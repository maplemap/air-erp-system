import {useNavigate} from 'react-router-dom';
import {ROUTES} from '@/routes/constants';
import {useAppStore} from '@/services/store';
import {Box, Menu, Text} from '@/ui-kit';
import {IconLogout} from '@/ui-kit/icons';
import styles from './user-box.module.css';

export const UserBox = () => {
  const {user} = useAppStore();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Box className={styles.email}>{user.username}</Box>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconLogout size={14} />}
          onClick={() => navigate(ROUTES.LOGOUT)}
        >
          <Text size="md">Logout</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
