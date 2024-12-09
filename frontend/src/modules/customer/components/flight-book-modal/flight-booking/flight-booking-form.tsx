import {useMemo} from 'react';
import {getDefaultPrice} from '@/modules/customer/components/flight-book-modal/flight-booking/utils.ts';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Group,
  Radio,
  Select,
  Stack,
  Text,
  TextInput,
} from '@/ui-kit';
import {useForm, validateNonEmpty} from '@/ui-kit/form';
import styles from './flight-booking.module.css';

const GENDER = {
  MALE: 'Male',
  FEMALE: 'Female',
};

const SEAT_TYPE: Record<SeatType, string> = {
  economy_class: 'Economy Class',
  business_class: 'Business Class',
  first_class: 'First Class',
};

export type PassengerFormData = FlightBookingData & {
  price: number;
};

type FlightBookingFormProps = {
  passengers: number;
  flightOptions: Option[];
  flightSeatTypes: SeatTypeData[];
  onSubmit: (data: FlightBookingData[]) => void;
};

export const FlightBookingForm = (props: FlightBookingFormProps) => {
  const {passengers, flightOptions, flightSeatTypes, onSubmit} = props;

  const form = useForm<{
    passengers: PassengerFormData[];
  }>({
    initialValues: {
      passengers: Array.from({length: passengers}, () => ({
        firstName: '',
        lastName: '',
        gender: '',
        passportNumber: '',
        seatType: 'economy_class',
        options: [],
        price: getDefaultPrice(flightSeatTypes),
      })),
    },
    validate: {
      passengers: {
        firstName: validateNonEmpty('First Name'),
        lastName: validateNonEmpty('Last Name'),
        gender: validateNonEmpty('Gender'),
        passportNumber: validateNonEmpty('Passport Number'),
      },
    },
    onValuesChange: (values) => {
      values.passengers.forEach((data, index) => {
        const priceForSeat =
          flightSeatTypes.find(({seat_type}) => seat_type === data.seatType)
            ?.price || 0;
        const priceForOptions = flightOptions
          .filter((option) => data.options.includes(option.id.toString()))
          .reduce((total, option) => total + option.price, 0);

        form.setFieldValue(
          `passengers.${index}.price`,
          priceForSeat + priceForOptions,
        );
      }, 0);
    },
  });

  const totalPrice = useMemo(
    () => form.values.passengers.reduce((acc, {price}) => acc + price, 0),
    [form.values],
  );

  const getFormContent = () => {
    return form.values.passengers.map((_, index) => (
      <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={700} size="xl">
          Passenger #{index + 1}
        </Text>
        <Stack mt="xl">
          <Group align="flex-start">
            <TextInput
              w={201}
              placeholder="First Name"
              {...form.getInputProps(`passengers.${index}.firstName`)}
            />
            <TextInput
              w={201}
              placeholder="Last Name"
              {...form.getInputProps(`passengers.${index}.lastName`)}
            />
            <Select
              w={201}
              placeholder="Gender"
              data={Object.values(GENDER).map((value) => ({
                value,
                label: value,
              }))}
              {...form.getInputProps(`passengers.${index}.gender`)}
            />
            <TextInput
              w={201}
              placeholder="Passport Number"
              {...form.getInputProps(`passengers.${index}.passportNumber`)}
            />
          </Group>
          <Divider mt="xl" mb="sm" />
          <Radio.Group
            label={
              <Text size="lg" mb="sm">
                Select type of seat
              </Text>
            }
            {...form.getInputProps(`passengers.${index}.seatType`)}
          >
            <Group mt="xs">
              {flightSeatTypes.map(({seat_type, available_seats}) => (
                <Radio
                  key={seat_type}
                  value={seat_type}
                  label={SEAT_TYPE[seat_type]}
                  disabled={available_seats === 0}
                />
              ))}
            </Group>
          </Radio.Group>
          <Checkbox.Group
            mt="xl"
            label={
              <Text size="lg" mb="sm">
                Select your favorite frameworks/libraries
              </Text>
            }
            {...form.getInputProps(`passengers.${index}.options`)}
          >
            <Group mt="xs">
              {flightOptions.map(({id, name, price}) => (
                <Checkbox
                  key={name}
                  value={String(id)}
                  label={`${name}(+${price}$)`}
                />
              ))}
            </Group>
          </Checkbox.Group>
          <Divider mt="xl" mb="sm" />
          <Group gap={5}>
            <Text fw={600}>Price:</Text>
            <Text fw={600}>{form.values.passengers[index].price}</Text>$
          </Group>
        </Stack>
      </Card>
    ));
  };

  const onHandlerSubmit = ({passengers}: {passengers: PassengerFormData[]}) => {
    onSubmit(
      passengers.map(
        ({firstName, lastName, options, gender, seatType, passportNumber}) => ({
          firstName,
          lastName,
          options,
          gender,
          seatType,
          passportNumber,
        }),
      ),
    );
  };

  return (
    <form onSubmit={form.onSubmit(onHandlerSubmit)}>
      <Stack px="md" gap="lg">
        {getFormContent()}
      </Stack>
      <Group
        py="xl"
        px="xxl"
        justify="space-between"
        className={styles.formFooter}
      >
        <Text size="lg">
          <strong>Total price:</strong> {totalPrice}$
        </Text>
        <Button w={200} type="submit">
          Submit
        </Button>
      </Group>
    </form>
  );
};
