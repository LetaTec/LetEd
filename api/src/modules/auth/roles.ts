import { randomUUID } from 'node:crypto';

import { transaction, type Database } from '../../db/client.js';

export const USER_ROLE = {
  student: 'STUDENT',
  superAdmin: 'SUPER_ADMIN',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const toUserRole = (value: unknown): UserRole =>
  value === USER_ROLE.superAdmin ? USER_ROLE.superAdmin : USER_ROLE.student;

// Makes the database match SUPER_ADMIN_EMAILS on every start: listed emails
// become super admins (an account is created, with no password, if none
// exists) and anyone no longer listed goes back to being a student.
export const syncSuperAdmins = async (
  db: Database,
  emails: readonly string[],
  now: Date,
) => {
  const listed = new Set(emails.map(email => email.toLowerCase()));
  const timestamp = now.toISOString();

  await transaction(db, async tx => {
    const current = await tx.all<{ id: string; email: string }>(
      'SELECT id, email FROM users WHERE role = $1',
      [USER_ROLE.superAdmin],
    );

    for (const user of current) {
      if (!listed.has(String(user.email).toLowerCase())) {
        await tx.query(
          'UPDATE users SET role = $1, updated_at = $2 WHERE id = $3',
          [USER_ROLE.student, timestamp, user.id],
        );
      }
    }

    for (const email of listed) {
      const existing = await tx.get<{ id: string }>(
        'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
        [email],
      );

      if (existing) {
        await tx.query(
          'UPDATE users SET role = $1, updated_at = $2 WHERE id = $3',
          [USER_ROLE.superAdmin, timestamp, existing.id],
        );
      } else {
        await tx.query(
          `INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
           VALUES ($1, $2, NULL, $3, $4, $4)`,
          [randomUUID(), email, USER_ROLE.superAdmin, timestamp],
        );
      }
    }
  });

  return listed.size;
};
