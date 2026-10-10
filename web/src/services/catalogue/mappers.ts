import { BATCH_AVAILABILITY } from '@constants/catalogue';

import type {
  Batch,
  BatchContext,
  Price,
  Subject,
  TopicContext,
} from './types';

export const listTopics = (subjects: readonly Subject[]): TopicContext[] =>
  subjects.flatMap(subject =>
    subject.chapters.flatMap(chapter =>
      chapter.topics.map(topic => ({ subject, chapter, topic })),
    ),
  );

export const findSubjectBySlug = (
  subjects: readonly Subject[],
  slug: string | null,
) => (slug ? (subjects.find(subject => subject.slug === slug) ?? null) : null);

export const findBatchContext = (
  subjects: readonly Subject[],
  batchId: string | null,
): BatchContext | null => {
  if (!batchId) return null;

  for (const context of listTopics(subjects)) {
    const batch = context.topic.batches.find(item => item.id === batchId);
    if (batch) return { ...context, batch };
  }

  return null;
};

export const isBatchOpen = (batch: Batch) =>
  batch.availability === BATCH_AVAILABILITY.OPEN;

export const hasTopics = (subject: Subject) =>
  subject.chapters.some(chapter => chapter.topics.length > 0);

// The lowest topic price a subject is offered from, falling back to the
// subject's configured list price when no topic is priced yet.
export const getSubjectStartingPrice = (subject: Subject): Price | null => {
  const topicPrices = subject.chapters
    .flatMap(chapter => chapter.topics)
    .map(topic => topic.price)
    .filter((price): price is Price => price !== null);

  if (topicPrices.length === 0) return subject.listPrice;

  return topicPrices.reduce((lowest, price) =>
    price.amountPaise < lowest.amountPaise ? price : lowest,
  );
};
