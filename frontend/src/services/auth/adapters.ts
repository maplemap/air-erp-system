import {useCallback} from 'react';
import {useAppStore} from '@/services/store';
import {API_ROUTES} from '../api/constants';
import {apiService} from '../api';

export type LoginParams = {
  username: string;
  password: string;
};

export type RegistrationParams = LoginParams & {
  email: string;
  firstName: string;
  lastName: string;
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const useAuth = () => {
  const {user, setUser, deleteUser} = useAppStore();

  const login = useCallback(
    async ({username, password}: LoginParams) => {
      try {
        const {data} = await apiService.post(API_ROUTES.SIGN_IN, {
          username,
          password,
        });

        saveTokens(data.access, data.refresh);
        setUser(data.user);
      } catch (error) {
        console.error('Login error:', error);
      }
    },
    [setUser],
  );

  const registration = useCallback(
    async ({
      username,
      email,
      password,
      firstName,
      lastName,
    }: RegistrationParams) => {
      const {data} = await apiService.post(API_ROUTES.SIGN_UP, {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });

      saveTokens(data.access, data.refresh);
      setUser(data.user);
    },
    [setUser],
  );

  const logout = useCallback(async () => {
    await apiService.post(API_ROUTES.LOGOUT);
    deleteUser();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, [deleteUser]);

  return {
    user,
    login,
    logout,
    registration,
  };
};
