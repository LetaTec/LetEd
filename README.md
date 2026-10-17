# LetEd

The letaEd education platform: topic-wise online classes, AI test papers and AI model papers.

## What's built

### Homepage

Sections, in order:

1. **Hero** — "Big Subjects. _Broken Into_ Small Victories", with the interactive book alongside.
2. **Our model** — "Big Subjects. Broken Into Small Victories." with four cards: Big Subjects, Broken Into, Small Victories and Test Paper.
3. **AI Test Paper** — explains generated test papers. "Start a sample test" invites visitors to create a profile.
4. **Courses** — one card per subject from the live catalogue. Each card opens that subject's topics, lessons and batches.
5. **The three paths** — Online Classes, AI Test Paper and AI Model Paper. "Join waitlist" opens the AI model paper waitlist form.
6. **About**, **Team** and a closing **Create your student account** call to action.

Student counselling is not offered and has been removed from the site and the API.

### Interactive book

- Pages: an intro, one page per topic (title and lessons), a batch spread, then closing chapters on AI tests, AI model papers and getting started.
- **Batch spread:** two facing pages showing up to four batches, two per page. Each batch shows the topic and price, the schedule, the date, time and number of sessions, its availability, and a **Select batch** link.
- **Explore more batches** at the foot of the spread opens `/batches`.
- **Stable layout:** fixed proportions and a static tilt, with no pointer parallax or hover movement. Page turns are locked so rapid clicks can't break the page state.
- **Controls:** previous and next buttons, arrow keys, clicking either half of the book, and swiping on touch screens. Reduced-motion preferences are respected.

### Choosing a batch

1. A visitor opens a subject or selects a batch, from the course cards, the book or the batches page.
2. If they aren't signed in, the registration or sign-in dialog opens. The chosen batch is kept in the URL, so it survives sign-in, registration and page refreshes.
3. Once signed in, they see **Review your selection**: the topic, the lessons it includes, the schedule and the price.
4. **Reserve seat** creates a real enrolment with status "payment pending". The student can then see it under **My learning**.

Full, closed, inactive and upcoming batches show their status and cannot be selected.

### Pages

| Path              | Who                | What                                               |
| ----------------- | ------------------ | -------------------------------------------------- |
| `/`               | everyone           | Homepage, course details, sign-in and registration |
| `/batches`        | signed-in students | Every topic batch with full details                |
| `/my-learning`    | signed-in students | The student's reserved seats                       |
| `/reset-password` | anyone with a link | Choose a new password from a reset email           |

Signed-out visitors who open `/batches` or `/my-learning` get the sign-in dialog and are returned to the page after signing in.

### Tests

- **API:** integration tests cover registration, login, sessions, password reset, the catalogue, enrolment rules and the waitlist.
- **Website:** Vitest covers the book, formatters and the selection-through-sign-in flow.
- **Browser:** Playwright runs the full student journey, the book's stability and the sign-in gate in Chrome at desktop and mobile sizes.

## Structure

| Folder          | What it is                                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `api/`          | Node 22.13+ / Express 5 / TypeScript API with SQLite (`node:sqlite`). Auth, sessions, catalogue, enrolments, enquiries. |
| `web/`          | Vite / React 19 / TypeScript / CSS Modules website.                                                                     |
| `AGENTS.md`     | Codebase rules (pro-web conventions adapted to letaEd).                                                                 |
| `DEPLOYMENT.md` | Production deployment guide for Cloudflare Pages and environment configuration.                                         |

## Getting started

```bash
npm install
cp api/.env.example api/.env   # placeholders only, adjust if needed
npm run db:seed                # creates api/data/leta-ed.sqlite and loads the catalogue
npm run dev:api                # http://localhost:4000
npm run dev:web                # http://localhost:5173 (proxies /api to the API)
```

## Scripts (from the repository root)

| Command                   | Does                                                          |
| ------------------------- | ------------------------------------------------------------- |
| `npm run lint`            | ESLint for api and web                                        |
| `npm run typecheck`       | TypeScript for api and web                                    |
| `npm run test`            | API integration tests (node:test) and web tests (Vitest)      |
| `npm run build`           | Builds `api/dist` and `web/dist`                              |
| `npm run test:e2e -w web` | Playwright browser tests in local Chrome (desktop and mobile) |
| `npm run format`          | Prettier                                                      |

## Learning model

The catalogue follows **Subject → Chapter → Topic → Lesson → Batch**. The homepage book previews up to four batches (two per page); **Explore more batches** opens `/batches`, which is only available to signed-in students — visitors are sent to sign in first and returned afterwards. Students select a batch of a single topic; each batch lists exactly which lessons it covers. A topic offering is never presented as a complete subject.

## Identity and data model

- `users.id` (UUID, generated by the API) is the canonical identity. It is the only ID the session resolves to.
- `student_profiles` holds the student details collected at registration. There is exactly one per user (`user_id UNIQUE`), created in the same transaction as the user.
- Catalogue entities (`subjects`, `chapters`, `topics`, `lessons`, `batches`) use stable, server-defined text IDs, for example `batch_gst_class_11_november`.
- `enrolments` link `user_id` → `batch_id`, with `UNIQUE(user_id, batch_id)` and status `PENDING_PAYMENT | CONFIRMED | CANCELLED`.
- `enquiries` store AI model paper waitlist sign-ups (type `MODEL_PAPER_WAITLIST`). They link to `user_id` when the visitor is signed in.
- Batch availability (`OPEN | FULL | CLOSED | UPCOMING | INACTIVE`) is computed on the server from the stored status, the start date and the live seat count.

## Authentication

- Email and password, hashed with scrypt.
- Sessions are opaque random tokens in an `httpOnly`, `SameSite=Lax` cookie (`Secure` in production). Only the token's SHA-256 is stored.
- Session lifetime is `SESSION_TTL_DAYS`, or `SESSION_REMEMBER_TTL_DAYS` with "Keep me signed in".
- An expired or revoked session answers `401 SESSION_EXPIRED`. The website then clears local state and tells the student.
- State-changing requests from other origins are rejected (`ORIGIN_NOT_ALLOWED`).
- Password reset uses single-use tokens that expire after 1 hour. A reset signs the account out everywhere.

## API

All errors use `{ message, code, details }`.

| Method | Path                               | Auth    | Purpose                                            |
| ------ | ---------------------------------- | ------- | -------------------------------------------------- |
| GET    | `/api/health`                      | –       | Health check                                       |
| POST   | `/api/auth/register`               | –       | Create account and student profile, start session  |
| POST   | `/api/auth/login`                  | –       | Start session                                      |
| POST   | `/api/auth/logout`                 | –       | End session                                        |
| GET    | `/api/auth/session`                | session | Current user (session restore)                     |
| POST   | `/api/auth/password-reset`         | –       | Email a reset link (always 202)                    |
| POST   | `/api/auth/password-reset/confirm` | –       | Set a new password with a reset token              |
| GET    | `/api/catalogue`                   | –       | Public catalogue tree with live availability       |
| GET    | `/api/enrolments`                  | session | The signed-in student's enrolments                 |
| POST   | `/api/enrolments`                  | session | `{ batchId }` → reserve a seat (`PENDING_PAYMENT`) |
| POST   | `/api/enquiries`                   | –       | Join the AI model paper waitlist                   |

## Environment

See `api/.env.example` and `web/.env.example`.

| Variable                                         | Required              | Notes                                                                                    |
| ------------------------------------------------ | --------------------- | ---------------------------------------------------------------------------------------- |
| `NODE_ENV`                                       | yes                   | `production` enables secure cookies and stricter checks                                  |
| `PORT`                                           | no                    | Default 4000                                                                             |
| `DATABASE_PATH`                                  | no                    | SQLite file; use a persistent volume in production                                       |
| `WEB_ORIGIN`                                     | production            | Public site origin, e.g. `https://letaed.com`. Used for the origin check and reset links |
| `SESSION_TTL_DAYS` / `SESSION_REMEMBER_TTL_DAYS` | no                    | Defaults 1 / 30                                                                          |
| `MAIL_TRANSPORT`                                 | for password recovery | Only `console` (development) exists today. It is refused in production                   |
| `SERVE_WEB_DIST`                                 | no                    | `true` serves `web/dist` from the API, so one origin is deployed                         |
| `VITE_API_URL`                                   | no                    | Web build only. Default `/api`                                                           |

Deploy the website and API on the same site (for example with `SERVE_WEB_DIST=true`) so the session cookie stays first-party.

## Not yet built (launch dependencies)

- **Payment gateway.** Reserving a seat records a `PENDING_PAYMENT` enrolment; no payment is taken.
- **Email provider for password recovery.** In production the endpoint answers `PASSWORD_RECOVERY_UNAVAILABLE` until a transport is added in `api/src/mail/mailer.ts`.
- **Real content.**
  - Faculty names, lesson durations, and topics for Economics and Mathematics are not configured; the site shows "To be announced" for them.
  - Team profiles are placeholders.
  - The Economics and Mathematics list price (₹499 + GST) comes from the prototype and needs confirmation.
- **Not yet added:** rate limiting on login and registration, and email verification.
- **AI test papers and AI model papers.** The site presents them as planned; only the waitlist is functional.
