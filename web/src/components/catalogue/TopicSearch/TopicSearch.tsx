import { useId, useRef, useState, type KeyboardEvent } from 'react';
import cx from 'classnames/bind';

import { ButtonBase } from '@components/ui/ButtonBase/ButtonBase';
import { Icon } from '@components/ui/Icon/Icon';
import { Input } from '@components/ui/Input/Input';
import { StatusDot } from '@components/ui/StatusDot/StatusDot';
import { Text } from '@components/ui/Text/Text';
import {
  BATCH_AVAILABILITY_COLOR,
  BATCH_AVAILABILITY_LABEL,
  CATALOGUE_TEXT,
} from '@constants/catalogue';
import { HEADER_TEXT } from '@constants/home';
import { TOPIC_PREVIEWS, type TopicPreview } from '@constants/landing';
import { isBatchOpen, type Batch, type Topic } from '@services/catalogue';
import { formatPrice } from '@utils/currency';
import { formatWallClockTime } from '@utils/date';

import styles from './TopicSearch.module.css';

const cn = cx.bind(styles);

// Enough to keep the dropdown short; the topic opens the full list.
const MAX_BATCHES = 3;

export type TopicSearchProps = {
  catalogueTopics: readonly Topic[];
  onOpenTopic: (topicId: string) => void;
  onSelectBatch: (topicId: string, batchId: string) => void;
  // For topics that have no batches yet
  onBrowseTopics: () => void;
};

const matches = (preview: TopicPreview, query: string) =>
  [preview.title, ...preview.subtopics].some(text =>
    text.toLowerCase().includes(query),
  );

const batchTiming = (batch: Batch) =>
  [
    batch.scheduleLabel,
    batch.startTime ? formatWallClockTime(batch.startTime) : null,
  ]
    .filter(Boolean)
    .join(' · ');

const batchStatus = (batch: Batch) =>
  isBatchOpen(batch) && batch.seatsRemaining !== null
    ? CATALOGUE_TEXT.seatsRemaining(batch.seatsRemaining)
    : BATCH_AVAILABILITY_LABEL[batch.availability];

// Topic search for the header. Matches topic names and subtopics, and lists
// each open topic's fee and batches: choosing a topic opens its lessons and
// batches, choosing a batch goes straight to reserving it.
export const TopicSearch = ({
  catalogueTopics,
  onOpenTopic,
  onSelectBatch,
  onBrowseTopics,
}: TopicSearchProps) => {
  const resultsId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const normalisedQuery = query.trim().toLowerCase();
  const results = normalisedQuery
    ? TOPIC_PREVIEWS.filter(preview => matches(preview, normalisedQuery))
    : [];
  const showResults = isOpen && normalisedQuery.length > 0;

  const findOpenTopic = (preview: TopicPreview) => {
    const topic = catalogueTopics.find(
      item => item.id === preview.catalogueTopicId,
    );
    return topic && topic.batches.length > 0 ? topic : null;
  };

  const finish = () => {
    setIsOpen(false);
    setQuery('');
  };

  const chooseTopic = (preview: TopicPreview) => {
    const topic = findOpenTopic(preview);
    finish();
    if (topic) onOpenTopic(topic.id);
    else onBrowseTopics();
  };

  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn('search')}
      onFocus={() => setIsOpen(true)}
      onBlur={event => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
          setIsOpen(false);
        }
      }}
    >
      <Input
        type="search"
        label={HEADER_TEXT.searchLabel}
        hideLabel
        placeholder={HEADER_TEXT.searchPlaceholder}
        value={query}
        aria-controls={resultsId}
        aria-expanded={showResults}
        autoComplete="off"
        endAdornment={<Icon name="search" size="sm" />}
        className={cn('input')}
        onChange={event => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onKeyDown={event => {
          closeOnEscape(event);
          if (event.key === 'Enter' && results[0]) {
            event.preventDefault();
            chooseTopic(results[0]);
          }
        }}
      />

      <div
        id={resultsId}
        role="region"
        aria-label={HEADER_TEXT.searchResultsLabel}
        aria-live="polite"
        className={cn('results', { resultsOpen: showResults })}
      >
        {showResults && results.length === 0 ? (
          <Text as="p" variant="small" tone="muted" className={cn('empty')}>
            {HEADER_TEXT.searchEmpty}
          </Text>
        ) : null}

        {showResults
          ? results.map(preview => {
              const topic = findOpenTopic(preview);
              const batches = topic?.batches.slice(0, MAX_BATCHES) ?? [];

              return (
                <div key={preview.title} className={cn('group')}>
                  <ButtonBase
                    className={cn('topic')}
                    onClick={() => chooseTopic(preview)}
                    onKeyDown={closeOnEscape}
                  >
                    <span className={cn('topicIcon')} aria-hidden="true">
                      <Icon name={preview.icon} size="md" />
                    </span>
                    <span className={cn('topicText')}>
                      <Text as="span" variant="strong">
                        {preview.title}
                      </Text>
                      <Text as="span" variant="caption" tone="muted">
                        {preview.level}
                      </Text>
                    </span>
                    {topic ? (
                      <Text as="span" variant="strong" tone="accent">
                        {topic.price
                          ? formatPrice(topic.price)
                          : CATALOGUE_TEXT.priceOnRequest}
                      </Text>
                    ) : (
                      <StatusDot
                        color="neutral"
                        label={HEADER_TEXT.searchSoon}
                      />
                    )}
                  </ButtonBase>

                  {topic
                    ? batches.map(batch => (
                        <ButtonBase
                          key={batch.id}
                          className={cn('batch')}
                          aria-label={HEADER_TEXT.searchBatchLabel(
                            preview.title,
                            batch.name,
                            batchTiming(batch),
                          )}
                          onClick={() => {
                            finish();
                            if (isBatchOpen(batch)) {
                              onSelectBatch(topic.id, batch.id);
                            } else {
                              onOpenTopic(topic.id);
                            }
                          }}
                          onKeyDown={closeOnEscape}
                        >
                          <span className={cn('batchText')}>
                            <Text as="span" variant="small">
                              {batch.name}
                            </Text>
                            <Text as="span" variant="caption" tone="muted">
                              {batchTiming(batch)}
                            </Text>
                          </span>
                          <StatusDot
                            color={BATCH_AVAILABILITY_COLOR[batch.availability]}
                            label={batchStatus(batch)}
                          />
                        </ButtonBase>
                      ))
                    : null}
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};
