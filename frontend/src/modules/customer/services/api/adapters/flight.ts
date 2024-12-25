import {useCallback, useState} from 'react';
import {API_ROUTES, apiService} from '@/services/api';
import {catchError} from '@/utils/catch-error.ts';

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
      catchError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const bookFlight = useCallback(
    async (flightId: string, passengersData: FlightBookingData[]) => {
      setLoading(true);

      try {
        const {data} = await apiService.post(API_ROUTES.FLIGHT_BOOKING, {
          flight_id: flightId,
          passengers: passengersData,
        });

        return data;
      } catch (e) {
        catchError(e);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const checkInOnFlight = useCallback(async (passengersId: number[]) => {
    setLoading(true);

    try {
      await apiService.post(API_ROUTES.FLIGHT_CHECK_IN, {
        passenger_ids: passengersId,
      });
    } catch (e) {
      catchError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    getFlightDetails,
    bookFlight,
    checkInOnFlight,
  };
};
