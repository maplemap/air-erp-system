import {useCallback} from 'react';
import {STORAGE_KEY} from '@/constants.ts';
import {useUser} from '@/services/api/adapters/user.ts';
import {API_ROUTES} from '../../api/constants';
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
  localStorage.setItem(STORAGE_KEY.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEY.REFRESH_TOKEN, refreshToken);
};

export const useAuth = () => {
  const {getUser, setUser} = useUser();

  const getUserData = useCallback(async () => {
    const user = await getUser();
    setUser(user);
  }, [getUser, setUser]);

  const login = useCallback(
    async ({username, password}: LoginParams) => {
      try {
        const {data} = await apiService.post(API_ROUTES.SIGN_IN, {
          username,
          password,
        });

        saveTokens(data.access, data.refresh);
        getUserData();
      } catch (error) {
        console.error('Login error:', error);
      }
    },
    [getUserData],
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
      getUserData();
    },
    [getUserData],
  );

  return {
    login,
    registration,
  };
};
