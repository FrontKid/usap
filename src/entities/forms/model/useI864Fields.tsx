/* eslint-disable max-len */
import { getAllUsersInfo, getAllUserAnswers } from '@/shared/firebase/services';
import { DocumentData } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { IPDFField } from '../types/IPDFField';
import { getUserAnswerById } from '../utils/getUserAnswerById';
import { getAnswerFromArray } from '../utils/getAnswerFromArray';
import { usStates } from './codesState';

const useI864Fields = (): IPDFField[] => {
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
    // !! Page 1

    // ?? Basics for filling Affidat of Support
    {
      name: 'form1[0].#subform[0].P1_Line1_Name[0]',
      type: 'PDFTextField',
      value: `I ${getAnswerById('28', 'lastName')} ${getAnswerById('28', 'middleName')} ${getAnswerById('28', 'firstName')}`,
    },
    {
      name: 'form1[0].#subform[0].P1_Line1a_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[0].P1_Line1b_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[0].P1_Line1b_Relationship[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[0].P1_Line1c_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[0].P1_Line1c_InterestIn[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[0].P1_Line1c_Relationship[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[0].P1_Line1d_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[0].P1_Line1e_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[0].P1_Line1e1_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[0].P1_Line1e1_Checkbox[1]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[0].P1_Line1f_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[0].P1_Line1f_Relationship[0]',
      type: 'PDFTextField',
      value: '',
    },

    // ?? Mailing Address
    {
      name: 'form1[0].#subform[0].P2_Line2_InCareOf[0]',
      type: 'PDFTextField',
      value: getAnswerById('31', 'careName'),
    },
    {
      name: 'form1[0].#subform[0].P2_Line2_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('31', 'street'),
    },
    {
      name: 'form1[0].#subform[0].P2_Line2_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('31', 'Apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[0].P2_Line2_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('31', 'Apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[0].P2_Line2_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('31', 'Apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[0].P2_Line2_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('31', 'apt/Ste/FlrNum'),
    },
    {
      name: 'form1[0].#subform[0].P2_Line2_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('31', 'cityOrTown'),
    },
    {
      name: 'form1[0].#subform[0].P2_Line2_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('31', 'states')]],
    },
    {
      name: 'form1[0].#subform[0].P2_Line2_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('31', 'ZIPCode'),
    },
    {
      name: 'form1[0].#subform[0].P2_Line2_Province[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[0].P2_Line2_PostalCode[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[0].P2_Line2_Country[0]',
      type: 'PDFTextField',
      value: 'United states of America',
    },

    // ?? Other Information
    {
      name: 'form1[0].#subform[0].P2_Line3_CountryOfCitenship[0]',
      type: 'PDFTextField',
      value: getAnswerById('22', 'countryBirthFirst'),
    },
    {
      name: 'form1[0].#subform[0].P2_Line4_DateOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'birthDate'),
    },
    {
      name: 'form1[0].#subform[0].#area[1].P2_Line5_AlienNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    {
      name: 'form1[0].#subform[0].#area[2].Pt2Line6_USCISOnlineAcctNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'uscisNumber'),
    },
    {
      name: 'form1[0].#subform[0].P2_Line7_DaytimeTelephoneNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'daytimeTelephone'),
    },

    // ?? Part 2 Information about the Principal Immigrant
    {
      name: 'form1[0].#subform[0].P2_Line1a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'lastName'),
    },
    {
      name: 'form1[0].#subform[0].P2_Line1b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'firstName'),
    },
    {
      name: 'form1[0].#subform[0].P2_Line1c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'middleName'),
    },

    // !! Page 2

    // ?? Part 3 Information about the Immigrants You are sponsoring
    {
      name: 'form1[0].#subform[1].P3_Line1_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[1].P3_Line1_Checkbox[1]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[1].P3_Line2_SponsoringFamily[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[1].P3_Line2_SponsoringFamily[1]',
      type: 'PDFCheckBox',
      checked: false,
    },

    // ?? Family Member 1
    {
      name: 'form1[0].#subform[1].P3_Line3a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'lastName'),
    },
    {
      name: 'form1[0].#subform[1].P3_Line3b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'firstName'),
    },
    {
      name: 'form1[0].#subform[1].P3_Line3c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'middleName'),
    },
    {
      name: 'form1[0].#subform[1].P3_Line4_Relationship[0]',
      type: 'PDFTextField',
      value: 'Spouse',
    },
    {
      name: 'form1[0].#subform[1].P3_Line_DateOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'birthDate'),
    },
    {
      name: 'form1[0].#subform[1].#area[4].P3_Line7_AcctIdentifier[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'uscisNumber'),
    },
    {
      name: 'form1[0].#subform[1].P2_Line5_AlienNumber[2]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },

    // ?? Family Member 2
    {
      name: 'form1[0].#subform[1].P3_Line8a_FamilyName[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P3_Line8b_GivenName[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P3_Line8c_MiddleName[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P3_Line9_Relationship[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P3_Line10_DateOfBirth[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].#area[5].P3_Line11_AlienNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].#area[6].P3_Line12_AcctIdentifier[0]',
      type: 'PDFTextField',
      value: '',
    },

    // ?? Family Member 3
    {
      name: 'form1[0].#subform[1].P3_Line13a_FamilyName[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P3_Line13b_GivenName[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P3_Line13c_MiddleName[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P3_Line14_Relationship[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P3_Line15_DateOfBirth[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].#area[8].P3_Line17_AcctIdentifier[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P2_Line5_AlienNumber[1]',
      type: 'PDFTextField',
      value: '',
    },

    // ?? Family Member 4
    {
      name: 'form1[0].#subform[1].P3_Line18a_FamilyName[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P3_Line18b_GivenName[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P3_Line18c_MiddleName[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P3_Line19_Relationship[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P3_Line20_DateOfBirth[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].#area[9].P3_Line21_AlienNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].#area[10].P3_Line22_AcctIdentifier[0]',
      type: 'PDFTextField',
      value: '',
    },

    // ?? Family Member 5
    {
      name: 'form1[0].#subform[1].P3_Line23a_FamilyName[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P3_Line23b_GivenName[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P3_Line23c_MiddleName[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P3_Line24_Relationship[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].P3_Line25_DateOfBirth[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].#area[11].P3_Line26_AlienNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].#area[12].P3_Line27_AcctIdentifier[0]',
      type: 'PDFTextField',
      value: '',
    },

    // !! Page 3

    // ?? Part 3 Information about the immigrants you are sponsoring
    {
      name: 'form1[0].#subform[2].P3_Line28_TotalNumberofImmigrants[0]',
      type: 'PDFTextField',
      value: '1',
    },

    // ?? Part 4 Information about you (Sponsor)
    // ?? Sponsor's full name
    {
      name: 'form1[0].#subform[2].P4_Line1a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'lastName'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line1b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'firstName'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line1c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'middleName'),
    },

    // ?? Sponsor's mailing address
    {
      name: 'form1[0].#subform[2].P4_Line2a_InCareOf[0]',
      type: 'PDFTextField',
      value: getAnswerById('33', 'careName'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line2b_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('33', 'street'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line2c_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('33', 'Apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[2].P4_Line2c_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('33', 'Apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[2].P4_Line2c_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('33', 'Apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[2].P4_Line2c_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('33', 'apt/Ste/FlrNum'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line2d_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('33', 'cityOrTown'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line2e_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('31', 'states')]],
    },
    {
      name: 'form1[0].#subform[2].P4_Line2f_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('33', 'ZIPCode'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line2g_Province[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[2].P4_Line2h_PostalCode[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[2].P4_Line2i_Country[0]',
      type: 'PDFTextField',
      value: 'United States of America',
    },
    {
      name: 'form1[0].#subform[2].P4_Line3_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('32', 'haveMailing') === 'No',
    },
    {
      name: 'form1[0].#subform[2].P4_Line3_Checkbox[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('32', 'haveMailing') === 'Yes',
    },

    // ?? Sponsor's physicall address
    {
      name: 'form1[0].#subform[2].P4_Line4a_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('51', 'streetNumber'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line4b_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('51', 'apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[2].P4_Line4b_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('51', 'apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[2].P4_Line4b_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('51', 'apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[2].P4_Line4b_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('51', 'apt/Ste/FlrN'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line4c_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('51', 'city'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line4d_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('51', 'state')]],
    },
    {
      name: 'form1[0].#subform[2].P4_Line4e_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('51', 'zipCode'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line4f_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('51', 'province'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line4g_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('51', 'postalCode'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line4h_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('51', 'country'),
    },

    // ?? Other information
    {
      name: 'form1[0].#subform[2].P4_Line5_CountryOfDomicile[0]',
      type: 'PDFTextField',
      value: getAnswerById('51', 'country'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line6_DateOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'birthDate'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line7_CityofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'birthCity'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line8_StateorProvinceofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'stateBirth'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line9_CountryOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'countryBirth'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line10_SocialSecurityNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('66', 'socialSecurityNumberSponsor'),
    },
    {
      name: 'form1[0].#subform[2].P4_Line11a_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('82', 'howDidYouBecomeUsCitizen') === 'Birth',
    },
    {
      name: 'form1[0].#subform[2].P4_Line11b_Checkbox[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('82', 'howDidYouBecomeUsCitizen') === 'Naturalization',
    },
    {
      name: 'form1[0].#subform[2].P4_Line11c_Checkbox[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '82',
          'gainedPermanentStatusOrCitizenshipThroughAdoption',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[2].Line11c_AlienNumberGroup[0].P4_Line12_AlienNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[2].#area[14].P4_Line13_AcctIdentifier[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[2].P4_Line14_Checkboxes[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'armedForces') === 'No',
    },
    {
      name: 'form1[0].#subform[2].P4_Line14_Checkboxes[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'armedForces') === 'Yes',
    },

    // !! Page 4
    // ?? Part 5 Sponsor's Household Size

    {
      name: 'form1[0].#subform[3].P5_Line1_Number[0]',
      type: 'PDFTextField',
      value: '1',
    },
    {
      name: 'form1[0].#subform[3].P5_Line2_Yourself[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].P5_Line3_Married[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].P5_Line4_DependentChildren[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].P5_Line5_OtherDependents[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].P5_Line6_Sponsors[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].P5_Line7_SameResidence[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].Override[0]',
      type: 'PDFTextField',
      value: '1',
    },

    // Sponsor's employment and Income

    {
      name: 'form1[0].#subform[3].P6_Line1_Checkbox[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('61', 'currentSponsorEmployment') ===
        'Working (Employed/Self-employed/Intern)',
    },
    {
      name: 'form1[0].#subform[3].P6_Line1a_NameofEmployer[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('61', 'currentSponsorEmployment') ===
        'Working (Employed/Self-employed/Intern)'
          ? getAnswerById('62', 'sponsorWorkingOccupation')
          : '',
    },
    {
      name: 'form1[0].#subform[3].P6_Line1a1_NameofEmployer[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingEmployerName'),
    },
    {
      name: 'form1[0].#subform[3].P6_Line1a2_NameofEmployer[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingEmployerName0'),
    },
    {
      name: 'form1[0].#subform[3].P6_Line4_Checkbox[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('61', 'currentSponsorEmployment') ===
        'Working (Employed/Self-employed/Intern)',
    },
    {
      name: 'form1[0].#subform[3].P6_Line4a_SelfEmployedAs[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('61', 'currentSponsorEmployment') ===
        'Working (Employed/Self-employed/Intern)'
          ? getAnswerById('62', 'sponsorWorkingOccupation')
          : '',
    },
    {
      name: 'form1[0].#subform[3].P6_Line5_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('61', 'currentSponsorEmployment') === 'Retired',
    },
    {
      name: 'form1[0].#subform[3].P6_Line5a_DateRetired[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('61', 'currentSponsorEmployment') === 'Retired'
          ? getAnswerById('62', 'retiredSinceWhen')
          : '',
    },
    {
      name: 'form1[0].#subform[3].P6_Line6_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('61', 'currentSponsorEmployment') === 'Unemployed',
    },
    {
      name: 'form1[0].#subform[3].P6_Line6a_DateofUnemployment[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('61', 'currentSponsorEmployment') === 'Unemployed'
          ? getAnswerById('62', 'sponsorUnemployedSinceWhen')
          : '',
    },
    {
      name: 'form1[0].#subform[3].P6_Line2_TotalIncome[0]',
      type: 'PDFTextField',
      value: getAnswerById('66', 'sponsorCurrentTotalIncomeProjected'),
    },

    // Person 1
    {
      name: 'form1[0].#subform[3].P6_Line3_Name[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'firstName'),
    },
    {
      name: 'form1[0].#subform[3].P6_Line4_Relationship[0]',
      type: 'PDFTextField',
      value: 'Spouse',
    },
    {
      name: 'form1[0].#subform[3].P6_Line5_CurrentIncome[0]',
      type: 'PDFTextField',
      value: getAnswerById('66', 'immigrantNameTotalIncome'),
    },

    // Person 2
    {
      name: 'form1[0].#subform[3].P6_Line9_Name[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].P6_Line7_Relationship[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].P6_Line8_CurrentIncome[0]',
      type: 'PDFTextField',
      value: '',
    },

    // Person 3
    {
      name: 'form1[0].#subform[3].P6_Line9_Name[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].P6_Line10_Relationship[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].P6_Line8_CurrentIncome[0]',
      type: 'PDFTextField',
      value: '',
    },

    // Person 4
    {
      name: 'form1[0].#subform[3].P6_Line12_Name[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].P6_Line13_Relationship[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].P6_Line14_CurrentIncome[0]',
      type: 'PDFTextField',
      value: '',
    },

    // !! Page 5

    // ?? Part 6 Sponsor's employment and income
    {
      name: 'form1[0].#subform[4].P6_Line15_TotalHouseholdIncome[0]',
      type: 'PDFTextField',
      value: `${+getAnswerById('66', 'sponsorCurrentTotalIncomeProjected') + +getAnswerById('66', 'immigrantNameTotalIncome')}`,
    },
    {
      name: 'form1[0].#subform[4].P6_Line16_CompletedForm[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[4].P6_Line17_NotNeedComplete[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[4].P6_Line17_Name[0]',
      type: 'PDFTextField',
      value: '',
    },

    // ?? Federal Income TAx Return Information
    {
      name: 'form1[0].#subform[4].P6_Line18a_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('63', 'fileLastRaxReturnJointly') === 'No',
    },
    {
      name: 'form1[0].#subform[4].P6_Line18a_Checkbox[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('63', 'fileLastRaxReturnJointly') === 'Yes',
    },
    {
      name: 'form1[0].#subform[4].P6_Line1_Employed[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '64',
          'attachedTaxReturnsForSecondAndThirdMostRecentYears',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[4].P6_Line19a_TaxYear[0]',
      type: 'PDFTextField',
      value: getAnswerById('64', 'mostRecentTaxYear'),
    },
    {
      name: 'form1[0].#subform[4].P6_Line19a_TotalIncome[0]',
      type: 'PDFTextField',
      value: getAnswerById('64', 'enterAdjustedGross1'),
    },
    {
      name: 'form1[0].#subform[4].P6_Line19b_TaxYear[0]',
      type: 'PDFTextField',
      value: getAnswerById('64', 'secondRecentTaxYear'),
    },
    {
      name: 'form1[0].#subform[4].P6_Line19b_TotalIncome[0]',
      type: 'PDFTextField',
      value: getAnswerById('64', 'enterAdjustedGross2'),
    },
    {
      name: 'form1[0].#subform[4].P6_Line19c_TaxYear[0]',
      type: 'PDFTextField',
      value: getAnswerById('64', 'thirdRecentTaxYear'),
    },
    {
      name: 'form1[0].#subform[4].P6_Line19c_TotalIncome[0]',
      type: 'PDFTextField',
      value: getAnswerById('64', 'enterAdjustedGross3'),
    },
    {
      name: 'form1[0].#subform[4].P6_Line20_Attached[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('64', 'fileLastRaxReturnJointly') === 'Yes',
    },

    // Part 7 Use of Assets to Supplement Income
    {
      name: 'form1[0].#subform[4].P7_Line1_BalanceofAccounts[0]',
      type: 'PDFTextField',
      value: getAnswerById('67', 'sponsorCurrentBalance'),
    },
    {
      name: 'form1[0].#subform[4].P7_Line2_RealEstate[0]',
      type: 'PDFTextField',
      value: getAnswerById('67', 'sponsorCurrentNetValue'),
    },
    {
      name: 'form1[0].#subform[4].P7_Line3_StocksBonds[0]',
      type: 'PDFTextField',
      value: getAnswerById('67', 'sponsorCurrentOtherValue'),
    },
    {
      name: 'form1[0].#subform[4].P7_Line4_Total[0]',
      type: 'PDFTextField',
      value: `${+getAnswerById('67', 'sponsorCurrentBalance') + +getAnswerById('67', 'sponsorCurrentNetValue') + +getAnswerById('67', 'sponsorCurrentOtherValue')}`,
    },
    {
      name: 'form1[0].#subform[4].P7_Line5a_NameofRelative[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[4].P7_Line5b_Assets[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[4].P7_Line6_BalanceofAccounts[0]',
      type: 'PDFTextField',
      value: getAnswerById('67', 'immigrantCurrentBalance'),
    },
    {
      name: 'form1[0].#subform[4].P7_Line7_RealEstate[0]',
      type: 'PDFTextField',
      value: getAnswerById('67', 'immigrantCurrentNetValue'),
    },
    {
      name: 'form1[0].#subform[4].P7_Line8_StocksBonds[0]',
      type: 'PDFTextField',
      value: getAnswerById('67', 'immigrantCurrentOtherValue'),
    },

    // !! Page 6

    // Use of assets
    {
      name: 'form1[0].#subform[5].P7_Line9_Total[0]',
      type: 'PDFTextField',
      value: `${+getAnswerById('67', 'immigrantCurrentBalance') + +getAnswerById('67', 'immigrantCurrentNetValue') + +getAnswerById('67', 'immigrantCurrentOtherValue')}`,
    },
    {
      name: 'form1[0].#subform[5].P7_Line10_TotalValueAssets[0]',
      type: 'PDFTextField',
      value: `${+getAnswerById('67', 'sponsorCurrentBalance') + +getAnswerById('67', 'sponsorCurrentNetValue') + +getAnswerById('67', 'sponsorCurrentOtherValue') + +getAnswerById('67', 'immigrantCurrentBalance') + +getAnswerById('67', 'immigrantCurrentNetValue') + +getAnswerById('67', 'immigrantCurrentOtherValue')}`,
    },

    // !! Page 7

    // ?? Sponsor's Statement
    {
      name: 'form1[0].#subform[9].P8_Line1_Checkbox[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('70', 'readNUnderstandEnglish') === 'Yes',
    },
    {
      name: 'form1[0].#subform[9].P8_Line1_Checkbox[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('70', 'useSponsorInterpreterOrPreparer') ===
          'Interpreter' ||
        getAnswerById('70', 'useSponsorInterpreterOrPreparer') === 'Both',
    },
    {
      name: 'form1[0].#subform[9].P8_Line1b_language[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('70', 'useSponsorInterpreterOrPreparer') ===
          'Interpreter' ||
        getAnswerById('70', 'useSponsorInterpreterOrPreparer') === 'Both'
          ? getAnswerById('70', 'interpreterLanguageTranslated')
          : '',
    },
    {
      name: 'form1[0].#subform[9].P8_Line2_Checkbox[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('70', 'useSponsorInterpreterOrPreparer') === 'Preparer' ||
        getAnswerById('70', 'useSponsorInterpreterOrPreparer') === 'Both',
    },
    {
      name: 'form1[0].#subform[9].P8_Line2_Attorney[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('70', 'useSponsorInterpreterOrPreparer') === 'Preparer' ||
        getAnswerById('70', 'useSponsorInterpreterOrPreparer') === 'Both'
          ? getAnswerById('70', 'preparerLastName') +
            ' ' +
            getAnswerById('70', 'preparerFirstName')
          : '',
    },
    {
      name: 'form1[0].#subform[9].P8_Line3_DaytimeTelephoneNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('29', 'daytimeTelephone'),
    },
    {
      name: 'form1[0].#subform[9].P8_Line4_MobileTelephoneNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('29', 'mobileTelephone'),
    },
    {
      name: 'form1[0].#subform[9].P7Line7_EmailAddress[0]',
      type: 'PDFTextField',
      value: getAnswerById('29', 'emailAddress'),
    },

    // !! Part 8

    // ?? Interpreter's Contact Information, Certification...
    // ?? Interpreter's Full name
    {
      name: 'form1[0].#subform[20].P9_Line1a_InterpretersFamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'interpreterLastName'),
    },
    {
      name: 'form1[0].#subform[20].P9_Line1b_InterpretersGivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'interpreterFirstName'),
    },
    {
      name: 'form1[0].#subform[20].P8Line2_InterpretersBusinessName[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'interpreterBusinessName'),
    },

    // ?? Interpreter's Mailing address
    {
      name: 'form1[0].#subform[20].P9_Line3a_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'interpreterStreetN'),
    },
    {
      name: 'form1[0].#subform[20].P9_Line3b_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('70', 'apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[20].P9_Line3b_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('70', 'apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[20].P9_Line3b_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('70', 'apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[20].P9_Line3b_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'interpreterAptSteFlrN'),
    },
    {
      name: 'form1[0].#subform[20].P9_Line3c_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'interpreterCity'),
    },
    {
      name: 'form1[0].#subform[20].P9_Line3d_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('70', 'interpreterStates')]],
    },
    {
      name: 'form1[0].#subform[20].P9_Line3e_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'interpreterZipCode'),
    },
    {
      name: 'form1[0].#subform[20].P9_Line3f_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'interpreterProvince'),
    },
    {
      name: 'form1[0].#subform[20].P9_Line3g_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'interpreterPostalCode'),
    },
    {
      name: 'form1[0].#subform[20].P9_Line3h_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'interpreterSponsorCountry'),
    },

    // ?? Interpreter's Contact Information
    {
      name: 'form1[0].#subform[20].P9_Line4_InterpretersDaytimePhoneNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'interpreterDaytimeTelephoneN'),
    },
    {
      name: 'form1[0].#subform[20].P9_Line4_InterpretersDaytimePhoneNumber[1]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'interpreterMobileTelephoneN'),
    },
    {
      name: 'form1[0].#subform[20].P9_Line5_InterpretersEmailAddress[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'interpreterEmailAddress'),
    },
    // ?? Interpreter's certification
    {
      name: 'form1[0].#subform[20].P9_Language[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'interpreterLanguageTranslated'),
    },

    // !! Page 9

    // ?? Part 10. Contact Information, Declaration, and Signature of the Person...
    // ?? Prepear's full name
    {
      name: 'form1[0].#subform[25].P10_Line1a_PreparersFamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'preparerLastName'),
    },
    {
      name: 'form1[0].#subform[25].P10_Line1b_PreparersGivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'preparerFirstName'),
    },
    {
      name: 'form1[0].#subform[25].P10_Line2_PreparersBusinessName[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'preparerBusinessName'),
    },

    // ??  Preparer's Mailing Address
    {
      name: 'form1[0].#subform[25].P10_Line3a_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'preparerStreetN'),
    },
    {
      name: 'form1[0].#subform[25].P10_Line3b_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('70', 'apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[25].P10_Line3b_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('70', 'apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[25].P10_Line3b_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('70', 'apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[25].P10_Line3b_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'preparerAptSteFlrN'),
    },
    {
      name: 'form1[0].#subform[25].P10_Line3c_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'preparerCity'),
    },
    {
      name: 'form1[0].#subform[25].P10_Line3d_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('70', 'preparerStates')]],
    },
    {
      name: 'form1[0].#subform[25].P10_Line3e_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'preparerZipCode'),
    },
    {
      name: 'form1[0].#subform[25].P10_Line3f_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'preparerProvince'),
    },
    {
      name: 'form1[0].#subform[25].P10_Line3g_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'preparerPostalCode'),
    },
    {
      name: 'form1[0].#subform[25].P10_Line3h_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'preparerSponsorCountry'),
    },

    // ?? Preparer's Contact Information
    {
      name: 'form1[0].#subform[25].P10_Line4_PreparersDaytimePhoneNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'preparerDaytimeTelephoneN'),
    },
    {
      name: 'form1[0].#subform[25].P10_Line5_PreparersFaxNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'preparerMobileTelephoneN'),
    },
    {
      name: 'form1[0].#subform[25].P10_Line6_PreparersEmailAddress[0]',
      type: 'PDFTextField',
      value: getAnswerById('70', 'preparerEmailAddress'),
    },

    // ?? Preparer's Statement
    {
      name: 'form1[0].#subform[25].P10_Line7_checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('70', 'ssPreparerAttorneyRepresentative') === 'No',
    },
    {
      name: 'form1[0].#subform[25].P10_Line7_checkbox[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('70', 'ssPreparerAttorneyRepresentative') === 'Yes',
    },
    {
      name: 'form1[0].#subform[25].P10_Line7_Extend[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('70', 'ssPreparerAttorneyRepresentative') === 'Yes'
          ? getAnswerById('70', 'attorneyRepresentationExtendBeyond') ===
            'Extends beyond just forms'
          : false,
    },
    {
      name: 'form1[0].#subform[25].P10_Line7_Extend[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('70', 'ssPreparerAttorneyRepresentative') === 'Yes'
          ? getAnswerById('70', 'attorneyRepresentationExtendBeyond') ===
            'Limited to forms'
          : false,
    },

    // !! Part 11

    // ?? Additional Information
    {
      name: 'form1[0].#subform[26].P4_Line1a_FamilyName[1]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'lastName'),
    },
    {
      name: 'form1[0].#subform[26].P4_Line1b_GivenName[1]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'firstName'),
    },
    {
      name: 'form1[0].#subform[26].P4_Line1c_MiddleName[1]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'middleName'),
    },
    {
      name: 'form1[0].#subform[26].#area[19].P4_Line12_AlienNumber[1]',
      type: 'PDFTextField',
      value: '',
    },
  ];
};

export { useI864Fields };
