import {Box, Center, LoadingOverlay} from '@/ui-kit';
import {FlightSearchResultsTable} from './flight-search-results-table.tsx';
import styles from './flight-search-results.module.css';

type FlightSearchResultsProps = {
  data: Flight[] | null;
  loading?: boolean;
};

export const FlightSearchResults = (props: FlightSearchResultsProps) => {
  const {data, loading} = props;

  const getResults = () => {
    if (!data) {
      return null;
    }

    if (data.length === 0) {
      return <Center>No flights were found. Please try again</Center>;
    }

    return <FlightSearchResultsTable data={data} />;
  };

  return (
    <Box pos="relative" className={styles.wrapper}>
      <LoadingOverlay visible={loading} />
      {getResults()}
    </Box>
  );
};
