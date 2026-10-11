import type React from 'react';
import cx from 'classnames/bind';

import { Heading } from '../Heading/Heading';
import { Reveal } from '../Reveal/Reveal';
import { Text } from '../Text/Text';
import styles from './SectionHead.module.css';

const cn = cx.bind(styles);

export type SectionHeadProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  titleId?: string;
};

export const SectionHead = ({
  title,
  description,
  titleId,
}: SectionHeadProps) => (
  <Reveal className={cn('head')}>
    <Heading level={2} variant="display" id={titleId}>
      {title}
    </Heading>
    {description ? (
      <Text as="p" tone="muted" className={cn('description')}>
        {description}
      </Text>
    ) : null}
  </Reveal>
);
