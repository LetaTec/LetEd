import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { ModelPaperDialog } from '@components/enquiries/ModelPaperDialog/ModelPaperDialog';
import { useCatalogue } from '@hooks/useCatalogue';
import { useTopicSelection } from '@hooks/useTopicSelection';
import {
  findBatchContext,
  findTopicContext,
  listTopics,
  type Batch,
} from '@services/catalogue';

import { AboutSection } from './components/AboutSection/AboutSection';
import { AiTestDialog } from './components/AiTestDialog/AiTestDialog';
import { AiTestSection } from './components/AiTestSection/AiTestSection';
import { CtaSection } from './components/CtaSection/CtaSection';
import { HeroSection } from './components/HeroSection/HeroSection';
import { LearningModelSection } from './components/LearningModelSection/LearningModelSection';
import { ProgramsSection } from './components/ProgramsSection/ProgramsSection';
import { TeamSection } from './components/TeamSection/TeamSection';
import { TopicBreakdownSection } from './components/TopicBreakdownSection/TopicBreakdownSection';
import { TopicDialog } from './components/TopicDialog/TopicDialog';
import { TopicsSection } from './components/TopicsSection/TopicsSection';

type HomeDialog = 'modelPaper' | 'aiTest';

const HomePage = () => {
  const catalogue = useCatalogue();
  const location = useLocation();
  const { topicId, batchId, openTopic, selectBatch, clearBatch, closeTopic } =
    useTopicSelection();
  const [activeDialog, setActiveDialog] = useState<HomeDialog | null>(null);

  const topicContext = findTopicContext(catalogue.subjects, topicId);
  const batchContext = findBatchContext(catalogue.subjects, batchId);
  const selection =
    batchContext &&
    topicContext &&
    batchContext.topic.id === topicContext.topic.id
      ? batchContext
      : null;
  const hasUnknownBatch =
    !catalogue.isLoading && Boolean(batchId) && selection === null;

  // Sections render client-side, so honour an incoming #anchor once mounted.
  useEffect(() => {
    if (!location.hash) return;
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
    // Only on first mount — later hash changes are native in-page jumps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectBatch = (nextTopicId: string, batch: Batch) =>
    selectBatch(nextTopicId, batch.id);

  const closeDialog = () => setActiveDialog(null);

  return (
    <>
      <HeroSection
        catalogue={catalogue}
        onOpenTopic={openTopic}
        onSelectBatch={handleSelectBatch}
      />
      <LearningModelSection />
      <TopicBreakdownSection
        topic={listTopics(catalogue.subjects)[0] ?? null}
      />
      <AiTestSection onStartSample={() => setActiveDialog('aiTest')} />
      <TopicsSection catalogue={catalogue} onOpenTopic={openTopic} />
      <ProgramsSection
        onSeeTestFlow={() => setActiveDialog('aiTest')}
        onJoinWaitlist={() => setActiveDialog('modelPaper')}
      />
      <AboutSection />
      <TeamSection />
      <CtaSection />

      <TopicDialog
        open={topicContext !== null && activeDialog === null}
        context={topicContext}
        selection={selection}
        hasUnknownBatch={hasUnknownBatch}
        onClose={closeTopic}
        onSelectBatch={batch =>
          topicContext && handleSelectBatch(topicContext.topic.id, batch)
        }
        onClearBatch={clearBatch}
        onEnrolmentChange={catalogue.reload}
      />
      <AiTestDialog open={activeDialog === 'aiTest'} onClose={closeDialog} />
      <ModelPaperDialog
        open={activeDialog === 'modelPaper'}
        onClose={closeDialog}
      />
    </>
  );
};

export default HomePage;
