import {Navigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {ROUTES} from '@/routes/constants.js';
import {ComponentType} from 'react';

type PrivatePageProps = {
  component: ComponentType<unknown>;
  allowedRoles: string[];
};

export const PrivatePage = ({
  component: Component,
  allowedRoles,
}: PrivatePageProps) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to={ROUTES.SIGN_IN} />;
  }

  const decodedToken = jwtDecode<JWTToken>(token);
  const userRole = decodedToken.role;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={ROUTES.NOT_FOUND} />;
  }

  return <Component />;
};
