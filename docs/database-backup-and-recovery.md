# SriDha Academy (LetEd) — Database Backup & Recovery Plan

## 1. Backup Strategy Overview

To guarantee student data persistence, transactional safety, and business continuity, SriDha Academy employs a two-tier backup strategy:

1. **Automated Managed Provider Snapshots**: Full automated daily physical snapshots maintained by Render Managed PostgreSQL.
2. **Logical Dumps (`pg_dump`)**: Automated or on-demand portable SQL dumps before schema migrations or major releases.

---

## 2. Recovery Objectives

- **Recovery Point Objective (RPO)**:
  - Managed Starter Tier: Maximum 24 hours of data loss (daily automated backup).
  - Managed Pro/Point-in-Time-Recovery (PITR) Tier: Under 5 minutes of data loss (continuous WAL archiving).
- **Recovery Time Objective (RTO)**:
  - Point-in-time restore or snapshot recovery completed within 15–30 minutes.

---

## 3. Managed Provider Backups (Render)

### Features & Retention

- **Frequency**: Automatic daily snapshots taken during the daily maintenance window.
- **Retention Period**:
  - Starter Plan: 7 daily snapshots retained.
  - Standard/Pro Plan: 30 days retention with Point-in-Time-Recovery (PITR).
- **Storage Location**: Encrypted at rest (AES-256) in cloud object storage isolated from the compute instance.

### Restoring from Render Dashboard

1. Open [Render Dashboard](https://dashboard.render.com/) → Navigate to your PostgreSQL database: `sridha-academy-db`.
2. Select the **Backups** tab.
3. Locate the snapshot corresponding to the desired restore timestamp.
4. Click **Restore Backup**.
5. Render can restore the snapshot into a new database instance or restore over the existing instance.
6. If restored into a new database instance, update the `DATABASE_URL` environment variable on `sridha-academy-api` to point to the restored database.

---

## 4. Manual / Pre-Deployment Logical Backups (`pg_dump`)

Before executing database schema migrations or manual data interventions, take an explicit logical dump:

### Step 1: Create Backup

Run from a secure administrative terminal:

```bash
pg_dump "$DATABASE_URL" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file="backup_sridha_$(date +%Y%m%d_%H%M%S).dump"
```

### Step 2: Test Backup Integrity

Verify the dump file is valid:

```bash
pg_restore --list backup_sridha_*.dump > /dev/null
echo "Backup verification status: OK"
```

### Step 3: Offsite Storage

- Store pre-release dump files in an encrypted AWS S3 / Cloudflare R2 bucket with object versioning enabled.
- **Never commit `.dump`, `.sql`, or `.sqlite` files to the Git repository.**

---

## 5. Recovery Procedure (Logical Restore)

To restore from a logical `.dump` file to a target PostgreSQL database:

```bash
# 1. Terminate active connections (optional, for clean restore)
# 2. Restore schema and data:
pg_restore \
  --dbname="$DATABASE_URL" \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  backup_sridha_YYYYMMDD_HHMMSS.dump
```

Verify table counts after restore:

```sql
SELECT count(*) FROM users;
SELECT count(*) FROM student_profiles;
SELECT count(*) FROM enrolments;
```

---

## 6. Disaster Recovery Responsibilities & Monitoring

- **Weekly Verification**: The DevOps engineer inspects the Render Backups tab every Monday to ensure automated snapshots are actively succeeding.
- **Access Control**: Database credentials (`DATABASE_URL`) are restricted to production administrative staff and stored exclusively in password managers / cloud secret stores.
