import type React from 'react';
import cx from 'classnames/bind';

import styles from './Heading.module.css';

const cn = cx.bind(styles);

export type HeadingVariant =
  'hero' | 'feature' | 'display' | 'title' | 'card' | 'item' | 'sheet';

export type HeadingProps = {
  level?: 1 | 2 | 3 | 4;
  variant?: HeadingVariant;
  tone?: 'default' | 'inverse';
  id?: string;
  className?: string;
  children: React.ReactNode;
};

// Editorial serif headings. Wrap the emphasised words in <em> to get the
// italic accent treatment used across the brand.
export const Heading = ({
  level = 2,
  variant = 'display',
  tone = 'default',
  id,
  className,
  children,
}: HeadingProps) => {
  const Component = `h${level}` as const;

  return (
    <Component id={id} className={cn('heading', variant, tone, className)}>
      {children}
    </Component>
  );
};
