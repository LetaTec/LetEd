import cx from 'classnames/bind';

import { ButtonRouteLink } from '@components/ui/Button/Button';
import { Heading } from '@components/ui/Heading/Heading';
import { Reveal } from '@components/ui/Reveal/Reveal';
import { Section } from '@components/ui/Section/Section';
import { Text } from '@components/ui/Text/Text';

import styles from './ClosingCta.module.css';

const cn = cx.bind(styles);

export type ClosingCtaProps = {
  titleId: string;
  eyebrow: string;
  title: string;
  titleEmphasis: string;
  actionLabel: string;
  to: string;
};

// The large centred invitation that closes a page.
export const ClosingCta = ({
  titleId,
  eyebrow,
  title,
  titleEmphasis,
  actionLabel,
  to,
}: ClosingCtaProps) => (
  <Section divider align="center" labelledBy={titleId}>
    <Reveal>
      <Text as="div" variant="eyebrow">
        {eyebrow}
      </Text>
      <Heading level={2} variant="feature" id={titleId} className={cn('title')}>
        {title}
        <br />
        <em>{titleEmphasis}</em>
      </Heading>
      <ButtonRouteLink to={to} endIcon="arrowRight">
        {actionLabel}
      </ButtonRouteLink>
    </Reveal>
  </Section>
);
