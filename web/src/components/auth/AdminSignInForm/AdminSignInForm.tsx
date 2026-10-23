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
import { ADMIN_SIGN_IN_TEXT, AUTH_TEXT } from '@constants/auth';
import { useApiForm } from '@hooks/useApiForm';
import { requestAdminSignIn } from '@services/auth';

const adminSignInSchema = z.object({
  email: z.string().trim().pipe(z.email(AUTH_TEXT.emailInvalid)),
});

type AdminSignInFormValues = z.infer<typeof adminSignInSchema>;

// Asks for a one-time sign-in link. The API answers the same way for every
// email, so the form never reveals which emails belong to the team.
export const AdminSignInForm = () => {
  const [isSent, setIsSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    formError,
    clearFormError,
    handleApiError,
  } = useApiForm<AdminSignInFormValues>({
    resolver: zodResolver(adminSignInSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async values => {
    clearFormError();
    setIsSent(false);

    try {
      await requestAdminSignIn(values);
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
          {ADMIN_SIGN_IN_TEXT.sentMessage}
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
      <FieldFormActions>
        <Button type="submit" loading={isSubmitting} endIcon="arrowRight">
          {ADMIN_SIGN_IN_TEXT.submit}
        </Button>
      </FieldFormActions>
    </FieldForm>
  );
};
