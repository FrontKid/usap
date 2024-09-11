import { isEmailValid } from './isEmailValid';
import { isPasswordValid } from './isPasswordValid';

interface IFormValues {
  email: string;
  password: string;
}

const authValidation = (values: IFormValues) => {
  const errors = {
    email: '',
    password: '',
  };

  if (!values.email) {
    errors.email = 'Required';
  } else if (!isEmailValid(values.email)) {
    errors.email = 'Enter valid email';
  }

  if (!values.password) {
    errors.password = "Password can't be blank";
  } else if (!isPasswordValid(values.password)) {
    errors.password = 'Enter valid password';
  }

  if (errors.email || errors.password) {
    return errors;
  }

  return {};
};

export { authValidation };
