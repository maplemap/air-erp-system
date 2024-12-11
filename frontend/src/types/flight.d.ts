type Flight = {
  id: string;
  code: string;
  departure_place: string;
  arrival_place: string;
  departure_time: string;
  arrival_time: string;
  airplane_model: string;
  available_seats: string;
};

type FlightDetails = {
  flight: Flight;
  options: Option[];
  seat_types: SeatTypeData[];
};

type FlightBookingData = {
  firstName: string;
  lastName: string;
  gender: string;
  passportNumber: string;
  seatType: SeatType;
  options: string[];
};

type FlightBookedPassenger = Passenger & {
  id: number;
  seat_type: SeatType;
  options: string[];
  price: number;
};

type FlightBookedData = {
  passengers: FlightBookedPassenger[];
  total_price: number;
};
