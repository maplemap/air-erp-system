import {PassengerFormData} from '@/modules/customer/components/flight-book-modal/flight-booking/flight-booking-form.tsx';

export const getDefaultPrice = (seatTypes: SeatTypeData[]) =>
  seatTypes.find(({seat_type}) => seat_type === 'economy_class')?.price || 0;

type CalculateTicketPriceParams = {
  formData: PassengerFormData[];
  flightSeatTypes: SeatTypeData[];
  flightSeatOptions: Option[];
};

export const calculateTicketPrice = ({
  formData,
  flightSeatTypes,
  flightSeatOptions,
}: CalculateTicketPriceParams): number => {
  return formData.reduce((acc, {options, seatType}) => {
    const priceForSeat =
      flightSeatTypes.find(({seat_type}) => seat_type === seatType)?.price || 0;
    const priceForOptions = flightSeatOptions
      .filter((option) => options.includes(option.id.toString()))
      .reduce((total, option) => total + option.price, 0);

    acc = acc + priceForOptions + priceForSeat;

    return acc;
  }, 0);
};
