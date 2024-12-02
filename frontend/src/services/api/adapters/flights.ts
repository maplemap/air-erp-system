import {useCallback, useEffect, useState} from 'react';
import {formatDate} from '@/libs/date.ts';
import {apiService} from '@/services/api';
import {logger} from '@/utils/logger';
import {API_ROUTES} from '../../api/constants';

export type SearchFlightsParams = {
  departure: string;
  destination?: string;
  date?: Date | null;
  passengers?: number;
};

export const useSearchFlights = () => {
  const [loading, setLoading] = useState(false);
  const [departures, setDepartures] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [dates, setDates] = useState([]);
  const [flights, setFlights] = useState<Flight[] | null>(null);

  const getDates = useCallback(async (departure: string, arrival: string) => {
    try {
      const {data} = await apiService.get(API_ROUTES.FLIGHT_DATES, {
        departure_place: departure,
        arrival_place: arrival,
      });

      setDates(data);
    } catch (e) {
      logger.error(e);
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
      logger.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDepartures = async () => {
    try {
      const {data} = await apiService.get(API_ROUTES.FLIGHT_DEPARTURES);

      setDepartures(data);
    } catch (e) {
      logger.error(e);
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
    async ({departure, destination, date, passengers}: SearchFlightsParams) => {
      if (departure && !destination) {
        return setFlights(null);
      }

      setLoading(true);

      try {
        const {data} = await apiService.get(API_ROUTES.FLIGHT_SEARCH, {
          departure_place: departure,
          arrival_place: destination,
          date: date ? formatDate(date, 'YY/MM/DD') : null,
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
