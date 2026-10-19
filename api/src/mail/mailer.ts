import { MAIL_TRANSPORT, type AppConfig } from '../config/env.js';

export type Mailer = {
  sendPasswordReset: (email: string, resetUrl: string) => Promise<void>;
};

const consoleMailer: Mailer = {
  sendPasswordReset: async (email, resetUrl) => {
    console.info('[mail] password reset for %s - %s', email, resetUrl);
  },
};

const createResendMailer = (apiKey: string, fromAddress: string): Mailer => ({
  sendPasswordReset: async (email, resetUrl) => {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [email],
        subject: 'Reset your SriDha Academy password',
        html: `
          <div style="font-family: sans-serif; line-height: 1.5; color: #333; max-width: 560px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #111;">SriDha Academy</h2>
            <p>Hello,</p>
            <p>We received a request to reset the password for your SriDha Academy account.</p>
            <p style="margin: 24px 0;">
              <a href="${resetUrl}" style="background-color: #0b57d0; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">Reset Password</a>
            </p>
            <p style="font-size: 14px; color: #666;">This link is valid for 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="font-size: 12px; color: #999;">SriDha Academy</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        '[mail] Resend delivery failed status %d: %s',
        response.status,
        errorText,
      );
      throw new Error(
        `Failed to send password reset email via Resend (status ${response.status})`,
      );
    }
  },
});

// Returns null when no transport is configured so callers can report that
// password recovery is unavailable instead of silently dropping the email.
export const createMailer = (config: AppConfig): Mailer | null => {
  if (config.mailTransport === MAIL_TRANSPORT.console) {
    return consoleMailer;
  }

  if (config.mailTransport === MAIL_TRANSPORT.resend && config.resendApiKey) {
    return createResendMailer(config.resendApiKey, config.emailFrom);
  }

  return null;
};
