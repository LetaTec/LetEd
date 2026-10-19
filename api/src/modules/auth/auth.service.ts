import { randomUUID } from 'node:crypto';

import type { AppContext } from '../../app/context.js';
import { transaction, type DatabaseClient } from '../../db/client.js';
import { ApiError, ERROR_CODE } from '../../http/errors.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';
import {
  hashPassword,
  verifyAgainstDummyHash,
  verifyPassword,
} from './password.js';
import { deleteUserSessions } from './session.js';
import { generateToken, hashToken } from './tokens.js';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

// The authenticated account (users.id) is the canonical identity. Each account
// owns exactly one student profile, created in the same transaction.
export type AuthUser = {
  id: string;
  email: string;
  student: {
    id: string;
    fullName: string;
    standard: string;
    stream: string | null;
    streamOther: string | null;
  };
};

const emailAlreadyRegistered = () =>
  new ApiError(
    409,
    ERROR_CODE.emailAlreadyRegistered,
    'An account with this email already exists. Sign in instead.',
  );

const isUniqueViolation = (error: unknown) =>
  error instanceof Error &&
  (/duplicate key/i.test(error.message) ||
    /unique constraint/i.test(error.message) ||
    /UNIQUE constraint failed/.test(error.message) ||
    (error as any).code === '23505');

export const getAuthUser = async (
  { db }: AppContext,
  userId: string,
  client?: DatabaseClient,
): Promise<AuthUser | null> => {
  const runner = client ?? db;
  const row = await runner.get(
    `SELECT u.id, u.email, s.id AS student_id, s.full_name, s.standard, s.stream, s.stream_other
     FROM users u
     JOIN student_profiles s ON s.user_id = u.id
     WHERE u.id = $1`,
    [userId],
  );

  if (!row) {
    return null;
  }

  return {
    id: String(row.id),
    email: String(row.email),
    student: {
      id: String(row.student_id),
      fullName: String(row.full_name),
      standard: String(row.standard),
      stream: row.stream === null ? null : String(row.stream),
      streamOther: row.stream_other === null ? null : String(row.stream_other),
    },
  };
};

export const registerStudent = async (
  context: AppContext,
  input: RegisterInput,
): Promise<AuthUser> => {
  const { db } = context;
  const existing = await db.get(
    'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
    [input.email],
  );

  if (existing) {
    throw emailAlreadyRegistered();
  }

  const passwordHash = await hashPassword(input.password);
  const userId = randomUUID();
  const timestamp = context.now().toISOString();

  try {
    await transaction(db, async tx => {
      await tx.query(
        'INSERT INTO users (id, email, password_hash, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)',
        [userId, input.email, passwordHash, timestamp, timestamp],
      );

      await tx.query(
        `INSERT INTO student_profiles
          (id, user_id, full_name, date_of_birth, mobile, standard, stream, stream_other, address, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          randomUUID(),
          userId,
          input.fullName,
          input.dateOfBirth,
          input.mobile,
          input.standard,
          input.stream,
          input.streamOther,
          input.address,
          timestamp,
          timestamp,
        ],
      );
    });
  } catch (error) {
    // Two concurrent registrations for the same email: the second one loses
    // the UNIQUE race and gets the same answer as the pre-check.
    if (isUniqueViolation(error)) {
      throw emailAlreadyRegistered();
    }

    throw error;
  }

  const user = await getAuthUser(context, userId);

  if (!user) {
    throw new Error(`Registered user ${userId} could not be loaded`);
  }

  return user;
};

export const authenticateStudent = async (
  context: AppContext,
  input: LoginInput,
): Promise<AuthUser> => {
  const row = await context.db.get(
    'SELECT id, password_hash FROM users WHERE LOWER(email) = LOWER($1)',
    [input.email],
  );

  const isValid = row
    ? await verifyPassword(input.password, String(row.password_hash))
    : await verifyAgainstDummyHash(input.password);

  const user =
    isValid && row ? await getAuthUser(context, String(row.id)) : null;

  if (!user) {
    throw new ApiError(
      401,
      ERROR_CODE.invalidCredentials,
      'The email or password is incorrect',
    );
  }

  return user;
};

export const requestPasswordReset = async (
  context: AppContext,
  email: string,
) => {
  if (!context.mailer) {
    throw new ApiError(
      503,
      ERROR_CODE.passwordRecoveryUnavailable,
      'Password recovery is not available yet. Please contact SriDha Academy support.',
    );
  }

  const row = await context.db.get(
    'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
    [email],
  );

  // Always respond the same way so the endpoint cannot be used to discover
  // which emails are registered.
  if (!row) {
    return;
  }

  const userId = String(row.id);
  const token = generateToken();
  const now = context.now();

  await transaction(context.db, async tx => {
    await tx.query(
      'UPDATE password_reset_tokens SET used_at = $1 WHERE user_id = $2 AND used_at IS NULL',
      [now.toISOString(), userId],
    );
    await tx.query(
      'INSERT INTO password_reset_tokens (id, user_id, created_at, expires_at) VALUES ($1, $2, $3, $4)',
      [
        hashToken(token),
        userId,
        now.toISOString(),
        new Date(now.getTime() + RESET_TOKEN_TTL_MS).toISOString(),
      ],
    );
  });

  const resetUrl = new URL('/reset-password', context.config.webOrigin);
  resetUrl.searchParams.set('token', token);
  await context.mailer.sendPasswordReset(email, resetUrl.toString());
};

export const confirmPasswordReset = async (
  context: AppContext,
  token: string,
  password: string,
) => {
  const tokenId = hashToken(token);
  const now = context.now();
  const row = await context.db.get(
    'SELECT user_id, expires_at, used_at FROM password_reset_tokens WHERE id = $1',
    [tokenId],
  );

  if (!row || row.used_at !== null || new Date(String(row.expires_at)) <= now) {
    throw new ApiError(
      400,
      ERROR_CODE.invalidResetToken,
      'This reset link is invalid or has expired. Request a new one.',
    );
  }

  const userId = String(row.user_id);
  const passwordHash = await hashPassword(password);

  await transaction(context.db, async tx => {
    await tx.query(
      'UPDATE users SET password_hash = $1, updated_at = $2 WHERE id = $3',
      [passwordHash, now.toISOString(), userId],
    );
    await tx.query(
      'UPDATE password_reset_tokens SET used_at = $1 WHERE id = $2',
      [now.toISOString(), tokenId],
    );
    // A password change signs the account out everywhere.
    await deleteUserSessions(context, userId, tx);
  });
};
