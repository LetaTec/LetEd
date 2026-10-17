import { BATCH_AVAILABILITY } from '@constants/catalogue';

import type { Batch, BatchContext, Subject, TopicContext } from './types';

export const listTopics = (subjects: readonly Subject[]): TopicContext[] =>
  subjects.flatMap(subject =>
    subject.chapters.flatMap(chapter =>
      chapter.topics.map(topic => ({ subject, chapter, topic })),
    ),
  );

export const findTopicContext = (
  subjects: readonly Subject[],
  topicId: string | null,
): TopicContext | null =>
  topicId
    ? (listTopics(subjects).find(context => context.topic.id === topicId) ??
      null)
    : null;

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
