import {useState} from 'react';
import {CheckFlightInfo} from '@/pages/customer/flight-book-modal/check-flight-info.tsx';
import {Button, Group, LoadingOverlay, Modal, Stepper, Text} from '@/ui-kit';
import styles from './flight-book-modal.module.css';

const MIN_STEP = 0;
const MAX_STEP = 3;

type FlightBookModalProps = {
  data?: Flight;
  opened: boolean;
  onClose: () => void;
};

export const FlightBookModal = (props: FlightBookModalProps) => {
  const [active, setActive] = useState(MIN_STEP);
  const nextStep = () =>
    setActive((current) => (current < MAX_STEP ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > MIN_STEP ? current - 1 : current));
  const {opened, onClose, data} = props;

  const onCloseModal = () => {
    setActive(0);
    onClose();
  };

  const modalTitle = (
    <Text size="xl" fw={700}>
      Booking on flight {data?.code} :: {data?.departure_place} -&nbsp;
      {data?.arrival_place}
    </Text>
  );

  const getModalContent = () => {
    if (!data) {
      return <LoadingOverlay visible={true} zIndex={1000} />;
    }

    return (
      <>
        <Stepper active={active} classNames={{steps: styles.stepperSteps}}>
          <Stepper.Step label="Check flight info">
            <CheckFlightInfo data={data} />
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Verify email">
            Step 2 content: Verify email
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Get full access">
            Step 3 content: Get full access
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        <Group justify="center" mt="xl" mb="md">
          <Button
            variant="default"
            onClick={prevStep}
            disabled={active === MIN_STEP}
          >
            Back
          </Button>
          <Button onClick={nextStep} disabled={active === MAX_STEP}>
            Next step
          </Button>
        </Group>
      </>
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={onCloseModal}
      size="70%"
      title={modalTitle}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      pos="relative"
    >
      {getModalContent()}
    </Modal>
  );
};
