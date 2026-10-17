import cx from 'classnames/bind';

import { ButtonLink } from '@components/ui/Button/Button';
import { Card } from '@components/ui/Card/Card';
import { CardGrid } from '@components/ui/CardGrid/CardGrid';
import { Heading } from '@components/ui/Heading/Heading';
import { Reveal } from '@components/ui/Reveal/Reveal';
import { Section } from '@components/ui/Section/Section';
import { Text } from '@components/ui/Text/Text';
import { LEARNING_MODEL_TEXT } from '@constants/home';
import { HOME_SECTION_ID, toSectionHref } from '@constants/routes';

import styles from './LearningModelSection.module.css';

const cn = cx.bind(styles);

const TITLE_ID = 'learning-model-title';

export const LearningModelSection = () => (
  <Section id={HOME_SECTION_ID.learningModel} divider labelledBy={TITLE_ID}>
    <Reveal className={cn('grid')}>
      <Text as="div" variant="numeral">
        {LEARNING_MODEL_TEXT.index}
      </Text>
      <Heading level={2} variant="display" id={TITLE_ID}>
        {LEARNING_MODEL_TEXT.title} <em>{LEARNING_MODEL_TEXT.titleEmphasis}</em>
      </Heading>
      <div className={cn('copy')}>
        <Text as="p" variant="lead" tone="primary">
          {LEARNING_MODEL_TEXT.lead}
        </Text>
        <Text as="p" tone="muted">
          {LEARNING_MODEL_TEXT.body}
        </Text>
        <div>
          <ButtonLink
            variant="editorial"
            href={toSectionHref(HOME_SECTION_ID.courses)}
            endIcon="arrowRight"
          >
            {LEARNING_MODEL_TEXT.action}
          </ButtonLink>
        </div>
      </div>
    </Reveal>

    <CardGrid variant="columns" columns={4} className={cn('blocks')}>
      {LEARNING_MODEL_TEXT.blocks.map(block => (
        <Reveal key={block.index}>
          <Card
            variant="note"
            label={block.index}
            title={block.title}
            description={block.description}
          />
        </Reveal>
      ))}
    </CardGrid>
  </Section>
);
