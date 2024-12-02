import {useCallback, useState} from 'react';
import {apiService} from '@/services/api';
import {logger} from '@/utils/logger';
import {API_ROUTES} from '../../api/constants';

export const useFlight = () => {
  const [loading, setLoading] = useState(false);

  const getFlightDetails = useCallback(async (flightId: string) => {
    setLoading(true);

    try {
      const {data} = await apiService.get(API_ROUTES.FLIGHT_DETAILS, {
        flight_id: flightId,
      });

      return data;
    } catch (e) {
      logger.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return {loading, getFlightDetails};
};
