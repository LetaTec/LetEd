import cx from 'classnames/bind';

import { TopicPreviewGrid } from '@components/catalogue/TopicPreviewGrid/TopicPreviewGrid';
import { ButtonRouteLink } from '@components/ui/Button/Button';
import { Section } from '@components/ui/Section/Section';
import { SectionHead } from '@components/ui/SectionHead/SectionHead';
import { TOPICS_TEXT } from '@constants/home';
import { APP_ROUTES, HOME_SECTION_ID } from '@constants/routes';
import { HOME_TOPIC_COUNT, TOPIC_PREVIEWS } from '@constants/topics';
import type { CatalogueState } from '@hooks/useCatalogue';
import { listTopics } from '@services/catalogue';

import styles from './TopicsSection.module.css';

const cn = cx.bind(styles);

const TITLE_ID = 'topics-title';

export type TopicsSectionProps = {
  catalogue: CatalogueState;
  onOpenTopic: (topicId: string) => void;
};

// The first topics on offer, second on the homepage, with their own search
// and a link to every topic on the Topics page.
export const TopicsSection = ({
  catalogue,
  onOpenTopic,
}: TopicsSectionProps) => {
  const catalogueTopics = listTopics(catalogue.subjects).map(
    context => context.topic,
  );

  return (
    <Section id={HOME_SECTION_ID.topics} labelledBy={TITLE_ID}>
      <SectionHead
        titleId={TITLE_ID}
        title={
          <>
            {TOPICS_TEXT.title}
            <br />
            <em>{TOPICS_TEXT.titleEmphasis}</em>
          </>
        }
        description={TOPICS_TEXT.description}
      />
      <TopicPreviewGrid
        catalogueTopics={catalogueTopics}
        onSelectTopic={onOpenTopic}
        actionLabel={TOPICS_TEXT.openTopicLabel}
        limit={HOME_TOPIC_COUNT}
      />
      <div className={cn('more')}>
        <ButtonRouteLink
          to={APP_ROUTES.TOPICS}
          variant="secondary"
          endIcon="arrowRight"
        >
          {TOPICS_TEXT.seeAll(TOPIC_PREVIEWS.length)}
        </ButtonRouteLink>
      </div>
    </Section>
  );
};
