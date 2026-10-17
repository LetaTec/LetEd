import { FeatureIllustration } from '@components/brand/FeatureIllustration/FeatureIllustration';
import { Card } from '@components/ui/Card/Card';
import { CardGrid } from '@components/ui/CardGrid/CardGrid';
import { Reveal } from '@components/ui/Reveal/Reveal';
import { Section } from '@components/ui/Section/Section';
import { SectionHead } from '@components/ui/SectionHead/SectionHead';
import { LANDING_TEXT } from '@constants/landing';

const TITLE_ID = 'feature-title';

export const FeatureSection = () => (
  <Section labelledBy={TITLE_ID}>
    <SectionHead
      titleId={TITLE_ID}
      title={
        <>
          {LANDING_TEXT.featuresTitle}{' '}
          <em>{LANDING_TEXT.featuresTitleEmphasis}</em>
        </>
      }
    />
    <CardGrid variant="plain" columns={3}>
      {LANDING_TEXT.features.map(feature => (
        <Reveal key={feature.title}>
          <Card
            variant="note"
            media={<FeatureIllustration variant={feature.illustration} />}
            title={feature.title}
            description={feature.description}
          />
        </Reveal>
      ))}
    </CardGrid>
  </Section>
);
