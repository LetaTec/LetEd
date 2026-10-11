import type { AppConfig } from '../config/env.js';
import type { Database } from '../db/client.js';
import type { Mailer } from '../mail/mailer.js';

export type AppContext = {
  db: Database;
  config: AppConfig;
  mailer: Mailer | null;
  now: () => Date;
};
