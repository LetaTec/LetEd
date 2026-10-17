import cx from 'classnames/bind';

import { Heading } from '@components/ui/Heading/Heading';
import { KeyValueList } from '@components/ui/KeyValueList/KeyValueList';
import { RuledList } from '@components/ui/RuledList/RuledList';
import { StatusDot } from '@components/ui/StatusDot/StatusDot';
import { Text } from '@components/ui/Text/Text';
import {
  BATCH_AVAILABILITY_COLOR,
  BATCH_AVAILABILITY_LABEL,
  CATALOGUE_TEXT,
} from '@constants/catalogue';
import type { BatchContext } from '@services/catalogue';

import { formatTopicPrice, getBatchDetailItems } from '../batchDetails';
import styles from './SelectionSummary.module.css';

const cn = cx.bind(styles);

export type SelectionSummaryProps = {
  context: BatchContext;
};

// The scope of a selection before enrolment: which chapter and topic,
// the lessons it includes, and the exact batch schedule and price.
export const SelectionSummary = ({ context }: SelectionSummaryProps) => {
  const { chapter, topic, batch } = context;

  return (
    <div className={cn('summary')}>
      <Text as="div" variant="label" tone="accent">
        {CATALOGUE_TEXT.chapterLabel} / {chapter.title}
      </Text>
      <Heading level={3} variant="item">
        {topic.title}
      </Heading>
      <div className={cn('batchLine')}>
        <Text variant="strong">
          {batch.scheduleLabel} · {batch.name}
        </Text>
        <StatusDot
          color={BATCH_AVAILABILITY_COLOR[batch.availability]}
          label={BATCH_AVAILABILITY_LABEL[batch.availability]}
        />
      </div>
      <KeyValueList
        items={[
          {
            label: CATALOGUE_TEXT.priceLabel,
            value: formatTopicPrice(topic.price),
          },
          {
            label: CATALOGUE_TEXT.levelLabel,
            value: topic.level ?? CATALOGUE_TEXT.toBeAnnounced,
          },
          ...getBatchDetailItems(batch),
        ]}
      />
      <div className={cn('lessons')}>
        <Text as="div" variant="label" tone="muted">
          {CATALOGUE_TEXT.lessonsIncludedLabel}
        </Text>
        <RuledList ordered items={topic.lessons.map(lesson => lesson.title)} />
      </div>
    </div>
  );
};
