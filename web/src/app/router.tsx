import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';

import { PageLoader } from '@components/ui/PageLoader/PageLoader';
import { PAGE_TEXT } from '@constants/pages';
import { APP_ROUTES } from '@constants/routes';
import { SiteShell } from '@layout/SiteShell/SiteShell';

import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { RouteErrorBoundary } from '@/routes/RouteErrorBoundary';

const HomePage = lazy(() => import('@pages/home/HomePage'));
const MyLearningPage = lazy(() => import('@pages/my-learning/MyLearningPage'));
const BatchesPage = lazy(() => import('@pages/batches/BatchesPage'));
const ResetPasswordPage = lazy(
  () => import('@pages/reset-password/ResetPasswordPage'),
);
const NotFoundPage = lazy(() => import('@pages/not-found/NotFoundPage'));

const SuspendedOutlet = () => (
  <Suspense fallback={<PageLoader label={PAGE_TEXT.loading} />}>
    <Outlet />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <SiteShell />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <SuspendedOutlet />,
        children: [
          { path: APP_ROUTES.HOME, element: <HomePage /> },
          { path: APP_ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
          {
            element: <ProtectedRoute />,
            children: [
              { path: APP_ROUTES.MY_LEARNING, element: <MyLearningPage /> },
              { path: APP_ROUTES.BATCHES, element: <BatchesPage /> },
            ],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
