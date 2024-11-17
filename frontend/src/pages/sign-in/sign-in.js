import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import './sign-in.module.scss';
import {useAuth} from '../../services/auth';
import {useNavigate} from 'react-router-dom';
import {ROUTES} from '../../routes/constants';

export const SignInPage = () => {
  const navigate = useNavigate();
  const {login} = useAuth();

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username too short')
      .max(20, 'Username too long')
      .required('Username is required'),
    password: Yup.string()
      .min(3, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleSubmit = async (values) => {
    const {username, password} = values;
    await login(username, password);
    navigate(ROUTES.BASE);
  };

  return (
    <div className="login-page">
      <h2>Sign In</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div>
            <label htmlFor="username">Username</label>
            <Field
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
            />
            <ErrorMessage name="username" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <Field
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
            />
            <ErrorMessage name="password" component="div" className="error" />
          </div>

          <div>
            <button type="submit">Login</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};
