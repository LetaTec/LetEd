import cx from 'classnames/bind';

import { Heading } from '@components/ui/Heading/Heading';
import { Section } from '@components/ui/Section/Section';
import { Text } from '@components/ui/Text/Text';
import { ABOUT_TEXT } from '@constants/home';
import { HOME_SECTION_ID } from '@constants/routes';

import styles from './AboutSection.module.css';

const cn = cx.bind(styles);

const TITLE_ID = 'about-title';

export const AboutSection = () => (
  <Section id={HOME_SECTION_ID.about} tone="inverseDeep" labelledBy={TITLE_ID}>
    <div className={cn('grid')}>
      <Text as="div" variant="eyebrow">
        {ABOUT_TEXT.eyebrow}
      </Text>
      <Heading level={2} variant="display" tone="inverse" id={TITLE_ID}>
        {ABOUT_TEXT.title}
        <br />
        <em>{ABOUT_TEXT.titleEmphasis}</em>
      </Heading>
      <div className={cn('copy')}>
        {ABOUT_TEXT.paragraphs.map(paragraph => (
          <Text key={paragraph} as="p" variant="lead" tone="inverseMuted">
            {paragraph}
          </Text>
        ))}
        <Text as="p" variant="small" tone="inverseMuted" className={cn('note')}>
          {ABOUT_TEXT.note}
        </Text>
      </div>
    </div>
  </Section>
);
