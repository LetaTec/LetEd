import { randomUUID } from 'node:crypto';

import { Router } from 'express';
import { z } from 'zod';

import type { AppContext } from '../../app/context.js';
import { validate } from '../../http/validate.js';

export const ENQUIRY_TYPE = {
  modelPaperWaitlist: 'MODEL_PAPER_WAITLIST',
} as const;

export const MODEL_PAPER_EXAMS = [
  'JEE',
  'NEET',
  'UPSC',
  'CA',
  'COMMERCE_11_12',
] as const;

const enquirySchema = z.strictObject({
  type: z.literal(ENQUIRY_TYPE.modelPaperWaitlist),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .pipe(z.email('Enter a valid email address')),
  exam: z.enum(MODEL_PAPER_EXAMS),
});

// Public: visitors can join the AI model paper waitlist without an account.
// A signed-in visitor's request is linked to their user.
export const createEnquiriesRouter = ({ db, now }: AppContext) => {
  const router = Router();

  router.post('/', async (req, res) => {
    const input = validate(enquirySchema, req.body);
    const id = randomUUID();

    await db.query(
      `INSERT INTO enquiries (id, type, email, exam, user_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        id,
        input.type,
        input.email,
        input.exam,
        req.auth?.userId ?? null,
        now().toISOString(),
      ],
    );

    res.status(201).json({ enquiry: { id, type: input.type } });
  });

  return router;
};
