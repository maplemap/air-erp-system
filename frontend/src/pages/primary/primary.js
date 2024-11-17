import {useAuth} from '../../services/auth';
import {useNavigate} from 'react-router-dom';
import {ROUTES} from '../../routes/constants';

export const PrimaryPage = () => {
  const navigate = useNavigate();
  const {logout} = useAuth();

  const onHandleLogout = async () => {
    await logout();
    navigate(ROUTES.SIGN_IN);
  };

  return (
    <section>
      PrimaryPage
      <button onClick={onHandleLogout}>Logout</button>
    </section>
  );
};
