import { Card } from '@components/ui/Card/Card';
import { CardGrid } from '@components/ui/CardGrid/CardGrid';
import { Reveal } from '@components/ui/Reveal/Reveal';
import { Section } from '@components/ui/Section/Section';
import { SectionHead } from '@components/ui/SectionHead/SectionHead';
import { ABOUT_PAGE_TEXT } from '@constants/about';

const TITLE_ID = 'motive-title';
const { motive } = ABOUT_PAGE_TEXT;

export const MotiveSection = () => (
  <Section divider labelledBy={TITLE_ID}>
    <SectionHead
      titleId={TITLE_ID}
      title={
        <>
          {motive.title} <em>{motive.titleEmphasis}</em>
        </>
      }
      description={motive.description}
    />
    <CardGrid variant="ruled" columns={3}>
      {motive.items.map(item => (
        <Reveal key={item.label}>
          <Card
            variant="tile"
            label={item.label}
            title={item.title}
            description={item.description}
          />
        </Reveal>
      ))}
    </CardGrid>
  </Section>
);
