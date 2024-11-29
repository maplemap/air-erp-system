import {useCallback} from 'react';
import {apiService} from '@/services/api';
import {API_ROUTES} from '@/services/api/constants.ts';

export const useUser = () => {
  const getUser = useCallback(async () => {
    try {
      const {data} = await apiService.get(API_ROUTES.USER);

      return data;
    } catch (error) {
      console.error('Login error:', error);
    }
  }, []);

  return {getUser};
};
