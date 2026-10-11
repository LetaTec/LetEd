import React from 'react';
import cx from 'classnames/bind';

import styles from './ButtonBase.module.css';

const cn = cx.bind(styles);

export type ButtonBaseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
};

export const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn('button', className)}
      {...props}
    />
  ),
);

ButtonBase.displayName = 'ButtonBase';
