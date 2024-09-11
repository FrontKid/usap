import { getAllUsersInfo, getAllUserAnswers } from '@/shared/firebase/services';
import { DocumentData } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IPDFField } from '../types/IPDFField';
import { getAnswerFromArray } from '../utils/getAnswerFromArray';
import { getUserAnswerById } from '../utils/getUserAnswerById';

const useG1145Fields = (): IPDFField[] => {
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
    {
      name: 'form1[0].#subform[0].LastName[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'lastName'),
    },
    {
      name: 'form1[0].#subform[0].FirstName[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'firstName'),
    },
    {
      name: 'form1[0].#subform[0].MiddleName[0]',
      type: 'PDFTextField',
      value: getAnswerById('28', 'middleName'),
    },
    {
      name: 'form1[0].#subform[0].Email[0]',
      type: 'PDFTextField',
      value: getAnswerById('29', 'emailAddress'),
    },
    {
      name: 'form1[0].#subform[0].MobilePhoneNumber[0]',
      type: 'PDFTextField',
      value: getAnswerById('29', 'mobileTelephone'),
    },
  ];
};

export { useG1145Fields };
