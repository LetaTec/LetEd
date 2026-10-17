import cx from 'classnames/bind';

import logoHorizontal from '@/assets/brand/sridha-logo-horizontal.png';
import logoLight from '@/assets/brand/sridha-logo-light.png';
import logo from '@/assets/brand/sridha-logo.png';
import { LOGO_HEIGHT } from '@constants/brand';
import { BRAND } from '@constants/home';

import styles from './BrandLogo.module.css';

const cn = cx.bind(styles);

export type BrandLogoProps = {
  // horizontal: symbol beside the name, for headers; stacked: symbol above it.
  variant?: 'horizontal' | 'stacked';
  // inverse: light ink for dark backgrounds (stacked only).
  tone?: 'default' | 'inverse';
  size?: 'md' | 'lg';
};

export const BrandLogo = ({
  variant = 'horizontal',
  tone = 'default',
  size = 'md',
}: BrandLogoProps) => {
  const src =
    variant === 'horizontal'
      ? logoHorizontal
      : tone === 'inverse'
        ? logoLight
        : logo;

  return (
    <img
      src={src}
      alt={BRAND.name}
      height={LOGO_HEIGHT[variant][size]}
      className={cn('logo', variant, size)}
      decoding="async"
    />
  );
};
