import {useRoutes} from 'react-router-dom';
import {routes as mainRoutes} from './routes';

export const App = () => {
  const routes = useRoutes(mainRoutes);

  return routes;
};
