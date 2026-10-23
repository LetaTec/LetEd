import { Card } from '@components/ui/Card/Card';
import { CardGrid } from '@components/ui/CardGrid/CardGrid';
import { Reveal } from '@components/ui/Reveal/Reveal';
import { Section } from '@components/ui/Section/Section';
import { SectionHead } from '@components/ui/SectionHead/SectionHead';
import { ABOUT_PAGE_TEXT } from '@constants/about';

const TITLE_ID = 'approach-title';
const { approach } = ABOUT_PAGE_TEXT;

export const ApproachSection = () => (
  <Section labelledBy={TITLE_ID}>
    <SectionHead
      titleId={TITLE_ID}
      title={
        <>
          {approach.title}
          <br />
          <em>{approach.titleEmphasis}</em>
        </>
      }
      description={approach.description}
    />
    <CardGrid variant="columns" columns={4}>
      {approach.steps.map(step => (
        <Reveal key={step.label}>
          <Card
            variant="note"
            label={step.label}
            title={step.title}
            description={step.description}
          />
        </Reveal>
      ))}
    </CardGrid>
  </Section>
);
