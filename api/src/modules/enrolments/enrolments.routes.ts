import { Router } from 'express';

import type { AppContext } from '../../app/context.js';
import { validate } from '../../http/validate.js';
import { getRequiredAuth, requireAuth } from '../auth/session.js';
import {
  createEnrolment,
  createEnrolmentSchema,
  listEnrolments,
} from './enrolments.service.js';

export const createEnrolmentsRouter = (context: AppContext) => {
  const router = Router();

  router.use(requireAuth);

  router.get('/', (req, res) => {
    const { userId } = getRequiredAuth(req.auth);
    res.json({ enrolments: listEnrolments(context, userId) });
  });

  router.post('/', (req, res) => {
    const { userId } = getRequiredAuth(req.auth);
    const { batchId } = validate(createEnrolmentSchema, req.body);
    res.status(201).json({
      enrolment: createEnrolment(context, userId, batchId),
    });
  });

  return router;
};
