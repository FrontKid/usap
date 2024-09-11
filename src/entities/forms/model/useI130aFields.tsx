import { getAllUsersInfo, getAllUserAnswers } from '@/shared/firebase/services';
import { DocumentData } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { IPDFField } from '../types/IPDFField';
import { getUserAnswerById } from '../utils/getUserAnswerById';
import { getAnswerFromArray } from '../utils/getAnswerFromArray';
import { usStates } from './codesState';

const useI130aFields = (): IPDFField[] => {
  const [allUserAnswers, setUserAnswers] = useState<DocumentData | never[]>([]);
  const { pathname } = useLocation();

  const getAnswerById = (answerId: string, key: string = '') => {
    return getAnswerFromArray(getUserAnswerById(allUserAnswers, answerId), key);
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
    // !! Page

    // ?? for
    {
      name: 'form1[0].#subform[0].Pt1Line1_AlienNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    {
      name: 'form1[0].#subform[0].#area[1].Pt2Line3_USCISELISActNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'uscisNumber'),
    },
    // !! FULL NAE
    {
      name: 'form1[0].#subform[0].Pt1Line3a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'lastName'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line3b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'firstName'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line3c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'middleName'),
    },
    // !! phisical number 1
    {
      name: 'form1[0].#subform[0].Pt1Line4a_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'streetNumber'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line4b_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('42', 'apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[0].Pt1Line4b_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('42', 'apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[0].Pt1Line4b_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('42', 'apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[0].Pt1Line4b_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'apt/Ste/FlrN'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line4c_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'city'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line4d_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('42', 'state')]],
    },
    {
      name: 'form1[0].#subform[0].Pt1Line4e_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'zipCode'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line4f_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'province'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line4h_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'country'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line4g_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'postalCode'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line5a_DateFrom[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'dateFrom'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line5b_DateTo[0]',
      type: 'PDFTextField',
      value: 'PRESENT',
    },
    // phisical number 2
    {
      name: 'form1[0].#subform[0].Pt1Line6a_StreetNumberName[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[0].Pt1Line6b_Unit[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[0].Pt1Line6b_Unit[1]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[0].Pt1Line6b_Unit[2]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[0].Pt1Line6b_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[0].Pt1Line6c_CityOrTown[0]',
      type: 'PDFTextField',
      value: '',
    },
    // state
    {
      name: 'form1[0].#subform[0].Pt1Line6e_ZipCode[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[0].Pt1Line6f_Province[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[0].Pt1Line6g_PostalCode[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[0].Pt1Line6h_Country[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[0].Pt1Line7a_DateFrom[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[0].Pt1Line7b_DateTo[0]',
      type: 'PDFTextField',
      value: '',
    },

    // !! LAST PHISICAL ADDRES OUTSIDE USA
    {
      name: 'form1[0].#subform[0].Pt1Line8a_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'streetNumber'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line8b_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('44', 'apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[0].Pt1Line8b_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('44', 'apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[0].Pt1Line8b_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('44', 'apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[0].Pt1Line8b_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'apt/Ste/FlrN'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line8c_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'city'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line8d_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'province'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line8e_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'ZIPCode'),
    },
    {
      name: 'form1[0].#subform[0].Pt1Line8f_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'country'),
    },
    // ?? page 2

    // !! Employment History
    // Employer I
    {
      name: 'form1[0].#subform[1].Pt2Line1_EmployerOrCompName[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employerName'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line2a_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'streetName'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line2b_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line2b_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line2b_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line2b_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'AptSteFlrN'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line2c_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'states'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line2f_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'province'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line2g_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'postalCode'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line2d_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('60', 'states')]],
    },
    {
      name: 'form1[0].#subform[1].Pt2Line2e_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'zipCode'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line2h_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'country'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line3_Occupation[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'occupation'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line4a_DateFrom[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employmentDatesFrom'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line4b_DateTo[0]',
      type: 'PDFTextField',
      value: 'PRESENT',
    },

    // Employer II
    {
      name: 'form1[0].#subform[1].Pt2Line5_EmployerOrCompName[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employerName0'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line6_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'streetName0'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line6_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/Flr0') === 'Apt',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line6_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/Flr0') === 'Ste',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line6_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/Flr0') === 'Flr',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line6_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'AptSteFlrN0'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line6_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'states0'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line6_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('60', 'states0')]],
    },
    {
      name: 'form1[0].#subform[1].Pt2Line6_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'zipCode0'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line6_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'province0'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line6_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'postalCode0'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line6_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'country0'),
    },

    // ! Part 1. Information About You (The Spouse Beneficiary)

    {
      name: 'form1[0].#subform[1].Pt1Line9a_DateFrom[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'dateResidenceFrom'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line9b_DateTo[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'dateResidenceTo'),
    },

    // !! Information About Parent 1
    {
      name: 'form1[0].#subform[1].Pt1Line10_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('38', 'lastName'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line10_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('38', 'firstName'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line10_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('38', 'middleName'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line11_DateofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('38', 'birthDate'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line12_Female[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[1].Pt1Line12CityTownOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('38', 'cityBirth'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line13_CountryofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('38', 'birthCountry'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line14_CountryofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('39', 'currentCity'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line15_CountryofResidence[0]',
      type: 'PDFTextField',
      value: getAnswerById('39', 'currentCountry'),
    },
    // !! Information About Parent 2

    {
      name: 'form1[0].#subform[1].Pt1Line16_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('40', 'lastName'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line16_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('40', 'firstName'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line16_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('40', 'middleName'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line17_DateofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('40', 'birthDate'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line19_Male[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[1].Pt1Line18_CityTownOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('40', 'cityBirth'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line19_CountryofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('40', 'birthCountry'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line20_CityTownVillageofRes[0]',
      type: 'PDFTextField',
      value: getAnswerById('41', 'currentCity'),
    },
    {
      name: 'form1[0].#subform[1].Pt1Line21_CountryofResidence[0]',
      type: 'PDFTextField',
      value: getAnswerById('41', 'currentCountry'),
    },
    // ?? page 3
    // !! Information about ur employment
    {
      name: 'form1[0].#subform[2].Pt2Line7_Occupation[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'occupation0'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line8a_DateFrom[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employmentAdditionDatesFrom0'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line8b_DateTo[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employmentAdditionDatesTo0'),
    },

    // !! Information about ur employment outside United States
    {
      name: 'form1[0].#subform[2].Pt3Line1_EmployerOrCompName[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employerNameOutside'),
    },
    {
      name: 'form1[0].#subform[2].Pt3Line2a_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'streetNameOutside'),
    },
    {
      name: 'form1[0].#subform[2].Pt3Line2b_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/FlrOutside') === 'Apt',
    },
    {
      name: 'form1[0].#subform[2].Pt3Line2b_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/FlrOutside') === 'Ste',
    },
    {
      name: 'form1[0].#subform[2].Pt3Line2b_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/FlrOutside') === 'Flr',
    },
    {
      name: 'form1[0].#subform[2].Pt3Line2b_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'AptSteFlrNOutside'),
    },
    {
      name: 'form1[0].#subform[2].Pt3Line2c_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'statesOutside'),
    },
    {
      name: 'form1[0].#subform[2].Pt3Line2e_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'zipCodeOutside'),
    },
    {
      name: 'form1[0].#subform[2].Pt3Line2d_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('60', 'statesOutside')]],
    },
    {
      name: 'form1[0].#subform[2].Pt3Line2f_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'provinceOutside'),
    },
    {
      name: 'form1[0].#subform[2].Pt3Line2g_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'postalCodeOutside'),
    },
    {
      name: 'form1[0].#subform[2].Pt3Line2h_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'countryOutside'),
    },
    {
      name: 'form1[0].#subform[2].Pt3Line3_Occupation[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'occupationOutside'),
    },

    {
      name: 'form1[0].#subform[2].Pt3Line4a_DateFrom[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employmentDatesFromOutside'),
    },
    {
      name: 'form1[0].#subform[2].Pt3Line4b_DateTo[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employmentDatesToOutside'),
    },

    // !! Spouse beneficiary's statement

    {
      name: 'form1[0].#subform[2].Pt4Line1Checkbox[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'readNUnderstandEnglish') === 'Yes',
    },

    {
      name: 'form1[0].#subform[2].Pt4Line1Checkbox[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Interpreter' ||
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Both',
    },
    {
      name: 'form1[0].#subform[2].Pt4Line1b_Language[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Interpreter' ||
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Both'
          ? getAnswerById('69', 'interpreterLanguageTranslated')
          : '',
    },
    {
      name: 'form1[0].#subform[2].Pt4_Checkbox[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Preparer' ||
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Both',
    },
    {
      name: 'form1[0].#subform[2].Pt4Line2_RepresentativeName[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Preparer' ||
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Both'
          ? getAnswerById('69', 'preparerFirstName')
          : '',
    },

    // !! Spouse beneficiary's contanct information
    {
      name: 'form1[0].#subform[2].Pt4Line3_DaytimePhoneNumber1[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'daytimeTelephone'),
    },
    {
      name: 'form1[0].#subform[2].Pt4Line4_MobileNumber1[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'mobileTelephone'),
    },
    {
      name: 'form1[0].#subform[2].Pt4Line5_Email[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'emailAddress'),
    },
    // !! Spouse beneficiary's signature
    {
      name: 'form1[0].#subform[2].Pt4Line6a_Signature[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[2].Pt4Line6b_DateofSignature[0]',
      type: 'PDFTextField',
      value: '',
    },

    // ?? page 4
    // !! Interpreter's Full Name
    {
      name: 'form1[0].#subform[3].Pt5Line1a_InterpreterFamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterLastName'),
    },
    {
      name: 'form1[0].#subform[3].Pt5Line1b_InterpreterGivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterFirstName'),
    },
    {
      name: 'form1[0].#subform[3].Pt5Line2_InterpreterBusinessorOrg[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterBusinessName'),
    },

    // !! Interpreter's Mailing Address
    {
      name: 'form1[0].#subform[3].Pt5Line3a_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterStreetN'),
    },
    {
      name: 'form1[0].#subform[3].Pt5Line3b_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'interpreterAptSteFlr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[3].Pt5Line3b_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'interpreterAptSteFlr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[3].Pt5Line3b_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'interpreterAptSteFlr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[3].Pt5Line3b_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterAptSteFlrN'),
    },
    {
      name: 'form1[0].#subform[3].Pt5Line3c_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterCity'),
    },
    {
      name: 'form1[0].#subform[3].Pt5Line3d_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('69', 'interpreterStates')]],
    },
    {
      name: 'form1[0].#subform[3].Pt5Line3e_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterZipCode'),
    },

    {
      name: 'form1[0].#subform[3].Pt5Line3f_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterProvince'),
    },
    {
      name: 'form1[0].#subform[3].Pt5Line3g_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterPostalCode'),
    },
    {
      name: 'form1[0].#subform[3].Pt5Line3h_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterCountry'),
    },
    // !! Interpreter's Contact Information
    {
      name: 'form1[0].#subform[3].Pt5Line4_InterpreterDaytimeTelephone[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterMobileTelephoneN'),
    },
    {
      name: 'form1[0].#subform[3].Pt5Line4_InterpreterDaytimeTelephone[1]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterDaytimeTelephoneN'),
    },
    {
      name: 'form1[0].#subform[3].Pt5Line5_Email[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterEmailAddress'),
    },
    // !! Interpreter's Certification
    {
      name: 'form1[0].#subform[3].Pt5_NameofLanguage[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterLanguageTranslated'),
    },
    // !! Interpreter's Signature
    {
      name: 'form1[0].#subform[3].Pt5Line6a_Signature[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].Pt5Line6b_DateofSignature[0]',
      type: 'PDFTextField',
      value: '',
    },
    // !! Preparer's Full Name
    {
      name: 'form1[0].#subform[3].Pt6Line1a_PreparerFamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerLastName'),
    },
    {
      name: 'form1[0].#subform[3].Pt6Line1b_PreparerGivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerFirstName'),
    },
    {
      name: 'form1[0].#subform[3].Pt6Line2_BusinessName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerBusinessName'),
    },
    // !! Preparer's Mailing Address
    {
      name: 'form1[0].#subform[3].Pt6Line3a_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerStreetN'),
    },
    {
      name: 'form1[0].#subform[3].Pt6Line3b_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'preparerAptSteFlr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[3].Pt6Line3b_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'preparerAptSteFlr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[3].Pt6Line3b_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'preparerAptSteFlr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[3].Pt6Line3b_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerAptSteFlrN'),
    },
    {
      name: 'form1[0].#subform[3].Pt6Line3c_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerStates'),
    },
    {
      name: 'form1[0].#subform[3].Pt6Line3d_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('69', 'preparerStates')]],
    },
    {
      name: 'form1[0].#subform[3].Pt6Line3e_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerZipCode'),
    },
    {
      name: 'form1[0].#subform[3].Pt6Line3f_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerProvince'),
    },
    {
      name: 'form1[0].#subform[3].Pt6Line3g_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerPostalCode'),
    },
    {
      name: 'form1[0].#subform[3].Pt6Line3h_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerCountry'),
    },

    // ?? Page 5

    // !!  Preparer's Contact Information

    {
      name: 'form1[0].#subform[4].Pt6Line4_DaytimePhoneNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerDaytimeTelephoneN'),
    },
    {
      name: 'form1[0].#subform[4].Pt6Line5_PreparerFaxNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerMobileTelephoneN'),
    },
    {
      name: 'form1[0].#subform[4].Pt6Line6_Email[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerEmailAddress'),
    },

    // !! Preparer's Statement

    {
      name: 'form1[0].#subform[4].Pt6Line7_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'ssPreparerAttorneyRepresentative') === 'No',
    },

    {
      name: 'form1[0].#subform[4].Pt6Line7_Checkbox[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'ssPreparerAttorneyRepresentative') === 'Yes',
    },
    {
      name: 'form1[0].#subform[4].Pt6Line7b_Checkbox[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'attorneyRepresentationExtendBeyond') ===
        'Limited to forms',
    },
    {
      name: 'form1[0].#subform[4].Pt6Line7b_Checkbox[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'attorneyRepresentationExtendBeyond') !==
        'Limited to forms',
    },

    // !! Preparer's Signature

    {
      name: 'form1[0].#subform[4].Pt6Line8a_Signature[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[4].Pt6Line8b_DateofSignature[0]',
      type: 'PDFTextField',
      value: '',
    },

    // ?? page 6

    // !! Additional Information

    {
      name: 'form1[0].#subform[5].Pt1Line3a_FamilyName[1]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'lastName'),
    },
    {
      name: 'form1[0].#subform[5].Pt1Line3b_GivenName[1]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'firstName'),
    },
    {
      name: 'form1[0].#subform[5].Pt1Line3c_MiddleName[1]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'middleName'),
    },
    {
      name: 'form1[0].#subform[5].Pt1Line1_AlienNumber[1]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    {
      name: 'form1[0].#subform[5].Pt7Line3a_PageNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line3b_PartNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line3c_ItemNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line3d_AdditionalInfo[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line4a_PageNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line4b_PartNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line4c_ItemNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line4d_AdditionalInfo[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line5a_PageNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line5b_PartNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line5c_ItemNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line5d_AdditionalInfo[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line6a_PageNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line6b_PartNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line6c_ItemNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line6d_AdditionalInfo[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line7a_PageNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line7b_PartNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line7c_ItemNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[5].Pt7Line7d_AdditionalInfo[0]',
      type: 'PDFTextField',
      value: '',
    },
  ];
};

export { useI130aFields };
