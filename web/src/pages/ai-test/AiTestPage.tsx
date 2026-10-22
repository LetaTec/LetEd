import { SampleTestPaper } from '@components/assessment/SampleTestPaper/SampleTestPaper';
import { FeatureInProgress } from '@components/roadmap/FeatureInProgress/FeatureInProgress';
import { AI_TEST_ROADMAP } from '@constants/roadmap';

// AI test papers are not live yet: show what they will be and how far along
// the build is.
const AiTestPage = () => (
  <FeatureInProgress
    id="ai-test"
    roadmap={AI_TEST_ROADMAP}
    visual={<SampleTestPaper />}
  />
);

export default AiTestPage;
