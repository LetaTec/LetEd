import { loadConfigFromEnvironment } from '../config/env.js';
import { seedCatalogue } from './catalogueSeed.js';
import { openDatabase, runMigrations } from './client.js';

const config = loadConfigFromEnvironment();
const db = openDatabase(config.databasePath);

runMigrations(db);
seedCatalogue(db);
db.close();

console.log('[db] catalogue seeded - %s', config.databasePath);
