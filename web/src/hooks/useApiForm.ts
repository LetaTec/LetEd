import {
  useForm,
  type FieldValues,
  type Path,
  type UseFormProps,
  type UseFormReturn,
} from 'react-hook-form';

import { useApiFormError } from './useApiFormError';

type UseApiFormOptions<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues = TFieldValues,
> = UseFormProps<TFieldValues, unknown, TTransformedValues> & {
  fallbackMessage?: string;
  mapFieldName?: (name: string) => Path<TFieldValues> | undefined;
};

type UseApiFormReturn<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues = TFieldValues,
> = UseFormReturn<TFieldValues, unknown, TTransformedValues> & {
  formError: string | null;
  clearFormError: () => void;
  handleApiError: (error: unknown) => void;
};

export function useApiForm<
  TFieldValues extends FieldValues = FieldValues,
  TTransformedValues extends FieldValues = TFieldValues,
>({
  fallbackMessage,
  mapFieldName,
  ...formOptions
}: UseApiFormOptions<TFieldValues, TTransformedValues>): UseApiFormReturn<
  TFieldValues,
  TTransformedValues
> {
  const form = useForm<TFieldValues, unknown, TTransformedValues>(formOptions);
  const { formError, clearFormError, handleFormError } =
    useApiFormError<TFieldValues>({
      setError: form.setError,
      fallbackMessage,
      mapFieldName,
    });

  return {
    ...form,
    formError,
    clearFormError,
    handleApiError: handleFormError,
  };
}
