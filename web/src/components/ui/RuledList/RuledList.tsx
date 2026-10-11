import type React from 'react';
import cx from 'classnames/bind';

import styles from './RuledList.module.css';

const cn = cx.bind(styles);

export type RuledListProps = {
  items: readonly React.ReactNode[];
  size?: 'md' | 'sheet';
  ordered?: boolean;
  className?: string;
};

export const RuledList = ({
  items,
  size = 'md',
  ordered = false,
  className,
}: RuledListProps) => {
  const Component = ordered ? 'ol' : 'ul';

  return (
    <Component className={cn('list', size, className)}>
      {items.map((item, index) => (
        <li key={index} className={cn('item')}>
          {item}
        </li>
      ))}
    </Component>
  );
};
