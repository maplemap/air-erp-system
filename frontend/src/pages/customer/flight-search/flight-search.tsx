import {formatDate} from '@/libs/date';
import {SearchFlightsParams} from '@/services/api/adapters';
import {Button, DatePickerInput, Group, Stack, TextInput} from '@/ui-kit';
import {useForm, validateNonEmpty} from '@/ui-kit/form';
import {NumberInput} from '@mantine/core';
import styles from './flight-search.module.css';

type FlightSearchParams = {
  destination: string;
  date: Date | null;
  passengers: string;
};

type FlightSearchProps = {
  searchFlights: (params: SearchFlightsParams) => void;
};

export const FlightSearch = (props: FlightSearchProps) => {
  const {searchFlights} = props;
  const form = useForm<FlightSearchParams>({
    initialValues: {
      destination: '',
      date: null,
      passengers: '',
    },
    validate: {
      destination: validateNonEmpty('Destination'),
      date: validateNonEmpty('Date'),
      passengers: validateNonEmpty('Passengers'),
    },
  });

  const onSubmit = async ({
    destination,
    date,
    passengers,
  }: FlightSearchParams) => {
    searchFlights({
      destination,
      date: formatDate(date as Date, 'YYYY-MM-DD'),
      passengers,
    });
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)} className={styles.form}>
      <Stack justify="center" mt="xxl">
        <Group
          gap={0}
          justify="center"
          align="flex-start"
          className={styles.fieldsWrapper}
        >
          <TextInput
            className={styles.input}
            size="md"
            placeholder="Destination"
            key={form.key('destination')}
            {...form.getInputProps('destination')}
          />
          <DatePickerInput
            className={styles.input}
            size="md"
            placeholder="Date"
            minDate={new Date()}
            highlightToday={true}
            key={form.key('date')}
            {...form.getInputProps('date')}
          />
          <NumberInput
            className={styles.input}
            size="md"
            min={1}
            placeholder="Passengers"
            key={form.key('passengers')}
            {...form.getInputProps('passengers')}
          />
        </Group>
        <Group justify="center">
          <Button type="submit" disabled={!form.isValid()} size="md">
            Find
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
