import cx from 'classnames/bind';

import { Heading } from '@components/ui/Heading/Heading';
import { Icon } from '@components/ui/Icon/Icon';
import { StatusDot } from '@components/ui/StatusDot/StatusDot';
import { Text } from '@components/ui/Text/Text';
import type { StatusColor } from '@constants/status';

import styles from './Timeline.module.css';

const cn = cx.bind(styles);

export type TimelineState = 'done' | 'active' | 'next';

export type TimelineItem = {
  id: string;
  label: string;
  title: string;
  description?: string;
  state: TimelineState;
  statusLabel: string;
  statusColor: StatusColor;
};

export type TimelineProps = {
  items: readonly TimelineItem[];
  className?: string;
};

// Vertical sequence of steps joined by a rule. Done steps are filled, the
// active step is ringed, upcoming steps are hollow.
export const Timeline = ({ items, className }: TimelineProps) => (
  <ol className={cn('timeline', className)}>
    {items.map(item => (
      <li key={item.id} className={cn('item', item.state)}>
        <span className={cn('marker')} aria-hidden="true">
          {item.state === 'done' ? <Icon name="check" size="sm" /> : null}
        </span>
        <div className={cn('content')}>
          <div className={cn('meta')}>
            <Text as="span" variant="label" tone="accent">
              {item.label}
            </Text>
            <StatusDot color={item.statusColor} label={item.statusLabel} />
          </div>
          <Heading level={3} variant="item" className={cn('title')}>
            {item.title}
          </Heading>
          {item.description ? (
            <Text as="p" variant="small" tone="muted">
              {item.description}
            </Text>
          ) : null}
        </div>
      </li>
    ))}
  </ol>
);
