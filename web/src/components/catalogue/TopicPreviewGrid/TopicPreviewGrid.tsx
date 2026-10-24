import { useId, useState } from 'react';
import cx from 'classnames/bind';

import { TopicSubtopicsOverlay } from '@components/catalogue/TopicSubtopicsOverlay/TopicSubtopicsOverlay';
import { Button } from '@components/ui/Button/Button';
import { Card } from '@components/ui/Card/Card';
import { CardGrid } from '@components/ui/CardGrid/CardGrid';
import { EmptyState } from '@components/ui/EmptyState/EmptyState';
import { Icon } from '@components/ui/Icon/Icon';
import { Input } from '@components/ui/Input/Input';
import { StatusDot } from '@components/ui/StatusDot/StatusDot';
import { Text } from '@components/ui/Text/Text';
import { CATALOGUE_TEXT } from '@constants/catalogue';
import { LANDING_TEXT } from '@constants/landing';
import { CHECKOUT_TEXT } from '@constants/payments';
import { TOPIC_PREVIEWS, type TopicPreview } from '@constants/topics';
import { findNextBatch, type Topic } from '@services/catalogue';
import { formatPrice } from '@utils/currency';
import { formatDateOnly } from '@utils/date';
import { searchTopicPreviews } from '@utils/topicSearch';

import styles from './TopicPreviewGrid.module.css';

const cn = cx.bind(styles);

// The fee, when the next batch starts (or that batches open soon) and the
// action that opens the payment panel.
const TopicOffer = ({
  preview,
  topic,
  onChoose,
  describedBy,
}: {
  preview: TopicPreview;
  topic: Topic | null;
  onChoose: (topicId: string) => void;
  describedBy: string;
}) => {
  const hasBatches = Boolean(topic && topic.batches.length > 0);
  const nextBatch = topic ? findNextBatch(topic) : null;
  const action = hasBatches
    ? CHECKOUT_TEXT.enrolAction
    : CHECKOUT_TEXT.preRegisterAction;

  return (
    <div className={cn('offer')}>
      <Text as="span" variant="price">
        {topic?.price
          ? formatPrice(topic.price)
          : CATALOGUE_TEXT.priceOnRequest}
      </Text>
      <StatusDot
        color={hasBatches ? 'positive' : 'neutral'}
        label={
          !hasBatches
            ? LANDING_TEXT.topicSoon
            : nextBatch?.startDate
              ? LANDING_TEXT.topicStarts(formatDateOnly(nextBatch.startDate))
              : LANDING_TEXT.topicOpen
        }
      />
      <Button
        variant="plain"
        endIcon="arrowRight"
        disabled={!topic}
        aria-label={CHECKOUT_TEXT.actionLabel(
          action,
          preview.title,
          preview.level,
        )}
        aria-describedby={describedBy}
        className={cn('action')}
        onClick={() => topic && onChoose(topic.id)}
      >
        {action}
      </Button>
    </div>
  );
};

export type TopicPreviewGridProps = {
  // The topics to show; defaults to every topic
  previews?: readonly TopicPreview[];
  // Topics from the live catalogue, which hold each topic's fee and batches
  catalogueTopics: readonly Topic[];
  // "Enrol now" or "Pre-register now", with the catalogue topic id
  onChooseTopic: (topicId: string) => void;
  // The full grid has a search box and four columns; the compact panel
  // beside the sign-in form has neither.
  showSearch?: boolean;
  columns?: 2 | 4;
  // Show only the first few topics, e.g. in the compact sign-in panel
  limit?: number;
};

// Grid of topic cards. Each shows its fee and an "Enrol now" (batches
// published) or "Pre-register now" button; hovering the card reveals what
// the topic teaches.
export const TopicPreviewGrid = ({
  catalogueTopics,
  onChooseTopic,
  showSearch = true,
  columns = 4,
  limit,
  previews = TOPIC_PREVIEWS,
}: TopicPreviewGridProps) => {
  const overlayId = useId();
  const [query, setQuery] = useState('');
  const topics = searchTopicPreviews(previews, query).results.slice(0, limit);

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
            const descriptionId = `${overlayId}-${index}`;

            return (
              <div
                key={`${preview.title}-${preview.level}`}
                className={cn('topic')}
              >
                <div className={cn('preview')}>
                  <Card
                    variant="centered"
                    className={cn('card')}
                    media={
                      <Icon name={preview.icon} size="xl" strokeWidth={1.25} />
                    }
                    title={preview.title}
                    description={preview.level}
                  />
                  <TopicSubtopicsOverlay
                    id={descriptionId}
                    title={preview.title}
                    level={preview.level}
                    subtopics={preview.subtopics}
                    className={cn('overlay')}
                  />
                </div>
                <TopicOffer
                  preview={preview}
                  topic={findCatalogueTopic(preview)}
                  onChoose={onChooseTopic}
                  describedBy={descriptionId}
                />
              </div>
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
