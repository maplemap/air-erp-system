import {LoginParams, useAuth} from '@/services/auth';
import {Link, useNavigate} from 'react-router-dom';
import {
  Stack,
  Button,
  Group,
  TextInput,
  Text,
  Center,
  PasswordInput,
} from '@/ui-kit';
import {useForm, validateLength} from '@/ui-kit/form';
import styles from './sign-in.module.css';
import {ROUTES} from '@/routes/constants.ts';

export const SignInPage = () => {
  const navigate = useNavigate();
  const {login} = useAuth();

  const form = useForm<LoginParams>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => validateLength({fieldName: 'Username', value}),
      password: (value) => validateLength({fieldName: 'Password', value}),
    },
  });

  const onSubmit = async (values: LoginParams) => {
    await login(values);
    navigate(ROUTES.BASE);
  };

  return (
    <Stack justify="center" className={styles.wrapper}>
      <h2>Sign In</h2>
      <form onSubmit={form.onSubmit(onSubmit)} className={styles.form}>
        <Stack>
          <TextInput
            withAsterisk
            placeholder="Username"
            key={form.key('username')}
            {...form.getInputProps('username')}
          />
          <PasswordInput
            withAsterisk
            placeholder="Password"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          <Center>
            <Text size="sm">
              You&#39;re not registered yet? Let&#39;s{' '}
              <Link to={ROUTES.SIGN_UP}>do it</Link>
            </Text>
          </Center>
          <Group justify="center">
            <Button type="submit">Login</Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};
