import type React from 'react';
import cx from 'classnames/bind';

import { Text } from '../Text/Text';
import styles from './KeyValueList.module.css';

const cn = cx.bind(styles);

export type KeyValueItem = {
  label: string;
  value: React.ReactNode;
};

export type KeyValueListProps = {
  items: readonly KeyValueItem[];
  columns?: 2 | 3;
  className?: string;
};

export const KeyValueList = ({
  items,
  columns = 3,
  className,
}: KeyValueListProps) => (
  <dl className={cn('list', `columns-${columns}`, className)}>
    {items.map(item => (
      <div key={item.label} className={cn('item')}>
        <dt>
          <Text variant="label" tone="muted">
            {item.label}
          </Text>
        </dt>
        <dd className={cn('value')}>{item.value}</dd>
      </div>
    ))}
  </dl>
);
