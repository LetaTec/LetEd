import { useNavigate } from 'react-router-dom';
import cx from 'classnames/bind';

import { TopicDetails } from '@components/catalogue/TopicDetails/TopicDetails';
import { Button } from '@components/ui/Button/Button';
import { EmptyState } from '@components/ui/EmptyState/EmptyState';
import { Heading } from '@components/ui/Heading/Heading';
import { Section } from '@components/ui/Section/Section';
import { Spinner } from '@components/ui/Spinner/Spinner';
import { Text } from '@components/ui/Text/Text';
import { CATALOGUE_QUERY_PARAM, CATALOGUE_TEXT } from '@constants/catalogue';
import { PAGE_TEXT } from '@constants/pages';
import { APP_ROUTES } from '@constants/routes';
import { useCatalogue } from '@hooks/useCatalogue';
import { listTopics, type TopicContext } from '@services/catalogue';

import styles from './BatchesPage.module.css';

const cn = cx.bind(styles);

const TITLE_ID = 'batches-title';

// Every topic batch, for signed-in students. Choosing one continues to the
// enrolment review on the homepage with the selection kept in the URL.
const BatchesPage = () => {
  const { subjects, isLoading, hasError, reload } = useCatalogue();
  const navigate = useNavigate();
  const topics = listTopics(subjects).filter(
    context => context.topic.batches.length > 0,
  );

  const handleSelectBatch = (context: TopicContext, batchId: string) => {
    const params = new URLSearchParams({
      [CATALOGUE_QUERY_PARAM.subject]: context.subject.slug,
      [CATALOGUE_QUERY_PARAM.batch]: batchId,
    });
    navigate(`${APP_ROUTES.HOME}?${params}`);
  };

  return (
    <Section labelledBy={TITLE_ID} className={cn('page')}>
      <div className={cn('head')}>
        <Text as="div" variant="eyebrow">
          {PAGE_TEXT.batchesEyebrow}
        </Text>
        <Heading level={1} variant="display" id={TITLE_ID}>
          {PAGE_TEXT.batchesTitle} <em>{PAGE_TEXT.batchesTitleEmphasis}</em>
        </Heading>
        <Text as="p" tone="muted" className={cn('note')}>
          {CATALOGUE_TEXT.topicWiseNote}
        </Text>
      </div>

      {isLoading ? (
        <div className={cn('status')} role="status">
          <Spinner tone="muted" />
          <Text variant="small" tone="muted">
            {PAGE_TEXT.loading}
          </Text>
        </div>
      ) : null}

      {hasError ? (
        <EmptyState
          title={CATALOGUE_TEXT.loadError}
          action={
            <Button variant="secondary" onClick={reload}>
              {CATALOGUE_TEXT.retry}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !hasError && topics.length === 0 ? (
        <EmptyState
          title={PAGE_TEXT.batchesEmptyTitle}
          message={PAGE_TEXT.batchesEmptyMessage}
        />
      ) : null}

      {!isLoading && !hasError && topics.length > 0 ? (
        <div className={cn('topics')}>
          {topics.map(context => (
            <TopicDetails
              key={context.topic.id}
              context={context}
              onSelectBatch={batch => handleSelectBatch(context, batch.id)}
            />
          ))}
        </div>
      ) : null}
    </Section>
  );
};

export default BatchesPage;
