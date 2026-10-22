import cx from 'classnames/bind';

import { ButtonRouteLink } from '@components/ui/Button/Button';
import { Card } from '@components/ui/Card/Card';
import { CardGrid } from '@components/ui/CardGrid/CardGrid';
import { Monogram } from '@components/ui/Monogram/Monogram';
import { Reveal } from '@components/ui/Reveal/Reveal';
import { Section } from '@components/ui/Section/Section';
import { SectionHead } from '@components/ui/SectionHead/SectionHead';
import { TEAM_TEXT } from '@constants/home';
import {
  ABOUT_SECTION_ID,
  APP_ROUTES,
  HOME_SECTION_ID,
  toPageSection,
} from '@constants/routes';

import styles from './TeamSection.module.css';

const cn = cx.bind(styles);

const TITLE_ID = 'team-title';

export const TeamSection = () => (
  <Section id={HOME_SECTION_ID.team} labelledBy={TITLE_ID}>
    <SectionHead
      titleId={TITLE_ID}
      title={
        <>
          {TEAM_TEXT.title}
          <br />
          <em>{TEAM_TEXT.titleEmphasis}</em>
        </>
      }
      description={TEAM_TEXT.description}
    />
    <CardGrid variant="columns" columns={4}>
      {TEAM_TEXT.members.map(member => (
        <Reveal key={member.name}>
          <Card
            variant="profile"
            media={<Monogram initial={member.initial} />}
            title={member.name}
            description={member.role}
          />
        </Reveal>
      ))}
    </CardGrid>
    <div className={cn('more')}>
      <ButtonRouteLink
        variant="editorial"
        to={toPageSection(APP_ROUTES.ABOUT, ABOUT_SECTION_ID.tutors)}
      >
        {TEAM_TEXT.meetTutors}
      </ButtonRouteLink>
    </div>
  </Section>
);
