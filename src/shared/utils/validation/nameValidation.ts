import { isValidName } from './isNameValid';

interface IFormValues {
  immigrantName: string;
  sponsorName: string;
}

const nameValidation = (values: IFormValues) => {
  const errors = {
    immigrantName: '',
    sponsorName: '',
  };

  if (!values.immigrantName) {
    errors.immigrantName = 'Required';
  } else if (!isValidName(values.immigrantName)) {
    errors.immigrantName = 'Enter valid name';
  }

  if (!values.sponsorName) {
    errors.sponsorName = 'Required';
  } else if (!isValidName(values.sponsorName)) {
    errors.sponsorName = 'Enter valid name';
  }

  if (errors.immigrantName || errors.sponsorName) {
    return errors;
  }

  return {};
};

export { nameValidation };
