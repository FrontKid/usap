import { FC } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';

import { PasswordField, InputField, Button } from '@/shared/ui';
import { authValidation } from '@/shared/utils';
import { useSignIn, useSignUp } from '@/shared/hooks';

import { TInputValues } from '../../types';

import css from './AuthForm.module.scss';

type TAuthFormProps = {
  isSignIn: boolean;
  onToggle: (resetForm: () => void) => void;
  toggleResetPassword: () => void;
};

const initialValue = {
  password: '',
  email: '',
};

const AuthForm: FC<TAuthFormProps> = ({
  isSignIn = true,
  onToggle = () => {},
  toggleResetPassword = () => {},
}) => {
  const userSignIn = useSignIn();
  const userSignUp = useSignUp();

  const handleSubmit = (
    values: TInputValues,
    { setFieldError }: FormikHelpers<TInputValues>,
  ) => {
    const trimmedEmail = values.email.trim();
    const trimmedPassword = values.password.trim();

    if (isSignIn) {
      userSignIn(trimmedEmail, trimmedPassword, ({ message, code }) => {
        if (code === 'auth/user-not-found') {
          setFieldError('email', message);
        } else {
          setFieldError('password', message);
        }
      });

      return;
    }

    userSignUp(trimmedEmail, trimmedPassword, ({ message, code }) => {
      if (code === 'auth/email-already-in-use') {
        setFieldError('email', message);
      } else {
        setFieldError('password', message);
      }
    });
  };

  return (
    <Formik
      initialValues={initialValue}
      validate={authValidation}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ resetForm }) => (
        <Form className={css.form}>
          <InputField
            name="email"
            isCapitalize={false}
            autoComplete="off"
            placeholder="yours@example.com"
            classNames={css.inputEmail}
          />
          <PasswordField className={css.inputPassword} />

          <div>
            {isSignIn && (
              <Button
                onClick={toggleResetPassword}
                color="textButton"
                className={css.forgotPassword}
              >
                Forgot Password?
              </Button>
            )}

            <Button buttonType="submit">Continue</Button>

            {isSignIn && (
              <div className={css.signUpWrapper}>
                <span>Didn&apos;t have acount?</span>

                <Button onClick={() => onToggle(resetForm)} color="textButton">
                  SignUp
                </Button>
              </div>
            )}

            {!isSignIn && (
              <div className={css.signUpWrapper}>
                <span>Already have account?</span>

                <Button onClick={() => onToggle(resetForm)} color="textButton">
                  LogIn
                </Button>
              </div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export { AuthForm };
