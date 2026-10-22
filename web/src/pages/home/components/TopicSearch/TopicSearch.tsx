import { useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames/bind';

import { ButtonBase } from '@components/ui/ButtonBase/ButtonBase';
import { Icon } from '@components/ui/Icon/Icon';
import { Input } from '@components/ui/Input/Input';
import { StatusDot } from '@components/ui/StatusDot/StatusDot';
import { Text } from '@components/ui/Text/Text';
import { HERO_TEXT } from '@constants/home';
import { TOPIC_PREVIEWS, type TopicPreview } from '@constants/landing';
import { HOME_SECTION_ID, toSectionHref } from '@constants/routes';
import type { Topic } from '@services/catalogue';

import styles from './TopicSearch.module.css';

const cn = cx.bind(styles);

export type TopicSearchProps = {
  catalogueTopics: readonly Topic[];
  onOpenTopic: (topicId: string) => void;
};

const matches = (preview: TopicPreview, query: string) =>
  [preview.title, ...preview.subtopics].some(text =>
    text.toLowerCase().includes(query),
  );

// Topic search in the hero. Matches topic names and subtopics; choosing an
// open topic opens its batches, any other topic jumps to the topic cards.
export const TopicSearch = ({
  catalogueTopics,
  onOpenTopic,
}: TopicSearchProps) => {
  const navigate = useNavigate();
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const normalisedQuery = query.trim().toLowerCase();
  const results = normalisedQuery
    ? TOPIC_PREVIEWS.filter(preview => matches(preview, normalisedQuery))
    : [];
  const showResults = isOpen && normalisedQuery.length > 0;

  const openTopicId = (preview: TopicPreview) => {
    const topic = catalogueTopics.find(
      item => item.id === preview.catalogueTopicId,
    );
    return topic && topic.batches.length > 0 ? topic.id : null;
  };

  const choose = (preview: TopicPreview) => {
    const topicId = openTopicId(preview);
    setIsOpen(false);
    setQuery('');
    if (topicId) onOpenTopic(topicId);
    else navigate({ hash: toSectionHref(HOME_SECTION_ID.topics) });
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
        label={HERO_TEXT.searchLabel}
        placeholder={HERO_TEXT.searchPlaceholder}
        value={query}
        aria-controls={listId}
        aria-expanded={showResults}
        autoComplete="off"
        endAdornment={<Icon name="search" size="sm" />}
        onChange={event => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onKeyDown={event => {
          if (event.key === 'Escape') setIsOpen(false);
          if (event.key === 'Enter' && results[0]) {
            event.preventDefault();
            choose(results[0]);
          }
        }}
      />

      <div
        id={listId}
        role="region"
        aria-label={HERO_TEXT.searchResultsLabel}
        aria-live="polite"
        className={cn('results', { resultsOpen: showResults })}
      >
        {showResults && results.length === 0 ? (
          <Text as="p" variant="small" tone="muted" className={cn('empty')}>
            {HERO_TEXT.searchEmpty}
          </Text>
        ) : null}
        {showResults
          ? results.map(preview => {
              const isOpenTopic = openTopicId(preview) !== null;

              return (
                <ButtonBase
                  key={preview.title}
                  className={cn('result')}
                  onClick={() => choose(preview)}
                  onKeyDown={event => {
                    if (event.key === 'Escape') setIsOpen(false);
                  }}
                >
                  <span className={cn('resultIcon')} aria-hidden="true">
                    <Icon name={preview.icon} size="md" />
                  </span>
                  <span className={cn('resultText')}>
                    <Text as="span" variant="strong">
                      {preview.title}
                    </Text>
                    <Text as="span" variant="caption" tone="muted">
                      {preview.level}
                    </Text>
                  </span>
                  <StatusDot
                    color={isOpenTopic ? 'positive' : 'neutral'}
                    label={
                      isOpenTopic ? HERO_TEXT.searchOpen : HERO_TEXT.searchSoon
                    }
                  />
                </ButtonBase>
              );
            })
          : null}
      </div>
    </div>
  );
};
