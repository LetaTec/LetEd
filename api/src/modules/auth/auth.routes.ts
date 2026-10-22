import { Router } from 'express';

import type { AppContext } from '../../app/context.js';
import { ApiError, ERROR_CODE } from '../../http/errors.js';
import { validate } from '../../http/validate.js';
import {
  loginSchema,
  passwordResetConfirmSchema,
  passwordResetRequestSchema,
  registerSchema,
} from './auth.schema.js';
import {
  authenticateStudent,
  confirmPasswordReset,
  getAuthUser,
  registerStudent,
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

  return router;
};
