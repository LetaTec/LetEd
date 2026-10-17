import cx from 'classnames/bind';

import { ButtonLink } from '@components/ui/Button/Button';
import { Heading } from '@components/ui/Heading/Heading';
import { Reveal } from '@components/ui/Reveal/Reveal';
import { Section } from '@components/ui/Section/Section';
import { Text } from '@components/ui/Text/Text';
import { CTA_TEXT } from '@constants/home';
import { HOME_SECTION_ID, toSectionHref } from '@constants/routes';

import styles from './CtaSection.module.css';

const cn = cx.bind(styles);

const TITLE_ID = 'cta-title';

export const CtaSection = () => (
  <Section divider align="center" labelledBy={TITLE_ID}>
    <Reveal>
      <Text as="div" variant="eyebrow">
        {CTA_TEXT.eyebrow}
      </Text>
      <Heading
        level={2}
        variant="feature"
        id={TITLE_ID}
        className={cn('title')}
      >
        {CTA_TEXT.title}
        <br />
        <em>{CTA_TEXT.titleEmphasis}</em>
      </Heading>
      <ButtonLink
        href={toSectionHref(HOME_SECTION_ID.topics)}
        endIcon="arrowRight"
      >
        {CTA_TEXT.action}
      </ButtonLink>
    </Reveal>
  </Section>
);
