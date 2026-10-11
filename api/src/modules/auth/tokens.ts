import { createHash, randomBytes } from 'node:crypto';

const TOKEN_BYTES = 32;

// The raw token only ever lives in the cookie or reset link; the database
// stores its SHA-256 digest so a leaked database cannot be replayed.
export const generateToken = () =>
  randomBytes(TOKEN_BYTES).toString('base64url');

export const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');
