import * as Yup from 'yup';

const eligibilityApplicantNamesShema = Yup.object().shape({
  immigrantName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Only Latin alphabet letters are allowed.')
    .max(10, 'Immigrant name must be at most 10 characters long')
    .required('Immigrant name is required'),
  sponsorName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Only Latin alphabet letters are allowed.')
    .max(10, 'Sponsor name must be at most 10 characters long')
    .required('Sponsor name is required'),
});

export { eligibilityApplicantNamesShema };
