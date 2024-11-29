import {RegistrationParams, useAuth} from '@/services/api/adapters';
import {Link, useNavigate} from 'react-router-dom';
import {Button, Center, Group, Stack, Text, TextInput} from '@/ui-kit';
import styles from '@/pages/sign-in/sign-in.module.css';
import {ROUTES} from '@/routes/constants.ts';
import {
  useForm,
  validateEmailAddress,
  validateLength,
  validateConfirmPassword,
} from '@/ui-kit/form';
import {PasswordInput} from '@mantine/core';

export type SignUpFormData = RegistrationParams & {
  password2: string;
};

export const SignUpPage = () => {
  const navigate = useNavigate();
  const {registration} = useAuth();

  const form = useForm<SignUpFormData>({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      password2: '',
    },
    validate: {
      firstName: (value) => validateLength({fieldName: 'First name', value}),
      lastName: (value) => validateLength({fieldName: 'Last name', value}),
      username: (value) => validateLength({fieldName: 'Username', value}),
      email: validateEmailAddress,
      password: (value) => validateLength({fieldName: 'Password', value}),
      password2: validateConfirmPassword,
    },
  });

  const onSubmit = async (values: SignUpFormData) => {
    await registration(values);
    navigate(ROUTES.BASE);
  };

  return (
    <Stack justify="center" className={styles.wrapper}>
      <h2>Sign In</h2>
      <form onSubmit={form.onSubmit(onSubmit)} className={styles.form}>
        <Stack>
          <TextInput
            withAsterisk
            placeholder="First name"
            key={form.key('firstName')}
            {...form.getInputProps('firstName')}
          />
          <TextInput
            withAsterisk
            placeholder="Last name"
            key={form.key('lastName')}
            {...form.getInputProps('lastName')}
          />
          <TextInput
            withAsterisk
            placeholder="Username"
            key={form.key('username')}
            {...form.getInputProps('username')}
          />
          <TextInput
            withAsterisk
            placeholder="Email"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          <PasswordInput
            withAsterisk
            placeholder="Password"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          <PasswordInput
            withAsterisk
            placeholder="Confirm Password"
            key={form.key('password2')}
            {...form.getInputProps('password2')}
          />
          <Center>
            <Text size="sm">
              You&#39;re already registered?&nbsp;
              <Link to={ROUTES.SIGN_IN}>Log in</Link>
            </Text>
          </Center>
          <Group justify="center">
            <Button type="submit">Register</Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};
