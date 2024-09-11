/* eslint-disable max-len */
import { getAllUsersInfo, getAllUserAnswers } from '@/shared/firebase/services';
import { DocumentData } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { getAnswerFromArray } from '../utils/getAnswerFromArray';
import { getUserAnswerById } from '../utils/getUserAnswerById';
import { IPDFField } from '../types/IPDFField';
import { usStates } from './codesState';

const useI130Fields = (): IPDFField[] => {
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
    // !! First page

    // * Part 1

    // ? 1.
    {
      name: 'form1[0].#subform[0].Pt1Line1_Spouse[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[0].Pt1Line1_Siblings[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[0].Pt1Line1_Parent[0]',
      type: 'PDFCheckBox',
      checked: false,
    },

    {
      name: 'form1[0].#subform[0].Pt1Line1_Child[0]',
      type: 'PDFCheckBox',
      checked: false,
    },

    // ? 2
    {
      name: 'form1[0].#subform[0].Pt1Line2_InWedlock[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[0].Pt1Line2_Stepchild[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[0].Pt1Line2_AdoptedChild[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[0].Pt1Line2_OutOfWedlock[0]',
      type: 'PDFCheckBox',
      checked: false,
    },

    // ? 3
    {
      name: 'form1[0].#subform[0].Pt1Line3_Yes[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[0].Pt1Line3_No[0]',
      type: 'PDFCheckBox',
      checked: false,
    },

    // ? 4
    {
      name: 'form1[0].#subform[0].Pt1Line4_Yes[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '82',
          'gainedPermanentStatusOrCitizenshipThroughAdoption',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[0].Pt1Line4_No[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '82',
          'gainedPermanentStatusOrCitizenshipThroughAdoption',
        ) === 'No',
    },

    // * Part 2. Information About You (Petitioner)

    {
      name: 'form1[0].#subform[0].#area[4].Pt2Line1_AlienNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[0].#area[5].Pt2Line2_USCISOnlineActNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[0].Pt2Line11_SSN[0]',
      type: 'PDFTextField',
      value: getAnswerById('66', 'socialSecurityNumberSponsor'),
    },

    // * Fullname

    {
      name: 'form1[0].#subform[0].Pt2Line4a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'lastName'),
    },
    {
      name: 'form1[0].#subform[0].Pt2Line4b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'firstName'),
    },
    {
      name: 'form1[0].#subform[0].Pt2Line4c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'middleName'),
    },

    // !! page 2
    // ?? Part 2. Information About You (Petitioner) (continued)

    // * Other Names Used (if any)
    {
      name: 'form1[0].#subform[1].Pt2Line5a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('29', 'familyName1'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line5b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('29', 'givenName1'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line5c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('29', 'middleName1'),
    },

    // * Other Information

    {
      name: 'form1[0].#subform[1].Pt2Line6_CityTownOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'birthCity'),
    },

    {
      name: 'form1[0].#subform[1].Pt2Line7_CountryofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'countryBirth'),
    },

    {
      name: 'form1[0].#subform[1].Pt2Line8_DateofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'birthDate'),
    },

    {
      name: 'form1[0].#subform[1].Pt2Line9_Male[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('28', 'sex') === 'Male',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line9_Female[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('28', 'sex') === 'Female',
    },

    // * Mailing Address
    {
      name: 'form1[0].#subform[1].Pt2Line10_InCareofName[0]',
      type: 'PDFTextField',
      value: getAnswerById('33', 'careName'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line10_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('33', 'street'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line10_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('33', 'Apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line10_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('33', 'Apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line10_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('33', 'Apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line10_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('33', 'apt/Ste/FlrNum'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line10_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('33', 'cityOrTown'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line10_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('33', 'states')]],
    },
    {
      name: 'form1[0].#subform[1].Pt2Line10_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('33', 'ZIPCode'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line10_Province[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line10_PostalCode[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line10_Country[0]',
      type: 'PDFTextField',
      value: 'United States of America',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line11_Yes[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('32', 'haveMailing') === 'Yes',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line11_No[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('32', 'haveMailing') === 'No',
    },

    // * Address History
    {
      name: 'form1[0].#subform[1].Pt2Line12_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('51', 'streetNumber'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line12_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('51', 'apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line12_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('51', 'apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line12_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('51', 'apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[1].Pt2Line12_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('51', 'apt/Ste/FlrN'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line12_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('51', 'city'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line12_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('51', 'state')]],
    },
    {
      name: 'form1[0].#subform[1].Pt2Line12_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('51', 'zipCode'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line12_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('51', 'province'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line12_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('51', 'postalCode'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line12_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('51', 'country'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line13a_DateFrom[0]',
      type: 'PDFTextField',
      value: getAnswerById('51', 'dateFrom'),
    },
    {
      name: 'form1[0].#subform[1].Pt2Line13b_DateTo[0]',
      type: 'PDFTextField',
      value: 'PRESENT',
    },

    // * Your Marital Information

    {
      name: 'form1[0].#subform[1].Pt2Line16_NumberofMarriages[0]',
      type: 'PDFTextField',
      value: '1',
    },

    {
      name: 'form1[0].#subform[1].Pt2Line17_Married[0]',
      type: 'PDFCheckBox',
      checked: true,
    },

    // !! Page 3

    // ?? Part 2 Information About You (Petitioner) (continued)
    {
      name: 'form1[0].#subform[2].Pt2Line18_DateOfMarriage[0]',
      type: 'PDFTextField',
      value: getAnswerById('34', 'marriedDate'),
    },

    // * Place of Your Current Marriage (if married)
    {
      name: 'form1[0].#subform[2].Pt2Line19a_CityTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('34', 'marriedDate'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line19b_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('34', 'state')]],
    },
    {
      name: 'form1[0].#subform[2].Pt2Line19c_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('34', 'province'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line19d_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('34', 'country'),
    },

    // * Names of All Your Spouses (if any)
    // * spouse 1
    {
      name: 'form1[0].#subform[2].PtLine20a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'lastName'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line20b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'firstName'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line20c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'middleName'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line21_DateMarriageEnded[0]',
      type: 'PDFTextField',
      value: '',
    },

    // * spouse 2

    {
      name: 'form1[0].#subform[2].Pt2Line22a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('46', 'lastName'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line22b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('46', 'firstName'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line22c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('46', 'middleName'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line23_DateMarriageEnded[0]',
      type: 'PDFTextField',
      value: getAnswerById('46', 'divorceDatePriorSpouse'),
    },

    // * Information About Your Parents

    {
      name: 'form1[0].#subform[2].Pt2Line24_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('47', 'lastName'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line24_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('47', 'firstName'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line24_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('47', 'middleName'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line25_DateofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('47', 'birthDate'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line26_Male[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[2].Pt2Line26_Female[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[2].Pt2Line27_CountryofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('47', 'birthCountry'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line28_CityTownOrVillageOfResidence[0]',
      type: 'PDFTextField',
      value: getAnswerById('48', 'currentCity'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line29_CountryOfResidence[0]',
      type: 'PDFTextField',
      value: getAnswerById('48', 'currentCountry'),
    },
    // *** second parrent
    {
      name: 'form1[0].#subform[2].Pt2Line30a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('49', 'lastName'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line30b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('49', 'firstName'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line30c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('49', 'middleName'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line31_DateofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('49', 'birthDate'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line32_Male[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[2].Pt2Line32_Female[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[2].Pt2Line33_CountryofBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('49', 'birthCountry'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line34_CityTownOrVillageOfResidence[0]',
      type: 'PDFTextField',
      value: getAnswerById('50', 'currentCity'),
    },
    {
      name: 'form1[0].#subform[2].Pt2Line35_CountryOfResidence[0]',
      type: 'PDFTextField',
      value: getAnswerById('50', 'currentCountry'),
    },

    // * Additional Information About You (Petitioner)
    {
      name: 'form1[0].#subform[2].Pt2Line36_USCitizen[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    // {
    //   name: 'form1[0].#subform[2].Pt2Line36_LPR[0]',
    //   type: 'PDFCheckBox',
    //   checked: getAnswerById('82', 'currentCountry') === '',
    // },
    {
      name: 'form1[0].#subform[2].Pt2Line23a_checkbox[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '82',
          'obtainedCertificateOfNaturalizationOrCitizenship',
        ) === 'Birth',
    },
    {
      name: 'form1[0].#subform[2].Pt2Line23b_checkbox[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('82', 'howDidYouBecomeUsCitizen') === 'Naturalization',
    },
    {
      name: 'form1[0].#subform[2].Pt2Line23c_checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('82', 'howDidYouBecomeUsCitizen') === 'Parents',
    },
    {
      name: 'form1[0].#subform[2].Pt2Line36_Yes[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '82',
          'obtainedCertificateOfNaturalizationOrCitizenship',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[2].Pt2Line36_No[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '82',
          'obtainedCertificateOfNaturalizationOrCitizenship',
        ) === 'No',
    },
    {
      name: 'form1[0].#subform[2].Pt2Line37a_CertificateNumber[0]',
      type: 'PDFTextField',
      value:
        getAnswerById(
          '82',
          'obtainedCertificateOfNaturalizationOrCitizenship',
        ) === 'Yes'
          ? getAnswerById('82', 'certificateNumber')
          : '',
    },
    {
      name: 'form1[0].#subform[2].Pt2Line37b_PlaceOfIssuance[0]',
      type: 'PDFTextField',
      value:
        getAnswerById(
          '82',
          'obtainedCertificateOfNaturalizationOrCitizenship',
        ) === 'Yes'
          ? getAnswerById('82', 'issuancePlace')
          : '',
    },
    {
      name: 'form1[0].#subform[2].Pt2Line37c_DateOfIssuance[0]',
      type: 'PDFTextField',
      value:
        getAnswerById(
          '82',
          'obtainedCertificateOfNaturalizationOrCitizenship',
        ) === 'Yes'
          ? getAnswerById('82', 'issuanceDate')
          : '',
    },
    // !! Page 4

    // ?? Part 2. Information About You (Petitioner) (continued)
    {
      name: 'form1[0].#subform[3].Pt2Line40a_ClassOfAdmission[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].Pt2Line40b_DateOfAdmission[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].Pt2Line40d_CityOrTown[0]',
      type: 'PDFTextField',
      value: '',
    },
    // {
    //   name: 'form1[0].#subform[3].Pt2Line40e_State[0]',
    //   type: 'PDFDropdown',
    //   selected: [' '],
    // },
    {
      name: 'form1[0].#subform[3].Pt2Line41_Yes[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '82',
          'gainedPermanentStatusOrCitizenshipThroughAdoption',
        ) === 'Yes',
    },
    {
      name: 'form1[0].#subform[3].Pt2Line41_No[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById(
          '82',
          'gainedPermanentStatusOrCitizenshipThroughAdoption',
        ) === 'No',
    },
    // ?? Employment History
    {
      name: 'form1[0].#subform[3].Pt2Line40_EmployerOrCompName[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingEmployerName'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line41_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingStreetName'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line41_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('62', 'sponsorWorkingApt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[3].Pt2Line41_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('62', 'sponsorWorkingApt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[3].Pt2Line41_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('62', 'sponsorWorkingApt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[3].Pt2Line41_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingAptSteFlrN'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line41_CityOrTown[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].Pt2Line41_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('62', 'sponsorWorkingStates')]],
    },
    {
      name: 'form1[0].#subform[3].Pt2Line41_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingZipCode'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line41_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingProvince'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line41_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingPostalCode'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line41_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingCountry'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line42_Occupation[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingOccupation'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line43a_DateFrom[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingEmploymentDatesFrom'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line43b_DateTo[0]',
      type: 'PDFTextField',
      value: 'PRESENT',
    },
    // Employer 2
    {
      name: 'form1[0].#subform[3].Pt2Line44_EmployerOrOrgName[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingEmployerName0'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line45_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingStreetName0'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line45_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('62', 'sponsorWorkingApt/Ste/Flr0') === 'Apt',
    },
    {
      name: 'form1[0].#subform[3].Pt2Line45_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('62', 'sponsorWorkingApt/Ste/Flr0') === 'Ste',
    },
    {
      name: 'form1[0].#subform[3].Pt2Line45_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('62', 'sponsorWorkingApt/Ste/Flr0') === 'Flr',
    },
    {
      name: 'form1[0].#subform[3].Pt2Line45_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingAptSteFlrN0'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line45_CityOrTown[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[3].Pt2Line45_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('62', 'sponsorWorkingStates0')]],
    },
    {
      name: 'form1[0].#subform[3].Pt2Line45_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingZipCode0'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line45_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingProvince0'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line45_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingPostalCode0'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line45_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingCountry0'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line46_Occupation[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingOccupation0'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line47a_DateFrom[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingEmploymentDatesFrom0'),
    },
    {
      name: 'form1[0].#subform[3].Pt2Line47b_DateTo[0]',
      type: 'PDFTextField',
      value: getAnswerById('62', 'sponsorWorkingEmploymentDatesTo0'),
    },
    //
    {
      name: 'form1[0].#subform[3].Pt3Line1_Ethnicity[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'ethnicity') === 'Hispanic or Latino',
    },
    {
      name: 'form1[0].#subform[3].Pt3Line1_Ethnicity[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'ethnicity') === 'NOT Hispanic or Latino',
    },
    //
    {
      name: 'form1[0].#subform[3].Pt3Line2_Race_White[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'white') === 'White',
    },
    {
      name: 'form1[0].#subform[3].Pt3Line2_Race_Asian[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'asian') === 'Asian',
    },
    {
      name: 'form1[0].#subform[3].Pt3Line2_Race_Black[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'black') === 'Black or African American',
    },
    {
      name: 'form1[0].#subform[3].Pt3Line2_Race_AmericanIndianAlaskaNative[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('29', 'indian') === 'American Indian or Alaska Native',
    },
    {
      name: 'form1[0].#subform[3].Pt3Line2_Race_NativeHawaiianOtherPacificIslander[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('29', 'island') === 'Native Hawaiian or Pacific Islander',
    },
    //
    {
      name: 'form1[0].#subform[3].Pt3Line3_HeightFeet[0]',
      type: 'PDFDropdown',
      selected: [getAnswerById('29', 'heightFt')],
    },
    {
      name: 'form1[0].#subform[3].Pt3Line3_HeightInches[0]',
      type: 'PDFDropdown',
      selected: [getAnswerById('29', 'heightInch')],
    },
    //
    {
      name: 'form1[0].#subform[3].Pt3Line4_Pound1[0]',
      type: 'PDFTextField',
      value: getAnswerById('29', 'weightPounds')[0],
    },
    {
      name: 'form1[0].#subform[3].Pt3Line4_Pound2[0]',
      type: 'PDFTextField',
      value: getAnswerById('29', 'weightPounds')[1],
    },
    {
      name: 'form1[0].#subform[3].Pt3Line4_Pound3[0]',
      type: 'PDFTextField',
      value: getAnswerById('29', 'weightPounds')[2],
    },
    //
    {
      name: 'form1[0].#subform[3].Pt3Line5_EyeColor[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'eyeColor') === 'Blue',
    },
    {
      name: 'form1[0].#subform[3].Pt3Line5_EyeColor[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'eyeColor') === 'Brown',
    },
    {
      name: 'form1[0].#subform[3].Pt3Line5_EyeColor[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'eyeColor') === 'Hazel',
    },
    {
      name: 'form1[0].#subform[3].Pt3Line5_EyeColor[3]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'eyeColor') === 'Pink',
    },
    {
      name: 'form1[0].#subform[3].Pt3Line5_EyeColor[4]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'eyeColor') === 'Maroon',
    },
    {
      name: 'form1[0].#subform[3].Pt3Line5_EyeColor[5]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'eyeColor') === 'Green',
    },
    {
      name: 'form1[0].#subform[3].Pt3Line5_EyeColor[6]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'eyeColor') === 'Gray',
    },
    {
      name: 'form1[0].#subform[3].Pt3Line5_EyeColor[7]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'eyeColor') === 'Black',
    },
    {
      name: 'form1[0].#subform[3].Pt3Line5_EyeColor[8]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'eyeColor') === 'Unknown/Other',
    },
    // !! Page 5

    // ?? bio cont o
    {
      name: 'form1[0].#subform[4].Pt3Line6_HairColor[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'hairColor') === 'Bald(NoHair)',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line6_HairColor[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'hairColor') === 'Black',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line6_HairColor[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'hairColor') === 'Blond',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line6_HairColor[3]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'hairColor') === 'Brown',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line6_HairColor[4]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'hairColor') === 'Gray',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line6_HairColor[5]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'hairColor') === 'Red',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line6_HairColor[6]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'hairColor') === 'Sandy',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line6_HairColor[7]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'hairColor') === 'White',
    },
    {
      name: 'form1[0].#subform[4].Pt3Line6_HairColor[8]',
      type: 'PDFCheckBox',
      checked: getAnswerById('29', 'hairColor') === 'Unknown/Other',
    },
    // ?? info about u
    {
      name: 'form1[0].#subform[4].#area[6].Pt4Line1_AlienNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
    {
      name: 'form1[0].#subform[4].#area[7].Pt4Line2_USCISOnlineActNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'uscisNumber'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line3_SSN[0]',
      type: 'PDFTextField',
      value: getAnswerById('68', 'provideSecurityNumber'),
    },
    // ?? full
    {
      name: 'form1[0].#subform[4].Pt4Line4a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'lastName'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line4b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'firstName'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line4c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'middleName'),
    },
    // ?? Other n
    {
      name: 'form1[0].#subform[4].P4Line5a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'familyName1'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line5b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'givenName1'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line5c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('26', 'middleName1'),
    },
    // ?? Other info
    {
      name: 'form1[0].#subform[4].Pt4Line7_CityTownOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'birthCity'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line8_CountryOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'countryBirth'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line9_DateOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'birthDate'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line9_Male[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('21', 'sex') === 'Male',
    },
    {
      name: 'form1[0].#subform[4].Pt4Line9_Female[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('21', 'sex') === 'Female',
    },
    {
      name: 'form1[0].#subform[4].Pt4Line10_Yes[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[4].Pt4Line10_No[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[4].Pt4Line10_Unknown[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    // ?? Phys address
    {
      name: 'form1[0].#subform[4].Pt4Line11_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'streetNumber'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line11_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('42', 'apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[4].Pt4Line11_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('42', 'apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[4].Pt4Line11_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('42', 'apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[4].Pt4Line11_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'apt/Ste/FlrN'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line11_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'city'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line11_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('42', 'state')]],
    },
    {
      name: 'form1[0].#subform[4].Pt4Line11_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'zipCode'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line11_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'province'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line11_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'postalCode'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line11_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'country'),
    },
    // ?? Other address
    {
      name: 'form1[0].#subform[4].Pt4Line12a_StreetNumberName[0]',
      type: 'PDFTextField',
      value: 'SAME',
    },
    {
      name: 'form1[0].#subform[4].Pt4Line12b_Unit[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[4].Pt4Line12b_Unit[1]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[4].Pt4Line12b_Unit[2]',
      type: 'PDFCheckBox',
      checked: false,
    },
    {
      name: 'form1[0].#subform[4].Pt4Line12b_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[4].Pt4Line12c_CityOrTown[0]',
      type: 'PDFTextField',
      value: '',
    },
    // {
    //   name: 'form1[0].#subform[4].Pt4Line12d_State[0]',
    //   type: 'PDFDropdown',
    //   selected: [' '],
    // },
    {
      name: 'form1[0].#subform[4].Pt4Line12e_ZipCode[0]',
      type: 'PDFTextField',
      value: '',
    },
    //
    {
      name: 'form1[0].#subform[4].Pt4Line13_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'streetNumber'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line13_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('44', 'apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[4].Pt4Line13_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('44', 'apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[4].Pt4Line13_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('44', 'apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[4].Pt4Line13_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'apt/Ste/FlrN'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line13_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'city'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line13_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'province'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line13_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'postalCode'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line13_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('44', 'country'),
    },
    {
      name: 'form1[0].#subform[4].Pt4Line14_DaytimePhoneNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'daytimeTelephone'),
    },
    // !! Page 6

    // ??
    {
      name: 'form1[0].#subform[5].Pt4Line15_MobilePhoneNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'mobileTelephone'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line16_EmailAddress[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'emailAddress'),
    },
    // ??
    {
      name: 'form1[0].#subform[5].Pt4Line17_NumberofMarriages[0]',
      type: 'PDFTextField',
      value: '1',
    },
    {
      name: 'form1[0].#subform[5].Pt4Line18_MaritalStatus[4]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[5].Pt4Line19_DateOfMarriage[0]',
      type: 'PDFTextField',
      value: getAnswerById('34', 'marriedDate'),
    },
    // ??
    {
      name: 'form1[0].#subform[5].Pt4Line20a_CityTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('34', 'city'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line20b_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('34', 'state')]],
    },
    {
      name: 'form1[0].#subform[5].Pt4Line20c_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('34', 'province'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line20d_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('34', 'country'),
    },
    // ??
    {
      name: 'form1[0].#subform[5].Pt4Line16a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'lastName'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line16b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'firstName'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line16c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'middleName'),
    },
    // ??
    {
      name: 'form1[0].#subform[5].Pt4Line18a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'lastName'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line18b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'firstName'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line18c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'middleName'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line17_DateMarriageEnded[1]',
      type: 'PDFTextField',
      value: getAnswerById('37', 'divorceDatePriorSpouse'),
    },
    // ??
    {
      name: 'form1[0].#subform[5].Pt4Line30a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'lastName'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line30b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'firstName'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line30c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'middleName'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line35_Relationship[0]',
      type: 'PDFTextField',
      value: 'SPOUSE',
    },
    {
      name: 'form1[0].#subform[5].Pt4Line32_DateOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'birthDate'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line49_CountryOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'countryBirth'),
    },
    // ??
    {
      name: 'form1[0].#subform[5].Pt4Line34a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'LastName1'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line34b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'FirstName1'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line34c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'MiddleName1'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line35_Relationship[0]',
      type: 'PDFTextField',
      value: 'CHILD',
    },
    {
      name: 'form1[0].#subform[5].Pt4Line36_DateOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'BirthDate1'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line37_CountryOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'BirthCountry1'),
    },
    // ??
    {
      name: 'form1[0].#subform[5].Pt4Line38a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'LastName2'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line38b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'FirstName2'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line38c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'MiddleName2'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line39_Relationship[0]',
      type: 'PDFTextField',
      value: 'CHILD',
    },
    {
      name: 'form1[0].#subform[5].Pt4Line40_DateOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'BirthDate2'),
    },
    {
      name: 'form1[0].#subform[5].Pt4Line41_CountryOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'BirthCountry2'),
    },
    // !! Page 7

    // ??
    {
      name: 'form1[0].#subform[6].Pt4Line42a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'LastName3'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line42b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'FirstName3'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line42c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'MiddleName3'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line43_Relationship[0]',
      type: 'PDFTextField',
      value: 'CHILD',
    },
    {
      name: 'form1[0].#subform[6].Pt4Line44_DateOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'BirthDate3'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line45_CountryOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'BirthCountry3'),
    },
    // ??
    {
      name: 'form1[0].#subform[6].Pt4Line46a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'LastName4'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line46b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'FirstName4'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line46c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'MiddleName4'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line47_Relationship[0]',
      type: 'PDFTextField',
      value: 'CHILD',
    },
    {
      name: 'form1[0].#subform[6].Pt4Line48_DateOfBirth[0]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'BirthDate4'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line49_CountryOfBirth[1]',
      type: 'PDFTextField',
      value: getAnswerById('35', 'BirthCountry4'),
    },
    // ??
    {
      name: 'form1[0].#subform[6].Pt4Line20_Yes[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[6].Pt4Line20_No[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    //
    {
      name: 'form1[0].#subform[6].Pt4Line21a_ClassOfAdmission[0]',
      type: 'PDFDropdown',
      selected: [getAnswerById('54', 'formStatusI94') || ' '],
    },
    {
      name: 'form1[0].#subform[6].#area[8].Pt4Line21b_ArrivalDeparture[0]',
      type: 'PDFTextField',
      value: getAnswerById('54', 'formI94Number'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line21c_DateOfArrival[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'lastArrivalUS'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line21d_DateExpired[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('54', 'isExpirationSayD/S') === 'Yes'
          ? 'D/S'
          : getAnswerById('54', 'expirationDateOfAuthorizedFormI94'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line22_PassportNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'passportNumber'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line23_TravelDocNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'travelDocumentNumber'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line24_CountryOfIssuance[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'issuingCountry'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line25_ExpDate[0]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'expOfPassportTravelDocument'),
    },
    // ??
    {
      name: 'form1[0].#subform[6].Pt4Line26_NameOfCompany[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employerName'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line26_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'streetName'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line26_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[6].Pt4Line26_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[6].Pt4Line26_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('60', 'Apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[6].Pt4Line26_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'AptSteFlrN'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line26_CityOrTown[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[6].Pt4Line26_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('60', 'states')]],
    },
    {
      name: 'form1[0].#subform[6].Pt4Line26_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'zipCode'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line26_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'province'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line26_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'postalCode'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line26_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'country'),
    },
    {
      name: 'form1[0].#subform[6].Pt4Line27_DateEmploymentBegan[0]',
      type: 'PDFTextField',
      value: getAnswerById('60', 'employmentDatesFrom'),
    },
    // ??
    {
      name: 'form1[0].#subform[6].Pt4Line28_No[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    {
      name: 'form1[0].#subform[6].Pt4Line28_Yes[0]',
      type: 'PDFCheckBox',
      checked: false,
    },
    // {
    //   name: 'form1[0].#subform[5].Pt4Line41_CountryOfBirth[0]',
    //   type: 'PDFTextField',
    //   value: '',
    // },
    // {
    //   name: 'form1[0].#subform[5].Pt4Line41_CountryOfBirth[0]',
    //   type: 'PDFTextField',
    //   value: '',
    // },
    // {
    //   name: 'form1[0].#subform[5].Pt4Line41_CountryOfBirth[0]',
    //   type: 'PDFTextField',
    //   value: '',
    // },
    // {
    //   name: 'form1[0].#subform[5].Pt4Line41_CountryOfBirth[0]',
    //   type: 'PDFTextField',
    //   value: '',
    // },
    // {
    //   name: 'form1[0].#subform[5].Pt4Line41_CountryOfBirth[0]',
    //   type: 'PDFTextField',
    //   value: '',
    // },
    // {
    //   name: 'form1[0].#subform[5].Pt4Line41_CountryOfBirth[0]',
    //   type: 'PDFTextField',
    //   value: '',
    // },
    // {
    //   name: 'form1[0].#subform[5].Pt4Line41_CountryOfBirth[0]',
    //   type: 'PDFTextField',
    //   value: '',
    // },
    // !! Page 8

    // ??
    {
      name: 'form1[0].#subform[7].Pt4Line55a_FamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'lastName'),
    },
    {
      name: 'form1[0].#subform[7].Pt4Line55b_GivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'firstName'),
    },
    {
      name: 'form1[0].#subform[7].Pt4Line55c_MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'middleName'),
    },
    {
      name: 'form1[0].#subform[7].Pt4Line56_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'streetNumber'),
    },
    {
      name: 'form1[0].#subform[7].Pt4Line56_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('42', 'apt/Ste/Flr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[7].Pt4Line56_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('42', 'apt/Ste/Flr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[7].Pt4Line56_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('42', 'apt/Ste/Flr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[7].Pt4Line56_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'apt/Ste/FlrN'),
    },
    {
      name: 'form1[0].#subform[7].Pt4Line56_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'city'),
    },
    {
      name: 'form1[0].#subform[7].Pt4Line56_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'province'),
    },
    {
      name: 'form1[0].#subform[7].Pt4Line56_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'postalCode'),
    },
    {
      name: 'form1[0].#subform[7].Pt4Line56_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('42', 'country'),
    },
    // ??
    {
      name: 'form1[0].#subform[7].Pt4Line57_StreetNumberName[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('19') === 'Yes'
          ? getAnswerById('42', 'streetNumber')
          : 'Never lived together',
    },
    {
      name: 'form1[0].#subform[7].Pt4Line57_Unit[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('19') === 'Yes'
          ? getAnswerById('42', 'apt/Ste/Flr') === 'Apt'
          : false,
    },
    {
      name: 'form1[0].#subform[7].Pt4Line57_Unit[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('19') === 'Yes'
          ? getAnswerById('42', 'apt/Ste/Flr') === 'Ste'
          : false,
    },
    {
      name: 'form1[0].#subform[7].Pt4Line57_Unit[2]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('19') === 'Yes'
          ? getAnswerById('42', 'apt/Ste/Flr') === 'Flr'
          : false,
    },
    {
      name: 'form1[0].#subform[7].Pt4Line57_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('19') === 'Yes'
          ? getAnswerById('42', 'apt/Ste/FlrN')
          : '',
    },
    {
      name: 'form1[0].#subform[7].Pt4Line57_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('19') === 'Yes' ? getAnswerById('42', 'city') : '',
    },
    {
      name: 'form1[0].#subform[7].Pt4Line57_State[0]',
      type: 'PDFDropdown',
      selected:
        getAnswerById('19') === 'Yes'
          ? [usStates[getAnswerById('42', 'state')]]
          : [' '],
    },
    {
      name: 'form1[0].#subform[7].Pt4Line57_ZipCode[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('19') === 'Yes' ? getAnswerById('42', 'zipCode') : '',
    },
    {
      name: 'form1[0].#subform[7].Pt4Line57_Province[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('19') === 'Yes' ? getAnswerById('42', 'province') : '',
    },
    {
      name: 'form1[0].#subform[7].Pt4Line57_PostalCode[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('19') === 'Yes' ? getAnswerById('42', 'postalCode') : '',
    },
    {
      name: 'form1[0].#subform[7].Pt4Line57_Country[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('19') === 'Yes' ? getAnswerById('42', 'country') : '',
    },
    {
      name: 'form1[0].#subform[7].Pt4Line58a_DateFrom[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('19') === 'Yes' ? getAnswerById('42', 'dateFrom') : '',
    },
    {
      name: 'form1[0].#subform[7].Pt4Line58b_DateTo[0]',
      type: 'PDFTextField',
      value: '',
    },
    // ??
    // {
    //   name: 'form1[0].#subform[7].Pt4Line60a_CityOrTown[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('60', 'employmentDatesFrom'),
    // },
    // {
    //   name: 'form1[0].#subform[7].Pt4Line60b_State[0]',
    //   type: 'PDFTextField',
    //   value: '',
    // },
    // ??
    // {
    //   name: 'form1[0].#subform[7].Pt4Line61a_CityOrTown[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('60', 'employmentDatesFrom'),
    // },
    // {
    //   name: 'form1[0].#subform[7].Pt4Line61b_Province[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('60', 'employmentDatesFrom'),
    // },
    // {
    //   name: 'form1[0].#subform[7].Pt4Line61c_Country[0]',
    //   type: 'PDFTextField',
    //   value: getAnswerById('60', 'employmentDatesFrom'),
    // },
    // ??
    {
      name: 'form1[0].#subform[7].Part4Line1_No[0]',
      type: 'PDFCheckBox',
      checked: true,
    },
    // !! Page 9

    // ??
    {
      name: 'form1[0].#subform[8].Pt4Line8a_FamilyName[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[8].Pt4Line8b_GivenName[0]',
      type: 'PDFTextField',
      value: '',
    },
    {
      name: 'form1[0].#subform[8].Pt4Line8c_MiddleName[0]',
      type: 'PDFTextField',
      value: '',
    },
    // ??
    {
      name: 'form1[0].#subform[8].Pt6Line1Checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'readNUnderstandEnglish') === 'Yes',
    },
    {
      name: 'form1[0].#subform[8].Pt6Line1Checkbox[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Interpreter' ||
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Both',
    },
    {
      name: 'form1[0].#subform[8].Pt6Line1b_Language[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Interpreter' ||
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Both'
          ? getAnswerById('69', 'interpreterLanguageTranslated')
          : '',
    },
    {
      name: 'form1[0].#subform[8].Pt6Line2_Checkbox[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Preparer' ||
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Both',
    },
    {
      name: 'form1[0].#subform[8].Pt6Line2_RepresentativeName[0]',
      type: 'PDFTextField',
      value:
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Preparer' ||
        getAnswerById('69', 'useInterpreterOrPreparer') === 'Both'
          ? `${getAnswerById('69', 'preparerLastName')} ${getAnswerById('69', 'preparerFirstName')}`
          : '',
    },
    // ??
    {
      name: 'form1[0].#subform[8].Pt6Line3_DaytimePhoneNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'daytimeTelephone'),
    },
    {
      name: 'form1[0].#subform[8].Pt6Line4_MobileNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'mobileTelephone'),
    },
    {
      name: 'form1[0].#subform[8].Pt6Line5_Email[0]',
      type: 'PDFTextField',
      value: getAnswerById('27', 'emailAddress'),
    },
    // !! Page 10

    // ?? Interpreter's Full Name
    {
      name: 'form1[0].#subform[9].Pt7Line1a_InterpreterFamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterLastName'),
    },
    {
      name: 'form1[0].#subform[9].Pt7Line1b_InterpreterGivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterFirstName'),
    },
    {
      name: 'form1[0].#subform[9].Pt7Line2_InterpreterBusinessorOrg[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterBusinessName'),
    },
    // ?? Interpreter's Mailing Address
    {
      name: 'form1[0].#subform[9].Pt7Line3_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterStreetN'),
    },
    {
      name: 'form1[0].#subform[9].Pt7Line3_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'interpreterAptSteFlr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[9].Pt7Line3_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'interpreterAptSteFlr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[9].Pt7Line3_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'interpreterAptSteFlr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[9].Pt7Line3_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterAptSteFlrN'),
    },
    {
      name: 'form1[0].#subform[9].Pt7Line3_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterCity'),
    },
    {
      name: 'form1[0].#subform[9].Pt7Line3_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('69', 'interpreterStates')]],
    },
    {
      name: 'form1[0].#subform[9].Pt7Line3_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterZipCode'),
    },
    {
      name: 'form1[0].#subform[9].Pt7Line3_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterProvince'),
    },
    {
      name: 'form1[0].#subform[9].Pt7Line3_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterPostalCode'),
    },
    {
      name: 'form1[0].#subform[9].Pt7Line3_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterCountry'),
    },
    // ?? Interpreter's Contact Information
    {
      name: 'form1[0].#subform[9].Pt7Line4_InterpreterDaytimeTelephone[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterDaytimeTelephoneN'),
    },
    {
      name: 'form1[0].#subform[9].Pt4Line53_DaytimePhoneNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterMobileTelephoneN'),
    },
    {
      name: 'form1[0].#subform[9].Pt7Line5_Email[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterEmailAddress'),
    },
    // ?? Interpreter's Certification
    {
      name: 'form1[0].#subform[9].Pt7_NameofLanguage[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'interpreterLanguageTranslated'),
    },
    // ?? Preparer's Full Name
    {
      name: 'form1[0].#subform[9].Pt8Line1a_PreparerFamilyName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerLastName'),
    },
    {
      name: 'form1[0].#subform[9].Pt8Line1b_PreparerGivenName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerFirstName'),
    },
    {
      name: 'form1[0].#subform[9].Pt8Line2_BusinessName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerBusinessName'),
    },
    // ??  Preparer's Mailing Address
    {
      name: 'form1[0].#subform[9].Pt8Line3_StreetNumberName[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerStreetN'),
    },
    {
      name: 'form1[0].#subform[9].Pt8Line3_Unit[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'preparerAptSteFlr') === 'Apt',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line3_Unit[1]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'preparerAptSteFlr') === 'Ste',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line3_Unit[2]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'preparerAptSteFlr') === 'Flr',
    },
    {
      name: 'form1[0].#subform[9].Pt8Line3_AptSteFlrNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerAptSteFlrN'),
    },
    {
      name: 'form1[0].#subform[9].Pt8Line3_CityOrTown[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerCity'),
    },
    {
      name: 'form1[0].#subform[9].Pt8Line3_State[0]',
      type: 'PDFDropdown',
      selected: [usStates[getAnswerById('69', 'preparerStates')]],
    },
    {
      name: 'form1[0].#subform[9].Pt8Line3_ZipCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerZipCode'),
    },
    {
      name: 'form1[0].#subform[9].Pt8Line3_Province[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerProvince'),
    },
    {
      name: 'form1[0].#subform[9].Pt8Line3_PostalCode[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerPostalCode'),
    },
    {
      name: 'form1[0].#subform[9].Pt8Line3_Country[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerCountry'),
    },

    // !! Page 11

    // ??  Preparer's Contact Information
    {
      name: 'form1[0].#subform[10].Pt8Line4_DaytimePhoneNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerDaytimeTelephoneN'),
    },
    {
      name: 'form1[0].#subform[10].Pt8Line5_PreparerFaxNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerMobileTelephoneN'),
    },
    {
      name: 'form1[0].#subform[10].Pt8Line6_Email[0]',
      type: 'PDFTextField',
      value: getAnswerById('69', 'preparerEmailAddress'),
    },
    // ?? Preparer's Statement
    {
      name: 'form1[0].#subform[10].Pt8Line7_Checkbox[0]',
      type: 'PDFCheckBox',
      checked: getAnswerById('69', 'ssPreparerAttorneyRepresentative') === 'No',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line7_Checkbox[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'ssPreparerAttorneyRepresentative') === 'Yes',
    },
    {
      name: 'form1[0].#subform[10].Pt8Line7b_Checkbox[0]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'ssPreparerAttorneyRepresentative') === 'Yes'
          ? getAnswerById('69', 'attorneyRepresentationExtendBeyond') ===
            'Extends beyond just forms'
          : false,
    },
    {
      name: 'form1[0].#subform[10].Pt8Line7b_Checkbox[1]',
      type: 'PDFCheckBox',
      checked:
        getAnswerById('69', 'ssPreparerAttorneyRepresentative') === 'Yes'
          ? getAnswerById('69', 'attorneyRepresentationExtendBeyond') ===
            'Limited to forms'
          : false,
    },

    // !! Page 12
    // ?? Additional Information

    {
      name: 'form1[0].#subform[11].Pt2Line4a_FamilyName[1]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'lastName'),
    },
    {
      name: 'form1[0].#subform[11].Pt2Line4b_GivenName[1]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'firstName'),
    },
    {
      name: 'form1[0].#subform[11].Pt2Line4c_MiddleName[1]',
      type: 'PDFTextField',
      value: getAnswerById('21', 'middleName'),
    },
    {
      name: 'form1[0].#subform[11].Pt2Line1_AlienNumber[1]',
      type: 'PDFTextField',
      value: getAnswerById('53', 'aNumber'),
    },
  ];
};

export { useI130Fields };
