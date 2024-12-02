import {Stack, Text} from '@/ui-kit';
import {FlightSearch} from './flight-search';

export const CustomerPage = () => {
  return (
    <Stack w="100%" align="center" mt="xxl">
      <Text size="xxl">
        Where would you like to <s>go</s> fly?
      </Text>
      <FlightSearch />
    </Stack>
  );
};
