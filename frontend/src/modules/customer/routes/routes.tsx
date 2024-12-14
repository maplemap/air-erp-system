import {Navigate} from 'react-router-dom';
import {ROUTES as APP_ROUTES} from '@/routes/constants';
import {CabinetPage, FlightSearchPage} from '../pages';

export const routes = [
  {
    path: '/',
    element: <FlightSearchPage />,
  },
  {
    path: APP_ROUTES.CUSTOMER_CABINET,
    element: <CabinetPage />,
  },
  {
    path: '*',
    element: <Navigate to={`/${APP_ROUTES.NOT_FOUND}`} />,
  },
];
