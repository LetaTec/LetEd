import type React from 'react';
import cx from 'classnames/bind';

import { useRevealOnScroll } from '@hooks/useRevealOnScroll';

import styles from './Reveal.module.css';

const cn = cx.bind(styles);

export type RevealProps = {
  as?: 'div' | 'article' | 'li';
  className?: string;
  children: React.ReactNode;
};

// Fades content in once as it scrolls into view. Content is visible
// immediately when reduced motion is requested.
export const Reveal = ({ as = 'div', className, children }: RevealProps) => {
  const { ref, isVisible } = useRevealOnScroll<HTMLElement>();
  const Component = as as React.ElementType;

  return (
    <Component
      ref={ref}
      className={cn('reveal', { visible: isVisible }, className)}
    >
      {children}
    </Component>
  );
};
