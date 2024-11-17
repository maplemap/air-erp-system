import {Navigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {ROUTES} from '../../routes/constants';

export const PrivatePage = ({component: Component, allowedRoles}) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to={ROUTES.SIGN_IN} />;
  }

  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={ROUTES.NOT_FOUND} />;
  }

  return <Component />;
};
