import cx from 'classnames/bind';

import { Icon } from '@components/ui/Icon/Icon';
import { Text } from '@components/ui/Text/Text';
import { LANDING_TEXT } from '@constants/landing';

import styles from './TopicSubtopicsOverlay.module.css';

const cn = cx.bind(styles);

export type TopicSubtopicsOverlayProps = {
  id: string;
  title: string;
  level: string;
  subtopics: readonly string[];
  // Open topics also invite the student through to their batches.
  isOpen: boolean;
  className?: string;
};

// What a topic teaches, revealed over its card on hover or keyboard focus.
// The topic and level are named in the description for screen readers.
// Rendered inside the card's button, so it uses phrasing elements only, and
// it doubles as the button's accessible description.
export const TopicSubtopicsOverlay = ({
  id,
  title,
  level,
  subtopics,
  isOpen,
  className,
}: TopicSubtopicsOverlayProps) => (
  <span id={id} className={cn('overlay', className)}>
    <span className={cn('visuallyHidden')}>{`${title} · ${level}`}</span>
    <Text as="span" variant="numeral" tone="inverse" className={cn('title')}>
      {LANDING_TEXT.overlayTitle}
    </Text>

    <span className={cn('subtopics')}>
      {subtopics.map((subtopic, index) => (
        <span key={subtopic} className={cn('subtopic')}>
          <Text as="span" variant="label" tone="accentInverse">
            {String(index + 1).padStart(2, '0')}
          </Text>
          <Text as="span" variant="small" tone="inverse">
            {subtopic}
          </Text>
        </span>
      ))}
    </span>

    {isOpen ? (
      <span className={cn('action')}>
        <Text as="span" variant="label" tone="inverse">
          {LANDING_TEXT.overlayAction}
        </Text>
        <Icon name="arrowRight" size="sm" />
      </span>
    ) : null}
  </span>
);
