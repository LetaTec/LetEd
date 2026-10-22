import cx from 'classnames/bind';

import { ButtonRouteLink } from '@components/ui/Button/Button';
import { Card } from '@components/ui/Card/Card';
import { CardGrid } from '@components/ui/CardGrid/CardGrid';
import { Heading } from '@components/ui/Heading/Heading';
import { Photo } from '@components/ui/Photo/Photo';
import { Reveal } from '@components/ui/Reveal/Reveal';
import { Section } from '@components/ui/Section/Section';
import { Text } from '@components/ui/Text/Text';
import { LEARNING_MODEL_TEXT } from '@constants/landing';
import { STUDENT_PHOTOS } from '@constants/photos';
import { APP_ROUTES, AUTH_SECTION_ID, toPageSection } from '@constants/routes';

import styles from './LearningModelSection.module.css';

const cn = cx.bind(styles);

const TITLE_ID = 'learning-model-title';

// The SriDha Academy model, under the sign-in form. "Browse topics" returns
// the visitor to the topics panel beside the form.
export const LearningModelSection = () => (
  <Section id={AUTH_SECTION_ID.model} divider labelledBy={TITLE_ID}>
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
          <ButtonRouteLink
            variant="editorial"
            to={toPageSection(APP_ROUTES.LOGIN, AUTH_SECTION_ID.access)}
            endIcon="arrowRight"
          >
            {LEARNING_MODEL_TEXT.action}
          </ButtonRouteLink>
        </div>
      </div>
    </Reveal>

    <CardGrid variant="columns" columns={4} className={cn('blocks')}>
      {LEARNING_MODEL_TEXT.blocks.map(block => (
        <Reveal key={block.index}>
          <Card
            variant="note"
            media={
              <Photo
                src={STUDENT_PHOTOS[block.photo].src}
                alt={STUDENT_PHOTOS[block.photo].alt}
                credit={STUDENT_PHOTOS[block.photo].credit}
              />
            }
            label={block.index}
            title={block.title}
            description={block.description}
          />
        </Reveal>
      ))}
    </CardGrid>
  </Section>
);
