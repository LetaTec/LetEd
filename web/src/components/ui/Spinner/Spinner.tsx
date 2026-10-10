import cx from 'classnames/bind';

import styles from './Spinner.module.css';

const cn = cx.bind(styles);

export type SpinnerProps = {
  tone?: 'current' | 'muted';
  className?: string;
};

export const Spinner = ({ tone = 'current', className }: SpinnerProps) => (
  <span className={cn('spinner', tone, className)} aria-hidden="true" />
);
