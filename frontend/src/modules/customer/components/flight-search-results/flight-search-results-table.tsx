import {FlightsTable} from '@/modules/customer/components/flights-table';
import {useCustomerStore} from '@/modules/customer/services/store';
import {Button, Table} from '@/ui-kit';

type FlightSearchResultsTableProps = {
  data: Flight[];
};

export const FlightSearchResultsTable = (
  props: FlightSearchResultsTableProps,
) => {
  const {setBookFlightId} = useCustomerStore();
  const {data} = props;

  return (
    <FlightsTable
      data={data}
      renderExtraHeadRow={() => <Table.Th />}
      renderExtraRow={({id}) => (
        <Table.Td>
          <Button size="compact-md" onClick={() => setBookFlightId(id)}>
            Book
          </Button>
        </Table.Td>
      )}
    />
  );
};
