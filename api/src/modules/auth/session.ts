import type { CookieOptions, RequestHandler, Response } from 'express';

import type { AppContext } from '../../app/context.js';
import type { DatabaseClient } from '../../db/client.js';
import { ApiError, ERROR_CODE } from '../../http/errors.js';
import { generateToken, hashToken } from './tokens.js';

export const SESSION_COOKIE = 'leta_session';

export type SessionState = 'none' | 'active' | 'expired';

export type RequestAuth = {
  userId: string;
  sessionId: string;
};

const cookieOptions = (
  { config }: AppContext,
  expiresAt?: Date,
): CookieOptions => {
  const sameSite = config.cookieSameSite;
  const isSecure = config.secureCookies || sameSite === 'none';

  return {
    httpOnly: true,
    sameSite,
    secure: isSecure,
    path: '/',
    ...(isSecure && sameSite === 'none' ? { partitioned: true } : {}),
    ...(config.cookieDomain ? { domain: config.cookieDomain } : {}),
    ...(expiresAt ? { expires: expiresAt } : {}),
  };
};

export const createSession = async (
  context: AppContext,
  userId: string,
  rememberMe: boolean,
) => {
  const token = generateToken();
  const now = context.now();
  const ttl = rememberMe
    ? context.config.sessionRememberTtlMs
    : context.config.sessionTtlMs;
  const expiresAt = new Date(now.getTime() + ttl);

  await context.db.query(
    'INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES ($1, $2, $3, $4)',
    [hashToken(token), userId, now.toISOString(), expiresAt.toISOString()],
  );

  return { token, expiresAt };
};

export const setSessionCookie = (
  context: AppContext,
  res: Response,
  session: { token: string; expiresAt: Date },
) => {
  res.cookie(
    SESSION_COOKIE,
    session.token,
    cookieOptions(context, session.expiresAt),
  );
};

export const clearSessionCookie = (context: AppContext, res: Response) => {
  res.clearCookie(SESSION_COOKIE, cookieOptions(context));
};

export const deleteSession = async (
  context: AppContext,
  sessionId: string,
  client?: DatabaseClient,
) => {
  const db = client ?? context.db;
  await db.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
};

export const deleteUserSessions = async (
  context: AppContext,
  userId: string,
  client?: DatabaseClient,
) => {
  const db = client ?? context.db;
  await db.query('DELETE FROM sessions WHERE user_id = $1', [userId]);
};

// Resolves the session cookie on every request. An unknown or expired token is
// reported as "expired" so the client can tell a lapsed sign-in apart from a
// visitor who never signed in.
export const createSessionMiddleware =
  (context: AppContext): RequestHandler =>
  async (req, res, next) => {
    try {
      const token: unknown = req.cookies?.[SESSION_COOKIE];
      const hasCookie = typeof token === 'string' && token.length > 0;
      req.auth = null;
      req.sessionState = 'none';

      if (!hasCookie) {
        if (
          req.path.startsWith('/auth/session') ||
          req.path.startsWith('/enrolments')
        ) {
          console.info('[auth] session check: no cookie present', {
            path: req.path,
            method: req.method,
            origin: req.get('origin') ?? 'unknown',
          });
        }
        next();
        return;
      }

      const sessionId = hashToken(token as string);
      const row = await context.db.get<{
        user_id: string;
        expires_at: string | Date;
      }>('SELECT user_id, expires_at FROM sessions WHERE id = $1', [sessionId]);

      const expiresAt =
        row?.expires_at instanceof Date
          ? row.expires_at
          : row
            ? new Date(String(row.expires_at))
            : null;

      if (!row || !expiresAt || expiresAt <= context.now()) {
        if (row) {
          await deleteSession(context, sessionId);
        }

        clearSessionCookie(context, res);
        req.sessionState = 'expired';
        console.info('[auth] session check: expired or invalid token', {
          path: req.path,
          hasSessionRecord: Boolean(row),
        });
        next();
        return;
      }

      req.auth = { userId: String(row.user_id), sessionId };
      req.sessionState = 'active';
      console.info('[auth] session check: active session resolved', {
        path: req.path,
      });
      next();
    } catch (error) {
      console.error('[auth] session check error', {
        path: req.path,
        error: error instanceof Error ? error.message : 'unknown',
      });
      next(error);
    }
  };

export const requireAuth: RequestHandler = (req, _res, next) => {
  if (req.auth) {
    next();
    return;
  }

  next(
    req.sessionState === 'expired'
      ? new ApiError(
          401,
          ERROR_CODE.sessionExpired,
          'Your session has expired. Please sign in again.',
        )
      : new ApiError(
          401,
          ERROR_CODE.unauthenticated,
          'Please sign in to continue',
        ),
  );
};

export const getRequiredAuth = (auth: RequestAuth | null | undefined) => {
  if (!auth) {
    throw new ApiError(
      401,
      ERROR_CODE.unauthenticated,
      'Please sign in to continue',
    );
  }

  return auth;
};
