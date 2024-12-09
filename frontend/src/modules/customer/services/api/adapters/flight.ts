import {useCallback, useEffect, useState} from 'react';
import {useCustomerStore} from '@/modules/customer/services/store';
import {API_ROUTES, apiService} from '@/services/api';
import {logger} from '@/utils/logger';

export const useFlight = (flightId: string | null) => {
  const [loading, setLoading] = useState(false);
  const {flightDetails, setFlightDetails} = useCustomerStore();

  const getFlightDetails = useCallback(async () => {
    setLoading(true);

    try {
      const {data} = await apiService.get(API_ROUTES.FLIGHT_DETAILS, {
        flight_id: flightId,
      });

      setFlightDetails(data);
    } catch (e) {
      logger.error(e);
    } finally {
      setLoading(false);
    }
  }, [flightId, setFlightDetails]);

  useEffect(() => {
    if (!flightDetails && flightId) {
      getFlightDetails();
    }
  }, [flightDetails, flightId, getFlightDetails]);

  const bookFlight = useCallback(
    async (passengersData: FlightBookingData[]) => {
      setLoading(true);

      try {
        const {data} = await apiService.post(API_ROUTES.FLIGHT_BOOKING, {
          flight_id: flightId,
          passengers: passengersData,
        });

        return data;
      } catch (e) {
        logger.error(e);
      } finally {
        setLoading(false);
      }
    },
    [flightId],
  );

  return {loading, getFlightDetails, flightDetails, bookFlight};
};
