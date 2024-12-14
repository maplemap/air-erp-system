type Gender = 'Male' | 'Female';

type Passenger = {
  id: number;
  first_name: string;
  last_name: string;
  gender: Gender;
  passport_number: string;
  is_paid: boolean;
};
