import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@components/ui/Button/Button';
import {
  FieldForm,
  FieldFormActions,
  FieldGrid,
  FieldGroup,
  FieldStatus,
} from '@components/ui/Field/Field';
import { Input } from '@components/ui/Input/Input';
import { PasswordInput } from '@components/ui/PasswordInput/PasswordInput';
import { Select } from '@components/ui/Select/Select';
import {
  AUTH_ERROR_CODE,
  AUTH_TEXT,
  PASSWORD_MIN_LENGTH,
} from '@constants/auth';
import {
  STUDENT_STANDARD,
  STUDENT_STANDARD_OPTIONS,
  STUDENT_STREAM,
  STUDENT_STREAM_OPTIONS,
} from '@constants/student';
import { useApiForm } from '@hooks/useApiForm';
import { hasApiErrorCode } from '@services/api/errors';
import { registerStudent, type AuthUser } from '@services/auth';
import { toNullableString } from '@utils/formMapping';

const MOBILE_PATTERN = /^\+?[0-9][0-9\s-]{8,16}[0-9]$/;

const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, AUTH_TEXT.fullNameRequired),
    dateOfBirth: z.string().min(1, AUTH_TEXT.dateOfBirthRequired),
    mobile: z.string().trim().regex(MOBILE_PATTERN, AUTH_TEXT.mobileInvalid),
    email: z.string().trim().pipe(z.email(AUTH_TEXT.emailInvalid)),
    password: z.string().min(PASSWORD_MIN_LENGTH, AUTH_TEXT.passwordMinLength),
    standard: z
      .union([z.enum(STUDENT_STANDARD), z.literal('')])
      .refine(value => value !== '', AUTH_TEXT.standardRequired),
    stream: z.union([z.enum(STUDENT_STREAM), z.literal('')]),
    streamOther: z.string().trim().max(80),
    address: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.stream === STUDENT_STREAM.OTHER && values.streamOther === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['streamOther'],
        message: AUTH_TEXT.streamOtherRequired,
      });
    }
  });

type RegisterFormInput = z.input<typeof registerSchema>;
type RegisterFormValues = z.output<typeof registerSchema>;

export type RegisterFormProps = {
  onAuthenticated: (user: AuthUser) => void;
  onSwitchToLogin: () => void;
};

export const RegisterForm = ({
  onAuthenticated,
  onSwitchToLogin,
}: RegisterFormProps) => {
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    formError,
    clearFormError,
    handleApiError,
  } = useApiForm<RegisterFormInput, RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      mobile: '',
      email: '',
      password: '',
      standard: '',
      stream: '',
      streamOther: '',
      address: '',
    },
  });
  const isOtherStream = watch('stream') === STUDENT_STREAM.OTHER;

  const onSubmit = handleSubmit(async values => {
    clearFormError();
    setIsEmailTaken(false);

    try {
      const user = await registerStudent({
        fullName: values.fullName,
        dateOfBirth: values.dateOfBirth,
        mobile: values.mobile,
        email: values.email,
        password: values.password,
        standard: values.standard,
        stream: values.stream === '' ? null : values.stream,
        streamOther:
          values.stream === STUDENT_STREAM.OTHER
            ? toNullableString(values.streamOther)
            : null,
        address: toNullableString(values.address),
      });
      onAuthenticated(user);
    } catch (error) {
      setIsEmailTaken(
        hasApiErrorCode(error, AUTH_ERROR_CODE.emailAlreadyRegistered),
      );
      handleApiError(error);
    }
  });

  return (
    <FieldForm onSubmit={onSubmit}>
      {formError ? (
        <FieldStatus
          tone="error"
          action={
            isEmailTaken ? (
              <Button variant="editorial" onClick={onSwitchToLogin}>
                {AUTH_TEXT.emailAlreadyRegisteredAction}
              </Button>
            ) : null
          }
        >
          {formError}
        </FieldStatus>
      ) : null}
      <FieldGrid>
        <FieldGroup fullWidth>
          <Input
            label={AUTH_TEXT.fullNameLabel}
            autoComplete="name"
            placeholder={AUTH_TEXT.fullNamePlaceholder}
            error={errors.fullName?.message}
            {...register('fullName')}
          />
        </FieldGroup>
        <FieldGroup>
          <Input
            label={AUTH_TEXT.dateOfBirthLabel}
            type="date"
            autoComplete="bday"
            error={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
          />
        </FieldGroup>
        <FieldGroup>
          <Input
            label={AUTH_TEXT.mobileLabel}
            type="tel"
            autoComplete="tel"
            placeholder={AUTH_TEXT.mobilePlaceholder}
            error={errors.mobile?.message}
            {...register('mobile')}
          />
        </FieldGroup>
        <FieldGroup fullWidth>
          <Input
            label={AUTH_TEXT.emailLabel}
            type="email"
            autoComplete="email"
            placeholder={AUTH_TEXT.emailPlaceholder}
            error={errors.email?.message}
            {...register('email')}
          />
        </FieldGroup>
        <FieldGroup fullWidth>
          <PasswordInput
            label={AUTH_TEXT.passwordLabel}
            autoComplete="new-password"
            hint={AUTH_TEXT.passwordMinLength}
            error={errors.password?.message}
            {...register('password')}
          />
        </FieldGroup>
        <FieldGroup>
          <Select
            label={AUTH_TEXT.standardLabel}
            placeholder={AUTH_TEXT.standardPlaceholder}
            options={STUDENT_STANDARD_OPTIONS}
            error={errors.standard?.message}
            {...register('standard')}
          />
        </FieldGroup>
        <FieldGroup>
          <Select
            label={AUTH_TEXT.streamLabel}
            placeholder={AUTH_TEXT.streamPlaceholder}
            options={STUDENT_STREAM_OPTIONS}
            error={errors.stream?.message}
            {...register('stream')}
          />
        </FieldGroup>
        {isOtherStream ? (
          <FieldGroup fullWidth>
            <Input
              label={AUTH_TEXT.streamOtherLabel}
              placeholder={AUTH_TEXT.streamOtherPlaceholder}
              maxLength={80}
              error={errors.streamOther?.message}
              {...register('streamOther')}
            />
          </FieldGroup>
        ) : null}
        <FieldGroup fullWidth>
          <Input
            label={AUTH_TEXT.addressLabel}
            autoComplete="street-address"
            placeholder={AUTH_TEXT.addressPlaceholder}
            error={errors.address?.message}
            {...register('address')}
          />
        </FieldGroup>
      </FieldGrid>
      <FieldFormActions note={AUTH_TEXT.registerFootnote}>
        <Button type="submit" loading={isSubmitting} endIcon="arrowRight">
          {AUTH_TEXT.registerSubmitLabel}
        </Button>
      </FieldFormActions>
    </FieldForm>
  );
};
