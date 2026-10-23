import cx from 'classnames/bind';

import { Heading } from '@components/ui/Heading/Heading';
import { Photo } from '@components/ui/Photo/Photo';
import { Reveal } from '@components/ui/Reveal/Reveal';
import { Section } from '@components/ui/Section/Section';
import { Text } from '@components/ui/Text/Text';
import { ABOUT_PAGE_TEXT } from '@constants/about';
import { STUDENT_PHOTOS } from '@constants/photos';

import styles from './InspirationSection.module.css';

const cn = cx.bind(styles);

const TITLE_ID = 'inspiration-title';
const { inspiration } = ABOUT_PAGE_TEXT;
const photo = STUDENT_PHOTOS[inspiration.photo];

export const InspirationSection = () => (
  <Section tone="subtle" labelledBy={TITLE_ID}>
    <div className={cn('grid')}>
      <Photo src={photo.src} alt={photo.alt} credit={photo.credit} />

      <Reveal className={cn('story')}>
        <Heading level={2} variant="display" id={TITLE_ID}>
          {inspiration.title} <em>{inspiration.titleEmphasis}</em>
        </Heading>
        <blockquote className={cn('quote')}>
          <p>{inspiration.quote}</p>
        </blockquote>
        {inspiration.paragraphs.map(paragraph => (
          <Text key={paragraph} as="p" tone="muted" className={cn('paragraph')}>
            {paragraph}
          </Text>
        ))}
      </Reveal>
    </div>
  </Section>
);
