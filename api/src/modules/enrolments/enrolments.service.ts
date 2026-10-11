import { randomUUID } from 'node:crypto';

import { z } from 'zod';

import type { AppContext } from '../../app/context.js';
import { transaction } from '../../db/client.js';
import { ApiError, ERROR_CODE } from '../../http/errors.js';
import {
  BATCH_AVAILABILITY,
  countActiveEnrolmentsForBatch,
  getBatchRow,
  resolveBatchAvailability,
  toBatch,
  toDateOnly,
  toLesson,
  toTopicSummary,
  type Batch,
  type Lesson,
  type Price,
} from '../catalogue/catalogue.repository.js';

export const ENROLMENT_STATUS = {
  pendingPayment: 'PENDING_PAYMENT',
  confirmed: 'CONFIRMED',
  cancelled: 'CANCELLED',
} as const;

// The client only names the batch. The student is always the signed-in
// account — any user identifier in the body is rejected by the strict schema.
export const createEnrolmentSchema = z.strictObject({
  batchId: z.string().trim().min(1, 'Select a batch').max(100),
});

export type Enrolment = {
  id: string;
  status: (typeof ENROLMENT_STATUS)[keyof typeof ENROLMENT_STATUS];
  createdAt: string;
  subject: { id: string; slug: string; name: string };
  topic: {
    id: string;
    title: string;
    summary: string;
    level: string | null;
    price: Price | null;
    lessons: Lesson[];
  };
  batch: Batch;
};

const loadEnrolments = (
  { db, now }: AppContext,
  userId: string,
  enrolmentId?: string,
): Enrolment[] => {
  const today = toDateOnly(now());
  const rows = db
    .prepare(
      `SELECT e.id AS enrolment_id, e.status AS enrolment_status, e.created_at AS enrolment_created_at,
              b.*, t.id AS t_id, t.title AS t_title, t.summary AS t_summary, t.level AS t_level,
              t.price_paise AS t_price_paise, t.price_tax_label AS t_price_tax_label,
              s.id AS s_id, s.slug AS s_slug, s.name AS s_name
       FROM enrolments e
       JOIN batches b ON b.id = e.batch_id
       JOIN topics t ON t.id = b.topic_id
       JOIN chapters c ON c.id = t.chapter_id
       JOIN subjects s ON s.id = c.subject_id
       WHERE e.user_id = ? AND e.status <> 'CANCELLED' AND (? IS NULL OR e.id = ?)
       ORDER BY e.created_at DESC`,
    )
    .all(userId, enrolmentId ?? null, enrolmentId ?? null);

  const lessonsStatement = db.prepare(
    'SELECT * FROM lessons WHERE topic_id = ? ORDER BY position',
  );

  return rows.map(row => ({
    id: String(row.enrolment_id),
    status: row.enrolment_status as Enrolment['status'],
    createdAt: String(row.enrolment_created_at),
    subject: {
      id: String(row.s_id),
      slug: String(row.s_slug),
      name: String(row.s_name),
    },
    topic: {
      ...toTopicSummary({
        id: row.t_id,
        title: row.t_title,
        summary: row.t_summary,
        level: row.t_level,
        price_paise: row.t_price_paise,
        price_tax_label: row.t_price_tax_label,
      }),
      lessons: lessonsStatement.all(row.t_id as string).map(toLesson),
    },
    batch: toBatch(
      row,
      countActiveEnrolmentsForBatch(db, String(row.id)),
      today,
    ),
  }));
};

export const listEnrolments = (context: AppContext, userId: string) =>
  loadEnrolments(context, userId);

export const createEnrolment = (
  context: AppContext,
  userId: string,
  batchId: string,
): Enrolment => {
  const { db } = context;
  const timestamp = context.now().toISOString();

  // Check availability and insert inside one write transaction so two students
  // cannot take the last seat at the same time.
  const enrolmentId = transaction(db, () => {
    const batch = getBatchRow(db, batchId);

    if (!batch) {
      throw new ApiError(
        404,
        ERROR_CODE.batchNotFound,
        'This batch no longer exists',
      );
    }

    const existing = db
      .prepare(
        'SELECT id, status FROM enrolments WHERE user_id = ? AND batch_id = ?',
      )
      .get(userId, batchId);

    if (existing && existing.status !== ENROLMENT_STATUS.cancelled) {
      throw new ApiError(
        409,
        ERROR_CODE.alreadyEnrolled,
        'You have already selected this batch',
        { enrolmentId: String(existing.id) },
      );
    }

    const availability = resolveBatchAvailability(
      batch,
      countActiveEnrolmentsForBatch(db, batchId),
      toDateOnly(context.now()),
    );

    if (availability === BATCH_AVAILABILITY.full) {
      throw new ApiError(409, ERROR_CODE.batchFull, 'This batch is full', {
        availability,
      });
    }

    if (availability !== BATCH_AVAILABILITY.open) {
      throw new ApiError(
        409,
        ERROR_CODE.batchUnavailable,
        'This batch is not open for enrolment',
        { availability },
      );
    }

    if (existing) {
      db.prepare(
        'UPDATE enrolments SET status = ?, updated_at = ? WHERE id = ?',
      ).run(ENROLMENT_STATUS.pendingPayment, timestamp, String(existing.id));
      return String(existing.id);
    }

    const id = randomUUID();
    db.prepare(
      `INSERT INTO enrolments (id, user_id, batch_id, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      userId,
      batchId,
      ENROLMENT_STATUS.pendingPayment,
      timestamp,
      timestamp,
    );
    return id;
  });

  const [enrolment] = loadEnrolments(context, userId, enrolmentId);

  if (!enrolment) {
    throw new Error(`Enrolment ${enrolmentId} could not be loaded`);
  }

  return enrolment;
};
