import {useEffect, useState} from 'react';
import {FlightsTable, PassengersTable} from '@/modules/customer/components/';
import {useUser} from '@/modules/customer/services/api/adapters/user.ts';
import {Box, LoadingOverlay, Tabs} from '@/ui-kit';
import styles from './cabinet.module.css';

const TABS_KEYS = {
  PREVIOUS_FLIGHTS: 'previousFlights',
  FUTURE_FLIGHTS: 'futureFlights',
  CHECK_IN: 'checkIn',
};

export const CabinetPage = () => {
  const [activeTab, setActiveTab] = useState<string | null>(
    TABS_KEYS.FUTURE_FLIGHTS,
  );
  const {
    getPreviousFlights,
    getFutureFlights,
    getPassengers,
    previousFlights,
    futureFlights,
    passengers,
    loading,
  } = useUser();

  useEffect(() => {
    switch (activeTab) {
      case TABS_KEYS.PREVIOUS_FLIGHTS:
        getPreviousFlights();
        break;
      case TABS_KEYS.FUTURE_FLIGHTS:
        getFutureFlights();
        break;
      case TABS_KEYS.CHECK_IN:
        getPassengers();
        break;
    }
  }, [activeTab, getFutureFlights, getPreviousFlights]);

  return (
    <Box>
      <Tabs
        pos="relative"
        mt="xxl"
        classNames={{
          tab: styles.tab,
          list: styles.tabList,
          tabLabel: styles.tabLabel,
          panel: styles.tabPanel,
        }}
        value={activeTab}
        onChange={setActiveTab}
      >
        <LoadingOverlay visible={loading} />
        <Tabs.List>
          <Tabs.Tab value={TABS_KEYS.PREVIOUS_FLIGHTS}>
            Previous Flights
          </Tabs.Tab>
          <Tabs.Tab value={TABS_KEYS.FUTURE_FLIGHTS}>Future Flights</Tabs.Tab>
          <Tabs.Tab value={TABS_KEYS.CHECK_IN}>Check-In</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value={TABS_KEYS.PREVIOUS_FLIGHTS}>
          <FlightsTable data={previousFlights} />
        </Tabs.Panel>
        <Tabs.Panel value={TABS_KEYS.FUTURE_FLIGHTS}>
          <FlightsTable data={futureFlights} />
        </Tabs.Panel>
        <Tabs.Panel value={TABS_KEYS.CHECK_IN}>
          <PassengersTable data={passengers} />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};
