type User = {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: Roles;
};

type Roles = 'customer' | 'supervisor';
