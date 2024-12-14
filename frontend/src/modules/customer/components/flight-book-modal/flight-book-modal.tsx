import {useState} from 'react';
import {FlightPayment} from '@/modules/customer/components/flight-book-modal/flight-payment';
import {useFlight} from '@/modules/customer/services/api/adapters';
import {useCustomerStore} from '@/modules/customer/services/store';
import {Flex, LoadingOverlay, Modal, Stepper, Text} from '@/ui-kit';
import {FlightBooking} from './flight-booking';
import styles from './flight-book-modal.module.css';

const MIN_STEP = 0;
const MAX_STEP = 2;

export const FlightBookModal = () => {
  const [flightBookedData, setFlightBookedData] = useState<
    FlightBookedData | undefined
  >();
  const {bookFlightId, clearBookFlightId, searchParams} = useCustomerStore();
  const {flightDetails} = useFlight(bookFlightId);
  const [active, setActive] = useState(MIN_STEP);

  const {flight} = flightDetails || {};

  const passengers = searchParams?.passengers;
  const nextStep = () =>
    setActive((current) => (current < MAX_STEP ? current + 1 : current));

  const onBookingSuccess = (data: FlightBookedData) => {
    setFlightBookedData(data);
    nextStep();
  };

  const onPaymentSuccess = () => {
    nextStep();
  };

  const onCloseModal = () => {
    clearBookFlightId();
    setActive(MIN_STEP);
  };

  const getModalContent = () => {
    if (flightDetails && passengers) {
      return (
        <>
          <Stepper
            active={active}
            classNames={{
              steps: styles.stepperSteps,
              content: styles.stepperContent,
            }}
          >
            <Stepper.Step label="Booking">
              <FlightBooking
                flightDetails={flightDetails}
                passengers={passengers}
                onSuccess={onBookingSuccess}
              />
            </Stepper.Step>
            <Stepper.Step label="Payment">
              {
                <FlightPayment
                  data={flightBookedData}
                  onSuccess={onPaymentSuccess}
                />
              }
            </Stepper.Step>
            <Stepper.Completed>
              <Flex justify="center" className={styles.stepperCompleted}>
                <Text size="lg">
                  The payment was successful.
                  <br />
                  You can see the further process of your booking in your
                  account.
                </Text>
              </Flex>
            </Stepper.Completed>
          </Stepper>
        </>
      );
    }

    return <LoadingOverlay visible={true} />;
  };

  const modalTitle = (
    <Text size="xl" fw={700}>
      Booking on flight {flight?.code} :: {flight?.departure_place} -&nbsp;
      {flight?.arrival_place}
    </Text>
  );

  return (
    <Modal
      pos="relative"
      opened={Boolean(bookFlightId)}
      onClose={onCloseModal}
      size="70%"
      title={modalTitle}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      classNames={{
        body: styles.modaBody,
      }}
    >
      {getModalContent()}
    </Modal>
  );
};
