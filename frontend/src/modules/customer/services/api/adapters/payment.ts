import {useCallback, useState} from 'react';
import {API_ROUTES, apiService} from '@/services/api';
import {catchError} from '@/utils/catch-error.ts';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);

  const bookingPayment = useCallback(async (passengersId: number[]) => {
    setLoading(true);

    try {
      await apiService.post(API_ROUTES.PAYMENT_BOOKING_PAYMENT, {
        passenger_ids: passengersId,
      });
    } catch (e) {
      catchError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return {bookingPayment, loading};
};
