import cx from 'classnames/bind';

import { Text } from '@components/ui/Text/Text';

import styles from './ProgressRuler.module.css';

const cn = cx.bind(styles);

const TICK_COUNT = 10;
const SCALE = ['0', '50', '100'] as const;

export type ProgressRulerProps = {
  // 0–100
  value: number;
  label: string;
  caption?: string;
  className?: string;
};

// A ruled measure, like the edge of a ruler: a large figure above a ticked
// track filled to the value. Static by design.
export const ProgressRuler = ({
  value,
  label,
  caption,
  className,
}: ProgressRulerProps) => {
  const percent = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={cn('ruler', className)}>
      <div className={cn('head')}>
        <Text as="div" variant="label" tone="muted">
          {label}
        </Text>
        <div className={cn('value')} aria-hidden="true">
          {percent}
          <span className={cn('unit')}>%</span>
        </div>
      </div>

      <div
        className={cn('track')}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={caption ? `${percent}%, ${caption}` : `${percent}%`}
      >
        <span className={cn('fill')} style={{ width: `${percent}%` }} />
        {Array.from({ length: TICK_COUNT + 1 }, (_, index) => (
          <span
            key={index}
            className={cn('tick', { major: index % (TICK_COUNT / 2) === 0 })}
            style={{ left: `${(index / TICK_COUNT) * 100}%` }}
          />
        ))}
      </div>

      <div className={cn('scale')} aria-hidden="true">
        {SCALE.map(mark => (
          <span key={mark}>{mark}</span>
        ))}
      </div>

      {caption ? (
        <Text as="p" variant="small" tone="muted" className={cn('caption')}>
          {caption}
        </Text>
      ) : null}
    </div>
  );
};
