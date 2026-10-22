import type React from 'react';
import cx from 'classnames/bind';

import { ClosingCta } from '@components/brand/ClosingCta/ClosingCta';
import { ButtonRouteLink } from '@components/ui/Button/Button';
import { Card } from '@components/ui/Card/Card';
import { CardGrid } from '@components/ui/CardGrid/CardGrid';
import { Heading } from '@components/ui/Heading/Heading';
import { ProgressRuler } from '@components/ui/ProgressRuler/ProgressRuler';
import { Reveal } from '@components/ui/Reveal/Reveal';
import { Section } from '@components/ui/Section/Section';
import { SectionHead } from '@components/ui/SectionHead/SectionHead';
import { Stamp } from '@components/ui/Stamp/Stamp';
import { StatusDot } from '@components/ui/StatusDot/StatusDot';
import { Text } from '@components/ui/Text/Text';
import { Timeline } from '@components/ui/Timeline/Timeline';
import {
  getRoadmapProgress,
  MILESTONE_STATUS_COLOR,
  MILESTONE_STATUS_LABEL,
  ROADMAP_TEXT,
  type FeatureRoadmap,
} from '@constants/roadmap';
import { APP_ROUTES, HOME_SECTION_ID, toPageSection } from '@constants/routes';

import styles from './FeatureInProgress.module.css';

const cn = cx.bind(styles);

const TOPICS_LINK = toPageSection(APP_ROUTES.HOME, HOME_SECTION_ID.topics);

export type FeatureInProgressProps = {
  // Prefix for heading ids, unique per page.
  id: string;
  roadmap: FeatureRoadmap;
  visual: React.ReactNode;
  // Main call to action; defaults to browsing topics.
  action?: React.ReactNode;
};

// Page for a feature that is still being built: what it will do, how far
// along it is (chapter by chapter, like the book) and how it will work.
export const FeatureInProgress = ({
  id,
  roadmap,
  visual,
  action,
}: FeatureInProgressProps) => {
  const progress = getRoadmapProgress(roadmap.milestones);
  const heroId = `${id}-title`;
  const progressId = `${id}-progress-title`;
  const stepsId = `${id}-steps-title`;

  return (
    <>
      <Section labelledBy={heroId} className={cn('hero')}>
        <div className={cn('heroGrid')}>
          <div className={cn('heroCopy')}>
            <Text as="div" variant="eyebrow">
              {roadmap.eyebrow}
            </Text>
            <StatusDot color="warning" label={ROADMAP_TEXT.status} />
            <Heading level={1} variant="hero" id={heroId}>
              {roadmap.title}
              <br />
              <em>{roadmap.titleEmphasis}</em>
            </Heading>
            <Text as="p" variant="lead" tone="muted" className={cn('lead')}>
              {roadmap.lead}
            </Text>
            <div className={cn('actions')}>
              {action ?? (
                <ButtonRouteLink to={TOPICS_LINK} endIcon="arrowRight">
                  {ROADMAP_TEXT.ctaAction}
                </ButtonRouteLink>
              )}
              {action ? (
                <ButtonRouteLink variant="secondary" to={TOPICS_LINK}>
                  {ROADMAP_TEXT.ctaAction}
                </ButtonRouteLink>
              ) : null}
            </div>
          </div>

          <div className={cn('visual')}>
            {visual}
            <Stamp className={cn('stamp')}>{ROADMAP_TEXT.stamp}</Stamp>
          </div>
        </div>
      </Section>

      <Section tone="subtle" labelledBy={progressId}>
        <div className={cn('progressGrid')}>
          <Reveal className={cn('progressIntro')}>
            <Text as="div" variant="eyebrow">
              {ROADMAP_TEXT.progressEyebrow}
            </Text>
            <Heading level={2} variant="display" id={progressId}>
              {ROADMAP_TEXT.progressTitle}{' '}
              <em>{ROADMAP_TEXT.progressTitleEmphasis}</em>
            </Heading>
            <Text as="p" tone="muted">
              {ROADMAP_TEXT.progressDescription}
            </Text>
            <ProgressRuler
              value={progress.percent}
              label={ROADMAP_TEXT.progressLabel}
              caption={ROADMAP_TEXT.progressCaption(
                progress.done,
                progress.total,
              )}
              className={cn('ruler')}
            />
          </Reveal>

          <Timeline
            items={roadmap.milestones.map((milestone, index) => ({
              id: milestone.title,
              label: ROADMAP_TEXT.chapterLabel(index + 1),
              title: milestone.title,
              description: milestone.description,
              state: milestone.status,
              statusLabel: MILESTONE_STATUS_LABEL[milestone.status],
              statusColor: MILESTONE_STATUS_COLOR[milestone.status],
            }))}
          />
        </div>
      </Section>

      <Section labelledBy={stepsId}>
        <SectionHead
          titleId={stepsId}
          title={
            <>
              {ROADMAP_TEXT.stepsTitle}
              <br />
              <em>{ROADMAP_TEXT.stepsTitleEmphasis}</em>
            </>
          }
        />
        <CardGrid variant="columns" columns={4}>
          {roadmap.steps.map(step => (
            <Reveal key={step.label}>
              <Card
                variant="note"
                label={step.label}
                title={step.title}
                description={step.description}
              />
            </Reveal>
          ))}
        </CardGrid>
      </Section>

      <ClosingCta
        titleId={`${id}-cta-title`}
        eyebrow={ROADMAP_TEXT.ctaEyebrow}
        title={ROADMAP_TEXT.ctaTitle}
        titleEmphasis={ROADMAP_TEXT.ctaTitleEmphasis}
        actionLabel={ROADMAP_TEXT.ctaAction}
        to={TOPICS_LINK}
      />
    </>
  );
};
