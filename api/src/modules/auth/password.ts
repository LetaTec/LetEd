import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keyLength: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

const SCRYPT_PARAMS = { N: 2 ** 15, r: 8, p: 1 } as const;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const HASH_PREFIX = 'scrypt';
// scrypt needs 128 * N * r bytes; leave headroom above Node's 32 MiB default.
const MAX_MEMORY = 64 * 1024 * 1024;

const derive = (
  password: string,
  salt: Buffer,
  params: { N: number; r: number; p: number },
) => scryptAsync(password, salt, KEY_LENGTH, { ...params, maxmem: MAX_MEMORY });

export const hashPassword = async (password: string) => {
  const salt = randomBytes(SALT_LENGTH);
  const key = await derive(password, salt, SCRYPT_PARAMS);

  return [
    HASH_PREFIX,
    SCRYPT_PARAMS.N,
    SCRYPT_PARAMS.r,
    SCRYPT_PARAMS.p,
    salt.toString('base64'),
    key.toString('base64'),
  ].join('$');
};

export const verifyPassword = async (password: string, storedHash: string) => {
  const [prefix, n, r, p, salt, key] = storedHash.split('$');

  if (prefix !== HASH_PREFIX || !salt || !key) {
    return false;
  }

  const expected = Buffer.from(key, 'base64');
  const actual = await derive(password, Buffer.from(salt, 'base64'), {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });

  return expected.length === actual.length && timingSafeEqual(expected, actual);
};

// Used when an email is unknown so failed logins take a similar amount of
// time whether or not the account exists.
let dummyHash: Promise<string> | null = null;

export const verifyAgainstDummyHash = async (password: string) => {
  dummyHash ??= hashPassword(randomBytes(16).toString('hex'));
  await verifyPassword(password, await dummyHash);
  return false;
};
