import {ComponentType} from 'react';
import {Navigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {STORAGE_KEY} from '@/constants.ts';
import {ROUTES} from '@/routes/constants.js';

type PrivatePageProps = {
  component: ComponentType<unknown>;
  allowedRoles: string[];
};

export const PrivatePage = ({
  component: Component,
  allowedRoles,
}: PrivatePageProps) => {
  const token = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);

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
