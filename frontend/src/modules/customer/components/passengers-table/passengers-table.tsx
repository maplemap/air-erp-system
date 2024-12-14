import {ReactNode} from 'react';
import {formatDateToFlightFormat} from '@/libs/date.ts';
import {Center, Table} from '@/ui-kit';
import styles from './passengers-table.module.css';

type PassengersTableDataItem = Passenger & {
  flight: Flight;
};

type PassengersTableProps = {
  data: PassengersTableDataItem[];
  renderExtraHeadRow?: () => ReactNode;
  renderExtraRow?: (passenger: Passenger) => ReactNode;
};

export const PassengersTable = (props: PassengersTableProps) => {
  const {data, renderExtraHeadRow, renderExtraRow} = props;

  if (data.length === 0) {
    return <Center>No data.</Center>;
  }

  const rows = data.map((dataItem) => {
    const {
      id,
      last_name,
      first_name,
      passport_number,
      gender,
      is_paid,
      flight,
    } = dataItem;

    return (
      <Table.Tr key={id} className={styles.row}>
        <Table.Td>{flight.code}</Table.Td>
        <Table.Td>
          {flight.departure_place} / {flight.arrival_place}
        </Table.Td>
        <Table.Td>{formatDateToFlightFormat(flight.departure_time)}</Table.Td>
        <Table.Td>{formatDateToFlightFormat(flight.arrival_time)}</Table.Td>
        <Table.Td>
          {first_name} {last_name}
        </Table.Td>
        <Table.Td>{gender}</Table.Td>
        <Table.Td>{passport_number}</Table.Td>
        <Table.Td>{`${is_paid ? 'Paid' : 'Not paid'}`}</Table.Td>
        {renderExtraRow?.(dataItem)}
      </Table.Tr>
    );
  });

  return (
    <>
      <Table striped={true} highlightOnHover={true} horizontalSpacing="md">
        <Table.Thead>
          <Table.Tr className={styles.row}>
            <Table.Th>Flight</Table.Th>
            <Table.Th>Departure / Arrival</Table.Th>
            <Table.Th>Departure Time</Table.Th>
            <Table.Th>Arrival Time</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Gender</Table.Th>
            <Table.Th>Passport number</Table.Th>
            <Table.Th>Payment status</Table.Th>
            {renderExtraHeadRow?.()}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
};
