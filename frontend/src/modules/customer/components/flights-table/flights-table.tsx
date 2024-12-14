import {ReactNode} from 'react';
import {formatDateToFlightFormat} from '@/libs/date.ts';
import {Center, Table} from '@/ui-kit';
import styles from './flights-table.module.css';

type FlightsTableProps = {
  data: Flight[];
  renderExtraHeadRow?: () => ReactNode;
  renderExtraRow?: (flight: Flight) => ReactNode;
};

export const FlightsTable = (props: FlightsTableProps) => {
  const {data, renderExtraHeadRow, renderExtraRow} = props;

  if (data.length === 0) {
    return <Center>No data.</Center>;
  }

  const rows = data.map((flight) => {
    const {
      code,
      arrival_place,
      arrival_time,
      departure_place,
      departure_time,
      airplane_model,
    } = flight;

    return (
      <Table.Tr key={code} className={styles.row}>
        <Table.Td>
          {code} - {airplane_model}
        </Table.Td>
        <Table.Td>{departure_place}</Table.Td>
        <Table.Td>{formatDateToFlightFormat(departure_time)}</Table.Td>
        <Table.Td>{arrival_place}</Table.Td>
        <Table.Td>{formatDateToFlightFormat(arrival_time)}</Table.Td>
        {renderExtraRow?.(flight)}
      </Table.Tr>
    );
  });

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
            {renderExtraHeadRow?.()}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
};
