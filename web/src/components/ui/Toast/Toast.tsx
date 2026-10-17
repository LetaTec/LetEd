import type { ReactNode } from 'react';
import cx from 'classnames/bind';

import { Icon } from '../Icon/Icon';
import styles from './Toast.module.css';

const cn = cx.bind(styles);

export type ToastTone = 'default' | 'error';

export type ToastProps = {
  message: ReactNode;
  tone?: ToastTone;
  open: boolean;
  className?: string;
};

// Presentational toast — the consumer owns the message, visibility and timing.
export const Toast = ({
  message,
  tone = 'default',
  open,
  className,
}: ToastProps) => (
  <div
    className={cn('toast', tone, { open }, className)}
    role={tone === 'error' ? 'alert' : 'status'}
    aria-live={tone === 'error' ? 'assertive' : 'polite'}
  >
    {message ? (
      <>
        {tone === 'error' ? (
          <Icon name="error" size="sm" className={cn('icon')} />
        ) : null}
        <span>{message}</span>
      </>
    ) : null}
  </div>
);
