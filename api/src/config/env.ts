import { existsSync } from 'node:fs';
import path from 'node:path';

import { z } from 'zod';

export const MAIL_TRANSPORT = {
  console: 'console',
} as const;

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_PATH: z.string().min(1).default('./data/leta-ed.sqlite'),
  WEB_ORIGIN: z.url().optional(),
  SESSION_TTL_DAYS: z.coerce.number().positive().default(1),
  SESSION_REMEMBER_TTL_DAYS: z.coerce.number().positive().default(30),
  MAIL_TRANSPORT: z.enum([MAIL_TRANSPORT.console]).optional(),
  SERVE_WEB_DIST: z
    .enum(['true', 'false'])
    .default('false')
    .transform(value => value === 'true'),
});

export type AppConfig = {
  env: 'development' | 'test' | 'production';
  port: number;
  databasePath: string;
  webOrigin: string;
  sessionTtlMs: number;
  sessionRememberTtlMs: number;
  mailTransport: (typeof MAIL_TRANSPORT)[keyof typeof MAIL_TRANSPORT] | null;
  serveWebDist: boolean;
  secureCookies: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const DEVELOPMENT_WEB_ORIGIN = 'http://localhost:5173';

const loadEnvFile = () => {
  const envPath = path.resolve(process.cwd(), '.env');

  if (existsSync(envPath)) {
    process.loadEnvFile(envPath);
  }
};

export const loadConfig = (
  source: NodeJS.ProcessEnv = process.env,
): AppConfig => {
  const parsed = envSchema.safeParse(source);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map(issue => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid API configuration — ${issues}`);
  }

  const env = parsed.data;
  const isProduction = env.NODE_ENV === 'production';

  if (isProduction && !env.WEB_ORIGIN) {
    throw new Error(
      'Invalid API configuration — WEB_ORIGIN is required in production',
    );
  }

  if (isProduction && env.MAIL_TRANSPORT === MAIL_TRANSPORT.console) {
    throw new Error(
      'Invalid API configuration — MAIL_TRANSPORT=console exposes reset links in logs and is not allowed in production',
    );
  }

  return {
    env: env.NODE_ENV,
    port: env.PORT,
    databasePath: env.DATABASE_PATH,
    webOrigin: env.WEB_ORIGIN ?? DEVELOPMENT_WEB_ORIGIN,
    sessionTtlMs: env.SESSION_TTL_DAYS * DAY_MS,
    sessionRememberTtlMs: env.SESSION_REMEMBER_TTL_DAYS * DAY_MS,
    mailTransport: env.MAIL_TRANSPORT ?? null,
    serveWebDist: env.SERVE_WEB_DIST,
    secureCookies: isProduction,
  };
};

export const loadConfigFromEnvironment = () => {
  loadEnvFile();
  return loadConfig();
};
