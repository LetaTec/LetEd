import type React from 'react';
import cx from 'classnames/bind';

import { Container } from '../Container/Container';
import styles from './Section.module.css';

const cn = cx.bind(styles);

export type SectionTone = 'paper' | 'subtle' | 'inverse' | 'inverseDeep';

export type SectionProps = {
  id?: string;
  tone?: SectionTone;
  divider?: boolean;
  align?: 'start' | 'center';
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
};

export const Section = ({
  id,
  tone = 'paper',
  divider = false,
  align = 'start',
  labelledBy,
  className,
  children,
}: SectionProps) => (
  <section
    id={id}
    aria-labelledby={labelledBy}
    className={cn('section', tone, align, { divider }, className)}
  >
    <Container>{children}</Container>
  </section>
);
