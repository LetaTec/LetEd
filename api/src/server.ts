import { createApp } from './app/app.js';
import { loadConfigFromEnvironment } from './config/env.js';
import { openDatabase, runMigrations } from './db/client.js';
import { createMailer } from './mail/mailer.js';

const config = loadConfigFromEnvironment();
const db = await openDatabase(config.databaseUrl, config.pgMaxConnections);
await runMigrations(db);

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
