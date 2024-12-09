import {useRoutes} from 'react-router-dom';
import {routes as customerRoutes} from './routes';

export const CustomerResolver = () => {
  return useRoutes(customerRoutes);
};
