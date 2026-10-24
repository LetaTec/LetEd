import { useNavigate } from 'react-router-dom';
import cx from 'classnames/bind';

import { TopicPreviewGrid } from '@components/catalogue/TopicPreviewGrid/TopicPreviewGrid';
import { Heading } from '@components/ui/Heading/Heading';
import { Section } from '@components/ui/Section/Section';
import { Text } from '@components/ui/Text/Text';
import { CATALOGUE_QUERY_PARAM } from '@constants/catalogue';
import { PAGE_TEXT } from '@constants/pages';
import { APP_ROUTES } from '@constants/routes';
import { useCatalogue } from '@hooks/useCatalogue';
import { listTopics } from '@services/catalogue';

import styles from './TopicsPage.module.css';

const cn = cx.bind(styles);

const TITLE_ID = 'topics-page-title';

// Every topic we teach, searchable by name or class. Choosing an open topic
// opens its lessons and batches on the homepage, kept in the URL.
const TopicsPage = () => {
  const { subjects } = useCatalogue();
  const navigate = useNavigate();
  const catalogueTopics = listTopics(subjects).map(context => context.topic);

  const handleSelectTopic = (topicId: string) => {
    const params = new URLSearchParams({
      [CATALOGUE_QUERY_PARAM.topic]: topicId,
    });
    navigate(`${APP_ROUTES.HOME}?${params}`);
  };

  return (
    <Section labelledBy={TITLE_ID} className={cn('page')}>
      <div className={cn('head')}>
        <Text as="div" variant="eyebrow">
          {PAGE_TEXT.topicsEyebrow}
        </Text>
        <Heading level={1} variant="display" id={TITLE_ID}>
          {PAGE_TEXT.topicsTitle} <em>{PAGE_TEXT.topicsTitleEmphasis}</em>
        </Heading>
        <Text as="p" tone="muted" className={cn('note')}>
          {PAGE_TEXT.topicsNote}
        </Text>
      </div>

      <TopicPreviewGrid
        catalogueTopics={catalogueTopics}
        onSelectTopic={handleSelectTopic}
        actionLabel={PAGE_TEXT.topicsOpenLabel}
      />
    </Section>
  );
};

export default TopicsPage;
