import styles from './user-box.module.css';
import {useAuth} from '@/services/auth';
import {Menu, Box, Text} from '@/ui-kit';
import {IconLogout} from '@/ui-kit/icons';
import {useNavigate} from 'react-router-dom';
import {ROUTES} from '@/routes/constants.ts';

export const UserBox = () => {
  const {user, logout} = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const onHandleClickLogout = async () => {
    await logout();
    navigate(ROUTES.SIGN_IN);
  };
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Box className={styles.email}>{user.username}</Box>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconLogout size={14} />}
          onClick={onHandleClickLogout}
        >
          <Text size="md">Logout</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
