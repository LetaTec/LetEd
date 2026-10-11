import { MAIL_TRANSPORT, type AppConfig } from '../config/env.js';

export type Mailer = {
  sendPasswordReset: (email: string, resetUrl: string) => Promise<void>;
};

const consoleMailer: Mailer = {
  sendPasswordReset: async (email, resetUrl) => {
    console.info('[mail] password reset for %s - %s', email, resetUrl);
  },
};

// Returns null when no transport is configured so callers can report that
// password recovery is unavailable instead of silently dropping the email.
export const createMailer = (config: AppConfig): Mailer | null => {
  if (config.mailTransport === MAIL_TRANSPORT.console) {
    return consoleMailer;
  }

  return null;
};
