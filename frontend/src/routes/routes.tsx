import {Navigate} from 'react-router-dom';
import {
  SignInPage,
  NotFoundPage,
  PrivatePage,
  IsNotAuthorized,
  SignUpPage,
  PrimaryPage,
} from '@/pages';
import {PrimaryLayout} from '@/layouts';
import {ROUTES} from './constants';

export const routes = [
  {
    element: <PrimaryLayout />,
    children: [
      {
        path: ROUTES.BASE,
        element: (
          <PrivatePage
            component={PrimaryPage}
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
