import {useCallback} from 'react';
import {apiService} from '@/services/api';
import {API_ROUTES} from '@/services/api/constants.ts';
import {useAppStore} from '@/services/store';
import {catchError} from '@/utils/catch-error.ts';

export const useUser = () => {
  const {user, setUser} = useAppStore();

  const getUser = useCallback(async () => {
    try {
      const {data} = await apiService.get(API_ROUTES.USER);

      return data;
    } catch (e) {
      catchError(e);
    }
  }, []);

  return {getUser, setUser, user};
};
