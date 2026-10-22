import { Router } from 'express';

import type { AppContext } from '../../app/context.js';
import { ApiError, ERROR_CODE } from '../../http/errors.js';
import { validate } from '../../http/validate.js';
import {
  adminSignInConfirmSchema,
  adminSignInRequestSchema,
  loginSchema,
  passwordResetConfirmSchema,
  passwordResetRequestSchema,
  registerSchema,
} from './auth.schema.js';
import {
  authenticateStudent,
  confirmAdminSignIn,
  confirmPasswordReset,
  getAuthUser,
  registerStudent,
  requestAdminSignIn,
  requestPasswordReset,
} from './auth.service.js';
import {
  clearSessionCookie,
  createSession,
  deleteSession,
  getRequiredAuth,
  requireAuth,
  setSessionCookie,
} from './session.js';

export const createAuthRouter = (context: AppContext) => {
  const router = Router();

  router.post('/register', async (req, res) => {
    const input = validate(registerSchema, req.body);
    const user = await registerStudent(context, input);
    const session = await createSession(context, user.id, false);
    setSessionCookie(context, res, session);
    res.status(201).json({ user });
  });

  router.post('/login', async (req, res) => {
    const input = validate(loginSchema, req.body);
    const user = await authenticateStudent(context, input);
    if (req.auth) {
      await deleteSession(context, req.auth.sessionId);
    }
    const session = await createSession(context, user.id, input.rememberMe);
    setSessionCookie(context, res, session);
    res.json({ user });
  });

  router.post('/logout', async (req, res) => {
    if (req.auth) {
      await deleteSession(context, req.auth.sessionId);
    }

    clearSessionCookie(context, res);
    res.status(204).end();
  });

  router.get('/session', requireAuth, async (req, res) => {
    const auth = getRequiredAuth(req.auth);
    const user = await getAuthUser(context, auth.userId);

    if (!user) {
      await deleteSession(context, auth.sessionId);
      clearSessionCookie(context, res);
      throw new ApiError(
        401,
        ERROR_CODE.sessionExpired,
        'Your session has expired. Please sign in again.',
      );
    }

    res.json({ user });
  });

  router.post('/password-reset', async (req, res) => {
    const { email } = validate(passwordResetRequestSchema, req.body);
    await requestPasswordReset(context, email);
    res.status(202).json({
      message:
        "If an account exists for that email, you'll receive a reset link shortly",
    });
  });

  router.post('/password-reset/confirm', async (req, res) => {
    const { token, password } = validate(passwordResetConfirmSchema, req.body);
    await confirmPasswordReset(context, token, password);
    clearSessionCookie(context, res);
    res.status(204).end();
  });

  // Password-free sign-in for super admins: request an emailed link, then
  // exchange its token for a session.
  router.post('/admin-sign-in', async (req, res) => {
    const { email } = validate(adminSignInRequestSchema, req.body);
    await requestAdminSignIn(context, email);
    res.status(202).json({
      message:
        "If this email belongs to a SriDha Academy team account, you'll receive a sign-in link shortly",
    });
  });

  router.post('/admin-sign-in/confirm', async (req, res) => {
    const { token } = validate(adminSignInConfirmSchema, req.body);
    const user = await confirmAdminSignIn(context, token);
    const session = await createSession(context, user.id, false);
    setSessionCookie(context, res, session);
    res.json({ user });
  });

  return router;
};
