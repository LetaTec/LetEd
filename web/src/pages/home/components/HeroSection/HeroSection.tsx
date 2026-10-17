import cx from 'classnames/bind';

import { Button, ButtonLink } from '@components/ui/Button/Button';
import { Container } from '@components/ui/Container/Container';
import { Heading } from '@components/ui/Heading/Heading';
import { StatList } from '@components/ui/StatList/StatList';
import { Text } from '@components/ui/Text/Text';
import { HERO_TEXT } from '@constants/home';
import { HOME_SECTION_ID, toSectionHref } from '@constants/routes';

import {
  InteractiveBook,
  type InteractiveBookProps,
} from '../InteractiveBook/InteractiveBook';
import styles from './HeroSection.module.css';

const cn = cx.bind(styles);

export type HeroSectionProps = InteractiveBookProps & {
  onCreateAccount: () => void;
};

export const HeroSection = ({
  onCreateAccount,
  ...bookProps
}: HeroSectionProps) => (
  <section id={HOME_SECTION_ID.home} className={cn('hero')}>
    <Container className={cn('grid')}>
      <div className={cn('copy')}>
        <Text as="div" variant="eyebrow" tone="accent" className={cn('kicker')}>
          <span className={cn('kickerRule')} aria-hidden="true" />
          {HERO_TEXT.kicker}
        </Text>
        <Heading level={1} variant="hero" className={cn('title')}>
          {HERO_TEXT.title}
          <br />
          <em>{HERO_TEXT.titleEmphasis}</em>
          <br />
          {HERO_TEXT.titleEnd}
        </Heading>
        <Text as="p" variant="lead" tone="muted" className={cn('lead')}>
          {HERO_TEXT.lead}
        </Text>
        <div className={cn('actions')}>
          <ButtonLink
            href={toSectionHref(HOME_SECTION_ID.courses)}
            endIcon="arrowUpRight"
          >
            {HERO_TEXT.primaryAction}
          </ButtonLink>
          <Button variant="secondary" onClick={onCreateAccount}>
            {HERO_TEXT.secondaryAction}
          </Button>
        </div>
        <StatList items={HERO_TEXT.stats} className={cn('stats')} />
      </div>

      <InteractiveBook {...bookProps} />
    </Container>
  </section>
);
