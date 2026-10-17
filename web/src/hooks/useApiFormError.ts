import { useCallback, useState } from 'react';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import {
  getApiError,
  getApiErrorMessage,
  getApiFieldErrors,
  type ApiFieldError,
} from '@services/api/errors';

const DEFAULT_FORM_ERROR = 'Something went wrong. Please try again.';

type UseApiFormErrorOptions<TFieldValues extends FieldValues> = {
  setError?: UseFormSetError<TFieldValues>;
  fallbackMessage?: string;
  mapFieldName?: (name: string) => Path<TFieldValues> | undefined;
};

const getFieldName = (fieldError: ApiFieldError) =>
  fieldError.path.map(String).join('.');

export function useApiFormError<
  TFieldValues extends FieldValues = FieldValues,
>({
  setError,
  mapFieldName,
  fallbackMessage = DEFAULT_FORM_ERROR,
}: UseApiFormErrorOptions<TFieldValues>) {
  const [formError, setFormError] = useState<string | null>(null);

  const clearFormError = useCallback(() => {
    setFormError(null);
  }, []);

  const handleFormError = useCallback(
    (error: unknown) => {
      const apiError = getApiError(error);

      if (!apiError) {
        setFormError(getApiErrorMessage(error, fallbackMessage));
        return;
      }

      const fieldErrors = getApiFieldErrors(error);
      let hasFieldError = false;
      let hasUnmappedError = false;

      if (fieldErrors.length > 0) {
        fieldErrors.forEach(fieldError => {
          const apiFieldName = getFieldName(fieldError);
          const fieldName = mapFieldName
            ? mapFieldName(apiFieldName)
            : apiFieldName;

          if (!fieldName || !setError) {
            hasUnmappedError = true;
            return;
          }

          hasFieldError = true;

          setError(fieldName as Path<TFieldValues>, {
            type: 'server',
            message: fieldError.message,
          });
        });

        setFormError(
          hasFieldError && !hasUnmappedError
            ? null
            : apiError.message || fallbackMessage,
        );
        return;
      }

      setFormError(apiError.message || fallbackMessage);
    },
    [fallbackMessage, mapFieldName, setError],
  );

  return {
    formError,
    clearFormError,
    handleFormError,
  };
}
