import {formatDateToFlightFormat} from '@/libs/date.ts';
import {useFlight} from '@/modules/customer/services/api/adapters';
import {Flex, List, Stack, Text} from '@/ui-kit';
import {FlightBookingForm} from './flight-booking-form';

type CheckFlightInfoType = {
  flightDetails: FlightDetails;
  passengers: number;
  onSuccess: (data: FlightBookedData) => void;
  onError: () => void;
};

export const FlightBooking = ({
  flightDetails,
  passengers,
  onSuccess,
}: CheckFlightInfoType) => {
  const {
    flight: {
      id,
      code,
      departure_place,
      departure_time,
      arrival_place,
      arrival_time,
    },
    options,
    seat_types: seatTypes,
  } = flightDetails;
  const {bookFlight} = useFlight();

  const bookTickets = async (data: FlightBookingData[]) => {
    const bookingData = await bookFlight(id, data);
    if (bookingData) {
      onSuccess(bookingData);
    }
  };

  const description = (
    <Text px="md">
      <List listStyleType="none" size="lg">
        <List.Item>
          <Flex>Flight code: {code}</Flex>
        </List.Item>
        <List.Item>
          <Flex>
            Departure: {departure_place} at&nbsp;
            {formatDateToFlightFormat(departure_time)}
          </Flex>
        </List.Item>
        <List.Item>
          <Flex>
            Arrival: {arrival_place} at&nbsp;
            {formatDateToFlightFormat(arrival_time)}
          </Flex>
        </List.Item>
      </List>
    </Text>
  );
  return (
    <Stack gap="xxl">
      {description}
      <FlightBookingForm
        passengers={passengers}
        flightOptions={options}
        flightSeatTypes={seatTypes}
        onSubmit={bookTickets}
      />
    </Stack>
  );
};
