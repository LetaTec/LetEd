import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@components/ui/Button/Button';
import {
  FieldForm,
  FieldFormActions,
  FieldStatus,
} from '@components/ui/Field/Field';
import { Input } from '@components/ui/Input/Input';
import { AUTH_TEXT } from '@constants/auth';
import { useApiForm } from '@hooks/useApiForm';
import { requestPasswordReset } from '@services/auth';

const forgotPasswordSchema = z.object({
  email: z.string().trim().pipe(z.email(AUTH_TEXT.emailInvalid)),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export type ForgotPasswordFormProps = {
  onBackToLogin: () => void;
};

export const ForgotPasswordForm = ({
  onBackToLogin,
}: ForgotPasswordFormProps) => {
  const [isSent, setIsSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    formError,
    clearFormError,
    handleApiError,
  } = useApiForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async values => {
    clearFormError();
    setIsSent(false);

    try {
      await requestPasswordReset(values);
      setIsSent(true);
    } catch (error) {
      handleApiError(error);
    }
  });

  return (
    <FieldForm onSubmit={onSubmit}>
      {formError ? <FieldStatus tone="error">{formError}</FieldStatus> : null}
      {isSent ? (
        <FieldStatus tone="success">
          {AUTH_TEXT.forgotSuccessMessage}
        </FieldStatus>
      ) : null}
      <Input
        label={AUTH_TEXT.emailLabel}
        type="email"
        autoComplete="email"
        placeholder={AUTH_TEXT.emailPlaceholder}
        error={errors.email?.message}
        {...register('email')}
      />
      <FieldFormActions
        note={
          <Button variant="editorial" onClick={onBackToLogin}>
            {AUTH_TEXT.backToLogin}
          </Button>
        }
      >
        <Button type="submit" loading={isSubmitting} endIcon="arrowRight">
          {AUTH_TEXT.forgotSubmitLabel}
        </Button>
      </FieldFormActions>
    </FieldForm>
  );
};
