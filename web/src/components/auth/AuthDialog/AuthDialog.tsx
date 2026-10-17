import type React from 'react';
import cx from 'classnames/bind';

import { Button } from '@components/ui/Button/Button';
import { Modal } from '@components/ui/Modal/Modal';
import { Text } from '@components/ui/Text/Text';
import { AUTH_TEXT, AUTH_VIEW, type AuthView } from '@constants/auth';
import type { AuthUser } from '@services/auth';

import { ForgotPasswordForm } from '../ForgotPasswordForm/ForgotPasswordForm';
import { LoginForm } from '../LoginForm/LoginForm';
import { RegisterForm } from '../RegisterForm/RegisterForm';
import styles from './AuthDialog.module.css';

const cn = cx.bind(styles);

export type AuthDialogProps = {
  view: AuthView | null;
  onViewChange: (view: AuthView) => void;
  onClose: () => void;
  onAuthenticated: (user: AuthUser, view: AuthView) => void;
  // What the student was trying to do, shown so they know the selection is kept.
  intent?: React.ReactNode;
};

const VIEW_HEADING: Record<
  AuthView,
  { eyebrow: string; title: string; emphasis: string }
> = {
  [AUTH_VIEW.login]: {
    eyebrow: AUTH_TEXT.loginEyebrow,
    title: AUTH_TEXT.loginTitle,
    emphasis: AUTH_TEXT.loginTitleEmphasis,
  },
  [AUTH_VIEW.register]: {
    eyebrow: AUTH_TEXT.registerEyebrow,
    title: AUTH_TEXT.registerTitle,
    emphasis: AUTH_TEXT.registerTitleEmphasis,
  },
  [AUTH_VIEW.forgotPassword]: {
    eyebrow: AUTH_TEXT.forgotEyebrow,
    title: AUTH_TEXT.forgotTitle,
    emphasis: AUTH_TEXT.forgotTitleEmphasis,
  },
};

export const AuthDialog = ({
  view,
  onViewChange,
  onClose,
  onAuthenticated,
  intent,
}: AuthDialogProps) => {
  const heading = VIEW_HEADING[view ?? AUTH_VIEW.login];

  return (
    <Modal
      open={view !== null}
      onClose={onClose}
      eyebrow={heading.eyebrow}
      title={
        <>
          {heading.title}
          <br />
          <em>{heading.emphasis}</em>
        </>
      }
    >
      {intent && view !== AUTH_VIEW.forgotPassword ? (
        <div className={cn('intent')}>
          <Text as="p" variant="small" tone="muted">
            {AUTH_TEXT.continueSelectionHint}
          </Text>
          <Text as="p" variant="strong">
            {intent}
          </Text>
        </div>
      ) : null}

      {view === AUTH_VIEW.login ? (
        <LoginForm
          onAuthenticated={user => onAuthenticated(user, AUTH_VIEW.login)}
          onForgotPassword={() => onViewChange(AUTH_VIEW.forgotPassword)}
        />
      ) : null}
      {view === AUTH_VIEW.register ? (
        <RegisterForm
          onAuthenticated={user => onAuthenticated(user, AUTH_VIEW.register)}
          onSwitchToLogin={() => onViewChange(AUTH_VIEW.login)}
        />
      ) : null}
      {view === AUTH_VIEW.forgotPassword ? (
        <ForgotPasswordForm
          onBackToLogin={() => onViewChange(AUTH_VIEW.login)}
        />
      ) : null}

      {view === AUTH_VIEW.login || view === AUTH_VIEW.register ? (
        <div className={cn('switch')}>
          <Text variant="small" tone="muted">
            {view === AUTH_VIEW.login
              ? AUTH_TEXT.noAccountPrompt
              : AUTH_TEXT.haveAccountPrompt}
          </Text>
          <Button
            variant="editorial"
            onClick={() =>
              onViewChange(
                view === AUTH_VIEW.login ? AUTH_VIEW.register : AUTH_VIEW.login,
              )
            }
          >
            {view === AUTH_VIEW.login
              ? AUTH_TEXT.switchToRegister
              : AUTH_TEXT.switchToLogin}
          </Button>
        </div>
      ) : null}
    </Modal>
  );
};
