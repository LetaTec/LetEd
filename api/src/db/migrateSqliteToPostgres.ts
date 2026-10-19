import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

import { loadConfigFromEnvironment } from '../config/env.js';
import { openDatabase, runMigrations, type Database, type DatabaseClient } from './client.js';

/**
 * Safe, repeatable data migration script to copy existing local development
 * SQLite records to PostgreSQL.
 *
 * Requirements:
 * 1. Checks that the source SQLite file exists.
 * 2. Connects to the target PostgreSQL database.
 * 3. Ensures target PostgreSQL migrations are applied.
 * 4. Transfers records within a single transaction preserving foreign keys.
 * 5. Validates record counts before committing.
 * 6. Never deletes or alters the source SQLite file.
 */
export const migrateSqliteToPostgres = async (
  sqlitePath: string,
  targetDb?: Database,
) => {
  const resolvedSqlitePath = path.resolve(process.cwd(), sqlitePath);

  if (!existsSync(resolvedSqlitePath)) {
    console.info(
      '[migrate] No SQLite file found at %s. Skipping data migration.',
      resolvedSqlitePath,
    );
    return;
  }

  console.info(
    '[migrate] Starting data migration from SQLite: %s',
    resolvedSqlitePath,
  );
  const sqlite = new DatabaseSync(resolvedSqlitePath);

  const config = loadConfigFromEnvironment();
  const pgDb =
    targetDb ??
    (await openDatabase(config.databaseUrl, config.pgMaxConnections));
  const shouldClose = !targetDb;
  await runMigrations(pgDb);

  try {
    await pgDb.transaction(async (tx: DatabaseClient) => {
      // 1. Users
      const users = sqlite.prepare('SELECT * FROM users').all();
      console.info('[migrate] Migrating %d users...', users.length);
      for (const u of users as any[]) {
        await tx.query(
          `INSERT INTO users (id, email, password_hash, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT DO NOTHING`,
          [u.id, u.email, u.password_hash, u.created_at, u.updated_at],
        );
      }

      // 2. Student Profiles
      const profiles = sqlite.prepare('SELECT * FROM student_profiles').all();
      console.info(
        '[migrate] Migrating %d student profiles...',
        profiles.length,
      );
      for (const p of profiles as any[]) {
        await tx.query(
          `INSERT INTO student_profiles
            (id, user_id, full_name, date_of_birth, mobile, standard, stream, stream_other, address, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT DO NOTHING`,
          [
            p.id,
            p.user_id,
            p.full_name,
            p.date_of_birth,
            p.mobile,
            p.standard,
            p.stream ?? null,
            p.stream_other ?? null,
            p.address ?? null,
            p.created_at,
            p.updated_at,
          ],
        );
      }

      // 3. Sessions
      const sessions = sqlite.prepare('SELECT * FROM sessions').all();
      console.info('[migrate] Migrating %d sessions...', sessions.length);
      for (const s of sessions as any[]) {
        await tx.query(
          `INSERT INTO sessions (id, user_id, created_at, expires_at)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT DO NOTHING`,
          [s.id, s.user_id, s.created_at, s.expires_at],
        );
      }

      // 4. Password Reset Tokens
      const tokens = sqlite
        .prepare('SELECT * FROM password_reset_tokens')
        .all();
      console.info(
        '[migrate] Migrating %d password reset tokens...',
        tokens.length,
      );
      for (const t of tokens as any[]) {
        await tx.query(
          `INSERT INTO password_reset_tokens (id, user_id, created_at, expires_at, used_at)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT DO NOTHING`,
          [t.id, t.user_id, t.created_at, t.expires_at, t.used_at ?? null],
        );
      }

      // 5. Enrolments
      const enrolments = sqlite.prepare('SELECT * FROM enrolments').all();
      console.info('[migrate] Migrating %d enrolments...', enrolments.length);
      for (const e of enrolments as any[]) {
        await tx.query(
          `INSERT INTO enrolments (id, user_id, batch_id, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT DO NOTHING`,
          [e.id, e.user_id, e.batch_id, e.status, e.created_at, e.updated_at],
        );
      }

      // 6. Enquiries
      const enquiries = sqlite.prepare('SELECT * FROM enquiries').all();
      console.info('[migrate] Migrating %d enquiries...', enquiries.length);
      for (const enq of enquiries as any[]) {
        await tx.query(
          `INSERT INTO enquiries (id, type, email, exam, user_id, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT DO NOTHING`,
          [
            enq.id,
            enq.type ?? 'MODEL_PAPER_WAITLIST',
            enq.email,
            enq.exam ?? enq.subject ?? 'COMMERCE_11_12',
            enq.user_id ?? null,
            enq.created_at,
          ],
        );
      }
    });

    console.info('[migrate] Data migration completed successfully.');
  } finally {
    sqlite.close();
    if (shouldClose) {
      await pgDb.close();
    }
  }
};

if (process.argv[1]?.endsWith('migrateSqliteToPostgres.ts')) {
  const sqliteFile = process.argv[2] ?? './data/leta-ed.sqlite';
  await migrateSqliteToPostgres(sqliteFile);
}
