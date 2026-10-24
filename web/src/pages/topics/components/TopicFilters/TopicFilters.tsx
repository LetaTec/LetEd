import cx from 'classnames/bind';

import { Button } from '@components/ui/Button/Button';
import { Icon } from '@components/ui/Icon/Icon';
import { Select } from '@components/ui/Select/Select';
import { Text } from '@components/ui/Text/Text';
import { PAGE_TEXT } from '@constants/pages';
import {
  STREAM,
  STREAM_LABEL,
  TOPIC_AVAILABILITY,
  TOPIC_AVAILABILITY_LABEL,
  TOPIC_PREVIEWS,
} from '@constants/topics';
import { formatClassLevel } from '@utils/classLevel';
import { listTopicClasses } from '@utils/topicSearch';

import type { TopicFilters as TopicFilterValues } from '../../topicFilters';
import styles from './TopicFilters.module.css';

const cn = cx.bind(styles);

const CLASS_OPTIONS = listTopicClasses(TOPIC_PREVIEWS).map(classNumber => ({
  value: String(classNumber),
  label: formatClassLevel(classNumber),
}));
const STREAM_OPTIONS = Object.values(STREAM).map(stream => ({
  value: stream,
  label: STREAM_LABEL[stream],
}));
const AVAILABILITY_OPTIONS = Object.values(TOPIC_AVAILABILITY).map(value => ({
  value,
  label: TOPIC_AVAILABILITY_LABEL[value],
}));

export type TopicFilterKey = Exclude<
  keyof TopicFilterValues,
  'query' | 'subject'
>;

export type TopicFiltersProps = {
  filters: TopicFilterValues;
  // An empty value clears that filter
  onChange: (key: TopicFilterKey, value: string) => void;
  onClear: () => void;
  canClear: boolean;
};

// "Filter by" class, stream and availability, as one row of dropdowns.
// Subjects have their own tabs above the topics.
export const TopicFilters = ({
  filters,
  onChange,
  onClear,
  canClear,
}: TopicFiltersProps) => (
  <div className={cn('bar')}>
    <div className={cn('head')}>
      <Text as="div" variant="eyebrow" className={cn('title')}>
        <Icon name="filter" size="sm" />
        {PAGE_TEXT.topicsFilterTitle}
      </Text>
      {canClear ? (
        <Button variant="plain" onClick={onClear}>
          {PAGE_TEXT.topicsClearFilters}
        </Button>
      ) : null}
    </div>
    <div className={cn('fields')}>
      <Select
        label={PAGE_TEXT.topicsFilterClass}
        placeholder={PAGE_TEXT.topicsFilterClassAll}
        options={CLASS_OPTIONS}
        value={filters.classNumber === null ? '' : String(filters.classNumber)}
        onChange={event => onChange('classNumber', event.target.value)}
      />
      <Select
        label={PAGE_TEXT.topicsFilterStream}
        placeholder={PAGE_TEXT.topicsFilterStreamAll}
        options={STREAM_OPTIONS}
        value={filters.stream ?? ''}
        onChange={event => onChange('stream', event.target.value)}
      />
      <Select
        label={PAGE_TEXT.topicsFilterAvailability}
        placeholder={PAGE_TEXT.topicsFilterAvailabilityAll}
        options={AVAILABILITY_OPTIONS}
        value={filters.availability ?? ''}
        onChange={event => onChange('availability', event.target.value)}
      />
    </div>
  </div>
);
