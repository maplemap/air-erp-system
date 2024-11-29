import axios from 'axios';
import {STORAGE_KEY} from '@/constants.ts';
import {ROUTES} from '@/routes/constants.ts';
import {API_ROUTES} from './constants.js';

const BASE_URL = '/api/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getRefreshToken = () => localStorage.getItem(STORAGE_KEY.REFRESH_TOKEN);
const getAccessToken = () => localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEY.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEY.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEY.APP_DATA);
};

const refreshTokens = async () => {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.REFRESH}`, {
      refresh: getRefreshToken(),
    });
    const {access, refresh} = response.data;

    localStorage.setItem(STORAGE_KEY.ACCESS_TOKEN, access);
    localStorage.setItem(STORAGE_KEY.REFRESH_TOKEN, refresh);

    return access;
  } catch (error) {
    console.error('Refresh token error', error);
    clearAllData();
    window.location.href = ROUTES.SIGN_IN;
  }
};

api.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const {response} = error;

    if (response && response.status === 401) {
      const newAccessToken = await refreshTokens();

      error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return axios(error.config);
    }

    return Promise.reject(error);
  },
);

export const apiService = {
  get: async (url: string, params = {}) => await api.get(url, {params}),
  post: async (url: string, data = {}) => await api.post(url, data),
  put: async (url: string, data = {}) => await api.put(url, data),
  delete: async (url: string, params = {}) => await api.delete(url, {params}),
};
