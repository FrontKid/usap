import { getAllUsersInfo, getAllUserAnswers } from '@/shared/firebase/services';
import { DocumentData } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { getAnswerFromArray } from '../utils/getAnswerFromArray';
import { getUserAnswerById } from '../utils/getUserAnswerById';
import { IPDFField } from '../types/IPDFField';
import { usStates } from './codesState';

const useI485Fields = (): IPDFField[] => {
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
    {
      name: 'form1[0].#subform[0].Pt1Line10_AlienNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ?? Part 1. Information About You (Person applying for lawful permanent residence
    // Your Current Legal Name
    {
      name: 'form1[0].#subform[0].Pt1Line1a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'lastName'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line1b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'firstName'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line1c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'middleName'),
    },
    // ?? Other Names You Have Used Since Birth
    {
      name: 'form1[0].#subform[0].Pt1Line2a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'familyName1'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line2b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'givenName1'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line2c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'middleName1'),
    },
    //
    {
      name: 'form1[0].#subform[0].Pt1Line3a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'familyName2'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line3b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'givenName2'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line3c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'middleName2'),
    },
    //
    {
      name: 'form1[0].#subform[0].Pt1Line4a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'familyName3'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line4b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'givenName3'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line4c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'middleName3'),
    },
    // ?? Other Information About You
    {
      name: 'form1[0].#subform[0].Pt1Line5_DateofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'birthDate'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line6_Gender[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('21', 'sex') === 'Male',
    },
    {
      name: 'form1[0].#subform[0].Pt1Line6_Gender[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('21', 'sex') === 'Female',
    },
    {
      name: 'form1[0].#subform[0].Pt1Line6_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'birthCity'),
    },

    // !! Page 2

    {
      name: 'form1[0].#subform[1].Pt1Line10_AlienNumber[1]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ?? Part 1. Information About You
    {
      name: 'form1[0].#subform[1].Pt1Line8_CountryofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'countryBirth'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line9_CountryofCitizenship[0]',
      type: 'PDFTextField',
      value: getAnswerById('22', 'countryBirthFirst'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line10_AlienNumber[2]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line11_USCISELISAcctNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'uscisNumber'),
    },
    // ?? U.S. Mailing Address
    {
      name: 'form1[0].#subform[1].Pt1Line12_InCareofName[0]',
      type: 'PDFTextField',
      value: getAnswerById('31', 'careName'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line12_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('31', 'street'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line12_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('31', 'Apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[1].Pt1Line12_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('31', 'Apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[1].Pt1Line12_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('31', 'Apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[1].Pt1Line12_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('31', 'apt/Ste/FlrNum'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line12_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('31', 'cityOrTown'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line12_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('31', 'states')]],
    },
    {
      name: 'form1[0].#subform[1].Pt1Line12_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('31', 'ZIPCode'),
    },
    // ?? Social Security Card
    {
      name: 'form1[0].#subform[1].Pt1Line14_YN[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('68', 'socialSecurityAdministration') === 'Yes',
    },
    {
      name: 'form1[0].#subform[1].Pt1Line14_YN[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('68', 'socialSecurityAdministration') === 'No',
    },
    {
      name: 'form1[0].#subform[1].Pt1Line15_SSN[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('68', 'socialSecurityAdministration') === 'Yes'
          ? getAnswerById('68', 'provideSecurityNumber')
          : '',
    },
    {
      name: 'form1[0].#subform[1].Pt1Line16_YN[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('68', 'socialSecurityCard') === 'Yes',
    },
    {
      name: 'form1[0].#subform[1].Pt1Line16_YN[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('68', 'socialSecurityCard') === 'No',
    },
    {
      name: 'form1[0].#subform[1].Pt1Line17_YN[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('68', 'socialSecurityCard') === 'Yes',
    },

    // ?? Recent Immigration History
    {
      name: 'form1[0].#subform[1].Pt1Line18_PassportNum[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'passportNumber'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line19_TravelDoc[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'travelDocumentNumber'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line20_ExpDate[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'expOfPassportTravelDocument'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line21_Passport[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'issuingCountry'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line22_VisaNum[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'nonImmigrantVisaNumber'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line23a_CityTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'lastArrivalUSCity'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line23b_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('53', 'lastArrivalUSState')]],
    },
    {
      name: 'form1[0].#subform[1].Pt1Line24_Date[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'lastArrivalUS'),
    },

    // !! Page 3

    {
      name: 'form1[0].#subform[2].Pt1Line10_AlienNumber[3]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ?? Part 1. Information About You (Person applying for lawful permanent residence) (continued)
    {
      name: 'form1[0].#subform[2].Pt1Line25a_CB[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[2].Pt1Line25a_AdmissionEntry[0]',
      type: 'PDFTextField',
      value: getAnswerById('5'),
    },
    {
      name: 'form1[0].#subform[2].P2Line26a_I94[0]',
      type: 'PDFTextField',
      value: getAnswerById('54', 'formI94Number'),
    },
    {
      name: 'form1[0].#subform[2].Pt1Line26b_Date[0]',
      type: 'PDFTextField',
      value: getAnswerById('54', 'expirationDateOfAuthorizedFormI94'),
    },
    {
      name: 'form1[0].#subform[2].Pt1Line26c_Status[0]',
      type: 'PDFTextField',
      value: getAnswerById('54', 'formStatusI94'),
    },
    {
      name: 'form1[0].#subform[2].Pt1Line27_Status[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('54', 'isStatusStillTheSame') === 'No'
          ? getAnswerById('54', 'currentImmigrationStatus')
          : getAnswerById('54', 'formStatusI94'),
    },
    {
      name: 'form1[0].#subform[2].Pt1Line28a_FamilyName[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('55', 'isNameExactOnI94') === 'Yes'
          ? getAnswerById('21', 'lastName')
          : getAnswerById('55', 'lastNameI94'),
    },
    {
      name: 'form1[0].#subform[2].Pt1Line28b_GivenName[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('55', 'isNameExactOnI94') === 'Yes'
          ? `${getAnswerById('21', 'firstName')} ${getAnswerById('21', 'middleName')}`
          : getAnswerById('55', 'firstNameI94'),
    },
    // ?? Part 2. Application Type or Filing Category
    // ?? Family-based
    {
      name: 'form1[0].#subform[2].Pt2Line1_CB[0]',
      type: 'PDFCheckBox',
      checked: true,
    },

    // !! Page 4

    {
      name: 'form1[0].#subform[3].Pt1Line10_AlienNumber[4]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ?? Special Programs Based on Certain Public Laws
    // {
    //   name: 'form1[0].#subform[2].Pt1Line28b_GivenName[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // // ?? Additional Options
    // {
    //   name: 'form1[0].#subform[2].Pt1Line28b_GivenName[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[2].Pt1Line28b_GivenName[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },

    // ?? Information About Your Immigrant Category
    {
      name: 'form1[0].#subform[3].Pt2Line3_Receipt[0]',
      type: 'PDFTextField',
      value: getAnswerById('56', 'underlyingPetitionReceiptN'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line4_Date[0]',
      type: 'PDFTextField',
      value: getAnswerById('56', 'underlyingPetitionPriorityDate'),
    },
    // {
    //   name: 'form1[0].#subform[3].Pt2Line5a_FamilyName[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[3].Pt2Line5b_GivenName[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[3].Pt2Line5c_MiddleName[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[3].Pt1Line8_AlienNumber[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[3].Pt2Line7_Date[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[3].Pt2Line8_ReceiptNumber[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[3].Pt2Line9_Date[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // ?? Part 3. Additional Information About You
    // {
    //   name: 'form1[0].#subform[3].Pt3Line1_YN[1]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[3].Pt3Line1_YN[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[3].Pt3Line2a_City[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[3].Pt3Line2b_Country[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[3].Pt3Line3_Decision[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[3].Pt3Line4_Date[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // !! Page 5

    {
      name: 'form1[0].#subform[4].Pt1Line10_AlienNumber[5]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ?? Address History
    // Physical Address 1 (current address)
    {
      name: 'form1[0].#subform[4].Pt3Line5_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'streetNumber'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line5_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('42', 'apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line5_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('42', 'apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line5_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('42', 'apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line5_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'apt/Ste/FlrN'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line5_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'city'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line5_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('42', 'state')]],
    },
    {
      name: 'form1[0].#subform[4].Pt3Line5_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'zipCode'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line5_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'province'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line5_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'postalCode'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line5_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'country'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line6a_Date[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'dateFrom'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line6b_Date[0]',
      type: 'PDFTextField',
      value: 'PRESENT',
    },
    // Physical Address 2
    // {
    //   name: 'form1[0].#subform[4].Pt3Line7_StreetNumberName[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[4].Pt3Line7_Unit[0]',
    //   type: 'PDFCheckBox',
    //   checked: getAnswerById('55', 'firstNameI94') === 'Apt',
    // },
    // {
    //   name: 'form1[0].#subform[4].Pt3Line7_Unit[1]',
    //   type: 'PDFCheckBox',
    //   checked: getAnswerById('55', 'firstNameI94') === 'Ste',
    // },
    // {
    //   name: 'form1[0].#subform[4].Pt3Line7_Unit[2]',
    //   type: 'PDFCheckBox',
    //   checked: getAnswerById('55', 'firstNameI94') === 'Flr',
    // },
    // {
    //   name: 'form1[0].#subform[4].Pt3Line7_AptSteFlrNumber[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[4].Pt3Line7_CityOrTown[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // // {
    // //   name: 'form1[0].#subform[4].Pt3Line7_State[0]',
    // //   type: 'PDFTextField',
    // //   value: getAnswerById('55', 'firstNameI94'),
    // // },
    // {
    //   name: 'form1[0].#subform[4].Pt3Line7_ZipCode[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[4].Pt3Line7_Province[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[4].Pt3Line7_PostalCode[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[4].Pt3Line7_Country[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[4].Pt3Line8a_DateFrom[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // {
    //   name: 'form1[0].#subform[4].Pt3Line8b_DateTo[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('55', 'firstNameI94'),
    // },
    // outside USA
    {
      name: 'form1[0].#subform[4].Pt3Line9_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'streetNumber'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line9_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('44', 'apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line9_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('44', 'apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line9_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('44', 'apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line9_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'apt/Ste/FlrN'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line9_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'city'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line9_ZipCode[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line9_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'province'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line9_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'ZIPCode'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line9_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'country'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line10a_DateFrom[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'dateResidenceFrom'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line10a_DateTo[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'dateResidenceTo'),
    },
    // ?? Employment History
    {
      name: 'form1[0].#subform[4].Pt3Line11_EmployerName[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employerName'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line12_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'streetName'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line12_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line12_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line12_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line12_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'AptSteFlrN'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line12_CityOrTown[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line12_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('60', 'states')]],
    },
    {
      name: 'form1[0].#subform[4].Pt3Line12_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'zipCode'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line12_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'province'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line12_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'postalCode'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line12_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'country'),
    },
    {
      name: 'form1[0].#subform[4].Pt3Line13_EmployerName[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'occupation'),
    },
    // !! Page 6

    {
      name: 'form1[0].#subform[5].Pt1Line10_AlienNumber[6]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ?? Part 3. Additional Information About You
    {
      name: 'form1[0].#subform[5].Pt3Line14a_DateFrom[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employmentDatesFrom'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line14b_DateTo[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employmentDatesTo'),
    },
    // Employer 2
    {
      name: 'form1[0].#subform[5].Pt3Line4a_EmployerName[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employerName0'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line16_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'streetName0'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line16_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/Flr0') === 'Apt',
    },
    {
      name: 'form1[0].#subform[5].Pt3Line16_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/Flr0') === 'Ste',
    },
    {
      name: 'form1[0].#subform[5].Pt3Line16_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/Flr0') === 'Flr',
    },
    {
      name: 'form1[0].#subform[5].Pt3Line16_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'AptSteFlrN0'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line16_CityOrTown[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt3Line16_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('60', 'states0')]],
    },
    {
      name: 'form1[0].#subform[5].Pt3Line16_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'zipCode0'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line16_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'province0'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line16_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'postalCode0'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line16_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'postalCode0'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line17_EmployerName[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'occupation0'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line18a_DateFrom[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employmentAdditionDatesFrom0'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line18a_DateTo[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employmentAdditionDatesTo0'),
    },
    // outside
    {
      name: 'form1[0].#subform[5].Pt3Line19_EmployerName[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employerNameOutside'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line20_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'streetNameOutside'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line20_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/FlrOutside') === 'Apt',
    },
    {
      name: 'form1[0].#subform[5].Pt3Line20_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/FlrOutside') === 'Ste',
    },
    {
      name: 'form1[0].#subform[5].Pt3Line20_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/FlrOutside') === 'Flr',
    },
    {
      name: 'form1[0].#subform[5].Pt3Line20_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'AptSteFlrNOutside'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line20_CityOrTown[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt3Line20_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('60', 'statesOutside')]],
    },
    {
      name: 'form1[0].#subform[5].Pt3Line20_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'zipCodeOutside'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line20_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'provinceOutside'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line20_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'postalCodeOutside'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line20_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'countryOutside'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line20_EmployerName[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'occupationOutside'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line22a_DateFrom[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employmentDatesFromOutside'),
    },
    {
      name: 'form1[0].#subform[5].Pt3Line22a_DateTo[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employmentDatesToOutside'),
    },
    // ?? Part 4. Information About Your Parents
    // Parent 1's Legal Name
    {
      name: 'form1[0].#subform[5].Pt4Line1a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('38', 'lastName'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line1b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('38', 'firstName'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line1c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('38', 'middleName'),
    },
    // Parent 1's Name at Birth (if different than above)
    {
      name: 'form1[0].#subform[5].Pt4Line2a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('38', 'diffLastName'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line2b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('38', 'diffFirstName'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line2c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('38', 'diffMiddleName'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line3_DateofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('38', 'birthDate'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line4_Gender[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[5].Pt4Line5_CityTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('38', 'cityBirth'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line6_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('38', 'birthCountry'),
    },
    // !! Page 7

    {
      name: 'form1[0].#subform[6].Pt1Line10_AlienNumber[7]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ?? Part 4. Information About Your Parents
    {
      name: 'form1[0].#subform[6].Pt4Line7_CityTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('39', 'currentCity'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line8_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('39', 'currentCountry'),
    },
    // ?? Information About Your Parent 2
    //Parent 2's Legal Name
    {
      name: 'form1[0].#subform[6].Pt4Line9a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('40', 'lastName'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line9b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('40', 'firstName'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line9c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('40', 'middleName'),
    },
    // Parent 2's Name at Birth (if different than above)
    {
      name: 'form1[0].#subform[6].Pt4Line10a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('40', 'diffLastName'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line10b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('40', 'diffFirstName'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line10c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('40', 'diffMiddleName'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line11_DateofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('40', 'birthDate'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line12_Gender[1]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[6].Pt4Line13_CityTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('40', 'cityBirth'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line14_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('40', 'birthCountry'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line15_CityTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('41', 'currentCity'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line16_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('41', 'currentCountry'),
    },
    // ?? Part 5. Information About Your Marital History
    {
      name: 'form1[0].#subform[6].Pt5Line1_MaritalStatus[3]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[6].Pt5Line2_YNNA[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'armedForces') === 'Yes',
    },
    {
      name: 'form1[0].#subform[6].Pt5Line2_YNNA[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'armedForces') === 'No',
    },
    {
      name: 'form1[0].#subform[6].Pt5Line3_TimesMarried[0]',
      type: 'PDFTextField',
      value: '1',
    },
    // ?? Information About Your Current Marriage
    {
      name: 'form1[0].#subform[6].Pt5Line4a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'lastName'),
    },
    {
      name: 'form1[0].#subform[6].Pt5Line4b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'firstName'),
    },
    {
      name: 'form1[0].#subform[6].Pt5Line4c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'middleName'),
    },
    {
      name: 'form1[0].#subform[6].Pt5Line5_AlienNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('29', 'armedForces'),
    },
    {
      name: 'form1[0].#subform[6].Pt5Line6_DateofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'birthDate'),
    },
    {
      name: 'form1[0].#subform[6].Pt5Line7_Date[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'marriageDatePriorSpouse'),
    },
    {
      name: 'form1[0].#subform[6].Pt5Line8a_CityTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'birthCity'),
    },
    {
      name: 'form1[0].#subform[6].Pt5Line8b_State[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'stateBirth'),
    },
    {
      name: 'form1[0].#subform[6].Pt5Line8c_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'countryBirth'),
    },
    {
      name: 'form1[0].#subform[6].Pt5Line9a_CityTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'marriagePlaceCity'),
    },
    {
      name: 'form1[0].#subform[6].Pt5Line9b_State[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'marriagePlaceProvince'),
    },
    {
      name: 'form1[0].#subform[6].Pt5Line9c_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'marriageCountry'),
    },
    {
      name: 'form1[0].#subform[6].Pt5Line10_YN[1]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[6].Pt5Line10_YN[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    // !! Page 8

    {
      name: 'form1[0].#subform[7].Pt1Line10_AlienNumber[8]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ?? Information About Prior Marriages (if any)
    {
      name: 'form1[0].#subform[7].Pt511a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'lastName'),
    },
    {
      name: 'form1[0].#subform[7].Pt5Line11b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'firstName'),
    },
    {
      name: 'form1[0].#subform[7].Pt5Line11c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'middleName'),
    },
    {
      name: 'form1[0].#subform[7].Pt5Line12_DateofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'priorSpouseBD'),
    },
    {
      name: 'form1[0].#subform[7].Pt5Line13_Date[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'marriageDatePriorSpouse'),
    },
    {
      name: 'form1[0].#subform[7].Pt5Line14a_CityTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'marriageDatePriorSpouse'),
    },
    {
      name: 'form1[0].#subform[7].Pt5Line14b_State[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'marriagePlaceProvince'),
    },
    {
      name: 'form1[0].#subform[7].Pt5Line14c_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'marriageCountry'),
    },
    {
      name: 'form1[0].#subform[7].Pt5Line15_Date[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'divorceDatePriorSpouse'),
    },
    {
      name: 'form1[0].#subform[7].Pt5Line16a_CityTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'marriagePlaceCity'),
    },
    {
      name: 'form1[0].#subform[7].Pt5Line16b_State[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'divorceProvince'),
    },
    {
      name: 'form1[0].#subform[7].Pt5Line16c_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'divorceCountry'),
    },
    // ?? Part 6. Information About Your Children
    {
      name: 'form1[0].#subform[7].Pt6Line1_TotalChildren[0]',
      type: 'PDFTextField',
      value: getAnswerById('20'),
    },
    // ?? Part 14. Additional Information.
    // Child 1
    {
      name: 'form1[0].#subform[7].Pt6Line2a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'LastName1'),
    },
    {
      name: 'form1[0].#subform[7].Pt6Line2b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'FirstName1'),
    },
    {
      name: 'form1[0].#subform[7].Pt6Line2c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'MiddleName1'),
    },
    {
      name: 'form1[0].#subform[7].Pt6Line3_AlienNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'ANumber1'),
    },
    {
      name: 'form1[0].#subform[7].Pt6Line4_DateofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'BirthDate1'),
    },
    {
      name: 'form1[0].#subform[7].Pt6Line6_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'BirthCountry1'),
    },
    {
      name: 'form1[0].#subform[7].Pt6Line6_YesNo[1]',
      type: 'PDFCheckBox',
      checked: true,
    },
    // Child 2
    {
      name: 'form1[0].#subform[7].Pt6Line7a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'LastName2'),
    },
    {
      name: 'form1[0].#subform[7].Pt6Line7b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'FirstName2'),
    },
    {
      name: 'form1[0].#subform[7].Pt6Line7c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'MiddleName2'),
    },
    {
      name: 'form1[0].#subform[7].Pt6Line8_AlienNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'ANumber2'),
    },
    {
      name: 'form1[0].#subform[7].Pt6Line9_DateofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'BirthDate2'),
    },
    {
      name: 'form1[0].#subform[7].Pt6Line10_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'BirthCountry2'),
    },
    {
      name: 'form1[0].#subform[7].Pt6Line11_YesNo[1]',
      type: 'PDFCheckBox',
      checked: true,
    },

    // !! Page 9

    {
      name: 'form1[0].#subform[8].Pt1Line10_AlienNumber[9]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ??
    // Child 3
    {
      name: 'form1[0].#subform[8].Pt6Line12a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'LastName3'),
    },
    {
      name: 'form1[0].#subform[8].Pt6Line12b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'FirstName3'),
    },
    {
      name: 'form1[0].#subform[8].Pt6Line12c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'MiddleName3'),
    },
    {
      name: 'form1[0].#subform[8].Pt6Line13_AlienNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'ANumber3'),
    },
    {
      name: 'form1[0].#subform[8].Pt6Line14_DateofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'BirthDate3'),
    },
    {
      name: 'form1[0].#subform[8].Pt6Line15_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'BirthCountry3'),
    },
    {
      name: 'form1[0].#subform[8].Pt6Line16_YesNo[1]',
      type: 'PDFCheckBox',
      checked: true,
    },

    // ?? Part 7. Biographic Information
    {
      name: 'form1[0].#subform[8].Pt7Line1_Ethnicity[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('23', 'BirthCountry3') === 'Hispanic or Latino',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line1_Ethnicity[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('23', 'BirthCountry3') === 'NOT Hispanic or Latino',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line2_Race[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('24', 'white') === 'White',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line2_Race[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('24', 'asian') === 'Asian',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line2_Race[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('24', 'black') === 'Black or African American',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line2_Race[3]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('24', 'indian') === 'American Indian or Alaska Native',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line2_Race[4]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('24', 'island') === 'Native Hawaiian or Pacific Islander',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line3_HeightFeet[0]',
      type: 'PDFDropdown',
      selected: [getAnswerById('29', 'heightFt')],
    },

    {
      name: 'form1[0].#subform[8].Pt7Line3_HeightInches[0]',
      type: 'PDFDropdown',
      selected: [getAnswerById('29', 'heightInch')],
    },
    {
      name: 'form1[0].#subform[8].Pt7Line4_Weight1[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'weightPounds')[0],
    },
    {
      name: 'form1[0].#subform[8].Pt7Line4_Weight2[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'weightPounds')[1],
    },
    {
      name: 'form1[0].#subform[8].Pt7Line4_Weight3[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'weightPounds')[2],
    },
    {
      name: 'form1[0].#subform[8].Pt7Line5_Eyecolor[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'eyeColor') === 'Black',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line5_Eyecolor[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'eyeColor') === 'Blue',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line5_Eyecolor[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'eyeColor') === 'Brown',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line5_Eyecolor[3]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'eyeColor') === 'Gray',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line5_Eyecolor[4]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'eyeColor') === 'Green',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line5_Eyecolor[5]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'eyeColor') === 'Hazel',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line5_Eyecolor[6]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'eyeColor') === 'Maroon',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line5_Eyecolor[7]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'eyeColor') === 'Pink',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line5_Eyecolor[8]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'eyeColor') === 'Unknown/Other',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line6_Haircolor[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'hairColor') === 'Bald (No hair)',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line6_Haircolor[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'hairColor') === 'Black',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line6_Haircolor[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'hairColor') === 'Blond',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line6_Haircolor[3]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'hairColor') === 'Brown',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line6_Haircolor[4]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'hairColor') === 'Gray',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line6_Haircolor[5]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'hairColor') === 'Red',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line6_Haircolor[6]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'hairColor') === 'Sandy',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line6_Haircolor[7]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'hairColor') === 'White',
    },
    {
      name: 'form1[0].#subform[8].Pt7Line6_Haircolor[8]',
      type: 'PDFCheckBox',
      checked: getAnswerById('27', 'hairColor') === 'Unknown/Other',
    },
    // ?? Part 8. General Eligibility and Inadmissibility Grounds
    {
      name: 'form1[0].#subform[8].Pt8Line1_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('71', 'hasBeenAssociatedWithOrganization') !== 'No',
    },
    {
      name: 'form1[0].#subform[8].Pt8Line1_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('71', 'hasBeenAssociatedWithOrganization') === 'No',
    },
    // Organization 1
    {
      name: 'form1[0].#subform[8].Pt8Line2_OrgName[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'organizationName0'),
    },
    {
      name: 'form1[0].#subform[8].Pt8Line3a_CityTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'city0'),
    },
    {
      name: 'form1[0].#subform[8].Pt8Line3b_State[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'stateOrProvince0'),
    },
    {
      name: 'form1[0].#subform[8].Pt8Line3c_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'orgCountry0'),
    },
    {
      name: 'form1[0].#subform[8].Pt8Line4_Group[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'groupNature0'),
    },
    {
      name: 'form1[0].#subform[8].Pt8Line5a_DateFrom[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'datesMembershipFrom0'),
    },
    {
      name: 'form1[0].#subform[8].Pt8Line5b_DateTo[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'datesMembershipTo0'),
    },
    // Organization 2
    {
      name: 'form1[0].#subform[8].Pt8Line6_OrgName[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'organizationName1'),
    },
    {
      name: 'form1[0].#subform[8].Pt8Line8a_CityTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'city1'),
    },
    {
      name: 'form1[0].#subform[8].Pt8Line7b_State[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'stateOrProvince1'),
    },
    {
      name: 'form1[0].#subform[8].Pt8Line7c_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'orgCountry1'),
    },
    {
      name: 'form1[0].#subform[8].Pt8Line8_Group[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'groupNature1'),
    },
    // !! Page 10

    {
      name: 'form1[0].#subform[9].Pt1Line10_AlienNumber[10]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ?? Part 8. General Eligibility and Inadmissibility Grounds (continued)

    {
      name: 'form1[0].#subform[9].Pt8Line9a_DateFrom[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'datesMembershipFrom1'),
    },
    {
      name: 'form1[0].#subform[9].Pt8Line9b_DateTo[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'datesMembershipTo1'),
    },
    // Org 3
    {
      name: 'form1[0].#subform[9].Pt8Line10_OrgName[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'organizationName2'),
    },
    {
      name: 'form1[0].#subform[9].Pt8Line11a_CityTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'city2'),
    },
    {
      name: 'form1[0].#subform[9].Pt8Line11b_State[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'stateOrProvince2'),
    },
    {
      name: 'form1[0].#subform[9].Pt8Line11c_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'orgCountry2'),
    },
    {
      name: 'form1[0].#subform[9].Pt8Line12_Group[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'groupNature2'),
    },
    {
      name: 'form1[0].#subform[9].Pt8Line13a_DateFrom[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'datesMembershipFrom2'),
    },
    {
      name: 'form1[0].#subform[9].Pt8Line13b_DateTo[0]',
      type: 'PDFTextField',
      value: getAnswerById('72', 'datesMembershipTo2'),
    },

    // ?? CheckBoxes disc
    {
      name: 'form1[0].#subform[9].Pt8Line14_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('73', 'hasBeenDeniedAdmissionToUS') === 'Yes',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line14_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('73', 'hasBeenDeniedAdmissionToUS') === 'No',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line15_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('73', 'hasBeenDeniedVisaToUS') === 'Yes',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line15_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('73', 'hasBeenDeniedVisaToUS') === 'No',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line16_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('73', 'hasWorkedInUSWithoutAuthorization') === 'Yes',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line16_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('73', 'hasWorkedInUSWithoutAuthorization') === 'No',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line17_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('73', 'hasViolatedNonimmigrantStatusTerms') === 'Yes',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line17_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('73', 'hasViolatedNonimmigrantStatusTerms') === 'No',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line18_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('73', 'hasBeenInRemovalProceedings') === 'Yes',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line18_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('73', 'hasBeenInRemovalProceedings') === 'No',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line19_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('73', 'hasBeenIssuedFinalOrderOfRemoval') === 'Yes',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line19_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('73', 'hasBeenIssuedFinalOrderOfRemoval') === 'No',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line20_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('73', 'hasHadFinalOrderReinstated') === 'Yes',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line20_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('73', 'hasHadFinalOrderReinstated') === 'No',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line21_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('73', 'hasHadPermanentResidentStatusRescinded') === 'Yes',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line21_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('73', 'hasHadPermanentResidentStatusRescinded') === 'No',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line22_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('73', 'hasFailedToDepartAfterVoluntaryDeparture') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line22_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('73', 'hasFailedToDepartAfterVoluntaryDeparture') ===
        'No',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line23_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('73', 'hasAppliedForReliefFromRemoval') === 'Yes',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line23_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('73', 'hasAppliedForReliefFromRemoval') === 'No',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line24a_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '73',
          'hasBeenSubjectToTwoYearForeignResidenceRequirement',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line24a_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '73',
          'hasBeenSubjectToTwoYearForeignResidenceRequirement',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line24b_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('73', 'hasCompliedWithForeignResidenceRequirement') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line24b_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('73', 'hasCompliedWithForeignResidenceRequirement') ===
        'No',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line24c_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('73', 'hasBeenGrantedWaiverOrFavorableRecommendation') ===
        'No',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line24c_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('73', 'hasBeenGrantedWaiverOrFavorableRecommendation') ===
        'Yes',
    },
    // ?? Criminal Acts and Violations
    {
      name: 'form1[0].#subform[9].Pt8Line25_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasBeenArrestedOrChargedByLawEnforcement') ===
        'No',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line25_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasBeenArrestedOrChargedByLawEnforcement') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line26_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('75', 'hasCommittedAnyCrime') === 'Yes',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line26_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('75', 'hasCommittedAnyCrime') === 'No',
    },
    // !! Page 11

    {
      name: 'form1[0].#subform[10].Pt1Line10_AlienNumber[11]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ?? Part 8. General Eligibility and Inadmissibility Grounds (continued)
    {
      name: 'form1[0].#subform[10].Pt8Line27_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasPledGuiltyOrBeenConvictedOfCrime') === 'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line27_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasPledGuiltyOrBeenConvictedOfCrime') === 'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line28_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasBeenOrderedPunishedOrHadLibertyRestraints') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line28_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasBeenOrderedPunishedOrHadLibertyRestraints') ===
        'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line29_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasBeenDefendantInCriminalProceeding') === 'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line29_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasBeenDefendantInCriminalProceeding') === 'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line30_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasViolatedControlledSubstanceLaw') === 'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line30_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasViolatedControlledSubstanceLaw') === 'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line31_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '75',
          'hasBeenConvictedOfTwoOrMoreOffensesWithFiveYearsOrMore',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line31_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '75',
          'hasBeenConvictedOfTwoOrMoreOffensesWithFiveYearsOrMore',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line32_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasIllicitlyTraffickedControlledSubstances') ===
        'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line32_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasIllicitlyTraffickedControlledSubstances') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line33_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasAidedInIllicitTraffickingOfNarcotics') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line33_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasAidedInIllicitTraffickingOfNarcotics') === 'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line34_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '75',
          'hasBenefitedFromIllicitTraffickingByFamilyMember',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line34_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '75',
          'hasBenefitedFromIllicitTraffickingByFamilyMember',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line35_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasEngagedInOrIntendsToEngageInProstitution') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line35_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasEngagedInOrIntendsToEngageInProstitution') ===
        'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line36_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasProcuredOrImportedPersonsForProstitution') ===
        'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line36_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasProcuredOrImportedPersonsForProstitution') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line37_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasReceivedProceedsFromProstitution') === 'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line37_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasReceivedProceedsFromProstitution') === 'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line38_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'intendsToEngageInIllegalActivitiesInUS') === 'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line38_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'intendsToEngageInIllegalActivitiesInUS') === 'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line39_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasExercisedImmunityToAvoidProsecutionInUS') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line39_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasExercisedImmunityToAvoidProsecutionInUS') ===
        'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line40_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasViolatedReligiousFreedomsAsForeignOfficial') ===
        'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line40_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasViolatedReligiousFreedomsAsForeignOfficial') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line41_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '75',
          'hasBeenInvolvedInTraffickingForCommercialSexActs',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line41_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '75',
          'hasBeenInvolvedInTraffickingForCommercialSexActs',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line42_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasTraffickedPersonIntoInvoluntaryServitude') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line42_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasTraffickedPersonIntoInvoluntaryServitude') ===
        'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line43_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '75',
          'hasAidedInTraffickingForCommercialSexOrInvoluntaryServitude',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line43_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '75',
          'hasAidedInTraffickingForCommercialSexOrInvoluntaryServitude',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line44_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '75',
          'hasReceivedBenefitsFromTraffickingByFamilyMember',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line44_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '75',
          'hasReceivedBenefitsFromTraffickingByFamilyMember',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line45_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasEngagedInOrAidedMoneyLaundering') === 'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line45_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('75', 'hasEngagedInOrAidedMoneyLaundering') === 'Yes',
    },
    // !! Page 12

    {
      name: 'form1[0].#subform[11].Pt1Line10_AlienNumber[12]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ?? Security and Related
    {
      name: 'form1[0].#subform[11].Pt8Line46a_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'hasEngagedInEspionageOrSabotage') === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line46a_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'hasEngagedInEspionageOrSabotage') === 'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line46b_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasEngagedInExportControlViolations') === 'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line46b_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasEngagedInExportControlViolations') === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line46c_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasEngagedInActivityOpposingUSGovernment') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line46c_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasEngagedInActivityOpposingUSGovernment') ===
        'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line46d_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '76',
          'hasEngagedInActivityEndangeringUSWelfareSafetySecurity',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line46d_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '76',
          'hasEngagedInActivityEndangeringUSWelfareSafetySecurity',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line46e_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasEngagedInOtherUnlawfulActivity') === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line46e_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasEngagedInOtherUnlawfulActivity') === 'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line47_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '76',
          'intendsToEngageInActivityWithAdverseForeignPolicyConsequences',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line47_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '76',
          'intendsToEngageInActivityWithAdverseForeignPolicyConsequences',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line48a_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasCommittedOrAttemptedSeriousCrimes') === 'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line48a_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasCommittedOrAttemptedSeriousCrimes') === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line48b_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasParticipatedInGroupEngagedInSeriousCrimes') ===
        'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line48b_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasParticipatedInGroupEngagedInSeriousCrimes') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line48c_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasRecruitedForGroupEngagedInSeriousCrimes') ===
        'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line48c_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasRecruitedForGroupEngagedInSeriousCrimes') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line48d_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasProvidedSupportForSeriousCrimes') === 'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line48d_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasProvidedSupportForSeriousCrimes') === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line48e_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '76',
          'hasProvidedSupportToIndividualsOrGroupsInvolvedInSeriousCrimes',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line48e_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '76',
          'hasProvidedSupportToIndividualsOrGroupsInvolvedInSeriousCrimes',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line49_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '76',
          'hasReceivedMilitaryParamilitaryOrWeaponsTraining',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line49_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '76',
          'hasReceivedMilitaryParamilitaryOrWeaponsTraining',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line50_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '76',
          'intendsToEngageInActivitiesListedInItems48aTo49',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line50_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '76',
          'intendsToEngageInActivitiesListedInItems48aTo49',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line51a_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'terrorismRelatedActivities51A') === 'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line51a_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'terrorismRelatedActivities51A') === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line51b_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'groupParticipation51B') === 'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line51b_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'groupParticipation51B') === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line51c_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'recruitmentForGroup51C') === 'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line51c_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'recruitmentForGroup51C') === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line51d_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'supportForActivities51D') === 'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line51d_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'supportForActivities51D') === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line51e_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'assistanceToIndividuals51E') === 'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line51e_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'assistanceToIndividuals51E') === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line51f_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'militaryTraining51F') === 'Yes',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line51f_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'militaryTraining51F') === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line52_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '76',
          'hasAssistedInWeaponSaleOrTransportUsedAgainstOthers',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[11].Pt8Line52_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '76',
          'hasAssistedInWeaponSaleOrTransportUsedAgainstOthers',
        ) === 'Yes',
    },

    // !! Page 13

    {
      name: 'form1[0].#subform[12].Pt1Line10_AlienNumber[13]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ??
    {
      name: 'form1[0].#subform[12].Pt8Line53_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'hasWorkedInDetentionFacility') === 'Yes',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line53_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'hasWorkedInDetentionFacility') === 'No',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line54_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'hasBeenMemberOfGroupUsingWeapons') === 'No',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line54_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasBeenMemberOfGroupUsingWeapons') === 'Yes',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line55_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'hasServedInArmedGroup') === 'Yes',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line55_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'hasServedInArmedGroup') === 'No',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line56_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '76',
          'hasBeenAffiliatedWithCommunistOrTotalitarianParty',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line56_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '76',
          'hasBeenAffiliatedWithCommunistOrTotalitarianParty',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line57_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasParticipatedInPersecutionDuringNaziEra') ===
        'No',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line57_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasParticipatedInPersecutionDuringNaziEra') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line58a_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasParticipatedInTortureOrGenocide') === 'Yes',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line58a_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasParticipatedInTortureOrGenocide') === 'No',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line58b_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasBeenInvolvedInKillingAnyPerson') === 'No',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line58b_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasBeenInvolvedInKillingAnyPerson') === 'Yes',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line58c_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasBeenInvolvedInSevereInjuryToAnyPerson') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line58c_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasBeenInvolvedInSevereInjuryToAnyPerson') ===
        'No',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line58d_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasEngagedInNonConsensualSexualContact') === 'Yes',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line58d_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasEngagedInNonConsensualSexualContact') === 'No',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line58e_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasLimitedOrDeniedReligiousBeliefs') === 'No',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line58e_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasLimitedOrDeniedReligiousBeliefs') === 'Yes',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line59_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasRecruitedOrUsedMinorsInArmedForces') === 'No',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line59_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'hasRecruitedOrUsedMinorsInArmedForces') === 'Yes',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line60_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'hasUsedMinorsInHostilities') === 'Yes',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line60_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('76', 'hasUsedMinorsInHostilities') === 'No',
    },

    // ?? Public Charge
    {
      name: 'form1[0].#subform[12].Pt8Line61_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'isSubjectToPublicChargeInadmissibility') === 'No',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line61_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('76', 'isSubjectToPublicChargeInadmissibility') === 'Yes',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line62_FamilyStatus[0]',
      type: 'PDFTextField',
      value: getAnswerById('67', 'immigrantTotalHouseholdSize'),
    },
    {
      name: 'form1[0].#subform[12].Pt8Line63_CB[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('67', 'yourAnnualIncome') === '$0-27000',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line63_CB[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('67', 'yourAnnualIncome') === '$27001-52000',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line63_CB[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('67', 'yourAnnualIncome') === '$52001-85000',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line63_CB[3]',
      type: 'PDFCheckBox',
      checked: getAnswerById('67', 'yourAnnualIncome') === '$85001-14100',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line63_CB[4]',
      type: 'PDFCheckBox',
      checked: getAnswerById('67', 'yourAnnualIncome') === 'Over $141000',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line64_CB[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('67', 'totalValueOfAssets') === '$0-18400',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line64_CB[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('67', 'totalValueOfAssets') === '$18401-136000',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line64_CB[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('67', 'totalValueOfAssets') === '$136001-321400',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line64_CB[3]',
      type: 'PDFCheckBox',
      checked: getAnswerById('67', 'totalValueOfAssets') === '$136001-321400',
    },
    {
      name: 'form1[0].#subform[12].Pt8Line64_CB[4]',
      type: 'PDFCheckBox',
      checked: getAnswerById('67', 'totalValueOfAssets') === 'Over $707100',
    },

    // !! Page 14

    {
      name: 'form1[0].#subform[13].Pt1Line10_AlienNumber[14]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ?? General Eligibility and Inadmissibility Grounds (continued)
    {
      name: 'form1[0].#subform[13].Pt8Line65_CB[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('67', 'totalValueLiabilities') === '$0',
    },
    {
      name: 'form1[0].#subform[13].Pt8Line65_CB[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('67', 'totalValueLiabilities') === '$1-10100',
    },
    {
      name: 'form1[0].#subform[13].Pt8Line65_CB[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('67', 'totalValueLiabilities') === '$10101-57700',
    },
    {
      name: 'form1[0].#subform[13].Pt8Line65_CB[3]',
      type: 'PDFCheckBox',
      checked: getAnswerById('67', 'totalValueLiabilities') === '$57701-186800',
    },
    {
      name: 'form1[0].#subform[13].Pt8Line65_CB[4]',
      type: 'PDFCheckBox',
      checked: getAnswerById('67', 'totalValueLiabilities') === 'Over $186800',
    },
    //
    {
      name: 'form1[0].#subform[13].Pt8Line66_CB[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('78', 'highestDegreeOrLevelCompleted') ===
        'Grades 1 through 11',
    },
    {
      name: 'form1[0].#subform[13].Pt8Line66_CB[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('78', 'highestDegreeOrLevelCompleted') ===
        '12th grade - no diploma',
    },
    {
      name: 'form1[0].#subform[13].Pt8Line66_CB[2]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('78', 'highestDegreeOrLevelCompleted') ===
        "Associate's degree",
    },
    {
      name: 'form1[0].#subform[13].Pt8Line66_CB[3]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('78', 'highestDegreeOrLevelCompleted') ===
        "Bachelor's degree",
    },
    {
      name: 'form1[0].#subform[13].Pt8Line66_CB[4]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('78', 'highestDegreeOrLevelCompleted') ===
        "Master's degree",
    },
    {
      name: 'form1[0].#subform[13].Pt8Line66_CB[5]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('78', 'highestDegreeOrLevelCompleted') ===
        '1 or more years of college credit- no degree',
    },
    {
      name: 'form1[0].#subform[13].Pt8Line66_CB[6]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('78', 'highestDegreeOrLevelCompleted') ===
        'High school diploma or GED or alternative credential',
    },
    {
      name: 'form1[0].#subform[13].Pt8Line66_CB[7]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('78', 'highestDegreeOrLevelCompleted') ===
        'Professional degree (JD/ MD/ DMD/ etc.)',
    },
    {
      name: 'form1[0].#subform[13].Pt8Line66_CB[8]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('78', 'highestDegreeOrLevelCompleted') ===
        'Doctorate degree',
    },
    //
    {
      name: 'form1[0].#subform[13].TextField1[0]',
      type: 'PDFTextField',
      value: getAnswerById('78', 'certificationsLicensesSkills'),
    },
    //
    // {
    //   name: 'form1[0].#subform[13].Pt8Line68a_YesNo[1]',
    //   type: 'PDFCheckBox',
    //   checked: getAnswerById('67', 'totalValueOfAssets') === 'Yes',
    // },
    // {
    //   name: 'form1[0].#subform[13].Pt8Line68a_YesNo[0]',
    //   type: 'PDFCheckBox',
    //   checked: getAnswerById('67', 'totalValueOfAssets') === 'No',
    // },
    // {
    //   name: 'form1[0].#subform[13].Pt8Line68b_YesNo[1]',
    //   type: 'PDFCheckBox',
    //   checked: getAnswerById('67', 'totalValueOfAssets') === 'Yes',
    // },
    // {
    //   name: 'form1[0].#subform[13].Pt8Line68b_YesNo[0]',
    //   type: 'PDFCheckBox',
    //   checked: getAnswerById('67', 'totalValueOfAssets') === 'No',
    // },
    // !! Page 15

    {
      name: 'form1[0].#subform[14].Pt1Line10_AlienNumber[15]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ?? Illegal Entries and Other Immigration Violations
    {
      name: 'form1[0].#subform[14].Pt8Line69a_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '74',
          'hasFailedToAttendOrRemainInRemovalProceedingSinceApril1997',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line69a_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '74',
          'hasFailedToAttendOrRemainInRemovalProceedingSinceApril1997',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line69b_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '74',
          'hadReasonableCauseForFailureToAttendRemovalProceeding',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line69b_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '74',
          'hadReasonableCauseForFailureToAttendRemovalProceeding',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line70_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '74',
          'hasSubmittedFraudulentDocumentationForImmigrationBenefit',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line70_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '74',
          'hasSubmittedFraudulentDocumentationForImmigrationBenefit',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line71_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '74',
          'hasLiedOrConcealedInformationForImmigrationBenefit',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line71_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '74',
          'hasLiedOrConcealedInformationForImmigrationBenefit',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line72_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('74', 'hasViolatedNonimmigrantStatusTerms') === 'No',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line72_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('74', 'hasViolatedNonimmigrantStatusTerms') === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line73_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('74', 'hasBeenStowawayInUS') === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line73_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('74', 'hasBeenStowawayInUS') === 'No',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line74_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('74', 'hasEngagedInAlienSmuggling') === 'No',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line74_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('74', 'hasEngagedInAlienSmuggling') === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line75_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('74', 'isUnderFinalOrderForINAViolation') === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line75_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('74', 'isUnderFinalOrderForINAViolation') === 'No',
    },
    // ??

    {
      name: 'form1[0].#subform[14].Pt8Line76_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('74', 'hasBeenExcludedOrDeportedFromUS') === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line76_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('74', 'hasBeenExcludedOrDeportedFromUS') === 'No',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line77_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('74', 'hasEnteredUSWithoutInspection') === 'No',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line77_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('74', 'hasEnteredUSWithoutInspection') === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line78a_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '74',
          'hasBeenUnlawfullyPresentInUSForMoreThan180Days',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line78a_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '74',
          'hasBeenUnlawfullyPresentInUSForMoreThan180Days',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line78b_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('74', 'hasBeenUnlawfullyPresentInUSForOneYearOrMore') ===
        'No',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line78b_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('74', 'hasBeenUnlawfullyPresentInUSForOneYearOrMore') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line79a_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '74',
          'hasReenteredWithoutInspectionAfterUnlawfulPresence',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line79a_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '74',
          'hasReenteredWithoutInspectionAfterUnlawfulPresence',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line79b_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('74', 'hasBeenGrantedWaiverOrFavorableRecommendation') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line79b_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('74', 'hasBeenGrantedWaiverOrFavorableRecommendation') ===
        'No',
    },
    // ??
    {
      name: 'form1[0].#subform[14].Pt8Line80_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('77', 'plansToPracticePolygamyInUS') === 'No',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line80_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('77', 'plansToPracticePolygamyInUS') === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line81_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '77',
          'accompanyingInadmissibleForeignNationalRequiringProtection',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line81_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '77',
          'accompanyingInadmissibleForeignNationalRequiringProtection',
        ) === 'No',
    },

    {
      name: 'form1[0].#subform[14].Pt8Line82_YesNo[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('77', 'hasVotedInViolationOfUSLaws') === 'No',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line82_YesNo[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('77', 'hasVotedInViolationOfUSLaws') === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line83_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('77', 'hasRenouncedUSCitizenshipToAvoidTaxes') === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line83_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('77', 'hasRenouncedUSCitizenshipToAvoidTaxes') === 'No',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line84_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '77',
          'hasAppliedForExemptionFromUSArmedForcesAsForeignNational',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line84_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '77',
          'hasAppliedForExemptionFromUSArmedForcesAsForeignNational',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line85a_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('77', 'hasAssistedInDetainingUSCitizenChild') === 'Yes',
    },
    {
      name: 'form1[0].#subform[14].Pt8Line85a_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('77', 'hasAssistedInDetainingUSCitizenChild') === 'No',
    },
    // !! Page 16

    {
      name: 'form1[0].#subform[15].Pt1Line10_AlienNumber[16]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ?? Illegal Entries and Other Immigration Violations
    {
      name: 'form1[0].#subform[15].Pt8Line85b_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '77',
          'hasBeenRelievedOrDischargedFromUSTrainingAsForeignNational',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[15].Pt8Line85b_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '77',
          'hasBeenRelievedOrDischargedFromUSTrainingAsForeignNational',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[15].Pt8Line85c_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '77',
          'hasBeenRelievedOrDischargedFromUSTrainingAsForeignNational',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[15].Pt8Line85c_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '77',
          'hasBeenRelievedOrDischargedFromUSTrainingAsForeignNational',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[15].Pt8Line86a_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('77', 'hasLeftToAvoidUSArmedForcesService') === 'Yes',
    },
    {
      name: 'form1[0].#subform[15].Pt8Line86a_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('77', 'hasLeftToAvoidUSArmedForcesService') === 'No',
    },
    {
      name: 'form1[0].#subform[15].Pt8Line86b_Nationality[0]',
      type: 'PDFTextField',
      value: getAnswerById('77', 'nationalityOrImmigrationStatusBeforeLeaving'),
    },
    // ??
    {
      name: 'form1[0].#subform[15].Pt9Line1_YesNo[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('79', 'isRequestingAccommodationForDisabilities') ===
        'Yes',
    },
    {
      name: 'form1[0].#subform[15].Pt9Line1_YesNo[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('79', 'isRequestingAccommodationForDisabilities') ===
        'No',
    },
    {
      name: 'form1[0].#subform[15].Pt9Line2a_Deaf[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('79', 'isDeafOrHardOfHearing') === 'Yes',
    },
    {
      name: 'form1[0].#subform[15].Pt9Line2a_Accommodation[0]',
      type: 'PDFTextField',
      value: getAnswerById('79', 'requestedAccommodation'),
    },
    {
      name: 'form1[0].#subform[15].Pt9Line2b_Blind[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('79', 'isBlindOrHasLowVision') === 'Yes',
    },
    {
      name: 'form1[0].#subform[15].Pt9Line2b_Accommodation[0]',
      type: 'PDFTextField',
      value: getAnswerById('79', 'requestedAccommodationForVision'),
    },
    {
      name: 'form1[0].#subform[15].Pt9Line2c_Other[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('79', 'hasOtherDisabilityOrImpairment') === 'Yes',
    },
    {
      name: 'form1[0].#subform[15].Pt9Line2c_Accommodation[0]',
      type: 'PDFTextField',
      value: getAnswerById('79', 'disabilityAccommodationRequest'),
    },
    // ?? Applicant's Statement
    {
      name: 'form1[0].#subform[15].Pt10Line1_English[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'readNUnderstandEnglish') === 'Yes',
    },
    {
      name: 'form1[0].#subform[15].Pt10Line1_English[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Interpreter' ||
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Both',
    },
    {
      name: 'form1[0].#subform[15].Pt10Line1b_Language[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Interpreter' ||
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Both'
          ? getAnswerById('69', 'interpreterLanguageTranslated')
          : '',
    },
    {
      name: 'form1[0].#subform[15].Pt10Line2_PreparerCB[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Preparer' ||
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Both',
    },
    {
      name: 'form1[0].#subform[15].Pt10Line2_Preparer[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Preparer' ||
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Both'
          ? `${getAnswerById('69', 'preparerLastName')} ${getAnswerById('69', 'preparerFirstName')}`
          : '',
    },
    // ?? Applicant's Contact Information
    {
      name: 'form1[0].#subform[15].Pt10Line3_DaytimePhone[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'daytimeTelephone'),
    },
    {
      name: 'form1[0].#subform[15].Pt10Line4_MobilePhone[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'mobileTelephone'),
    },
    {
      name: 'form1[0].#subform[15].Pt10Line5_Email[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'emailAddress'),
    },

    // !! Page 17

    {
      name: 'form1[0].#subform[16].Pt1Line10_AlienNumber[17]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },

    // ?? Interpreter's Full Name
    {
      name: 'form1[0].#subform[16].Pt11Line1a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterLastName'),
    },
    {
      name: 'form1[0].#subform[16].Pt11Line1b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterFirstName'),
    },
    {
      name: 'form1[0].#subform[16].Pt11Line2_OrgName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterBusinessName'),
    },
    // ?? Interpreter's Mailing Address
    {
      name: 'form1[0].#subform[16].Pt11Line3_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterStreetN'),
    },
    {
      name: 'form1[0].#subform[16].Pt11Line3_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'interpreterAptSteFlr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[16].Pt11Line3_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'interpreterAptSteFlr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[16].Pt11Line3_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'interpreterAptSteFlr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[16].Pt11Line3_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterAptSteFlrN'),
    },
    {
      name: 'form1[0].#subform[16].Pt11Line3_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterCity'),
    },
    {
      name: 'form1[0].#subform[16].Pt11Line3_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('69', 'interpreterStates')]],
    },
    {
      name: 'form1[0].#subform[16].Pt11Line3_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterZipCode'),
    },
    {
      name: 'form1[0].#subform[16].Pt11Line3_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterProvince'),
    },
    {
      name: 'form1[0].#subform[16].Pt11Line3_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterPostalCode'),
    },
    {
      name: 'form1[0].#subform[16].Pt11Line3_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterCountry'),
    },
    // ?? Interpreter's Contact Information
    {
      name: 'form1[0].#subform[16].Pt11Line4_DayPhone[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterDaytimeTelephoneN'),
    },
    {
      name: 'form1[0].#subform[16].Pt11Line5_MobilePhone[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterMobileTelephoneN'),
    },
    {
      name: 'form1[0].#subform[16].Pt11Line6_Email[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterEmailAddress'),
    },

    // !! Page 18

    {
      name: 'form1[0].#subform[17].Pt1Line10_AlienNumber[18]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },

    // ?? Interpreter's Certification
    {
      name: 'form1[0].#subform[17].Part11_NameofLanguage[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterLanguageTranslated'),
    },
    // ?? Preparer's Full Name
    {
      name: 'form1[0].#subform[17].Pt12Line1a_PreparerFamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerLastName'),
    },
    {
      name: 'form1[0].#subform[17].Pt12Line1b_PreparerGivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerFirstName'),
    },
    {
      name: 'form1[0].#subform[17].Pt12Line2_BusinessName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerBusinessName'),
    },
    // ??  Preparer's Mailing Address
    {
      name: 'form1[0].#subform[17].Pt12Line3_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerStreetN'),
    },
    {
      name: 'form1[0].#subform[17].Pt12Line3_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'preparerAptSteFlr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[17].Pt12Line3_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'preparerAptSteFlr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[17].Pt12Line3_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'preparerAptSteFlr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[17].Pt12Line3_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerAptSteFlrN'),
    },
    {
      name: 'form1[0].#subform[17].Pt12Line3_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerCity'),
    },
    {
      name: 'form1[0].#subform[17].Pt12Line3_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('69', 'preparerStates')]],
    },
    {
      name: 'form1[0].#subform[17].Pt12Line3_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerZipCode'),
    },
    {
      name: 'form1[0].#subform[17].Pt12Line3_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerProvince'),
    },
    {
      name: 'form1[0].#subform[17].Pt12Line3_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerPostalCode'),
    },
    {
      name: 'form1[0].#subform[17].Pt12Line3_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerCountry'),
    },
    // ??  Preparer's Contact Information
    {
      name: 'form1[0].#subform[17].Pt12Line4_DaytimePhoneNumber1[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerDaytimeTelephoneN'),
    },
    {
      name: 'form1[0].#subform[17].Pt12Line5_MobileNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerMobileTelephoneN'),
    },
    {
      name: 'form1[0].#subform[17].Pt12Line6_Email[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerEmailAddress'),
    },
    {
      name: 'form1[0].#subform[17].Part12Line7_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'ssPreparerAttorneyRepresentative') === 'No',
    },
    {
      name: 'form1[0].#subform[17].Part12Line7_Checkbox[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'ssPreparerAttorneyRepresentative') === 'Yes',
    },
    {
      name: 'form1[0].#subform[17].Part12Line7b_Extend[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'ssPreparerAttorneyRepresentative') === 'Yes'
          ? getAnswerById('69', 'attorneyRepresentationExtendBeyond') ===
            'Extends beyond just forms'
          : false,
    },
    {
      name: 'form1[0].#subform[17].Part12Line7b_NotExtend[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'ssPreparerAttorneyRepresentative') === 'Yes'
          ? getAnswerById('69', 'attorneyRepresentationExtendBeyond') ===
            'Limited to forms'
          : false,
    },
    // !! Page 19

    {
      name: 'form1[0].#subform[18].Pt1Line10_AlienNumber[19]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // !! Page 20

    {
      name: 'form1[0].#subform[19].Pt1Line10_AlienNumber[21]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    // ??
    {
      name: 'form1[0].#subform[19].Pt1Line1a_FamilyName[1]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'lastName'),
    },
    {
      name: 'form1[0].#subform[19].Pt1Line1b_GivenName[1]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'firstName'),
    },
    {
      name: 'form1[0].#subform[19].Pt1Line1c_MiddleName[1]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'middleName'),
    },
    {
      name: 'form1[0].#subform[19].Pt1Line10_AlienNumber[20]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
  ];
};

export { useI485Fields };
