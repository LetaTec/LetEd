import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { PageLoader } from '@components/ui/PageLoader/PageLoader';
import { AUTH_QUERY_PARAM, AUTH_VIEW } from '@constants/auth';
import { APP_ROUTES } from '@constants/routes';
import { PAGE_TEXT } from '@constants/pages';
import { useAuth } from '@context/AuthContext';

// Client-side guard for a better experience only — every protected API
// endpoint independently verifies the session on the server.
export const ProtectedRoute = () => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <PageLoader label={PAGE_TEXT.loading} />;
  }

  if (status === 'authenticated') {
    return <Outlet />;
  }

  const params = new URLSearchParams({
    [AUTH_QUERY_PARAM.view]: AUTH_VIEW.login,
    [AUTH_QUERY_PARAM.redirectTo]: location.pathname + location.search,
  });

  return <Navigate to={`${APP_ROUTES.HOME}?${params}`} replace />;
};
