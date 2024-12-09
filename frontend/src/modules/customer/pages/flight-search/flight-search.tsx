import {
  FlightBookModal,
  FlightSearchForm,
  FlightSearchResults,
} from '@/modules/customer/components';
import {useSearchFlights} from '@/modules/customer/services/api/adapters';
import {Stack, Text} from '@/ui-kit';

export const FlightSearchPage = () => {
  const {flights, loading, searchFlights} = useSearchFlights();

  return (
    <Stack w="100%" align="center" mt="xxl" gap={50}>
      <Text size="xxl">
        Where would you like to <s>go</s> fly?
      </Text>
      <FlightSearchForm onChange={searchFlights} />
      <FlightSearchResults data={flights} loading={loading} />
      <FlightBookModal />
    </Stack>
  );
};
