/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';

interface ISchema {
  daytimeTelephone: string;
  mobileTelephone: string;
  emailAddress: string;
}

const yupValidation = (schema: ISchema) => {
  const validationRules: Record<string, any> = {
    [schema.daytimeTelephone || '']: Yup.string()
      .max(10, 'The maximum allowed number is 10')
      .matches(
        /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
        'Invalid phone number format',
      ),
    [schema.mobileTelephone || '']: Yup.string()
      .max(10, 'The maximum allowed number is 10')
      .matches(
        /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
        'Invalid phone number format',
      ),
    [schema.emailAddress || '']: Yup.string().email('Email must be valid'),
  };

  // Фильтруем пустые ключи
  const filteredValidationRules = Object.fromEntries(
    Object.entries(validationRules).filter(([key]) => key !== ''),
  );

  return Yup.object().shape(filteredValidationRules);
};

export { yupValidation };
