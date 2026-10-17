import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

import { MIGRATIONS } from './migrations.js';

export type Database = DatabaseSync;

const IN_MEMORY_DATABASE = ':memory:';

export const openDatabase = (databasePath: string): Database => {
  if (databasePath !== IN_MEMORY_DATABASE) {
    mkdirSync(path.dirname(path.resolve(databasePath)), { recursive: true });
  }

  const db = new DatabaseSync(databasePath);
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA busy_timeout = 5000;');

  return db;
};

export const runMigrations = (db: Database) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  const applied = new Set(
    db
      .prepare('SELECT id FROM schema_migrations')
      .all()
      .map(row => String(row.id)),
  );

  MIGRATIONS.filter(migration => !applied.has(migration.id)).forEach(
    migration => {
      transaction(db, () => {
        db.exec(migration.sql);
        db.prepare(
          'INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)',
        ).run(migration.id, new Date().toISOString());
      });
    },
  );
};

// node:sqlite is synchronous, so a BEGIN IMMEDIATE block is enough to make a
// read-check-write sequence atomic within this process and across processes.
export const transaction = <T>(db: Database, work: () => T): T => {
  db.exec('BEGIN IMMEDIATE');

  try {
    const result = work();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
};
