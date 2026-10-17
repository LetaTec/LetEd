import type React from 'react';
import cx from 'classnames/bind';

import { ButtonBase } from '@components/ui/ButtonBase/ButtonBase';
import { Icon } from '@components/ui/Icon/Icon';
import { IconButton } from '@components/ui/IconButton/IconButton';
import { Section } from '@components/ui/Section/Section';
import { SectionHead } from '@components/ui/SectionHead/SectionHead';
import { Text } from '@components/ui/Text/Text';
import { TOPIC_BREAKDOWN_TEXT as TEXT } from '@constants/home';
import { useRevealOnScroll } from '@hooks/useRevealOnScroll';
import type { TopicContext } from '@services/catalogue';

import { useStepCycle } from './useStepCycle';
import styles from './TopicBreakdownSection.module.css';

const cn = cx.bind(styles);

const TITLE_ID = 'topic-breakdown-title';

// How long each step stays on screen; the final step holds longer so the
// lessons have time to tick off.
const STEP_DURATIONS_MS = [2600, 2600, 5200] as const;

export type TopicBreakdownSectionProps = {
  // The live topic to feature in the final step, when the catalogue has one.
  topic: TopicContext | null;
};

export const TopicBreakdownSection = ({
  topic,
}: TopicBreakdownSectionProps) => {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>();
  const { step, isPaused, goToStep, togglePaused } = useStepCycle(
    TEXT.steps.length,
    isVisible,
    STEP_DURATIONS_MS,
  );

  return (
    <Section tone="subtle" divider labelledBy={TITLE_ID}>
      <SectionHead
        titleId={TITLE_ID}
        title={
          <>
            {TEXT.title}
            <br />
            <em>{TEXT.titleEmphasis}</em>
          </>
        }
        description={TEXT.description}
      />

      <div
        ref={ref}
        className={cn('stage')}
        data-step={step}
        role="img"
        aria-label={TEXT.figureLabel}
      >
        <div className={cn('subject')}>
          <div className={cn('tiles')}>
            {TEXT.tiles.map((tile, index) => (
              <div
                key={tile}
                className={cn('tile', {
                  tileSelected: tile === TEXT.selectedTile,
                })}
                style={{ '--tile-index': index } as React.CSSProperties}
              >
                <span className={cn('tileIndex')}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={cn('tileLabel')}>{tile}</span>
              </div>
            ))}
          </div>
          <div className={cn('cover')}>
            <Text variant="label" tone="accentInverse">
              {TEXT.subjectCaption}
            </Text>
            <span className={cn('coverTitle')}>{TEXT.subjectLabel}</span>
          </div>
        </div>

        <div className={cn('panel')}>
          <Text variant="label" tone="accent">
            {TEXT.panelEyebrow}
          </Text>
          <span className={cn('panelTitle')}>
            {topic ? topic.topic.title : TEXT.selectedTile}
          </span>
          {topic ? (
            <>
              <Text variant="label" tone="muted">
                {TEXT.lessonsLabel}
              </Text>
              <ol className={cn('lessons')}>
                {topic.topic.lessons.map((lesson, index) => (
                  <li
                    key={lesson.id}
                    className={cn('lesson')}
                    style={{ '--lesson-index': index } as React.CSSProperties}
                  >
                    <span className={cn('check')}>
                      <Icon name="check" size="sm" />
                    </span>
                    <Text variant="small">{lesson.title}</Text>
                  </li>
                ))}
              </ol>
            </>
          ) : null}
          <Text variant="strong" tone="success" className={cn('victory')}>
            {TEXT.victory}
          </Text>
        </div>
      </div>

      <div className={cn('controls')}>
        <ol className={cn('steps')}>
          {TEXT.steps.map((item, index) => (
            <li key={item.label}>
              <ButtonBase
                className={cn('step', { stepActive: index === step })}
                aria-current={index === step ? 'step' : undefined}
                aria-label={TEXT.stepLabel(index + 1, item.label)}
                onClick={() => goToStep(index)}
              >
                <span className={cn('stepBar')} aria-hidden="true" />
                <Text variant="strong">{item.label}</Text>
                <Text variant="small" tone="muted">
                  {item.description}
                </Text>
              </ButtonBase>
            </li>
          ))}
        </ol>
        <IconButton
          icon={isPaused ? 'play' : 'pause'}
          label={isPaused ? TEXT.play : TEXT.pause}
          onClick={togglePaused}
        />
      </div>
      <Text as="p" variant="fine" tone="muted" className={cn('note')}>
        {TEXT.exampleNote}
      </Text>
    </Section>
  );
};
