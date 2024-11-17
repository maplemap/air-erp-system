import {useNavigate} from 'react-router-dom';
import {ROUTES} from '../../routes/constants';

export const IsNotAuthorized = ({children}) => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    navigate(ROUTES.BASE);
  }

  return children;
};
