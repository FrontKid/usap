import { Form, Formik } from 'formik';
import { FC } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Button, InputField, Logo } from '@/shared/ui';

import { isEmailValid } from '@/shared/utils';

import css from './ResetPassword.module.scss';
import { auth } from '@/shared/firebase';

type TResetPasswordProps = {
  onBack: () => void;
};

interface IFormValues {
  resetPasswordEmail: string;
}

const authValidation = (values: IFormValues) => {
  const errors = {
    resetPasswordEmail: '',
  };

  if (!values.resetPasswordEmail) {
    errors.resetPasswordEmail = 'Required';
  } else if (!isEmailValid(values.resetPasswordEmail)) {
    errors.resetPasswordEmail = 'Enter valid email';
  }

  if (errors.resetPasswordEmail) {
    return errors;
  }

  return {};
};

const ResetPassword: FC<TResetPasswordProps> = ({ onBack }) => {
  const handleSubmit = async ({ resetPasswordEmail }: IFormValues) => {
    try {
      await sendPasswordResetEmail(auth, resetPasswordEmail);
      onBack();
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <article className={css.resetPasswordWrapper}>
      <Logo className={css.logo} />

      <div className={css.contentWrapper}>
        <h2 className={css.title}>Reset your password</h2>
        <span className={css.desc}>
          Please enter your email address. We will send you an email to reset
          your password.
        </span>

        <Formik
          initialValues={{ resetPasswordEmail: '' }}
          validate={authValidation}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className={css.form}>
              <InputField
                name="resetPasswordEmail"
                className={css.input}
                placeholder="yours@example.com"
              />

              <Button buttonType="submit">Continue</Button>
            </Form>
          )}
        </Formik>

        <button
          onClick={onBack}
          type="button"
          aria-label="back"
          className={css.iconWrapper}
        >
          <FaArrowLeft className={css.iconBack} size={15} />
        </button>
      </div>
    </article>
  );
};

export { ResetPassword };
