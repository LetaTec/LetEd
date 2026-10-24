import { Router } from 'express';

import type { AppContext } from '../../app/context.js';
import { validate } from '../../http/validate.js';
import { getRequiredAuth, requireAuth } from '../auth/session.js';
import { createPaymentGateway } from './gateway.js';
import {
  createCheckout,
  createCheckoutSchema,
  verifyPayment,
  verifyPaymentSchema,
} from './payments.service.js';

export const createPaymentsRouter = (context: AppContext) => {
  const router = Router();
  const gateway =
    context.paymentGateway ?? createPaymentGateway(context.config);

  router.use(requireAuth);

  router.post('/checkout', async (req, res) => {
    const { userId } = getRequiredAuth(req.auth);
    const input = validate(createCheckoutSchema, req.body);
    res.status(201).json({
      checkout: await createCheckout(context, gateway, userId, input),
    });
  });

  router.post('/verify', async (req, res) => {
    const { userId } = getRequiredAuth(req.auth);
    const input = validate(verifyPaymentSchema, req.body);
    res.json({ payment: await verifyPayment(context, gateway, userId, input) });
  });

  return router;
};
