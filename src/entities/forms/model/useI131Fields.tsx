import { getAllUsersInfo, getAllUserAnswers } from '@/shared/firebase/services';
import { DocumentData } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { getAnswerFromArray } from '../utils/getAnswerFromArray';
import { getUserAnswerById } from '../utils/getUserAnswerById';
import { IPDFField } from '../types/IPDFField';
import { usStates } from './codesState';

const useI131Fields = (): IPDFField[] => {
  const [allUserAnswers, setUserAnswers] = useState<DocumentData | never[]>([]);
  const { pathname } = useLocation();

  const getAnswerById = (answerId: string, key: string = '') => {
    return (
      getAnswerFromArray(getUserAnswerById(allUserAnswers, answerId), key) ?? ''
    );
  };

  useEffect(() => {
    (async () => {
      try {
        const users = await getAllUsersInfo();
        const userEmail = pathname.split('/').slice(-1).join('');
        const userToFill = users.find(user => user.email === userEmail);
        const data = await getAllUserAnswers(userToFill?.id ?? '0');

        setUserAnswers(Object.values(data));
      } catch (error) {
        // console.log(error);
      }
    })();
  }, [pathname]);

  return [
    // !! Page 1

    // ?? Part 1. Information About You
    {
      name: 'form1[0].#subform[0].Line1a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'lastName'),
    },
    {
      name: 'form1[0].#subform[0].Line1b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'firstName'),
    },
    {
      name: 'form1[0].#subform[0].Line1c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'middleName'),
    },

    // ?? Physical Address
    {
      name: 'form1[0].#subform[0].Line2a_InCareofName[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'nameCare'),
    },
    {
      name: 'form1[0].#subform[0].Line2b_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'streetNumber'),
    },
    {
      name: 'form1[0].#subform[0].Line2c_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('42', 'apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[0].Line2c_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('42', 'apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[0].Line2c_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('42', 'apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[0].Line2c_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'apt/Ste/FlrN'),
    },
    {
      name: 'form1[0].#subform[0].Line2d_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'city'),
    },
    {
      name: 'form1[0].#subform[0].Line2e_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('42', 'state')]],
    },
    {
      name: 'form1[0].#subform[0].Line2f_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'zipCode'),
    },
    {
      name: 'form1[0].#subform[0].Line2g_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'postalCode'),
    },
    {
      name: 'form1[0].#subform[0].Line2h_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'province'),
    },
    {
      name: 'form1[0].#subform[0].Line2i_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'country'),
    },

    // ?? Other Information
    {
      name: 'form1[0].#subform[0].#area[1].Line3_AlienNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    {
      name: 'form1[0].#subform[0].Line4_CountryOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'countryBirth'),
    },
    {
      name: 'form1[0].#subform[0].Line5_CountryOfCitizenship[0]',
      type: 'PDFTextField',
      value: getAnswerById('22', 'countryBirthFirst'),
    },
    {
      name: 'form1[0].#subform[0].Line6_ClassofAdmission[0]',
      type: 'PDFTextField',
      value: getAnswerById('5'),
    },
    {
      name: 'form1[0].#subform[0].Line7_Male[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('21', 'sex') === 'Male',
    },
    {
      name: 'form1[0].#subform[0].Line7_Female[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('21', 'sex') === 'Female',
    },
    {
      name: 'form1[0].#subform[0].Line8_DateOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'birthDate'),
    },
    {
      name: 'form1[0].#subform[0].#area[2].Line9_SSN[0]',
      type: 'PDFTextField',
      value: getAnswerById('68', 'provideSecurityNumber'),
    },

    // !! Page 2

    // ?? Part 2. Application Type
    {
      name: 'form1[0].#subform[1].Line1a_checkbox[0]',
      type: 'PDFCheckBox',
      checked: true,
    },

    // ?? Part 3. Processing Information
    {
      name: 'form1[0].#subform[1].Line1_DateIntendedDeparture[0]',
      type: 'PDFTextField',
      value: getAnswerById('57', 'dateOfIntendedDeparture'),
    },
    {
      name: 'form1[0].#subform[1].Line2_ExpectedLengthTrip[0]',
      type: 'PDFTextField',
      value: getAnswerById('57', 'expectedLengthOfTripInDays'),
    },
    {
      name: 'form1[0].#subform[1].Line3a_Yes[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[1].Line3a_No[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[1].Line3b_NameDHSOffice[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].Line4a_Yes[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[1].Line4a_No[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[1].Line4b_DateIssued[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].Line4c_Disposition[0]',
      type: 'PDFTextField',
      value: '',
    },
    // !! Page 3

    // ?? Part 4. Information About Your Proposed Travel
    {
      name: 'form1[0].#subform[2].Line1a_Purpose[0]',
      type: 'PDFTextField',
      value: getAnswerById('57', 'purposeOfTrip'),
    },
    {
      name: 'form1[0].#subform[2].Line1b_ListCountries[0]',
      type: 'PDFTextField',
      value: getAnswerById('57', 'countriesVisitList'),
    },

    // !! Page 4

    // ?? How many trips do you intend to use this document?
    {
      name: 'form1[0].#subform[3].Line1_OneTrip[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('57', 'isMultipleTrips') === 'No',
    },
    {
      name: 'form1[0].#subform[3].Line1_MoreThanOne[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('57', 'isMultipleTrips') === 'Yes',
    },
    // !! Page 5

    // ?? Part 10. Information About Person Who Prepared This Application, If Other Than the Applicant
    // * Preparer's Full Name
    {
      name: 'form1[0].#subform[4].Line1a_PreparerFamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerLastName'),
    },
    {
      name: 'form1[0].#subform[4].Line1b_PreparerGivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerFirstName'),
    },
    {
      name: 'form1[0].#subform[4].Line2_BusinessName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerBusinessName'),
    },

    // * Preparer's Mailing Address
    {
      name: 'form1[0].#subform[4].Line3a_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerStreetN'),
    },
    {
      name: 'form1[0].#subform[4].Line3b_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'preparerAptSteFlr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[4].Line3b_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'preparerAptSteFlr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[4].Line3b_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'preparerAptSteFlr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[4].Line3b_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerAptSteFlrN'),
    },
    {
      name: 'form1[0].#subform[4].Line3c_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerCity'),
    },
    {
      name: 'form1[0].#subform[4].Line3d_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('69', 'preparerStates')]],
    },
    {
      name: 'form1[0].#subform[4].Line3e_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerZipCode'),
    },
    {
      name: 'form1[0].#subform[4].Line3f_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerPostalCode'),
    },
    {
      name: 'form1[0].#subform[4].Line3g_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerProvince'),
    },
    {
      name: 'form1[0].#subform[4].Line3h_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerCountry'),
    },

    // ?? Preparer's Contact Information
    {
      name: 'form1[0].#subform[4].#area[8].Line4_DaytimePhoneNumber1[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerDaytimeTelephoneN').slice(0, 3),
    },
    {
      name: 'form1[0].#subform[4].#area[8].Line4_DaytimePhoneNumber2[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerDaytimeTelephoneN').slice(3, 6),
    },
    {
      name: 'form1[0].#subform[4].#area[8].Line4_DaytimePhoneNumber3[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerDaytimeTelephoneN').slice(-4),
    },
    {
      name: 'form1[0].#subform[4].Line4_Extension[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[4].Line5_Email[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerEmailAddress'),
    },
  ];
};

export { useI131Fields };
