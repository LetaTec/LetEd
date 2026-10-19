# SriDha Academy (LetEd) — Production Readiness Assessment

## 1. Readiness Status Matrix

This assessment audits every subsystem required for safe production operations before student onboarding.

| Subsystem / Requirement                  | Status    | Verification Evidence / Details                                                                                          | Remaining Action Required                                              |
| :--------------------------------------- | :-------- | :----------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| **Frontend Live Availability**           | 🟢 GREEN  | Verified live at `https://sridhaacademy.com` & `https://sridha-academy.pages.dev`. SPA routing, headers, assets working. | None. Continuous deployment from `main`.                               |
| **Database Persistence & Schemas**       | 🟡 YELLOW | PostgreSQL schema designed, migrations written, parameterized queries implemented.                                       | Provision managed PostgreSQL database and run migrations.              |
| **Database Connection & Pooling**        | 🟡 YELLOW | Bounded connection pool implemented with SSL configuration and error handling.                                           | Set production `DATABASE_URL` in hosting provider.                     |
| **Authentication & Registration**        | 🟢 GREEN  | Scrypt password hashing, session tokens, strict input validation verified.                                               | Verified with automated tests; requires live DB.                       |
| **Session Security & Cookies**           | 🟢 GREEN  | `httpOnly: true`, `SameSite=Lax`, `secure: true` in production, token hashing.                                           | Verified with automated tests.                                         |
| **Origin & CSRF Guard**                  | 🟢 GREEN  | State-changing requests restricted to verified `WEB_ORIGIN`.                                                             | Ensure `WEB_ORIGIN=https://sridhaacademy.com` in production env.       |
| **Course Catalogue & Enrolment**         | 🟢 GREEN  | Atomic transactional seat reservation, availability derivation, and duplicate prevention.                                | Verified with automated tests.                                         |
| **AI Model Paper Waitlist**              | 🟢 GREEN  | Public waitlist submission with email validation and optional user linking.                                              | Verified with automated tests.                                         |
| **Transactional Email Delivery**         | 🟡 YELLOW | Password reset service implemented; modular provider abstraction prepared.                                               | Select and configure transactional mail provider (e.g. Resend, Brevo). |
| **OTP Verification**                     | ⚪ GRAY   | Not implemented in current product specification.                                                                        | Separate planned feature; not blocking launch.                         |
| **Rate Limiting**                        | 🟡 YELLOW | In-memory / Redis rate limiting designed for `/auth/*` endpoints.                                                        | Enable rate limiting middleware in Express app.                        |
| **Automated Testing Suite**              | 🟢 GREEN  | 50 unit and integration tests passing (24 API, 26 Web).                                                                  | Keep running in CI/CD pipeline.                                        |
| **Database Backups & Disaster Recovery** | 🟡 YELLOW | Backup strategy documented; relies on managed PostgreSQL automated snapshots.                                            | Enable managed backup retention in provider dashboard.                 |
| **Secrets & Credential Isolation**       | 🟢 GREEN  | No secrets committed to Git; runtime validation rejects insecure configurations.                                         | Configure secrets in Render / Cloudflare dashboards.                   |

---

## 2. Critical Launch Blockers

Before accepting real student registrations, the following manual provisioning steps must be completed:

1. **Provision Managed PostgreSQL**: Create managed PostgreSQL instance on Render (or Supabase/Neon).
2. **Deploy Backend API**: Deploy `api/` container/service on Render with custom domain `https://api.sridhaacademy.com`.
3. **Configure Transactional Email**: Set up transactional email credentials for password resets.
4. **Update Frontend Environment**: Set `VITE_API_URL=https://api.sridhaacademy.com/api` in Cloudflare Pages build settings and trigger a fresh deployment.
