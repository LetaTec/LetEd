import React from 'react';
import cx from 'classnames/bind';

import { Icon } from '@components/ui/Icon/Icon';
import type { IconName, IconSize } from '@constants/icons';

import { ButtonBase, type ButtonBaseProps } from '../ButtonBase/ButtonBase';
import styles from './IconButton.module.css';

const cn = cx.bind(styles);

export type IconButtonProps = Omit<ButtonBaseProps, 'children'> & {
  icon: IconName;
  label: string;
  size?: IconSize;
  tone?: 'default' | 'inverse';
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { icon, label, size = 'md', tone = 'default', className, ...props },
    ref,
  ) => (
    <ButtonBase
      ref={ref}
      aria-label={label}
      className={cn('iconButton', tone, className)}
      {...props}
    >
      <Icon name={icon} size={size} />
    </ButtonBase>
  ),
);

IconButton.displayName = 'IconButton';
