import {formatDate} from '@/libs/date.ts';
import {Button, Table} from '@/ui-kit';
import styles from './flight-search-results-table.module.css';

const TIME_FORMAT = 'YY/MM/DD HH:MM';

type FlightSearchResultsTableProps = {
  data: Flight[];
};

export const FlightSearchResultsTable = (
  props: FlightSearchResultsTableProps,
) => {
  const {data} = props;

  const rows = data.map(
    ({
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
        <Table.Td>{formatDate(departure_time, TIME_FORMAT)}</Table.Td>
        <Table.Td>{arrival_place}</Table.Td>
        <Table.Td>{formatDate(arrival_time, TIME_FORMAT)}</Table.Td>
        <Table.Td>
          <Button size="compact-md">Order</Button>
        </Table.Td>
      </Table.Tr>
    ),
  );

  return (
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
  );
};
