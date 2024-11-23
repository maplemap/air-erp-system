import {useNavigate} from 'react-router-dom';
import {ROUTES} from '@/routes/constants.ts';
import {ReactNode} from 'react';

type IsNotAuthorizedProps = {
  children: ReactNode;
};

export const IsNotAuthorized = ({children}: IsNotAuthorizedProps) => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    navigate(ROUTES.BASE);
  }

  return children;
};
