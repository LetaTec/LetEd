import type React from 'react';
import cx from 'classnames/bind';

import styles from './CardGrid.module.css';

const cn = cx.bind(styles);

export type CardGridVariant = 'ruled' | 'tiled' | 'columns';

export type CardGridProps = {
  variant?: CardGridVariant;
  columns?: 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
};

// Owns the editorial rules between cards so every grid of cards on the site
// shares one border system.
export const CardGrid = ({
  variant = 'ruled',
  columns = 3,
  className,
  children,
}: CardGridProps) => (
  <div className={cn('grid', variant, `columns-${columns}`, className)}>
    {children}
  </div>
);
