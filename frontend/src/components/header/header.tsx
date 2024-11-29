import {Link} from 'react-router-dom';
import {UserBox} from '@/components/user-box';
import {ROUTES} from '@/routes/constants';
import {Box, Group, Text} from '@/ui-kit';
import {IconPlaneDeparture} from '@/ui-kit/icons';
import styles from './header.module.css';

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
