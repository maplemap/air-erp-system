import {AxiosError} from 'axios';
import {useAppStore} from '@/services/store';
import {logger} from '@/utils/logger.ts';

export const catchError = (e: unknown) => {
  const {message, response} = e as AxiosError<APIError>;
  logger.error(message);
  useAppStore.getState().setError(response?.data?.error || message);
};
