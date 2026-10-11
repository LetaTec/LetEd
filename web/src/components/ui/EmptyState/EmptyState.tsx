import type React from 'react';
import cx from 'classnames/bind';

import { Heading } from '../Heading/Heading';
import { Text } from '../Text/Text';
import styles from './EmptyState.module.css';

const cn = cx.bind(styles);

export type EmptyStateProps = {
  title: React.ReactNode;
  message?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export const EmptyState = ({
  title,
  message,
  action,
  className,
}: EmptyStateProps) => (
  <div className={cn('emptyState', className)}>
    <Heading level={3} variant="item">
      {title}
    </Heading>
    {message ? (
      <Text as="p" variant="small" tone="muted">
        {message}
      </Text>
    ) : null}
    {action ? <div className={cn('action')}>{action}</div> : null}
  </div>
);
