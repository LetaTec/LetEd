import cx from 'classnames/bind';

import type { StatusColor } from '@constants/status';

import styles from './StatusDot.module.css';

const cn = cx.bind(styles);

export type StatusDotProps = {
  color: StatusColor;
  label?: string;
};

export const StatusDot = ({ color, label }: StatusDotProps) => {
  const dot = <span className={cn('dot', color)} aria-hidden="true" />;

  if (!label) return dot;

  return (
    <span className={cn('wrapper')}>
      {dot}
      <span className={cn('label')}>{label}</span>
    </span>
  );
};
