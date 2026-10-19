import { loadConfigFromEnvironment } from '../config/env.js';
import { seedCatalogue } from './catalogueSeed.js';
import { openDatabase, runMigrations } from './client.js';

const config = loadConfigFromEnvironment();
const db = await openDatabase(config.databaseUrl ?? config.databasePath);

await runMigrations(db);
await seedCatalogue(db);
await db.close();

console.log(
  '[db] catalogue seeded - %s',
  config.databaseUrl ? 'PostgreSQL' : config.databasePath,
);
