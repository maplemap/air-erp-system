import {useCallback, useEffect, useRef} from 'react';
import {formatDate} from '@/libs/date';
import {FlightSearchResults} from '@/pages/customer/flight-search/flight-search-results';
import {useSearchFlights} from '@/services/api/adapters';
import {DatePickerInput, Group, Select, Stack} from '@/ui-kit';
import {useForm, validateNonEmpty} from '@/ui-kit/form';
import {NumberInput} from '@mantine/core';
import styles from './flight-search.module.css';

const PASSENGERS_COUNT_DEFAULT = 1;

type FlightSearchParams = {
  departure: string;
  destination: string;
  date: Date | null;
  passengers: number;
};

export const FlightSearch = () => {
  const {
    flights,
    loading,
    searchFlights,
    departures,
    destinations,
    dates: availableDates,
    getDestinations,
    getDates,
  } = useSearchFlights();
  const form = useForm<FlightSearchParams>({
    initialValues: {
      departure: '',
      destination: '',
      date: null,
      passengers: PASSENGERS_COUNT_DEFAULT,
    },
    validate: {
      date: validateNonEmpty('Date'),
      passengers: validateNonEmpty('Passengers'),
    },
  });

  const {departure, destination, passengers, date} = form.values;
  const departureRef = useRef(departure);

  useEffect(() => {
    if (departure) {
      const params =
        departure !== departureRef.current
          ? {departure}
          : {departure, destination, passengers, date};
      searchFlights(params);
    }
  }, [date, departure, destination, passengers, searchFlights]);

  const cleanFormFields = useCallback(() => {
    form.setFieldValue('destination', '');
    form.setFieldValue('date', null);
    form.setFieldValue('passengers', PASSENGERS_COUNT_DEFAULT);
  }, [form]);

  useEffect(() => {
    if (departureRef.current !== departure) {
      cleanFormFields();
      departureRef.current = departure;
    }
  }, [cleanFormFields, departure, form, destination, passengers, date]);

  const onDepartureChange = (value: string | null) => {
    if (value) {
      getDestinations(value);
      form.setFieldValue('departure', value);
    } else {
      cleanFormFields();
    }
  };

  const onDestinationChange = (value: string | null) => {
    form.setFieldValue('destination', value || '');
    form.setFieldValue('date', null);

    if (value) {
      getDates(form.values.departure, value);
    }
  };

  const filterDatePickerDates = (date: Date) =>
    !availableDates
      .map((availableDate) => formatDate(availableDate, 'YY/MM/DD'))
      .includes(formatDate(date, 'YY/MM/DD'));

  return (
    <Stack w="100%" align="center" gap={100}>
      <form className={styles.form}>
        <Stack justify="center" mt="xl">
          <Group
            gap={0}
            justify="center"
            align="flex-start"
            className={styles.fieldsWrapper}
          >
            <Select
              className={styles.input}
              size="md"
              searchable={true}
              label="Departure"
              data={departures}
              key={form.key('departure')}
              value={form.values.departure}
              onChange={onDepartureChange}
            />
            <Select
              className={styles.input}
              size="md"
              searchable={true}
              label="Destination"
              data={destinations}
              key={`destination-${departureRef.current}`}
              disabled={!form.values.departure}
              value={form.values.destination}
              onChange={onDestinationChange}
            />
            <DatePickerInput
              className={styles.input}
              size="md"
              label="Date"
              minDate={new Date()}
              highlightToday={true}
              key={form.key('date')}
              disabled={!form.values.departure}
              excludeDate={filterDatePickerDates}
              {...form.getInputProps('date')}
            />
            <NumberInput
              className={styles.input}
              size="md"
              min={1}
              label="Passengers"
              key={form.key('passengers')}
              disabled={!form.values.departure}
              {...form.getInputProps('passengers')}
            />
          </Group>
        </Stack>
      </form>
      <FlightSearchResults data={flights} loading={loading} />
    </Stack>
  );
};
