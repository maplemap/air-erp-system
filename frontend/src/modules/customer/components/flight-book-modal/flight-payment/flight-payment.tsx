import {useState} from 'react';
import {SEAT_TYPE} from '@/modules/customer/components/flight-book-modal/constants.ts';
import {usePayment} from '@/modules/customer/services/api/adapters/payment.ts';
import {
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  List,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
} from '@/ui-kit';
import style from './flight-payment.module.css';

type CheckFlightInfoType = {
  data?: FlightBookedData;
  onSuccess: () => void;
};

export const FlightPayment = (props: CheckFlightInfoType) => {
  const {data, onSuccess} = props;
  const [loading, setLoading] = useState(false);
  const {bookingPayment} = usePayment();

  if (!data) {
    return null;
  }

  const {passengers, total_price} = data;

  const onHandlePayment = async () => {
    setLoading(true);
    await bookingPayment(passengers.map(({id}) => id));

    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <Stack pos="relative" gap="md" px="md" className={style.wrapper}>
      <LoadingOverlay visible={loading} />
      <Text size="lg" fw={700}>
        Your booking data
      </Text>
      {passengers.map(
        (
          {id, first_name, last_name, passport_number, seat_type, options},
          index,
        ) => (
          <Card key={id} shadow="sm" padding="md" radius="md" withBorder>
            <Text fw={700} size="xl">
              Passenger #{index + 1}
            </Text>
            <List mt="xl" listStyleType="none" size="lg">
              <List.Item>
                <Flex align="center">
                  Passport number:
                  <Text ml="sm" fw={600}>
                    {passport_number}
                  </Text>
                </Flex>
              </List.Item>
              <List.Item>
                <Flex align="center">
                  First name:{' '}
                  <Text ml="sm" fw={600}>
                    {first_name}
                  </Text>
                </Flex>
              </List.Item>
              <List.Item>
                <Flex align="center">
                  Last name:{' '}
                  <Text ml="sm" fw={600}>
                    {last_name}
                  </Text>
                </Flex>
              </List.Item>
              <List.Item>
                <Flex align="center">
                  Seat type:{' '}
                  <Text ml="sm" fw={600}>
                    {SEAT_TYPE[seat_type]}
                  </Text>
                </Flex>
              </List.Item>
              {options?.length > 0 ? (
                <List.Item>
                  <Flex align="center">
                    Options:{' '}
                    <Text ml="sm" fw={600}>
                      {options.join(', ')}
                    </Text>
                  </Flex>
                </List.Item>
              ) : null}
            </List>
          </Card>
        ),
      )}
      <Group>
        <Text fw={700} size="lg" mt="xl">
          Total price: {total_price}
        </Text>
      </Group>
      <Divider my="xl" />
      <Stack>
        <Text fw={700} size="xl">
          Payment
        </Text>
        <Center>
          <Stack>
            <Card
              w="400"
              h="250"
              py="xxl"
              shadow="sm"
              padding="md"
              radius="lg"
              withBorder
            >
              <TextInput
                label="Card Number"
                value="5425 2334 3010 9903"
                disabled={true}
              />
              <Group>
                <TextInput
                  label="Exp. Date"
                  maw="100"
                  value="03/33"
                  disabled={true}
                />
                <TextInput
                  type="password"
                  label="CV"
                  maw="100"
                  value="111"
                  disabled={true}
                />
              </Group>
            </Card>
            <Button onClick={onHandlePayment}>Pay</Button>
          </Stack>
        </Center>
      </Stack>
    </Stack>
  );
};
