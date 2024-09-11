import { getAllUsersInfo, getAllUserAnswers } from '@/shared/firebase/services';
import { DocumentData } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { getAnswerFromArray } from '../utils/getAnswerFromArray';
import { getUserAnswerById } from '../utils/getUserAnswerById';
import { IPDFField } from '../types/IPDFField';
import { usStates } from './codesState';

const useI765Fields = (): IPDFField[] => {
  const [allUserAnswers, setUserAnswers] = useState<DocumentData | never[]>([]);
  const { pathname } = useLocation();

  const getAnswerById = (answerId: string, key: string = '') => {
    return (
      getAnswerFromArray(getUserAnswerById(allUserAnswers, answerId), key) ?? ''
    );
  };

  const hasDifferentMailingAddress = getAnswerById('30', 'haveMailing');

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

    // ?? Part 1. Reason for Applying
    {
      name: 'form1[0].Page1[0].Part1_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: true,
    },

    // ?? Part 2. Information About You
    {
      name: 'form1[0].Page1[0].Line1a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'lastName'),
    },
    {
      name: 'form1[0].Page1[0].Line1b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'firstName'),
    },
    {
      name: 'form1[0].Page1[0].Line1c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'middleName'),
    },
    //
    {
      name: 'form1[0].Page1[0].Line2a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'familyName1'),
    },
    {
      name: 'form1[0].Page1[0].Line2b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'givenName1'),
    },
    {
      name: 'form1[0].Page1[0].Line2c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'middleName1'),
    },
    //
    {
      name: 'form1[0].Page1[0].Line3a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'familyName3'),
    },
    {
      name: 'form1[0].Page1[0].Line3b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'givenName3'),
    },
    {
      name: 'form1[0].Page1[0].Line3c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'middleName3'),
    },
    //
    {
      name: 'form1[0].Page1[0].Line3a_FamilyName[1]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'familyName2'),
    },
    {
      name: 'form1[0].Page1[0].Line3b_GivenName[1]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'givenName2'),
    },
    {
      name: 'form1[0].Page1[0].Line3c_MiddleName[1]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'middleName2'),
    },
    // !! Page 2

    // ?? Part 2. Information About You (continued)
    // * Your U.S. Mailing Address
    {
      name: 'form1[0].Page2[0].Line4a_InCareofName[0]',
      type: 'PDFTextField',
      value: getAnswerById('31', 'careName'),
    },
    {
      name: 'form1[0].Page2[0].Line4b_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('31', 'street'),
    },
    {
      name: 'form1[0].Page2[0].Pt2Line5_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('31', 'Apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].Page2[0].Pt2Line5_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('31', 'Apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].Page2[0].Pt2Line5_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('31', 'Apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].Page2[0].Pt2Line5_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('31', 'apt/Ste/FlrNum'),
    },
    {
      name: 'form1[0].Page2[0].Pt2Line5_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('31', 'cityOrTown'),
    },
    {
      name: 'form1[0].Page2[0].Pt2Line5_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('31', 'states')]],
    },
    {
      name: 'form1[0].Page2[0].Pt2Line5_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('31', 'ZIPCode'),
    },
    {
      name: 'form1[0].Page2[0].Part2Line5_Checkbox[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('30', 'haveMailing') === 'Yes',
    },
    {
      name: 'form1[0].Page2[0].Part2Line5_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('30', 'haveMailing') === 'No',
    },

    // ?? U.S. Physical Address
    {
      name: 'form1[0].Page2[0].Pt2Line7_StreetNumberName[0]',
      type: 'PDFTextField',
      value:
        hasDifferentMailingAddress === 'Yes'
          ? getAnswerById('42', 'streetNumber')
          : '',
    },
    {
      name: 'form1[0].Page2[0].Pt2Line7_Unit[0]',
      type: 'PDFCheckBox',
      checked:
        hasDifferentMailingAddress === 'Yes'
          ? getAnswerById('42', 'apt/Ste/Flr') === 'Apt'
          : false,
    },
    {
      name: 'form1[0].Page2[0].Pt2Line7_Unit[1]',
      type: 'PDFCheckBox',
      checked:
        hasDifferentMailingAddress === 'Yes'
          ? getAnswerById('42', 'apt/Ste/Flr') === 'Ste'
          : false,
    },
    {
      name: 'form1[0].Page2[0].Pt2Line7_Unit[2]',
      type: 'PDFCheckBox',
      checked:
        hasDifferentMailingAddress === 'Yes'
          ? getAnswerById('42', 'apt/Ste/Flr') === 'Flr'
          : false,
    },
    {
      name: 'form1[0].Page2[0].Pt2Line7_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value:
        hasDifferentMailingAddress === 'Yes'
          ? getAnswerById('42', 'apt/Ste/FlrN')
          : '',
    },
    {
      name: 'form1[0].Page2[0].Pt2Line7_CityOrTown[0]',
      type: 'PDFTextField',
      value:
        hasDifferentMailingAddress === 'Yes' ? getAnswerById('42', 'city') : '',
    },
    {
      name: 'form1[0].Page2[0].Pt2Line7_State[0]',
      type: 'PDFDropdown',
      selected:
        hasDifferentMailingAddress === 'Yes'
          ? [usStates[getAnswerById('42', 'state')]]
          : [' '],
    },
    {
      name: 'form1[0].Page2[0].Pt2Line7_ZipCode[0]',
      type: 'PDFTextField',
      value:
        hasDifferentMailingAddress === 'Yes'
          ? getAnswerById('42', 'zipCode')
          : '',
    },

    // ?? Other Information
    {
      name: 'form1[0].Page2[0].Line7_AlienNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    {
      name: 'form1[0].Page2[0].Line8_ElisAccountNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'uscisNumber'),
    },
    {
      name: 'form1[0].Page2[0].Line9_Checkbox[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('21', 'sex') === 'Male',
    },
    {
      name: 'form1[0].Page2[0].Line9_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('21', 'sex') === 'Female',
    },
    {
      name: 'form1[0].Page2[0].Line10_Checkbox[3]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].Page2[0].Line19_Checkbox[1]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].Page2[0].Line19_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].Page2[0].Line12a_Checkbox[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('68', 'socialSecurityAdministration') === 'Yes',
    },
    {
      name: 'form1[0].Page2[0].Line12a_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('68', 'socialSecurityAdministration') === 'No',
    },
    {
      name: 'form1[0].Page2[0].Line12b_SSN[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('68', 'socialSecurityAdministration') === 'Yes'
          ? getAnswerById('68', 'provideSecurityNumber')
          : '',
    },
    {
      name: 'form1[0].Page2[0].Line13_Checkbox[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('68', 'socialSecurityCard') === 'Yes',
    },
    {
      name: 'form1[0].Page2[0].Line13_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('68', 'socialSecurityCard') === 'No',
    },
    {
      name: 'form1[0].Page2[0].Line14_Checkbox_No[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].Page2[0].Line14_Checkbox_Yes[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('68', 'socialSecurityCard') === 'Yes',
    },

    // ?? Father's Name
    {
      name: 'form1[0].Page2[0].Line15a_FamilyName[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('68', 'socialSecurityCard') === 'Yes'
          ? getAnswerById('40', 'lastName')
          : '',
    },
    {
      name: 'form1[0].Page2[0].Line15b_GivenName[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('68', 'socialSecurityCard') === 'Yes'
          ? getAnswerById('40', 'firstName')
          : '',
    },
    // ?? Mother's Name
    {
      name: 'form1[0].Page2[0].Line16a_FamilyName[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('68', 'socialSecurityCard') === 'Yes'
          ? getAnswerById('38', 'lastName')
          : '',
    },
    {
      name: 'form1[0].Page2[0].Line16b_GivenName[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('68', 'socialSecurityCard') === 'Yes'
          ? getAnswerById('38', 'firstName')
          : '',
    },
    // ?? Your Country or Countries of Citizenship or Nationality
    {
      name: 'form1[0].Page2[0].Line17a_CountryOfBirth[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('68', 'socialSecurityCard') === 'Yes'
          ? getAnswerById('22', 'countryBirthFirst')
          : '',
    },
    {
      name: 'form1[0].Page2[0].Line17b_CountryOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('22', 'countryBirthSecondary'),
    },

    // !! Page 3
    // ?? Place of Birth
    {
      name: 'form1[0].Page3[0].Line18a_CityTownOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'birthCity'),
    },
    {
      name: 'form1[0].Page3[0].Line18b_CityTownOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'stateBirth'),
    },
    {
      name: 'form1[0].Page3[0].Line18c_CountryOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'countryBirth'),
    },
    {
      name: 'form1[0].Page3[0].Line19_DOB[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'birthDate'),
    },

    // ?? Information About Your Last Arrival in the United States
    {
      name: 'form1[0].Page3[0].Line20a_I94Number[0]',
      type: 'PDFTextField',
      value: getAnswerById('54', 'formI94Number'),
    },
    {
      name: 'form1[0].Page3[0].Line20b_Passport[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'passportNumber'),
    },
    {
      name: 'form1[0].Page3[0].Line20c_TravelDoc[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'travelDocumentNumber'),
    },
    {
      name: 'form1[0].Page3[0].Line20d_CountryOfIssuance[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'issuingCountry'),
    },
    {
      name: 'form1[0].Page3[0].Line20e_ExpDate[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'expOfPassportTravelDocument'),
    },
    {
      name: 'form1[0].Page3[0].Line21_DateOfLastEntry[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'lastArrivalUS'),
    },
    {
      name: 'form1[0].Page3[0].place_entry[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'lastArrivalUSCity'),
    },
    {
      name: 'form1[0].Page3[0].Line23_StatusLastEntry[0]',
      type: 'PDFTextField',
      value: getAnswerById('54', 'formStatusI94'),
    },
    {
      name: 'form1[0].Page3[0].Line24_CurrentStatus[0]',
      type: 'PDFTextField',
      value: getAnswerById('54', 'currentImmigrationStatus'),
    },
    {
      name: 'form1[0].Page3[0].Line26_SEVISnumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    // ?? Information About Your Eligibility Category
    {
      name: 'form1[0].Page3[0].#area[1].section_1[0]',
      type: 'PDFTextField',
      value: 'c',
    },
    {
      name: 'form1[0].Page3[0].#area[1].section_2[0]',
      type: 'PDFTextField',
      value: '9',
    },
    {
      name: 'form1[0].Page3[0].#area[1].section_3[0]',
      type: 'PDFTextField',
      value: 'i',
    },
    {
      name: 'form1[0].Page3[0].Line27a_Degree[0]',
      type: 'PDFTextField',
      value: getAnswerById('78', 'highestDegreeOrLevelCompleted'),
    },
    {
      name: 'form1[0].Page3[0].Line27b_Everify[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].Page3[0].Line27c_EverifyIDNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].Page3[0].Line28_ReceiptNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].Page3[0].PtLine29_YesNo[1]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].Page3[0].Line18a_Receipt[0].Line30a_ReceiptNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].Page3[0].PtLine30b_YesNo[1]',
      type: 'PDFCheckBox',
      checked: true,
    },

    // !! Page 4

    // ?? Part 3. Applicant's Statement, Contact Information, Declaration, Certification, and Signature
    // Applicant's Statement
    {
      name: 'form1[0].Page4[0].Pt3Line1Checkbox[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'readNUnderstandEnglish') === 'Yes',
    },
    {
      name: 'form1[0].Page4[0].Pt3Line1Checkbox[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Interpreter' ||
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Both',
    },
    {
      name: 'form1[0].Page4[0].Pt3Line1b_Language[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Interpreter' ||
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Both'
          ? getAnswerById('69', 'interpreterLanguageTranslated')
          : '',
    },
    {
      name: 'form1[0].Page4[0].Part3_Checkbox[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Preparer' ||
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Both',
    },
    {
      name: 'form1[0].Page4[0].Pt3Line2_RepresentativeName[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Preparer' ||
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Both'
          ? getAnswerById('69', 'preparerFirstName')
          : '',
    },

    // ?? Applicant's Contact Information
    {
      name: 'form1[0].Page4[0].Pt3Line3_DaytimePhoneNumber1[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'daytimeTelephone'),
    },
    {
      name: 'form1[0].Page4[0].Pt3Line4_MobileNumber1[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'mobileTelephone'),
    },
    {
      name: 'form1[0].Page4[0].Pt3Line5_Email[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'emailAddress'),
    },
    {
      name: 'form1[0].Page4[0].Pt4Line6_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('23') === 'Hispanic or Latino',
    },

    // ?? Interpreter's Full Name
    {
      name: 'form1[0].Page4[0].Pt4Line1a_InterpreterFamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterLastName'),
    },
    {
      name: 'form1[0].Page4[0].Pt4Line1b_InterpreterGivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterFirstName'),
    },
    {
      name: 'form1[0].Page4[0].Pt4Line2_InterpreterBusinessorOrg[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterBusinessName'),
    },

    // !! Page 5

    // ?? Preparer's Full Name
    {
      name: 'form1[0].Page5[0].Pt5Line1a_PreparerFamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerLastName'),
    },
    {
      name: 'form1[0].Page5[0].Pt5Line1b_PreparerGivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerFirstName'),
    },
    {
      name: 'form1[0].Page5[0].Pt5Line2_BusinessName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerBusinessName'),
    },
    // ?? Preparer's Mailing Address
    {
      name: 'form1[0].Page5[0].Pt6Line3a_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerStreetN'),
    },
    {
      name: 'form1[0].Page5[0].Pt6Line3b_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'preparerAptSteFlr') === 'Apt',
    },
    {
      name: 'form1[0].Page5[0].Pt6Line3b_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'preparerAptSteFlr') === 'Ste',
    },
    {
      name: 'form1[0].Page5[0].Pt6Line3b_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'preparerAptSteFlr') === 'Flr',
    },
    {
      name: 'form1[0].Page5[0].Pt6Line3b_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerAptSteFlrN'),
    },
    {
      name: 'form1[0].Page5[0].Pt6Line3c_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerCity'),
    },
    {
      name: 'form1[0].Page5[0].Pt6Line3d_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('69', 'preparerStates')]],
    },
    {
      name: 'form1[0].Page5[0].Pt6Line3e_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerZipCode'),
    },
    {
      name: 'form1[0].Page5[0].Pt6Line3f_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerProvince'),
    },
    {
      name: 'form1[0].Page5[0].Pt6Line3g_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerPostalCode'),
    },
    {
      name: 'form1[0].Page5[0].Pt6Line3h_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerCountry'),
    },
    // ?? Preparer's Contact Information
    {
      name: 'form1[0].Page5[0].Pt5Line4_DaytimePhoneNumber1[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerDaytimeTelephoneN'),
    },
    {
      name: 'form1[0].Page5[0].Pt5Line5_PreparerFaxNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerMobileTelephoneN'),
    },
    {
      name: 'form1[0].Page5[0].Pt5Line6_Email[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerEmailAddress'),
    },
    // ?? Interpreter's Mailing Address
    {
      name: 'form1[0].Page5[0].Pt5Line3a_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterStreetN'),
    },
    {
      name: 'form1[0].Page5[0].Pt5Line3b_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'interpreterAptSteFlr') === 'Apt',
    },
    {
      name: 'form1[0].Page5[0].Pt5Line3b_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'interpreterAptSteFlr') === 'Ste',
    },
    {
      name: 'form1[0].Page5[0].Pt5Line3b_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'interpreterAptSteFlr') === 'Flr',
    },
    {
      name: 'form1[0].Page5[0].Pt5Line3b_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterAptSteFlrN'),
    },
    {
      name: 'form1[0].Page5[0].Pt5Line3c_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterCity'),
    },
    {
      name: 'form1[0].Page5[0].Pt5Line3d_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('69', 'interpreterStates')]],
    },
    {
      name: 'form1[0].Page5[0].Pt5Line3e_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterZipCode'),
    },
    {
      name: 'form1[0].Page5[0].Pt5Line3f_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterProvince'),
    },
    {
      name: 'form1[0].Page5[0].Pt5Line3g_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterPostalCode'),
    },
    {
      name: 'form1[0].Page5[0].Pt5Line3h_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterCountry'),
    },
    // ?? Interpreter's Contact Information
    {
      name: 'form1[0].Page5[0].Pt4Line4_InterpreterDaytimeTelephone[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterDaytimeTelephoneN'),
    },
    {
      name: 'form1[0].Page5[0].Pt4Line5_MobileNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterMobileTelephoneN'),
    },
    {
      name: 'form1[0].Page5[0].Pt4Line6_Email[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterEmailAddress'),
    },
    // ?? Interpreter's Certification
    {
      name: 'form1[0].Page5[0].Part4_NameofLanguage[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterLanguageTranslated'),
    },

    // !! Page 6

    // ?? Preparer's Statement
    {
      name: 'form1[0].Page6[0].Part5Line7_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'ssPreparerAttorneyRepresentative') === 'No',
    },
    {
      name: 'form1[0].Page6[0].Part5Line7_Checkbox[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'ssPreparerAttorneyRepresentative') === 'Yes',
    },
    {
      name: 'form1[0].Page6[0].Part5Line7b_Checkbox[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'ssPreparerAttorneyRepresentative') === 'Yes'
          ? getAnswerById('69', 'attorneyRepresentationExtendBeyond') ===
            'Extends beyond just forms'
          : false,
    },
    {
      name: 'form1[0].Page6[0].Part5Line7b_Checkbox[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'ssPreparerAttorneyRepresentative') === 'Yes'
          ? getAnswerById('69', 'attorneyRepresentationExtendBeyond') ===
            'Limited to forms'
          : false,
    },
    // !! Page 7
    // ?? Part 6. Additional Information
    {
      name: 'form1[0].Page7[0].Line1a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'lastName'),
    },
    {
      name: 'form1[0].Page7[0].Line1b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'firstName'),
    },
    {
      name: 'form1[0].Page7[0].Line1c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'middleName'),
    },
    {
      name: 'form1[0].Page7[0].Line7_AlienNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
  ];
};

export { useI765Fields };
