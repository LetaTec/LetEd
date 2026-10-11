import { useId } from 'react';
import cx from 'classnames/bind';

import { Button } from '@components/ui/Button/Button';
import { KeyValueList } from '@components/ui/KeyValueList/KeyValueList';
import { StatusDot } from '@components/ui/StatusDot/StatusDot';
import { Text } from '@components/ui/Text/Text';
import {
  BATCH_AVAILABILITY_COLOR,
  BATCH_AVAILABILITY_LABEL,
  CATALOGUE_TEXT,
} from '@constants/catalogue';
import { isBatchOpen, type Batch } from '@services/catalogue';

import { getBatchDetailItems } from '../batchDetails';
import styles from './BatchOption.module.css';

const cn = cx.bind(styles);

export type BatchOptionProps = {
  batch: Batch;
  onSelect: (batch: Batch) => void;
};

export const BatchOption = ({ batch, onSelect }: BatchOptionProps) => {
  const statusId = useId();
  const isOpen = isBatchOpen(batch);

  return (
    <li className={cn('batch')}>
      <div className={cn('header')}>
        <div>
          <Text as="div" variant="strong">
            {batch.scheduleLabel}
          </Text>
          <Text as="div" variant="small" tone="muted">
            {batch.name}
          </Text>
        </div>
        <span id={statusId}>
          <StatusDot
            color={BATCH_AVAILABILITY_COLOR[batch.availability]}
            label={BATCH_AVAILABILITY_LABEL[batch.availability]}
          />
        </span>
      </div>
      <KeyValueList items={getBatchDetailItems(batch)} />
      <div className={cn('action')}>
        <Button
          variant={isOpen ? 'primary' : 'secondary'}
          disabled={!isOpen}
          aria-describedby={statusId}
          endIcon={isOpen ? 'arrowRight' : undefined}
          onClick={() => onSelect(batch)}
        >
          {CATALOGUE_TEXT.selectBatch}
        </Button>
      </div>
    </li>
  );
};
