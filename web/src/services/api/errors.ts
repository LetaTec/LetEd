import { isAxiosError } from 'axios';

const API_VALIDATION_ERROR_CODE = 'REQUEST_VALIDATION_FAILED';
const NETWORK_ERROR_MESSAGE =
  'We could not reach letaEd. Check your connection and try again.';

type ApiValidationLocation = 'body' | 'query';

export type ApiError = {
  message: string;
  code: string;
  details: unknown | null;
};

export type ApiFieldError = {
  message: string;
  path: Array<string | number>;
  code?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isApiError = (value: unknown): value is ApiError =>
  isRecord(value) &&
  typeof value.message === 'string' &&
  typeof value.code === 'string' &&
  'details' in value;

export function getApiError(error: unknown): ApiError | null {
  if (!isAxiosError(error)) {
    return null;
  }

  const data = error.response?.data;
  return isApiError(data) ? data : null;
}

export function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && !error.response;
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (isNetworkError(error)) {
    return NETWORK_ERROR_MESSAGE;
  }

  return getApiError(error)?.message || fallbackMessage;
}

export function hasApiErrorCode(error: unknown, code: string): boolean {
  return getApiError(error)?.code === code;
}

const isApiFieldError = (value: unknown): value is ApiFieldError =>
  isRecord(value) &&
  typeof value.message === 'string' &&
  Array.isArray(value.path);

export function getApiFieldErrors(
  error: unknown,
  location: ApiValidationLocation = 'body',
): ApiFieldError[] {
  const apiError = getApiError(error);

  if (
    !apiError ||
    apiError.code !== API_VALIDATION_ERROR_CODE ||
    !isRecord(apiError.details)
  ) {
    return [];
  }

  const issues = apiError.details[location];
  return Array.isArray(issues) ? issues.filter(isApiFieldError) : [];
}
