import {useCallback, useState} from 'react';
import {API_ROUTES, apiService} from '@/services/api';
import {catchError} from '@/utils/catch-error.ts';

export const useUser = () => {
  const [passengers, setPassengers] = useState([]);
  const [previousFlights, setPreviousFlights] = useState([]);
  const [futureFlights, setFutureFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserFlights = useCallback(async (type: 'past' | 'future') => {
    setLoading(true);

    try {
      const {data} = await apiService.get(API_ROUTES.USER_FLIGHTS, {
        type,
      });

      return data;
    } catch (e) {
      catchError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPassengers = useCallback(async () => {
    setLoading(true);

    try {
      const {data} = await apiService.get(API_ROUTES.USER_PASSENGERS);
      setPassengers(data);
    } catch (e) {
      catchError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const getFutureFlights = useCallback(async () => {
    const flights = await getUserFlights('future');
    setFutureFlights(flights);
  }, [getUserFlights]);

  const getPreviousFlights = useCallback(async () => {
    const flights = await getUserFlights('past');
    setPreviousFlights(flights);
  }, [getUserFlights]);

  return {
    getFutureFlights,
    getPreviousFlights,
    getPassengers,
    loading,
    futureFlights,
    previousFlights,
    passengers,
  };
};
