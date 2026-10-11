import type { z } from 'zod';

import { ApiError, ERROR_CODE, type ApiFieldIssue } from './errors.js';

type ValidationLocation = 'body' | 'query';

export const validate = <TSchema extends z.ZodType>(
  schema: TSchema,
  value: unknown,
  location: ValidationLocation = 'body',
): z.infer<TSchema> => {
  const result = schema.safeParse(value);

  if (result.success) {
    return result.data;
  }

  const issues: ApiFieldIssue[] = result.error.issues.map(issue => ({
    message: issue.message,
    path: issue.path.map(segment =>
      typeof segment === 'number' ? segment : String(segment),
    ),
    code: issue.code,
  }));

  throw new ApiError(
    400,
    ERROR_CODE.requestValidationFailed,
    'Please check the highlighted fields',
    { [location]: issues },
  );
};
