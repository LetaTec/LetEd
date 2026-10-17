import { Navigate, Outlet, useSearchParams } from 'react-router-dom';

import { PageLoader } from '@components/ui/PageLoader/PageLoader';
import { AUTH_QUERY_PARAM } from '@constants/auth';
import { PAGE_TEXT } from '@constants/pages';
import { APP_ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { resolveInternalPath } from '@utils/url';

// Sign-in and registration screens: a student who is already signed in goes
// straight to where they were heading.
export const PublicOnlyRoute = () => {
  const { status } = useAuth();
  const [searchParams] = useSearchParams();

  if (status === 'loading') {
    return <PageLoader label={PAGE_TEXT.loading} />;
  }

  if (status === 'authenticated') {
    return (
      <Navigate
        to={resolveInternalPath(
          searchParams.get(AUTH_QUERY_PARAM.redirectTo),
          APP_ROUTES.HOME,
        )}
        replace
      />
    );
  }

  return <Outlet />;
};
