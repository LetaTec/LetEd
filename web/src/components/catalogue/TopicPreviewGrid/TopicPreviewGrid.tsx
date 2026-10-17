import { useState } from 'react';
import cx from 'classnames/bind';

import { ButtonBase } from '@components/ui/ButtonBase/ButtonBase';
import { Card } from '@components/ui/Card/Card';
import { CardGrid } from '@components/ui/CardGrid/CardGrid';
import { EmptyState } from '@components/ui/EmptyState/EmptyState';
import { Icon } from '@components/ui/Icon/Icon';
import { Input } from '@components/ui/Input/Input';
import { StatusDot } from '@components/ui/StatusDot/StatusDot';
import {
  LANDING_TEXT,
  TOPIC_PREVIEWS,
  type TopicPreview,
} from '@constants/landing';

import styles from './TopicPreviewGrid.module.css';

const cn = cx.bind(styles);

export type TopicPreviewGridProps = {
  // Catalogue topic ids that currently have published batches.
  openTopicIds: ReadonlySet<string>;
  // Called with the catalogue topic id when an open topic is chosen.
  onSelectTopic: (topicId: string, preview: TopicPreview) => void;
  // Accessible name for each topic card, e.g. "View batches for GST".
  actionLabel: (topic: string) => string;
};

// Searchable grid of topic cards. Open topics are actionable; the rest are
// shown as coming soon and cannot be chosen yet.
export const TopicPreviewGrid = ({
  openTopicIds,
  onSelectTopic,
  actionLabel,
}: TopicPreviewGridProps) => {
  const [query, setQuery] = useState('');
  const normalisedQuery = query.trim().toLowerCase();
  const topics = TOPIC_PREVIEWS.filter(topic =>
    topic.title.toLowerCase().includes(normalisedQuery),
  );

  return (
    <div className={cn('grid')}>
      <Input
        type="search"
        label={LANDING_TEXT.searchLabel}
        placeholder={LANDING_TEXT.searchPlaceholder}
        value={query}
        onChange={event => setQuery(event.target.value)}
        endAdornment={<Icon name="search" size="sm" />}
      />

      {topics.length > 0 ? (
        <CardGrid variant="boxed" columns={4}>
          {topics.map(topic => {
            const topicId =
              topic.catalogueTopicId && openTopicIds.has(topic.catalogueTopicId)
                ? topic.catalogueTopicId
                : null;

            return (
              <ButtonBase
                key={topic.title}
                className={cn('topic', { topicSoon: topicId === null })}
                disabled={topicId === null}
                aria-label={actionLabel(topic.title)}
                onClick={() => topicId && onSelectTopic(topicId, topic)}
              >
                <Card
                  variant="centered"
                  media={
                    <Icon name={topic.icon} size="xl" strokeWidth={1.25} />
                  }
                  title={topic.title}
                  description={topic.level}
                  footer={
                    <StatusDot
                      color={topicId ? 'positive' : 'neutral'}
                      label={
                        topicId
                          ? LANDING_TEXT.topicOpen
                          : LANDING_TEXT.topicSoon
                      }
                    />
                  }
                />
              </ButtonBase>
            );
          })}
        </CardGrid>
      ) : (
        <EmptyState
          title={LANDING_TEXT.noTopicsTitle}
          message={LANDING_TEXT.noTopicsMessage}
        />
      )}
    </div>
  );
};
