import { TopicPreviewGrid } from '@components/catalogue/TopicPreviewGrid/TopicPreviewGrid';
import { Section } from '@components/ui/Section/Section';
import { SectionHead } from '@components/ui/SectionHead/SectionHead';
import { TOPICS_TEXT } from '@constants/home';
import { HOME_SECTION_ID } from '@constants/routes';
import type { CatalogueState } from '@hooks/useCatalogue';
import { listTopics } from '@services/catalogue';

const TITLE_ID = 'topics-title';

export type TopicsSectionProps = {
  catalogue: CatalogueState;
  onOpenTopic: (topicId: string) => void;
};

// The topics on offer, second on the homepage, with their own search.
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
      />
    </Section>
  );
};
