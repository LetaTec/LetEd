import cx from 'classnames/bind';

import { Text } from '../Text/Text';
import styles from './StatList.module.css';

const cn = cx.bind(styles);

export type StatListItem = {
  value: string;
  label: string;
};

export type StatListProps = {
  items: readonly StatListItem[];
  className?: string;
};

export const StatList = ({ items, className }: StatListProps) => (
  <dl className={cn('list', className)}>
    {items.map(item => (
      <div key={item.label} className={cn('item')}>
        <dt className={cn('label')}>
          <Text variant="label" tone="muted">
            {item.label}
          </Text>
        </dt>
        <dd className={cn('value')}>{item.value}</dd>
      </div>
    ))}
  </dl>
);
