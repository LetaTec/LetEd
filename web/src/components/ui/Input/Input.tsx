import React, { useId } from 'react';
import cx from 'classnames/bind';

import { Text } from '../Text/Text';
import styles from './Input.module.css';

const cn = cx.bind(styles);

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  endAdornment?: React.ReactNode;
  // Keeps the label for screen readers but does not show it, for compact
  // placements such as the header search.
  hideLabel?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      id,
      error,
      hint,
      endAdornment,
      hideLabel = false,
      className,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;

    return (
      <div className={cn('field')}>
        <Text
          as="label"
          variant="label"
          htmlFor={inputId}
          className={cn({ visuallyHidden: hideLabel })}
        >
          {label}
        </Text>
        <div className={cn('control')}>
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input',
              {
                invalid: Boolean(error),
                withEndAdornment: Boolean(endAdornment),
              },
              className,
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={error || hint ? messageId : undefined}
            {...props}
          />
          {endAdornment ? (
            <div className={cn('endAdornment')}>{endAdornment}</div>
          ) : null}
        </div>
        {error || hint ? (
          <Text
            as="p"
            id={messageId}
            variant="small"
            tone={error ? 'danger' : 'muted'}
            className={cn('message')}
          >
            {error ?? hint}
          </Text>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
