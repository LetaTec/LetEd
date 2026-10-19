# SriDha Academy (LetEd) — PostgreSQL Migration Plan

## 1. Migration Scope and Goals

The migration transitions the SriDha Academy backend persistence tier from local SQLite (`node:sqlite`) to managed PostgreSQL 16+.

### Core Objectives:

1. **Zero Data Loss & Strict Relational Integrity**: Preserve all existing tables, foreign keys, cascading deletes, unique constraints, and check constraints.
2. **Asynchronous Query Execution**: Adapt synchronous repository operations to asynchronous `Promise`-based queries using the `pg` (node-postgres) driver.
3. **Safe Parameterized SQL**: Convert all `?` SQLite placeholders to `$1, $2, ...` PostgreSQL placeholders.
4. **Connection Pooling & SSL**: Implement a bounded connection pool with support for Render and cloud PostgreSQL SSL/TLS requirements.
5. **Transactional Migrations**: Implement sequential version-controlled database migrations with audit tracking in `schema_migrations`.
6. **Local SQLite Backup & Compatibility**: Ensure existing local development SQLite files are backed up safely and can be exported if needed.

---

## 2. SQL Syntax & Behavioral Differences (SQLite vs. PostgreSQL)

| Feature                            | SQLite (`node:sqlite`)                              | PostgreSQL (`pg`)                                        | Adaptation Strategy                                                                                               |
| :--------------------------------- | :-------------------------------------------------- | :------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| **Execution Model**                | Synchronous (`prepare().all()`, `.get()`, `.run()`) | Asynchronous (`await pool.query(...)`)                   | Convert all repository and service functions to `async`/`await`.                                                  |
| **Parameter Placeholders**         | `?`                                                 | `$1, $2, $3, ...`                                        | Replace `?` with numbered parameter placeholders.                                                                 |
| **Collation / Case-Insensitivity** | `COLLATE NOCASE`                                    | `LOWER(email)` index or `CITEXT`                         | Use `LOWER(email)` unique index or `CITEXT` extension.                                                            |
| **Date & Time Types**              | `TEXT` ISO strings                                  | `TIMESTAMPTZ` or `TEXT` ISO strings                      | Store timestamps consistently as `TIMESTAMPTZ` (or ISO UTC strings).                                              |
| **Transactions**                   | `BEGIN IMMEDIATE` / `COMMIT` / `ROLLBACK`           | `BEGIN` / `COMMIT` / `ROLLBACK` via dedicated connection | Acquire client from pool, run `BEGIN`, execute queries, `COMMIT` on success, `ROLLBACK` on error, release client. |
| **Constraint Violation Errors**    | `error.message` includes `UNIQUE constraint failed` | `error.code === '23505'` (unique_violation)              | Check PostgreSQL error code `23505` in addition to error message.                                                 |
| **Pragmas**                        | `PRAGMA foreign_keys = ON;`, `journal_mode = WAL`   | Native foreign key enforcement, WAL default              | Remove SQLite PRAGMAs; configure pool parameters.                                                                 |

---

## 3. Migration Sequence

### Migration 001: Initial Schema

- `users`: `id TEXT PRIMARY KEY`, `email TEXT NOT NULL UNIQUE`, `password_hash TEXT NOT NULL`, `created_at TIMESTAMPTZ NOT NULL`, `updated_at TIMESTAMPTZ NOT NULL`.
- `student_profiles`: `id TEXT PRIMARY KEY`, `user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE`, `full_name TEXT NOT NULL`, `date_of_birth TEXT NOT NULL`, `mobile TEXT NOT NULL`, `standard TEXT NOT NULL`, `stream TEXT`, `stream_other TEXT`, `address TEXT`, `created_at TIMESTAMPTZ NOT NULL`, `updated_at TIMESTAMPTZ NOT NULL`.
- `sessions`: `id TEXT PRIMARY KEY`, `user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE`, `created_at TIMESTAMPTZ NOT NULL`, `expires_at TIMESTAMPTZ NOT NULL`. Index on `user_id`.
- `password_reset_tokens`: `id TEXT PRIMARY KEY`, `user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE`, `created_at TIMESTAMPTZ NOT NULL`, `expires_at TIMESTAMPTZ NOT NULL`, `used_at TIMESTAMPTZ`. Index on `user_id`.
- `subjects`: `id TEXT PRIMARY KEY`, `slug TEXT NOT NULL UNIQUE`, `name TEXT NOT NULL`, `description TEXT NOT NULL`, `status TEXT NOT NULL CHECK (status IN ('AVAILABLE', 'UPCOMING'))`, `list_price_paise INTEGER CHECK (list_price_paise >= 0)`, `list_price_tax_label TEXT`, `position INTEGER NOT NULL`.
- `chapters`: `id TEXT PRIMARY KEY`, `subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE`, `title TEXT NOT NULL`, `position INTEGER NOT NULL`.
- `topics`: `id TEXT PRIMARY KEY`, `chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE`, `title TEXT NOT NULL`, `summary TEXT NOT NULL`, `level TEXT`, `price_paise INTEGER CHECK (price_paise >= 0)`, `price_tax_label TEXT`, `position INTEGER NOT NULL`.
- `lessons`: `id TEXT PRIMARY KEY`, `topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE`, `title TEXT NOT NULL`, `duration_minutes INTEGER CHECK (duration_minutes > 0)`, `position INTEGER NOT NULL`.
- `batches`: `id TEXT PRIMARY KEY`, `topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE`, `name TEXT NOT NULL`, `schedule_label TEXT NOT NULL`, `start_date TEXT`, `start_time TEXT`, `session_count INTEGER CHECK (session_count > 0)`, `session_duration_minutes INTEGER CHECK (session_duration_minutes > 0)`, `instructor_name TEXT`, `capacity INTEGER CHECK (capacity > 0)`, `status TEXT NOT NULL CHECK (status IN ('OPEN', 'UPCOMING', 'INACTIVE'))`, `position INTEGER NOT NULL`.
- `enrolments`: `id TEXT PRIMARY KEY`, `user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE`, `batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE RESTRICT`, `status TEXT NOT NULL CHECK (status IN ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED'))`, `created_at TIMESTAMPTZ NOT NULL`, `updated_at TIMESTAMPTZ NOT NULL`, `UNIQUE (user_id, batch_id)`. Index on `batch_id`.
- `enquiries`: `id TEXT PRIMARY KEY`, `type TEXT NOT NULL CHECK (type IN ('MODEL_PAPER_WAITLIST'))`, `email TEXT NOT NULL`, `exam TEXT NOT NULL`, `user_id TEXT REFERENCES users(id) ON DELETE SET NULL`, `created_at TIMESTAMPTZ NOT NULL`.

---

## 4. Mobile Number Uniqueness Review

In SQLite `001_initial_schema`, the `student_profiles.mobile` column was defined as:

```sql
mobile TEXT NOT NULL
```

Notice: There is **no** `UNIQUE` constraint on `mobile`.

### Evaluation:

1. **Intended Product Behavior**: In Indian secondary education (Class 10–12, commerce, JEE/NEET prep), siblings frequently share a parent's mobile phone number, or a parent registers multiple students under the same contact phone number while each student has their own unique email address.
2. **Risk of Imposing Unique Constraint**: Adding a `UNIQUE` constraint on `mobile` would reject valid family registrations where two children study different topics.
3. **Decision**: Maintain `mobile TEXT NOT NULL` without a unique constraint. Account identity is strictly keyed on `email`.

---

## 5. Local Data Migration & Safety

1. The existing SQLite databases found in `api/data/` (`e2e.sqlite`, `e2e.sqlite-wal`, `e2e.sqlite-shm`) contain synthetic end-to-end test data generated by Playwright. No real student accounts exist in local SQLite files.
2. Local database files are ignored by Git (`.gitignore`).
3. An automated export script (`api/src/db/exportSqlite.ts`) is provided for developers who wish to export any existing local SQLite records to JSON before switching.
