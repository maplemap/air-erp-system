import {useState} from 'react';
import {useFlight} from '@/modules/customer/services/api/adapters';
import {useCustomerStore} from '@/modules/customer/services/store';
import {Button, Group, LoadingOverlay, Modal, Stepper, Text} from '@/ui-kit';
import {FlightBooking} from './flight-booking';
import styles from './flight-book-modal.module.css';

const MIN_STEP = 0;
const MAX_STEP = 2;

export const FlightBookModal = () => {
  const {bookFlightId, clearBookFlightId, searchParams} = useCustomerStore();
  const {flightDetails} = useFlight(bookFlightId);
  const [active, setActive] = useState(MIN_STEP);

  const {flight} = flightDetails || {};

  const passengers = searchParams?.passengers;
  const nextStep = () =>
    setActive((current) => (current < MAX_STEP ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > MIN_STEP ? current - 1 : current));

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
              />
            </Stepper.Step>
            <Stepper.Step label="Payment">
              Step 2 content: Verify email
            </Stepper.Step>
            <Stepper.Completed>
              Completed, click back button to get to previous step
            </Stepper.Completed>
          </Stepper>
        </>
      );
    }

    return <LoadingOverlay visible={true} zIndex={1000} />;
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
      onClose={() => clearBookFlightId()}
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
