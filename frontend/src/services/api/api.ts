import axios from 'axios';
import {API_ROUTES} from './constants.js';

const BASE_URL = '/api/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getRefreshToken = () => localStorage.getItem('refreshToken');
const getAccessToken = () => localStorage.getItem('accessToken');

const refreshTokens = async () => {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.REFRESH}`, {
      refresh: getRefreshToken(),
    });
    const {access, refresh} = response.data;

    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    return access;
  } catch (error) {
    console.error('Refresh token error', error);
    throw error;
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
  get: async (url, params = {}) => await api.get(url, {params}),
  post: async (url, data = {}) => await api.post(url, data),
  put: async (url, data = {}) => await api.put(url, data),
  delete: async (url, params = {}) => await api.delete(url, {params}),
};
