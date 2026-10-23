import { createApp } from './app/app.js';
import { loadConfigFromEnvironment } from './config/env.js';
import { seedCatalogue } from './db/catalogueSeed.js';
import {
  isInMemoryDatabase,
  openDatabase,
  runMigrations,
} from './db/client.js';
import { createMailer } from './mail/mailer.js';
import { syncSuperAdmins } from './modules/auth/roles.js';

const config = loadConfigFromEnvironment();
const db = await openDatabase(config.databaseUrl, config.pgMaxConnections);
await runMigrations(db);

// SUPER_ADMIN_EMAILS is the source of truth for who is a super admin.
const superAdminCount = await syncSuperAdmins(
  db,
  config.superAdminEmails,
  new Date(),
);
console.log('[auth] super admin accounts: %d', superAdminCount);

// An in-memory database starts empty on every run and no other process can
// reach it, so the server loads the catalogue itself. The seed is idempotent.
if (isInMemoryDatabase(config.databaseUrl)) {
  await seedCatalogue(db);
  console.log('[db] in-memory database - catalogue seeded');
}

const mailer = createMailer(config);

if (!mailer) {
  console.warn(
    '[api] MAIL_TRANSPORT is not configured - password recovery will respond with PASSWORD_RECOVERY_UNAVAILABLE',
  );
}

const app = createApp({ db, config, mailer, now: () => new Date() });

const server = app.listen(config.port, () => {
  console.log(
    '[api] listening - port %d, env %s, web origin %s',
    config.port,
    config.env,
    config.webOrigin,
  );
});

const shutdown = () => {
  server.close(async () => {
    await db.close();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
