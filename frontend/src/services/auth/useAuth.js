import {useCallback} from 'react';
import {API_ROUTES} from '../api/constants';
import {apiService} from '../api';

const saveTokens = ({accessToken, refreshToken}) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const useAuth = () => {
  const login = useCallback(async (username, password) => {
    try {
      const {data} = await apiService.post(API_ROUTES.SIGN_IN, {
        username,
        password,
      });

      saveTokens({
        accessToken: data.access,
        refreshToken: data.refresh,
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  }, []);

  const logout = useCallback(async () => {
    await apiService.post(API_ROUTES.LOGOUT);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, []);

  const registration = useCallback(
    async ({username, email, password, firstName, lastName}) => {
      const {data} = await apiService.post(API_ROUTES.SIGN_UP, {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });

      saveTokens({
        accessToken: data.access,
        refreshToken: data.refresh,
      });
    },

    [],
  );

  return {
    login,
    logout,
    registration,
  };
};
