import { useState } from 'react';

import { FeatureIllustration } from '@components/brand/FeatureIllustration/FeatureIllustration';
import { ModelPaperDialog } from '@components/enquiries/ModelPaperDialog/ModelPaperDialog';
import { FeatureInProgress } from '@components/roadmap/FeatureInProgress/FeatureInProgress';
import { Button } from '@components/ui/Button/Button';
import { MODEL_PAPER_ROADMAP, ROADMAP_TEXT } from '@constants/roadmap';

// Model papers are not live yet; the waitlist already works.
const ModelPaperPage = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <>
      <FeatureInProgress
        id="model-paper"
        roadmap={MODEL_PAPER_ROADMAP}
        visual={<FeatureIllustration variant="model" />}
        action={
          <Button endIcon="arrowRight" onClick={() => setIsWaitlistOpen(true)}>
            {ROADMAP_TEXT.joinWaitlist}
          </Button>
        }
      />
      <ModelPaperDialog
        open={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </>
  );
};

export default ModelPaperPage;
