import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import './sign-up.module.scss';
import {useAuth} from '../../services/auth';
import {useNavigate} from 'react-router-dom';
import {ROUTES} from '../../routes/constants';

export const SignUpPage = () => {
  const navigate = useNavigate();
  const {registration} = useAuth();

  const initialValues = {
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username too short')
      .max(20, 'Username too long')
      .required('Username is required'),

    firstName: Yup.string()
      .min(3, 'First name too short')
      .max(20, 'First name too long')
      .required('First name is required'),

    lastName: Yup.string()
      .min(3, 'Last name too short')
      .max(20, 'Last name too long')
      .required('Last name is required'),

    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),

    password: Yup.string()
      .min(3, 'Password must be at least 3 characters')
      .required('Password is required'),

    password2: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const handleSubmit = async (values) => {
    await registration(values);
    navigate(ROUTES.BASE);
  };

  return (
    <div className="login-page">
      <h2>Sign Up</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div>
            <label htmlFor="firstName">First Name</label>
            <Field
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
            />
            <ErrorMessage name="firstName" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <Field
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
            />
            <ErrorMessage name="lastName" component="div" className="error" />
          </div>
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
            <label htmlFor="email">Email</label>
            <Field
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
            />
            <ErrorMessage name="email" component="div" className="error" />
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
            <label htmlFor="password2">Confirm password</label>
            <Field
              type="password"
              id="password2"
              name="password2"
              placeholder="Confirm your password"
            />
            <ErrorMessage name="password2" component="div" className="error" />
          </div>

          <div>
            <button type="submit">Login</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};
