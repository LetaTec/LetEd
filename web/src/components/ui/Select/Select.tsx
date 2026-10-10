import React, { useId } from 'react';
import cx from 'classnames/bind';

import { Text } from '../Text/Text';
import styles from './Select.module.css';

const cn = cx.bind(styles);

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
  error?: string;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, options, placeholder, error, className, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const messageId = `${selectId}-message`;

    return (
      <div className={cn('field')}>
        <Text as="label" variant="label" htmlFor={selectId}>
          {label}
        </Text>
        <select
          ref={ref}
          id={selectId}
          className={cn('select', { invalid: Boolean(error) }, className)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? messageId : undefined}
          {...props}
        >
          {placeholder !== undefined ? (
            <option value="">{placeholder}</option>
          ) : null}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <Text
            as="p"
            id={messageId}
            variant="small"
            tone="danger"
            className={cn('message')}
          >
            {error}
          </Text>
        ) : null}
      </div>
    );
  },
);

Select.displayName = 'Select';
