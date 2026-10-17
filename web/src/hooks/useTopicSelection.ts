import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CATALOGUE_QUERY_PARAM } from '@constants/catalogue';

// The open topic and intended batch live in the URL so the selection is
// shareable and survives refreshes and the sign-in redirect.
export const useTopicSelection = () => {
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

  const openTopic = useCallback(
    (topicId: string) =>
      update(params => {
        params.set(CATALOGUE_QUERY_PARAM.topic, topicId);
        params.delete(CATALOGUE_QUERY_PARAM.batch);
      }),
    [update],
  );

  const selectBatch = useCallback(
    (topicId: string, batchId: string) =>
      update(params => {
        params.set(CATALOGUE_QUERY_PARAM.topic, topicId);
        params.set(CATALOGUE_QUERY_PARAM.batch, batchId);
      }),
    [update],
  );

  const clearBatch = useCallback(
    () => update(params => params.delete(CATALOGUE_QUERY_PARAM.batch)),
    [update],
  );

  const closeTopic = useCallback(
    () =>
      update(params => {
        params.delete(CATALOGUE_QUERY_PARAM.topic);
        params.delete(CATALOGUE_QUERY_PARAM.batch);
      }),
    [update],
  );

  return {
    topicId: searchParams.get(CATALOGUE_QUERY_PARAM.topic),
    batchId: searchParams.get(CATALOGUE_QUERY_PARAM.batch),
    openTopic,
    selectBatch,
    clearBatch,
    closeTopic,
  };
};
