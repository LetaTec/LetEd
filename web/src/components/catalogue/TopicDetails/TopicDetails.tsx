import cx from 'classnames/bind';

import { Heading } from '@components/ui/Heading/Heading';
import { KeyValueList } from '@components/ui/KeyValueList/KeyValueList';
import { RuledList } from '@components/ui/RuledList/RuledList';
import { Text } from '@components/ui/Text/Text';
import { CATALOGUE_TEXT } from '@constants/catalogue';
import type { Batch, TopicContext } from '@services/catalogue';

import { BatchOption } from '../BatchOption/BatchOption';
import { formatTopicPrice } from '../batchDetails';
import styles from './TopicDetails.module.css';

const cn = cx.bind(styles);

export type TopicDetailsProps = {
  context: TopicContext;
  onSelectBatch: (batch: Batch) => void;
};

// Explains exactly what a topic-wise offering contains: its chapter, the
// lessons it covers and the batches it runs in.
export const TopicDetails = ({ context, onSelectBatch }: TopicDetailsProps) => {
  const { chapter, topic } = context;

  return (
    <section className={cn('topic')} aria-label={topic.title}>
      <Text as="div" variant="label" tone="accent">
        {CATALOGUE_TEXT.chapterLabel} / {chapter.title}
      </Text>
      <Heading level={3} variant="item" className={cn('title')}>
        {topic.title}
      </Heading>
      <Text as="p" variant="small" tone="muted">
        {topic.summary}
      </Text>

      <KeyValueList
        className={cn('facts')}
        items={[
          {
            label: CATALOGUE_TEXT.levelLabel,
            value: topic.level ?? CATALOGUE_TEXT.toBeAnnounced,
          },
          {
            label: CATALOGUE_TEXT.priceLabel,
            value: formatTopicPrice(topic.price),
          },
          {
            label: CATALOGUE_TEXT.lessonsLabel,
            value: CATALOGUE_TEXT.lessonCount(topic.lessons.length),
          },
        ]}
      />

      <div className={cn('block')}>
        <Text as="div" variant="label" tone="muted">
          {CATALOGUE_TEXT.lessonsIncludedLabel}
        </Text>
        <RuledList
          ordered
          items={topic.lessons.map(lesson => lesson.title)}
          className={cn('lessons')}
        />
      </div>

      <div className={cn('block')}>
        <Text as="div" variant="label" tone="muted">
          {CATALOGUE_TEXT.batchesLabel}
        </Text>
        {topic.batches.length > 0 ? (
          <ul className={cn('batches')}>
            {topic.batches.map(batch => (
              <BatchOption
                key={batch.id}
                batch={batch}
                onSelect={onSelectBatch}
              />
            ))}
          </ul>
        ) : (
          <Text as="p" variant="small" tone="muted">
            {CATALOGUE_TEXT.noBatchesMessage}
          </Text>
        )}
      </div>
    </section>
  );
};
