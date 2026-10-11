import type React from 'react';
import cx from 'classnames/bind';

import styles from './Container.module.css';

const cn = cx.bind(styles);

export type ContainerProps = {
  className?: string;
  children: React.ReactNode;
};

export const Container = ({ className, children }: ContainerProps) => (
  <div className={cn('container', className)}>{children}</div>
);
