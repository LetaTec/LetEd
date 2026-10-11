import type React from 'react';
import cx from 'classnames/bind';

import { Text } from '../Text/Text';
import styles from './Field.module.css';

const cn = cx.bind(styles);

export type FieldFormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  children: React.ReactNode;
};

export const FieldForm = ({
  children,
  className,
  ...props
}: FieldFormProps) => (
  <form className={cn('form', className)} noValidate {...props}>
    {children}
  </form>
);

export type FieldGridProps = {
  children: React.ReactNode;
  className?: string;
};

export const FieldGrid = ({ children, className }: FieldGridProps) => (
  <div className={cn('grid', className)}>{children}</div>
);

export type FieldGroupProps = {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
};

export const FieldGroup = ({
  children,
  fullWidth = false,
  className,
}: FieldGroupProps) => (
  <div className={cn('group', { groupFull: fullWidth }, className)}>
    {children}
  </div>
);

export type FieldStatusProps = {
  tone: 'error' | 'success';
  children: React.ReactNode;
  action?: React.ReactNode;
};

export const FieldStatus = ({ tone, children, action }: FieldStatusProps) => (
  <div
    className={cn('status', tone)}
    role={tone === 'error' ? 'alert' : 'status'}
  >
    <Text variant="small" tone={tone === 'error' ? 'danger' : 'success'}>
      {children}
    </Text>
    {action}
  </div>
);

export type FieldFormActionsProps = {
  note?: React.ReactNode;
  children: React.ReactNode;
};

export const FieldFormActions = ({ note, children }: FieldFormActionsProps) => (
  <div className={cn('actions')}>
    {note ? (
      <Text as="small" variant="fine" tone="muted">
        {note}
      </Text>
    ) : (
      <span />
    )}
    <div className={cn('actionButtons')}>{children}</div>
  </div>
);
