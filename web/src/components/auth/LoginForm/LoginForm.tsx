import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@components/ui/Button/Button';
import { Checkbox } from '@components/ui/Checkbox/Checkbox';
import {
  FieldForm,
  FieldFormActions,
  FieldStatus,
} from '@components/ui/Field/Field';
import { Input } from '@components/ui/Input/Input';
import { PasswordInput } from '@components/ui/PasswordInput/PasswordInput';
import { AUTH_TEXT } from '@constants/auth';
import { useApiForm } from '@hooks/useApiForm';
import { loginStudent, type AuthUser } from '@services/auth';

const loginSchema = z.object({
  email: z.string().trim().pipe(z.email(AUTH_TEXT.emailInvalid)),
  password: z.string().min(1, AUTH_TEXT.passwordRequired),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export type LoginFormProps = {
  onAuthenticated: (user: AuthUser) => void;
  onForgotPassword: () => void;
};

export const LoginForm = ({
  onAuthenticated,
  onForgotPassword,
}: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    formError,
    clearFormError,
    handleApiError,
  } = useApiForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = handleSubmit(async values => {
    clearFormError();

    try {
      onAuthenticated(await loginStudent(values));
    } catch (error) {
      handleApiError(error);
    }
  });

  return (
    <FieldForm onSubmit={onSubmit}>
      {formError ? <FieldStatus tone="error">{formError}</FieldStatus> : null}
      <Input
        label={AUTH_TEXT.emailLabel}
        type="email"
        autoComplete="email"
        placeholder={AUTH_TEXT.emailPlaceholder}
        error={errors.email?.message}
        {...register('email')}
      />
      <PasswordInput
        label={AUTH_TEXT.passwordLabel}
        autoComplete="current-password"
        placeholder={AUTH_TEXT.passwordPlaceholder}
        error={errors.password?.message}
        {...register('password')}
      />
      <Checkbox label={AUTH_TEXT.rememberMeLabel} {...register('rememberMe')} />
      <FieldFormActions
        note={
          <Button variant="editorial" onClick={onForgotPassword}>
            {AUTH_TEXT.forgotPasswordLink}
          </Button>
        }
      >
        <Button type="submit" loading={isSubmitting} endIcon="arrowRight">
          {AUTH_TEXT.loginSubmitLabel}
        </Button>
      </FieldFormActions>
    </FieldForm>
  );
};
