import {useCallback, useEffect, useState} from 'react';
import {useCustomerStore} from '@/modules/customer/services/store';
import {API_ROUTES, apiService} from '@/services/api';
import {catchError} from '@/utils/catch-error.ts';

export const PASSENGERS_COUNT_DEFAULT = 1;

export type SearchFlightsParams = {
  departure: string;
  destination?: string;
  date?: string;
  passengers?: number;
};

export const useSearchFlights = () => {
  const [loading, setLoading] = useState(false);
  const [departures, setDepartures] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [dates, setDates] = useState([]);
  const [flights, setFlights] = useState<Flight[] | null>(null);
  const {setSearchParams} = useCustomerStore();

  const getDates = useCallback(async (departure: string, arrival: string) => {
    try {
      const {data} = await apiService.get(API_ROUTES.FLIGHT_DATES, {
        departure_place: departure,
        arrival_place: arrival,
      });

      setDates(data);
    } catch (e) {
      catchError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDestinations = useCallback(async (departure: string) => {
    try {
      const {data} = await apiService.get(API_ROUTES.FLIGHT_DESTINATIONS, {
        departure_place: departure,
      });

      setDestinations(data);
    } catch (e) {
      catchError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDepartures = async () => {
    try {
      const {data} = await apiService.get(API_ROUTES.FLIGHT_DEPARTURES);

      setDepartures(data);
    } catch (e) {
      catchError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (departures.length === 0) {
      getDepartures();
    }
  }, [departures.length]);

  const searchFlights = useCallback(
    async ({
      departure,
      destination,
      date,
      passengers: passengersCount,
    }: SearchFlightsParams) => {
      if (departure && !destination) {
        return setFlights(null);
      }
      const passengers = passengersCount || PASSENGERS_COUNT_DEFAULT;

      setLoading(true);
      setSearchParams({departure, destination, date, passengers});

      try {
        const {data} = await apiService.get(API_ROUTES.FLIGHT_SEARCH, {
          departure_place: departure,
          arrival_place: destination,
          date,
          passengers,
        });

        setFlights(data);
      } catch (e) {
        catchError(e);
      } finally {
        setLoading(false);
      }
    },
    [setSearchParams],
  );

  return {
    flights,
    searchFlights,
    loading,
    departures,
    destinations,
    dates,
    getDestinations,
    getDates,
  };
};
