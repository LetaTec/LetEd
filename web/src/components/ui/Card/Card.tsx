import type React from 'react';
import cx from 'classnames/bind';

import { Heading } from '../Heading/Heading';
import { Text } from '../Text/Text';
import styles from './Card.module.css';

const cn = cx.bind(styles);

export type CardVariant = 'tile' | 'panel' | 'profile' | 'note' | 'centered';

export type CardProps = {
  variant?: CardVariant;
  label?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  media?: React.ReactNode;
  footer?: React.ReactNode;
  id?: string;
  className?: string;
};

const CARD_HEADING_VARIANT = {
  tile: 'card',
  panel: 'title',
  profile: 'item',
  note: 'item',
  centered: 'item',
} as const;

const CARD_LABEL_VARIANT = {
  tile: 'numeralSm',
  panel: 'label',
  profile: 'numeralSm',
  note: 'numeralSm',
  centered: 'label',
} as const;

// Editorial card used for topics, programmes, notes and people. The parent
// CardGrid owns borders and backgrounds; the card owns its internal layout.
export const Card = ({
  variant = 'tile',
  label,
  title,
  description,
  media,
  footer,
  id,
  className,
}: CardProps) => (
  <article id={id} className={cn('card', variant, className)}>
    {media ? <div className={cn('media')}>{media}</div> : null}
    <div className={cn('body')}>
      {label ? (
        <Text
          as="div"
          variant={CARD_LABEL_VARIANT[variant]}
          tone={variant === 'panel' ? 'accent' : 'inherit'}
        >
          {label}
        </Text>
      ) : null}
      <div className={cn('content')}>
        <Heading
          level={3}
          variant={CARD_HEADING_VARIANT[variant]}
          className={cn('title')}
        >
          {title}
        </Heading>
        {description ? (
          <Text
            as="p"
            variant={variant === 'profile' ? 'caption' : 'small'}
            tone="muted"
            className={cn('description')}
          >
            {description}
          </Text>
        ) : null}
      </div>
    </div>
    {footer ? <div className={cn('footer')}>{footer}</div> : null}
  </article>
);
