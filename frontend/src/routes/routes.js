import {Navigate} from 'react-router-dom';
import {
  PrimaryPage,
  SignInPage,
  NotFoundPage,
  PrivatePage,
  IsNotAuthorized,
  SignUpPage,
} from '../pages';
import {ROUTES} from './constants';

export const routes = [
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
];
