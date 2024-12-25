import {FlightsTable} from '@/modules/customer/components';
import {useCustomerStore} from '@/modules/customer/services/store';
import {Box, Button, Center, LoadingOverlay, Table} from '@/ui-kit';
import styles from './flight-search-results.module.css';

type FlightSearchResultsProps = {
  data: Flight[] | null;
  loading?: boolean;
};

export const FlightSearchResults = (props: FlightSearchResultsProps) => {
  const {data, loading} = props;
  const {setBookFlightId} = useCustomerStore();

  const getResults = () => {
    if (!data) {
      return null;
    }

    if (data.length === 0) {
      return <Center>No flights were found. Please try again</Center>;
    }

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

  return (
    <Box pos="relative" className={styles.wrapper}>
      <LoadingOverlay visible={loading} />
      {getResults()}
    </Box>
  );
};
