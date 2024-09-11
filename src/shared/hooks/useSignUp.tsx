import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { useLocalStorage } from '@uidotdev/usehooks';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { getUserInfo } from '../firebase/services';
import { ECollectionNames } from '../types/ECollectionNames';

type TError = {
  code: string;
  message: string;
};

type TSignUpReturn = (
  email: string,
  password: string,
  setFieldError: (error: TError) => void,
) => void;

const useSignUp = (): TSignUpReturn => {
  const navigate = useNavigate();
  const [, setUser] = useLocalStorage('user');
  const [, setUserEmail] = useLocalStorage('userEmail');

  const signUp = (
    email: string,
    password: string,
    setFieldError: (error: TError) => void,
  ) => {
    (async () => {
      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        if (!user.emailVerified) {
          await sendEmailVerification(user);
        }

        const accessToken = await user.getIdToken();
        const userID = user.uid;

        const userBd = await getUserInfo(userID);

        const newUser = {
          user: {
            id: userID,
            email: user.email,
            firstName: userBd?.firstName ?? '',
            secondName: userBd?.secondName ?? '',
            avatarURL: userBd?.avatarURL ?? '',
            isEmailVerified: user.emailVerified,
            isAgreeLegalAgreements: userBd?.isAgreeLegalAgreements ?? false,
            isEligibilityTestCompleted:
              userBd?.isEligibilityTestCompleted ?? false,
            testsCompletedInfo: {
              basicPersonalInfo:
                userBd?.testsCompletedInfo.basicPersonalInfo ?? 0,
              familyNMarriage: userBd?.testsCompletedInfo.familyNMarriage ?? 0,
              immigrationNTravel:
                userBd?.testsCompletedInfo.immigrationNTravel ?? 0,
              employment: userBd?.testsCompletedInfo.employment ?? 0,
              financials: userBd?.testsCompletedInfo.financials ?? 0,
              disclaimer: userBd?.testsCompletedInfo.disclaimer ?? 0,
              miscellaneous: userBd?.testsCompletedInfo.miscellaneous ?? 0,
            },
            token: accessToken,
            isAdmin: userBd?.isAdmin ?? false,
            authProviderId: null,
          },
          error: {
            code: '',
            message: '',
          },
        };

        if (!userBd) {
          await setDoc(doc(db, ECollectionNames.USERS, userID), newUser.user);
          setUser(newUser);
          setUserEmail(user.email);
        }

        navigate('/');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const userError = {
          user: {
            id: null,
            email: null,
            firstName: '',
            secondName: '',
            avatarURL: '',
            isEmailVerified: false,
            isEligibilityTestCompleted: false,
            isAgreeLegalAgreements: false,
            testsCompletedInfo: {
              basicPersonalInfo: 0,
              familyNMarriage: 0,
              immigrationNTravel: 0,
              employment: 0,
              financials: 0,
              disclaimer: 0,
              miscellaneous: 0,
            },
            token: null,
            isAdmin: false,
            authProviderId: null,
          },
          error: {
            code: error.code,
            message: error.message,
          },
        };

        setUser(userError);
        setFieldError({ code: error.code, message: error.message });
      }
    })();
  };

  return signUp;
};

export { useSignUp };
