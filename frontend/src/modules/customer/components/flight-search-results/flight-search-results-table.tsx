import {formatDateToFlightFormat} from '@/libs/date.ts';
import {useCustomerStore} from '@/modules/customer/services/store';
import {Button, Table} from '@/ui-kit';
import styles from './flight-search-results.module.css';

type FlightSearchResultsTableProps = {
  data: Flight[];
};

export const FlightSearchResultsTable = (
  props: FlightSearchResultsTableProps,
) => {
  const {setBookFlightId} = useCustomerStore();
  const {data} = props;

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
      <Table.Tr key={code} className={styles.tableRow}>
        <Table.Td>
          {code} - {airplane_model}
        </Table.Td>
        <Table.Td>{departure_place}</Table.Td>
        <Table.Td>{formatDateToFlightFormat(departure_time)}</Table.Td>
        <Table.Td>{arrival_place}</Table.Td>
        <Table.Td>{formatDateToFlightFormat(arrival_time)}</Table.Td>
        <Table.Td>
          <Button size="compact-md" onClick={() => setBookFlightId(id)}>
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
    </>
  );
};
