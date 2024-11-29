import {Navigate} from 'react-router-dom';
import {PrimaryLayout} from '@/layouts';
import {
  CustomerPage,
  IsNotAuthorized,
  NotFoundPage,
  PrivatePage,
  SignInPage,
  SignUpPage,
} from '@/pages';
import {LogoutPage} from '@/pages/logout';
import {ROUTES} from './constants';

export const routes = [
  {
    element: <PrimaryLayout />,
    children: [
      {
        path: ROUTES.BASE,
        element: (
          <PrivatePage
            component={CustomerPage}
            allowedRoles={['customer', 'supervisor']}
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
