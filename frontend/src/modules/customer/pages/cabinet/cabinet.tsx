import {useEffect, useState} from 'react';
import {FlightsTable, PassengersTable} from '@/modules/customer/components/';
import {useFlight} from '@/modules/customer/services/api/adapters';
import {usePayment} from '@/modules/customer/services/api/adapters/payment.ts';
import {useUser} from '@/modules/customer/services/api/adapters/user.ts';
import {Box, Button, LoadingOverlay, Table, Tabs} from '@/ui-kit';
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
  const {bookingPayment} = usePayment();
  const {checkInOnFlight} = useFlight();

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
  }, [activeTab, getFutureFlights, getPassengers, getPreviousFlights]);

  const getPassengersTable = () => {
    const renderExtraHeadRow = () => <Table.Th />;

    const renderExtraRow = (passengerData: Passenger | UserPassenger) => {
      const {is_paid, id, is_checked_in} = passengerData as UserPassenger;

      if (is_checked_in) {
        return null;
      }

      const buttonLabel = !is_paid ? 'Pay' : 'Check-In';
      const makePayment = async (id: number) => {
        await bookingPayment([id]);
        await getPassengers();
      };
      const makeCheckIn = async (id: number) => {
        await checkInOnFlight([id]);
        await getPassengers();
      };
      const buttonHandler = !is_paid
        ? () => makePayment(id)
        : () => makeCheckIn(id);

      return (
        <Table.Td>
          <Button size="compact-md" onClick={buttonHandler}>
            {buttonLabel}
          </Button>
        </Table.Td>
      );
    };

    return (
      <PassengersTable
        data={passengers}
        renderExtraHeadRow={renderExtraHeadRow}
        renderExtraRow={renderExtraRow}
      />
    );
  };

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
          {getPassengersTable()}
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};
