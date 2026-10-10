import cx from 'classnames/bind';

import styles from './Monogram.module.css';

const cn = cx.bind(styles);

export type MonogramProps = {
  initial: string;
};

// Placeholder portrait shown until a real photograph is available.
export const Monogram = ({ initial }: MonogramProps) => (
  <div className={cn('monogram')} aria-hidden="true">
    {initial}
  </div>
);
