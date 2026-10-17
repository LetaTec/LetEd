import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { AUTH_QUERY_PARAM, type AuthView } from '@constants/auth';
import { CATALOGUE_QUERY_PARAM } from '@constants/catalogue';

// The open subject and intended batch live in the URL so the selection is
// preserved through sign-in, registration and page refreshes.
export const useCourseSelection = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const update = useCallback(
    (mutate: (params: URLSearchParams) => void) =>
      setSearchParams(
        params => {
          mutate(params);
          return params;
        },
        { replace: true, preventScrollReset: true },
      ),
    [setSearchParams],
  );

  const openSubject = useCallback(
    (subjectSlug: string) =>
      update(params => {
        params.set(CATALOGUE_QUERY_PARAM.subject, subjectSlug);
        params.delete(CATALOGUE_QUERY_PARAM.batch);
      }),
    [update],
  );

  const selectBatch = useCallback(
    (subjectSlug: string, batchId: string, authView?: AuthView) =>
      update(params => {
        params.set(CATALOGUE_QUERY_PARAM.subject, subjectSlug);
        params.set(CATALOGUE_QUERY_PARAM.batch, batchId);

        if (authView) {
          params.set(AUTH_QUERY_PARAM.view, authView);
        }
      }),
    [update],
  );

  const clearBatch = useCallback(
    () => update(params => params.delete(CATALOGUE_QUERY_PARAM.batch)),
    [update],
  );

  const closeCourse = useCallback(
    () =>
      update(params => {
        params.delete(CATALOGUE_QUERY_PARAM.subject);
        params.delete(CATALOGUE_QUERY_PARAM.batch);
      }),
    [update],
  );

  return {
    subjectSlug: searchParams.get(CATALOGUE_QUERY_PARAM.subject),
    batchId: searchParams.get(CATALOGUE_QUERY_PARAM.batch),
    openSubject,
    selectBatch,
    clearBatch,
    closeCourse,
  };
};
