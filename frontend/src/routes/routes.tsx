import {lazy} from 'react';
import {Navigate} from 'react-router-dom';
import {ROLE} from '@/constants.ts';
import {PrimaryLayout} from '@/layouts';
import {
  IsNotAuthorized,
  NotFoundPage,
  PrivatePage,
  SignInPage,
  SignUpPage,
} from '@/pages';
import {LogoutPage} from '@/pages/logout';
import {ROUTES} from './constants';

const CustomerModule = lazy(() => import('@/modules/customer'));

export const routes = [
  {
    element: <PrimaryLayout />,
    children: [
      {
        path: '*',
        element: (
          <PrivatePage
            component={CustomerModule}
            allowedRoles={[ROLE.CUSTOMER, ROLE.SUPERVISOR]}
          />
        ),
      },
      {
        path: ROUTES.SIGN_IN,
        element: (
          <IsNotAuthorized>
            <SignInPage />
          </IsNotAuthorized>
        ),
      },
      {
        path: ROUTES.SIGN_UP,
        element: (
          <IsNotAuthorized>
            <SignUpPage />
          </IsNotAuthorized>
        ),
      },
      {
        path: ROUTES.LOGOUT,
        element: <LogoutPage />,
      },
      {
        path: ROUTES.NOT_FOUND,
        element: <NotFoundPage />,
      },
      {
        path: '*',
        element: <Navigate to={ROUTES.NOT_FOUND} />,
      },
    ],
  },
];
