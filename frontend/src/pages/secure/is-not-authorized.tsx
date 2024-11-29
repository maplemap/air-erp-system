import {useNavigate} from 'react-router-dom';
import {ROUTES} from '@/routes/constants.ts';
import {ReactNode} from 'react';
import {STORAGE_KEY} from '@/constants.ts';

type IsNotAuthorizedProps = {
  children: ReactNode;
};

export const IsNotAuthorized = ({children}: IsNotAuthorizedProps) => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);

  if (accessToken) {
    navigate(ROUTES.BASE);
  }

  return children;
};
