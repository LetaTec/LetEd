import { loadConfigFromEnvironment } from '../config/env.js';
import { seedCatalogue } from './catalogueSeed.js';
import { isInMemoryDatabase, openDatabase, runMigrations } from './client.js';

const config = loadConfigFromEnvironment();

// Without DATABASE_URL the API uses an in-memory database that only the
// running server can reach, and the server seeds it on startup.
if (isInMemoryDatabase(config.databaseUrl)) {
  console.log(
    '[db] no DATABASE_URL - nothing to seed; the in-memory API seeds its own catalogue on startup',
  );
} else {
  const db = await openDatabase(config.databaseUrl);

  await runMigrations(db);
  await seedCatalogue(db);
  await db.close();

  console.log('[db] catalogue seeded - PostgreSQL');
}
