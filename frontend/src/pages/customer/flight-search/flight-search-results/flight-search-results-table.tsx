import {useMemo, useState} from 'react';
import {formatDateToFlightFormat} from '@/libs/date.ts';
import {FlightBookModal} from '@/pages/customer/flight-book-modal';
import {Button, Table} from '@/ui-kit';
import styles from './flight-search-results-table.module.css';

type FlightSearchResultsTableProps = {
  data: Flight[];
};

export const FlightSearchResultsTable = (
  props: FlightSearchResultsTableProps,
) => {
  const [bookingFlightId, setBookingFlightId] = useState<string | null>(null);
  const {data} = props;
  const bookingFlightData = useMemo(
    () => data.find(({id}) => id === bookingFlightId),
    [bookingFlightId, data],
  );

  const rows = data.map(
    ({
      id,
      code,
      arrival_place,
      arrival_time,
      departure_place,
      departure_time,
      airplane_model,
    }) => (
      <Table.Tr key={code} className={styles.row}>
        <Table.Td>
          {code} - {airplane_model}
        </Table.Td>
        <Table.Td>{departure_place}</Table.Td>
        <Table.Td>{formatDateToFlightFormat(departure_time)}</Table.Td>
        <Table.Td>{arrival_place}</Table.Td>
        <Table.Td>{formatDateToFlightFormat(arrival_time)}</Table.Td>
        <Table.Td>
          <Button size="compact-md" onClick={() => setBookingFlightId(id)}>
            Book
          </Button>
        </Table.Td>
      </Table.Tr>
    ),
  );

  return (
    <>
      <Table striped={true} highlightOnHover={true} horizontalSpacing="md">
        <Table.Thead>
          <Table.Tr className={styles.row}>
            <Table.Th>Flight</Table.Th>
            <Table.Th>Departure place</Table.Th>
            <Table.Th>Departure time</Table.Th>
            <Table.Th>Arrival place</Table.Th>
            <Table.Th>Arrival time</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <FlightBookModal
        data={bookingFlightData}
        opened={Boolean(bookingFlightId)}
        onClose={() => setBookingFlightId(null)}
      />
    </>
  );
};