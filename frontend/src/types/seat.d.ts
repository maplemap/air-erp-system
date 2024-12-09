type SeatType = 'economy_class' | 'business_class' | 'first_class';

type SeatTypeData = {
  seat_type: SeatType;
  price: number;
  available_seats: number;
};
