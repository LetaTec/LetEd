import { useCallback, useEffect, useState } from 'react';

import { getCatalogue, type Subject } from '@services/catalogue';

export type CatalogueState = {
  subjects: Subject[];
  isLoading: boolean;
  hasError: boolean;
  reload: () => void;
};

export const useCatalogue = (): CatalogueState => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setHasError(false);

    getCatalogue()
      .then(nextSubjects => {
        if (isActive) setSubjects(nextSubjects);
      })
      .catch(error => {
        if (!isActive) return;
        console.error('[catalogue] failed to load catalogue', error);
        setHasError(true);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [requestId]);

  const reload = useCallback(() => setRequestId(id => id + 1), []);

  return { subjects, isLoading, hasError, reload };
};
