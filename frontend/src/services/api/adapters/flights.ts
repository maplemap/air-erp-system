import {useCallback, useState} from 'react';
import {apiService} from '@/services/api';
import {logger} from '@/utils/logger';
import {API_ROUTES} from '../../api/constants';

export type SearchFlightsParams = {
  destination: string;
  date: string;
  passengers: string;
};

export const useFlights = () => {
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState<Flight[] | null>(null);

  const searchFlights = useCallback(
    async ({destination, date, passengers}: SearchFlightsParams) => {
      setLoading(true);

      try {
        const {data} = await apiService.get(API_ROUTES.FLIGHTS_SEARCH, {
          destination,
          date,
          passengers,
        });

        setFlights(data);
      } catch (e) {
        logger.error(e);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {flights, searchFlights, loading};
};
