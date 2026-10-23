import { useId, useState } from 'react';
import cx from 'classnames/bind';

import { TopicSubtopicsOverlay } from '@components/catalogue/TopicSubtopicsOverlay/TopicSubtopicsOverlay';
import { ButtonBase } from '@components/ui/ButtonBase/ButtonBase';
import { Card } from '@components/ui/Card/Card';
import { CardGrid } from '@components/ui/CardGrid/CardGrid';
import { EmptyState } from '@components/ui/EmptyState/EmptyState';
import { Icon } from '@components/ui/Icon/Icon';
import { Input } from '@components/ui/Input/Input';
import { StatusDot } from '@components/ui/StatusDot/StatusDot';
import { Text } from '@components/ui/Text/Text';
import { CATALOGUE_TEXT } from '@constants/catalogue';
import {
  LANDING_TEXT,
  TOPIC_PREVIEWS,
  type TopicPreview,
} from '@constants/landing';
import { findNextBatch, type Topic } from '@services/catalogue';
import { formatPrice } from '@utils/currency';
import { formatDateOnly } from '@utils/date';
import { searchTopicPreviews } from '@utils/topicSearch';

import styles from './TopicPreviewGrid.module.css';

const cn = cx.bind(styles);

// The fee and when the next batch starts, on the face of an open topic.
const TopicOffer = ({ topic }: { topic: Topic }) => {
  const nextBatch = findNextBatch(topic);

  return (
    <span className={cn('offer')}>
      <Text as="span" variant="price">
        {topic.price ? formatPrice(topic.price) : CATALOGUE_TEXT.priceOnRequest}
      </Text>
      <StatusDot
        color="positive"
        label={
          nextBatch?.startDate
            ? LANDING_TEXT.topicStarts(formatDateOnly(nextBatch.startDate))
            : LANDING_TEXT.topicOpen
        }
      />
    </span>
  );
};

export type TopicPreviewGridProps = {
  // Topics from the live catalogue; a preview is open once its topic has
  // published batches.
  catalogueTopics: readonly Topic[];
  // Called with the catalogue topic id when an open topic is chosen.
  onSelectTopic: (topicId: string, preview: TopicPreview) => void;
  // Accessible name for each topic card, e.g. "View batches for GST".
  actionLabel: (topic: string) => string;
  // The full grid has a search box and four columns; the compact panel
  // beside the sign-in form has neither.
  showSearch?: boolean;
  columns?: 2 | 4;
  // Show only the first few topics, e.g. in the compact sign-in panel
  limit?: number;
};

// Grid of topic cards. Hovering or focusing a card reveals what the topic
// teaches. Open topics are actionable; the rest show as opening soon and
// stay focusable (so their subtopics can be read) but cannot be chosen yet.
export const TopicPreviewGrid = ({
  catalogueTopics,
  onSelectTopic,
  actionLabel,
  showSearch = true,
  columns = 4,
  limit,
}: TopicPreviewGridProps) => {
  const overlayId = useId();
  const [query, setQuery] = useState('');
  const topics = searchTopicPreviews(TOPIC_PREVIEWS, query).results.slice(
    0,
    limit,
  );

  const findCatalogueTopic = (preview: TopicPreview) =>
    catalogueTopics.find(topic => topic.id === preview.catalogueTopicId) ??
    null;

  return (
    <div className={cn('grid')}>
      {showSearch ? (
        <Input
          type="search"
          label={LANDING_TEXT.searchLabel}
          placeholder={LANDING_TEXT.searchPlaceholder}
          value={query}
          onChange={event => setQuery(event.target.value)}
          endAdornment={<Icon name="search" size="sm" />}
        />
      ) : null}

      {topics.length > 0 ? (
        <CardGrid variant="boxed" columns={columns}>
          {topics.map((preview, index) => {
            const catalogueTopic = findCatalogueTopic(preview);
            const topicId =
              catalogueTopic && catalogueTopic.batches.length > 0
                ? catalogueTopic.id
                : null;
            const descriptionId = `${overlayId}-${index}`;

            return (
              <ButtonBase
                key={preview.title}
                className={cn('topic', { topicSoon: topicId === null })}
                aria-disabled={topicId === null || undefined}
                aria-label={actionLabel(preview.title)}
                aria-describedby={descriptionId}
                onClick={() => topicId && onSelectTopic(topicId, preview)}
              >
                <Card
                  variant="centered"
                  media={
                    <Icon name={preview.icon} size="xl" strokeWidth={1.25} />
                  }
                  title={preview.title}
                  description={preview.level}
                  footer={
                    topicId && catalogueTopic ? (
                      <TopicOffer topic={catalogueTopic} />
                    ) : (
                      <StatusDot
                        color="neutral"
                        label={LANDING_TEXT.topicSoon}
                      />
                    )
                  }
                />
                <TopicSubtopicsOverlay
                  id={descriptionId}
                  title={preview.title}
                  level={preview.level}
                  subtopics={preview.subtopics}
                  isOpen={topicId !== null}
                  className={cn('overlay')}
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
