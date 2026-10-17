import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { PageLoader } from '@components/ui/PageLoader/PageLoader';
import { AUTH_QUERY_PARAM } from '@constants/auth';
import { PAGE_TEXT } from '@constants/pages';
import { APP_ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';

// Every page except the sign-in screens requires a signed-in student. This
// guard shapes the experience only — every protected API endpoint
// independently verifies the session on the server.
export const ProtectedRoute = () => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <PageLoader label={PAGE_TEXT.loading} />;
  }

  if (status === 'authenticated') {
    return <Outlet />;
  }

  const destination = location.pathname + location.search + location.hash;
  const loginPath =
    destination === APP_ROUTES.HOME
      ? APP_ROUTES.LOGIN
      : `${APP_ROUTES.LOGIN}?${new URLSearchParams({
          [AUTH_QUERY_PARAM.redirectTo]: destination,
        })}`;

  return <Navigate to={loginPath} replace />;
};
