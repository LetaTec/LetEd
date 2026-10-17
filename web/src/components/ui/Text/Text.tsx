import type React from 'react';
import cx from 'classnames/bind';

import styles from './Text.module.css';

const cn = cx.bind(styles);

export type TextElement = 'p' | 'span' | 'div' | 'label' | 'strong' | 'small';

export type TextVariant =
  | 'body'
  | 'lead'
  | 'small'
  | 'fine'
  | 'strong'
  | 'eyebrow'
  | 'label'
  | 'caption'
  | 'numeral'
  | 'numeralSm'
  | 'price'
  | 'sheetBody'
  | 'sheetTitle'
  | 'sheetLabel';

export type TextTone =
  | 'inherit'
  | 'primary'
  | 'muted'
  | 'sheetMuted'
  | 'accent'
  | 'inverse'
  | 'inverseMuted'
  | 'accentInverse'
  | 'danger'
  | 'success';

export type TextProps = {
  as?: TextElement;
  variant?: TextVariant;
  tone?: TextTone;
  className?: string;
  children: React.ReactNode;
  htmlFor?: string;
  id?: string;
  role?: string;
};

export const Text = ({
  as = 'span',
  variant = 'body',
  tone = 'inherit',
  className,
  children,
  ...props
}: TextProps) => {
  const Component = as;

  return (
    <Component className={cn('text', variant, tone, className)} {...props}>
      {children}
    </Component>
  );
};
