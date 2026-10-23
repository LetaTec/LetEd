import { Card } from '@components/ui/Card/Card';
import { CardGrid } from '@components/ui/CardGrid/CardGrid';
import { Monogram } from '@components/ui/Monogram/Monogram';
import { Reveal } from '@components/ui/Reveal/Reveal';
import { Section } from '@components/ui/Section/Section';
import { SectionHead } from '@components/ui/SectionHead/SectionHead';
import { StatusDot } from '@components/ui/StatusDot/StatusDot';
import { ABOUT_PAGE_TEXT } from '@constants/about';
import { ABOUT_SECTION_ID } from '@constants/routes';

const TITLE_ID = 'tutors-title';
const { tutors } = ABOUT_PAGE_TEXT;

export const TutorsSection = () => (
  <Section id={ABOUT_SECTION_ID.tutors} divider labelledBy={TITLE_ID}>
    <SectionHead
      titleId={TITLE_ID}
      title={
        <>
          {tutors.title}
          <br />
          <em>{tutors.titleEmphasis}</em>
        </>
      }
      description={tutors.description}
    />
    <CardGrid variant="columns" columns={4}>
      {tutors.items.map(tutor => (
        <Reveal key={tutor.name}>
          <Card
            variant="profile"
            media={<Monogram initial={tutor.initial} />}
            title={tutor.name}
            description={tutor.focus}
            footer={<StatusDot color="neutral" label={tutors.status} />}
          />
        </Reveal>
      ))}
    </CardGrid>
  </Section>
);
