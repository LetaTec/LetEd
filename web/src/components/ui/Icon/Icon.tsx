import type { AriaAttributes } from 'react';

import { ICONS, ICON_SIZE } from '@constants/icons';
import type { IconName, IconSize } from '@constants/icons';

export type IconProps = {
  name: IconName;
  size?: IconSize;
  strokeWidth?: number;
  className?: string;
  'aria-hidden'?: AriaAttributes['aria-hidden'];
};

export const Icon = ({
  name,
  size = 'md',
  strokeWidth = 1.5,
  className,
  'aria-hidden': ariaHidden = 'true',
}: IconProps) => {
  const IconComponent = ICONS[name];

  return (
    <IconComponent
      size={ICON_SIZE[size]}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={ariaHidden}
    />
  );
};
