import {FlightSearchResultsTable} from '@/pages/customer/flight-search-results/flight-search-results-table.tsx';
import {Box, Center, LoadingOverlay} from '@/ui-kit';
import styles from './flight-search-results.module.css';

type FlightSearchResultsProps = {
  flights: Flight[] | null;
  loading: boolean;
};

export const FlightSearchResults = (props: FlightSearchResultsProps) => {
  const {flights, loading} = props;

  const getResults = () => {
    if (!flights) {
      return null;
    }

    if (flights.length === 0) {
      return <Center>No flights were found. Please try again</Center>;
    }

    return <FlightSearchResultsTable data={flights} />;
  };

  return (
    <Box pos="relative" className={styles.wrapper}>
      <LoadingOverlay visible={loading} zIndex={1000} />
      {getResults()}
    </Box>
  );
};
