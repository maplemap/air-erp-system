import {MantineProvider} from '@/providers/mantine';
import {useRoutes} from 'react-router-dom';
import '@mantine/core/styles.css';
import {routes as mainRoutes} from './routes';

export const App = () => {
  return <MantineProvider>{useRoutes(mainRoutes)}</MantineProvider>;
};
