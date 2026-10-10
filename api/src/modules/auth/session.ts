import type { CookieOptions, RequestHandler, Response } from 'express';

import type { AppContext } from '../../app/context.js';
import { ApiError, ERROR_CODE } from '../../http/errors.js';
import { generateToken, hashToken } from './tokens.js';

export const SESSION_COOKIE = 'leta_session';

export type SessionState = 'none' | 'active' | 'expired';

export type RequestAuth = {
  userId: string;
  sessionId: string;
};

const cookieOptions = (
  { config }: AppContext,
  expiresAt?: Date,
): CookieOptions => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: config.secureCookies,
  path: '/',
  ...(expiresAt ? { expires: expiresAt } : {}),
});

export const createSession = (
  context: AppContext,
  userId: string,
  rememberMe: boolean,
) => {
  const token = generateToken();
  const now = context.now();
  const ttl = rememberMe
    ? context.config.sessionRememberTtlMs
    : context.config.sessionTtlMs;
  const expiresAt = new Date(now.getTime() + ttl);

  context.db
    .prepare(
      'INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)',
    )
    .run(hashToken(token), userId, now.toISOString(), expiresAt.toISOString());

  return { token, expiresAt };
};

export const setSessionCookie = (
  context: AppContext,
  res: Response,
  session: { token: string; expiresAt: Date },
) => {
  res.cookie(
    SESSION_COOKIE,
    session.token,
    cookieOptions(context, session.expiresAt),
  );
};

export const clearSessionCookie = (context: AppContext, res: Response) => {
  res.clearCookie(SESSION_COOKIE, cookieOptions(context));
};

export const deleteSession = (context: AppContext, sessionId: string) => {
  context.db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
};

export const deleteUserSessions = (context: AppContext, userId: string) => {
  context.db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
};

// Resolves the session cookie on every request. An unknown or expired token is
// reported as "expired" so the client can tell a lapsed sign-in apart from a
// visitor who never signed in.
export const createSessionMiddleware =
  (context: AppContext): RequestHandler =>
  (req, res, next) => {
    const token: unknown = req.cookies?.[SESSION_COOKIE];
    req.auth = null;
    req.sessionState = 'none';

    if (typeof token !== 'string' || token.length === 0) {
      next();
      return;
    }

    const sessionId = hashToken(token);
    const row = context.db
      .prepare('SELECT user_id, expires_at FROM sessions WHERE id = ?')
      .get(sessionId);

    if (!row || new Date(String(row.expires_at)) <= context.now()) {
      if (row) {
        deleteSession(context, sessionId);
      }

      clearSessionCookie(context, res);
      req.sessionState = 'expired';
      next();
      return;
    }

    req.auth = { userId: String(row.user_id), sessionId };
    req.sessionState = 'active';
    next();
  };

export const requireAuth: RequestHandler = (req, _res, next) => {
  if (req.auth) {
    next();
    return;
  }

  next(
    req.sessionState === 'expired'
      ? new ApiError(
          401,
          ERROR_CODE.sessionExpired,
          'Your session has expired. Please sign in again.',
        )
      : new ApiError(
          401,
          ERROR_CODE.unauthenticated,
          'Please sign in to continue',
        ),
  );
};

export const getRequiredAuth = (auth: RequestAuth | null | undefined) => {
  if (!auth) {
    throw new ApiError(
      401,
      ERROR_CODE.unauthenticated,
      'Please sign in to continue',
    );
  }

  return auth;
};
