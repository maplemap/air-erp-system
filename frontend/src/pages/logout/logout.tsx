import {useCallback, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {STORAGE_KEY} from '@/constants.ts';
import {ROUTES} from '@/routes/constants.ts';
import {apiService} from '@/services/api';
import {API_ROUTES} from '@/services/api/constants.ts';
import {useAppStore} from '@/services/store';

export const LogoutPage = () => {
  const navigate = useNavigate();
  const {deleteUser} = useAppStore();

  const logout = useCallback(async () => {
    try {
      await apiService.post(API_ROUTES.LOGOUT);
    } finally {
      localStorage.removeItem(STORAGE_KEY.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEY.REFRESH_TOKEN);

      deleteUser();
    }
  }, [deleteUser]);

  useEffect(() => {
    logout();
    navigate(ROUTES.SIGN_IN);
  }, [logout, navigate]);

  return null;
};
