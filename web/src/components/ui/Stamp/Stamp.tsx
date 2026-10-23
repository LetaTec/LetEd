import type React from 'react';
import cx from 'classnames/bind';

import styles from './Stamp.module.css';

const cn = cx.bind(styles);

export type StampProps = {
  children: React.ReactNode;
  className?: string;
};

// A rubber-stamp label pressed over a visual, such as "In progress".
// Decorative: the same status is always given in text nearby.
export const Stamp = ({ children, className }: StampProps) => (
  <span className={cn('stamp', className)} aria-hidden="true">
    {children}
  </span>
);
