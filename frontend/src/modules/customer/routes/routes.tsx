import {Navigate} from 'react-router-dom';
import {ROUTES as APP_ROUTES} from '@/routes/constants';
import {FlightSearchPage} from '../pages';

export const routes = [
  {
    path: '/',
    element: <FlightSearchPage />,
  },
  {
    path: '*',
    element: <Navigate to={`/${APP_ROUTES.NOT_FOUND}`} />,
  },
];
