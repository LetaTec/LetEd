import cx from 'classnames/bind';

import { BRAND } from '@constants/home';

import styles from './BrandLogo.module.css';

const cn = cx.bind(styles);

export type BrandLogoProps = {
  size?: 'md' | 'lg';
};

export const BrandLogo = ({ size = 'md' }: BrandLogoProps) => (
  <span className={cn('logo', size)}>
    {BRAND.wordmark}
    <em>{BRAND.wordmarkEmphasis}</em>
  </span>
);
