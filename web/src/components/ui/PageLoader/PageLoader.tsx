import cx from 'classnames/bind';

import { Spinner } from '../Spinner/Spinner';
import styles from './PageLoader.module.css';

const cn = cx.bind(styles);

export type PageLoaderProps = {
  label: string;
};

export const PageLoader = ({ label }: PageLoaderProps) => (
  <div className={cn('loader')} role="status" aria-label={label}>
    <Spinner tone="muted" />
  </div>
);
