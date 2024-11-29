import {useFlights} from '@/services/api/adapters';
import {Stack, Text} from '@/ui-kit';
import {FlightSearch} from './flight-search';
import {FlightSearchResults} from './flight-search-results';

export const CustomerPage = () => {
  const {flights, loading, searchFlights} = useFlights();

  return (
    <Stack w="100%" align="center" mt="xxl">
      <Text size="xxl">
        Where would you like to <s>go</s> fly?
      </Text>
      <Stack w="100%" align="center" gap={100}>
        <FlightSearch searchFlights={searchFlights} />
        <FlightSearchResults flights={flights} loading={loading} />
      </Stack>
    </Stack>
  );
};
