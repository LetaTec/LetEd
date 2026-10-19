# SriDha Academy (LetEd) — System Architecture

## 1. System Overview

SriDha Academy (`LetEd`) is a modern educational platform delivering modular curriculum topics, batch scheduling, student enrolment, and AI-powered model examination prep.

The application is structured as an npm workspaces monorepo containing two core sub-projects:

- `web/`: Frontend Single Page Application (SPA) built with React 19, Vite 7, TypeScript, and CSS Modules.
- `api/`: Backend REST API built with Node.js 22+, Express 5, TypeScript, and a relational database tier.

```
┌─────────────────────────────────────────────────────────────┐
│                 Client Browser (Desktop/Mobile)             │
│                 https://sridhaacademy.com                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
               HTTPS (Credentials: include)
                               │
            ┌──────────────────▼──────────────────┐
            │       Cloudflare Edge CDN           │
            │   (Cloudflare Pages Static Assets)  │
            │    _headers, SPA fallback 200       │
            └──────────────────┬──────────────────┘
                               │
                       API Requests via
                   https://api.sridhaacademy.com
                               │
            ┌──────────────────▼──────────────────┐
            │       Express 5 REST API (Node 22)  │
            │     Hosted on Render / Container    │
            │   - CORS & OriginGuard Validation   │
            │   - Rate Limiting Middleware        │
            │   - Security Headers (nosniff, DENY)│
            │   - Session Auth (HttpOnly Cookie)  │
            └──────────────────┬──────────────────┘
                               │
                        pg Connection Pool
                     (SSL / Parameterized)
                               │
            ┌──────────────────▼──────────────────┐
            │      Managed PostgreSQL 16+         │
            │   - users & student_profiles        │
            │   - sessions & reset tokens         │
            │   - subjects, chapters, topics      │
            │   - lessons, batches, enrolments    │
            │   - enquiries & schema_migrations   │
            └─────────────────────────────────────┘
```

---

## 2. Monorepo Structure

```
LetEd/
├── package.json           # Root workspace configuration (workspaces: ["api", "web"])
├── package-lock.json      # Unified dependency lockfile
├── DECISION.md            # Mandatory engineering decision journal
├── DEPLOYMENT.md          # Cloudflare Pages deployment guide
├── AGENTS.md              # Coding and repository standards
├── docs/                  # Comprehensive engineering documentation
│   ├── architecture.md
│   ├── postgresql-migration-plan.md
│   ├── production-readiness.md
│   ├── development-setup.md
│   ├── environment-variables.md
│   ├── deployment.md
│   └── database-backup-and-recovery.md
├── web/                   # Frontend Vite + React application
│   ├── public/            # Static assets (_headers, favicon, 404.html)
│   ├── src/
│   │   ├── access/        # UI permission policies
│   │   ├── app/           # App root, router, context providers
│   │   ├── components/    # Reusable UI & domain components
│   │   ├── constants/     # Domain constants & copy
│   │   ├── pages/         # Page components (HomePage, BatchesPage, etc.)
│   │   ├── services/      # Axios API client & domain services
│   │   ├── styles/        # CSS variables & tokens
│   │   └── utils/         # Date, currency, string utilities
├── api/                   # Backend Express application
│   ├── src/
│   │   ├── app/           # Express app factory & context definition
│   │   ├── config/        # Environment variable parsing & validation
│   │   ├── db/            # Database pool, migrations, seeding
│   │   ├── http/          # Error handling, OriginGuard, validation
│   │   ├── mail/          # Email transports (console / transactional)
│   │   ├── modules/       # Domain modules (auth, catalogue, enrolments, enquiries)
│   │   ├── test/          # Test server harness
│   │   └── server.ts      # HTTP server entrypoint
```

---

## 3. Frontend Architecture (`web/`)

### 3.1 Technology Stack

- **Framework**: React 19 (`react`, `react-dom`).
- **Routing**: React Router v7 (`react-router-dom`) with client-side history navigation.
- **Styling**: Vanilla CSS Modules with `postcss-custom-media` and a design system token scale defined in `web/src/styles/tokens.css`.
- **Forms & Validation**: `react-hook-form` with `@hookform/resolvers` and `zod`.
- **Icons**: `lucide-react`.
- **HTTP Client**: `axios` with interceptors for credentials and SPA fallback error detection.

### 3.2 Hosting & Edge Rules

- Deployed on **Cloudflare Pages**.
- Single-page application fallback: all non-asset paths rewrite to `/index.html` with HTTP 200.
- Asset caching: `/assets/*` cached for 1 year (`immutable`).
- Security headers injected at edge via `public/_headers`:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`

---

## 4. Backend Architecture (`api/`)

### 4.1 Technology Stack

- **Runtime**: Node.js 22 LTS (`>=22.13.0`).
- **Framework**: Express 5 (`^5.1.0`) with native Promise rejection handling.
- **Database Driver**: `pg` (node-postgres) with connection pooling.
- **Schema Validation**: `zod` (`^4.3.6`) with strict object schemas (`z.strictObject`).
- **Cookie Parsing**: `cookie-parser`.
- **Password Security**: Node.js built-in `crypto.scrypt` with random 16-byte salt.

### 4.2 Security Architecture

1. **OriginGuard (`api/src/http/originGuard.ts`)**:
   - Inspects `Origin` and `Referer` headers on all state-changing HTTP requests (`POST`, `PUT`, `PATCH`, `DELETE`).
   - Validates that the request origin matches the configured `WEB_ORIGIN` (e.g. `https://sridhaacademy.com`).
   - Prevents cross-site request forgery (CSRF).
2. **Session Cookies (`api/src/modules/auth/session.ts`)**:
   - Named `leta_session`.
   - Attributes: `httpOnly: true`, `sameSite: 'lax'`, `path: '/'`, `secure: true` (in production).
   - The cookie stores a random high-entropy token (`crypto.randomBytes(32)`).
   - Only the SHA-256 hash of the token is stored in the database (`sessions.id`).
   - If an account's password is changed, all active sessions are revoked immediately.
3. **HTTP Security Headers**:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Cache-Control: no-store` on all API endpoints.

---

## 5. Domain Entities and Database Schema

1. **`users`**: Account credentials (`id`, `email`, `password_hash`, `created_at`, `updated_at`).
2. **`student_profiles`**: 1:1 student profile (`user_id`, `full_name`, `date_of_birth`, `mobile`, `standard`, `stream`, `stream_other`, `address`).
3. **`sessions`**: Active login sessions (`id`, `user_id`, `created_at`, `expires_at`).
4. **`password_reset_tokens`**: Single-use hashed password reset tokens (`id`, `user_id`, `created_at`, `expires_at`, `used_at`).
5. **`subjects`**: Course subjects (`id`, `slug`, `name`, `description`, `status`, `list_price_paise`, `list_price_tax_label`, `position`).
6. **`chapters`**: Hierarchical units within a subject (`id`, `subject_id`, `title`, `position`).
7. **`topics`**: Granular topics for study (`id`, `chapter_id`, `title`, `summary`, `level`, `price_paise`, `price_tax_label`, `position`).
8. **`lessons`**: Sequential learning lessons (`id`, `topic_id`, `title`, `duration_minutes`, `position`).
9. **`batches`**: Cohorts for topic instruction (`id`, `topic_id`, `name`, `schedule_label`, `start_date`, `start_time`, `session_count`, `session_duration_minutes`, `instructor_name`, `capacity`, `status`, `position`).
10. **`enrolments`**: Student batch reservations (`id`, `user_id`, `batch_id`, `status`, `created_at`, `updated_at`).
11. **`enquiries`**: Model paper waitlist submissions (`id`, `type`, `email`, `exam`, `user_id`, `created_at`).
12. **`schema_migrations`**: Migration audit ledger (`id`, `applied_at`).
