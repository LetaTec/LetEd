import type { RequestAuth, SessionState } from '../modules/auth/session.js';

declare global {
  namespace Express {
    interface Request {
      auth?: RequestAuth | null;
      sessionState?: SessionState;
    }
  }
}

export {};
