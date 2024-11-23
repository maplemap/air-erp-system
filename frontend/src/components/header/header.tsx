import {UserBox} from '@/components/user-box';
import styles from './header.module.css';
import {ROUTES} from '@/routes/constants';
import {IconPlaneDeparture} from '@/ui-kit/icons';
import {Text, Box, Group} from '@/ui-kit';
import {Link} from 'react-router-dom';

export const Header = () => (
  <Box p="lg">
    <Group justify="space-between" wrap="nowrap">
      <Link to={ROUTES.BASE} className={styles.brand}>
        <Group>
          <IconPlaneDeparture size={26} />
          <Text size="lg">Air ERP System</Text>
        </Group>
      </Link>
      <UserBox />
    </Group>
  </Box>
);
