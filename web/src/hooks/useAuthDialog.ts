import { useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { AUTH_QUERY_PARAM, AUTH_VIEWS, type AuthView } from '@constants/auth';
import { APP_ROUTES } from '@constants/routes';

const isAuthView = (value: string | null): value is AuthView =>
  value !== null && (AUTH_VIEWS as readonly string[]).includes(value);

// The sign-in dialog is addressed by the URL (?auth=login|register|...) so it
// can be opened from any page and keeps the rest of the query — such as the
// selected course and batch — intact.
export const useAuthDialog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const rawView = searchParams.get(AUTH_QUERY_PARAM.view);
  const view = isAuthView(rawView) ? rawView : null;

  const openAuth = useCallback(
    (nextView: AuthView) => {
      if (location.pathname !== APP_ROUTES.HOME) {
        navigate(
          `${APP_ROUTES.HOME}?${new URLSearchParams({
            [AUTH_QUERY_PARAM.view]: nextView,
          })}`,
        );
        return;
      }

      setSearchParams(
        params => {
          params.set(AUTH_QUERY_PARAM.view, nextView);
          return params;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [location.pathname, navigate, setSearchParams],
  );

  const closeAuth = useCallback(() => {
    setSearchParams(
      params => {
        params.delete(AUTH_QUERY_PARAM.view);
        params.delete(AUTH_QUERY_PARAM.redirectTo);
        return params;
      },
      { replace: true, preventScrollReset: true },
    );
  }, [setSearchParams]);

  return {
    view,
    redirectTo: searchParams.get(AUTH_QUERY_PARAM.redirectTo),
    openAuth,
    closeAuth,
  };
};
