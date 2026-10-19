import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import {
  startTestServer,
  TEST_WEB_ORIGIN,
  validRegistration,
} from '../../test/testServer.js';

describe('auth', () => {
  let server: Awaited<ReturnType<typeof startTestServer>>;

  before(async () => {
    server = await startTestServer();
  });

  after(async () => {
    await server.close();
  });

  it('registers a student, maps one account to one profile and starts a session', async () => {
    const client = server.createClient();
    const response = await client.request(
      'POST',
      '/api/auth/register',
      validRegistration(),
    );

    assert.equal(response.status, 201);
    assert.match(response.body.user.id, /^[0-9a-f-]{36}$/);
    assert.match(response.body.user.student.id, /^[0-9a-f-]{36}$/);
    assert.notEqual(response.body.user.id, response.body.user.student.id);
    assert.equal(response.body.user.email, 'asha@example.com');
    assert.equal(response.body.user.student.standard, 'CLASS_11');
    assert.match(response.setCookie ?? '', /leta_session=.+; .*HttpOnly/i);
    assert.match(response.setCookie ?? '', /SameSite=Lax/i);

    const session = await client.request('GET', '/api/auth/session');
    assert.equal(session.status, 200);
    assert.equal(session.body.user.id, response.body.user.id);

    const profiles = await server.db.get<{ count: string | number }>(
      'SELECT COUNT(*) AS count FROM student_profiles WHERE user_id = $1',
      [response.body.user.id],
    );
    assert.equal(Number(profiles?.count), 1);
  });

  it('never stores the raw password or session token', async () => {
    const user = await server.db.get<{ password_hash: string }>(
      'SELECT password_hash FROM users WHERE LOWER(email) = LOWER($1)',
      ['asha@example.com'],
    );
    assert.match(String(user?.password_hash), /^scrypt\$/);
    assert.ok(!String(user?.password_hash).includes('correct-horse-1'));
  });

  it('rejects a duplicate registration, ignoring email case', async () => {
    const client = server.createClient();
    const response = await client.request(
      'POST',
      '/api/auth/register',
      validRegistration({ email: 'ASHA@example.com' }),
    );

    assert.equal(response.status, 409);
    assert.equal(response.body.code, 'EMAIL_ALREADY_REGISTERED');
    assert.equal(response.setCookie, null);
  });

  it('reports field-level validation errors in the shared contract', async () => {
    const client = server.createClient();
    const response = await client.request('POST', '/api/auth/register', {
      ...validRegistration({ email: 'not-an-email', password: 'short' }),
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.code, 'REQUEST_VALIDATION_FAILED');
    const paths = response.body.details.body.map((issue: { path: string[] }) =>
      issue.path.join('.'),
    );
    assert.ok(paths.includes('email'));
    assert.ok(paths.includes('password'));
  });

  it('requires a description when the stream is Other and stores it', async () => {
    const missing = await server
      .createClient()
      .request(
        'POST',
        '/api/auth/register',
        validRegistration({ email: 'other1@example.com', stream: 'OTHER' }),
      );
    assert.equal(missing.status, 400);
    assert.deepEqual(
      missing.body.details.body.map((issue: { path: string[] }) =>
        issue.path.join('.'),
      ),
      ['streamOther'],
    );

    const described = await server.createClient().request(
      'POST',
      '/api/auth/register',
      validRegistration({
        email: 'other2@example.com',
        stream: 'OTHER',
        streamOther: '  Vocational  ',
      }),
    );
    assert.equal(described.status, 201);
    assert.equal(described.body.user.student.stream, 'OTHER');
    assert.equal(described.body.user.student.streamOther, 'Vocational');

    // Text sent with a regular stream is ignored rather than stored.
    const regular = await server.createClient().request(
      'POST',
      '/api/auth/register',
      validRegistration({
        email: 'other3@example.com',
        stream: 'SCIENCE',
        streamOther: 'Ignored',
      }),
    );
    assert.equal(regular.status, 201);
    assert.equal(regular.body.user.student.streamOther, null);
  });

  it('accepts 10th class students', async () => {
    const response = await server.createClient().request(
      'POST',
      '/api/auth/register',
      validRegistration({
        email: 'class10@example.com',
        standard: 'CLASS_10',
        stream: null,
      }),
    );
    assert.equal(response.status, 201);
    assert.equal(response.body.user.student.standard, 'CLASS_10');
  });

  it('rejects client-supplied identifiers on registration', async () => {
    const client = server.createClient();
    const response = await client.request(
      'POST',
      '/api/auth/register',
      validRegistration({ email: 'new@example.com', id: 'attacker-chosen-id' }),
    );

    assert.equal(response.status, 400);
    assert.equal(response.body.code, 'REQUEST_VALIDATION_FAILED');
  });

  it('returns the same error for an unknown email and a wrong password', async () => {
    const client = server.createClient();
    const wrongPassword = await client.request('POST', '/api/auth/login', {
      email: 'asha@example.com',
      password: 'wrong-password',
    });
    const unknownEmail = await client.request('POST', '/api/auth/login', {
      email: 'nobody@example.com',
      password: 'wrong-password',
    });

    assert.equal(wrongPassword.status, 401);
    assert.equal(unknownEmail.status, 401);
    assert.deepEqual(wrongPassword.body, unknownEmail.body);
    assert.equal(wrongPassword.body.code, 'INVALID_CREDENTIALS');
  });

  it('logs in, restores the session and logs out', async () => {
    const client = server.createClient();
    const login = await client.request('POST', '/api/auth/login', {
      email: 'Asha@Example.com',
      password: 'correct-horse-1',
    });
    assert.equal(login.status, 200);

    assert.equal(
      (await client.request('GET', '/api/auth/session')).status,
      200,
    );

    const logout = await client.request('POST', '/api/auth/logout');
    assert.equal(logout.status, 204);

    const afterLogout = await client.request('GET', '/api/auth/session');
    assert.equal(afterLogout.status, 401);
    assert.equal(afterLogout.body.code, 'UNAUTHENTICATED');
  });

  it('reports an expired session distinctly', async () => {
    const client = server.createClient();
    await client.request('POST', '/api/auth/login', {
      email: 'asha@example.com',
      password: 'correct-horse-1',
    });

    const realNow = server.clock.now;
    server.clock.now = () => new Date('2026-10-20T09:00:00Z');

    try {
      const response = await client.request('GET', '/api/auth/session');
      assert.equal(response.status, 401);
      assert.equal(response.body.code, 'SESSION_EXPIRED');
    } finally {
      server.clock.now = realNow;
    }
  });

  it('rejects state-changing requests from another origin', async () => {
    const client = server.createClient();
    const response = await client.request(
      'POST',
      '/api/auth/login',
      { email: 'asha@example.com', password: 'correct-horse-1' },
      { Origin: 'https://evil.example' },
    );
    assert.equal(response.status, 403);
    assert.equal(response.body.code, 'ORIGIN_NOT_ALLOWED');

    const allowed = await client.request(
      'POST',
      '/api/auth/login',
      { email: 'asha@example.com', password: 'correct-horse-1' },
      { Origin: TEST_WEB_ORIGIN },
    );
    assert.equal(allowed.status, 200);
  });

  it('resets a password with a single-use token and signs out other sessions', async () => {
    const existingSession = server.createClient();
    await existingSession.request('POST', '/api/auth/login', {
      email: 'asha@example.com',
      password: 'correct-horse-1',
    });

    const client = server.createClient();
    const request = await client.request('POST', '/api/auth/password-reset', {
      email: 'asha@example.com',
    });
    assert.equal(request.status, 202);

    const unknown = await client.request('POST', '/api/auth/password-reset', {
      email: 'nobody@example.com',
    });
    assert.equal(unknown.status, 202);
    assert.deepEqual(unknown.body, request.body);

    assert.equal(server.sentEmails.length, 1);
    const resetUrl = new URL(server.sentEmails[0].resetUrl);
    assert.equal(resetUrl.origin, TEST_WEB_ORIGIN);
    const token = resetUrl.searchParams.get('token');

    const confirm = await client.request(
      'POST',
      '/api/auth/password-reset/confirm',
      { token, password: 'new-password-2' },
    );
    assert.equal(confirm.status, 204);

    const reuse = await client.request(
      'POST',
      '/api/auth/password-reset/confirm',
      { token, password: 'another-password-3' },
    );
    assert.equal(reuse.status, 400);
    assert.equal(reuse.body.code, 'INVALID_RESET_TOKEN');

    const oldSession = await existingSession.request(
      'GET',
      '/api/auth/session',
    );
    assert.equal(oldSession.status, 401);

    const login = await client.request('POST', '/api/auth/login', {
      email: 'asha@example.com',
      password: 'new-password-2',
    });
    assert.equal(login.status, 200);
  });
});

describe('auth without a mail transport', () => {
  it('reports that password recovery is unavailable', async () => {
    const server = await startTestServer({ withMailer: false });

    try {
      const response = await server
        .createClient()
        .request('POST', '/api/auth/password-reset', {
          email: 'asha@example.com',
        });
      assert.equal(response.status, 503);
      assert.equal(response.body.code, 'PASSWORD_RECOVERY_UNAVAILABLE');
    } finally {
      await server.close();
    }
  });
});
