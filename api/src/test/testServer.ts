import type { AddressInfo } from 'node:net';

import { createApp } from '../app/app.js';
import { loadConfig } from '../config/env.js';
import { seedCatalogue } from '../db/catalogueSeed.js';
import { openDatabase, runMigrations } from '../db/client.js';
import type { Mailer } from '../mail/mailer.js';

export const TEST_WEB_ORIGIN = 'http://localhost:5173';

export type SentResetEmail = { email: string; resetUrl: string };

export type TestClient = {
  request: (
    method: string,
    path: string,
    body?: unknown,
    headers?: Record<string, string>,
  ) => Promise<{ status: number; body: any; setCookie: string | null }>;
  clearCookies: () => void;
};

export const startTestServer = async ({
  withMailer = true,
  now = () => new Date('2026-10-10T09:00:00Z'),
}: { withMailer?: boolean; now?: () => Date } = {}) => {
  const db = openDatabase(':memory:');
  runMigrations(db);
  seedCatalogue(db);

  const sentEmails: SentResetEmail[] = [];
  const mailer: Mailer | null = withMailer
    ? {
        sendPasswordReset: async (email, resetUrl) => {
          sentEmails.push({ email, resetUrl });
        },
      }
    : null;

  const clock = { now };
  const config = loadConfig({ NODE_ENV: 'test', WEB_ORIGIN: TEST_WEB_ORIGIN });
  const app = createApp({ db, config, mailer, now: () => clock.now() });
  const server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  const { port } = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${port}`;

  const createClient = (): TestClient => {
    let cookie: string | null = null;

    return {
      request: async (method, path, body, headers = {}) => {
        const response = await fetch(`${baseUrl}${path}`, {
          method,
          headers: {
            ...(body === undefined
              ? {}
              : { 'Content-Type': 'application/json' }),
            ...(cookie ? { Cookie: cookie } : {}),
            ...headers,
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        });

        const setCookie = response.headers.get('set-cookie');
        if (setCookie) {
          const [pair] = setCookie.split(';');
          cookie = pair.endsWith('=') ? null : pair;
        }

        const text = await response.text();
        return {
          status: response.status,
          body: text ? JSON.parse(text) : null,
          setCookie,
        };
      },
      clearCookies: () => {
        cookie = null;
      },
    };
  };

  return {
    db,
    clock,
    sentEmails,
    createClient,
    close: () =>
      new Promise<void>(resolve => {
        server.close(() => {
          db.close();
          resolve();
        });
      }),
  };
};

export const validRegistration = (overrides: Record<string, unknown> = {}) => ({
  fullName: 'Asha Verma',
  email: 'asha@example.com',
  password: 'correct-horse-1',
  dateOfBirth: '2009-04-12',
  mobile: '+91 98765 43210',
  standard: 'CLASS_11',
  stream: 'COMMERCE',
  address: 'Jaipur',
  ...overrides,
});
