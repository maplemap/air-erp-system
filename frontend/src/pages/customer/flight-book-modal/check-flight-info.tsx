import {useCallback, useEffect, useState} from 'react';
import {formatDateToFlightFormat} from '@/libs/date.ts';
import {useFlight} from '@/services/api/adapters';
import {Box, List, Text} from '@/ui-kit';

type CheckFlightInfoType = {
  data: Flight;
};

export const CheckFlightInfo = ({data}: CheckFlightInfoType) => {
  const [flightDetailsData, setFlightDetailsData] = useState(null);
  const {
    id,
    code,
    departure_place,
    departure_time,
    arrival_place,
    arrival_time,
  } = data;
  const {getFlightDetails} = useFlight();

  const getFlightDetailsData = useCallback(async () => {
    const data = await getFlightDetails(id);
    setFlightDetailsData(data);
  }, [getFlightDetails, id]);

  useEffect(() => {
    getFlightDetailsData();
  }, [getFlightDetailsData]);

  console.log(flightDetailsData);

  return (
    <Text px="md">
      <Box>
        <Text fw={700}>Flight Info</Text>
      </Box>
      <List listStyleType="none" withPadding={true}>
        <List.Item>Code: {code}</List.Item>
        <List.Item>
          Departure: {departure_place} at&nbsp;
          {formatDateToFlightFormat(departure_time)}
        </List.Item>
        <List.Item>
          Arrival: {arrival_place} at&nbsp;
          {formatDateToFlightFormat(arrival_time)}
        </List.Item>
      </List>
    </Text>
  );
};
