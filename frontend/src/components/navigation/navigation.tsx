import {Link} from 'react-router-dom';
import {ROUTES} from '@/routes/constants.ts';
import {useUser} from '@/services/api/adapters/user.ts';
import {Group} from '@/ui-kit';
import styles from './navigation.module.scss';

type NavigationItem = {
  link: string;
  label: string;
};

const MENU_ITEMS: Record<Roles, NavigationItem[]> = {
  customer: [
    {link: ROUTES.BASE, label: 'Search Flights'},
    {link: ROUTES.CUSTOMER_CABINET, label: 'Cabinet'},
  ],
  supervisor: [],
};

export const Navigation = () => {
  const {user} = useUser();

  if (!user) {
    return null;
  }

  return (
    <Group className={styles.wrapper}>
      {MENU_ITEMS[user.role].map(({link, label}) => (
        <Link key={link} to={link}>
          {label}
        </Link>
      ))}
    </Group>
  );
};
