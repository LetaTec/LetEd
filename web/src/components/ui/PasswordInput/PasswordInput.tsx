import React, { useState } from 'react';

import { AUTH_TEXT } from '@constants/auth';

import { IconButton } from '../IconButton/IconButton';
import { Input, type InputProps } from '../Input/Input';

export type PasswordInputProps = Omit<InputProps, 'type' | 'endAdornment'>;

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      ref={ref}
      type={isVisible ? 'text' : 'password'}
      endAdornment={
        <IconButton
          icon={isVisible ? 'passwordHide' : 'passwordShow'}
          size="sm"
          label={
            isVisible
              ? AUTH_TEXT.hidePasswordLabel
              : AUTH_TEXT.showPasswordLabel
          }
          onClick={() => setIsVisible(value => !value)}
        />
      }
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';
