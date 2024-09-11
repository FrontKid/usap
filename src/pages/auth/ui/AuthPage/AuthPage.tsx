/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
// import { IoLogoFacebook } from 'react-icons/io';
import { FcGoogle } from 'react-icons/fc';
import {
  GoogleAuthProvider,
  // FacebookAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useLocalStorage } from '@uidotdev/usehooks';

import { AuthForm } from '@/widgets/auth';

import { Logo, Button } from '@/shared/ui';
import { auth, db } from '@/shared/firebase';
import { useToggle } from '@/shared/hooks';

import { getUserInfo } from '@/shared/firebase/services';
import { ECollectionNames } from '@/shared/types/ECollectionNames';

import { ResetPassword } from '../ResetPassword';

import css from './AuthPage.module.scss';

const AuthPage = () => {
  const [isSignIn, toggleAuthMethod] = useToggle(true);
  const [isResetPassword, toggleResetPassword] = useToggle(false);

  const [, setUser] = useLocalStorage('user');
  const [userEmail, setUserEmail] = useLocalStorage('userEmail');
  const [, setPairNames] = useLocalStorage('sponsorImmigrantPair');

  const navigate = useNavigate();

  const handleToggleSignIn = (resetForm: () => void) => {
    toggleAuthMethod();
    resetForm();
  };

  const handleGoogleAuth = () => {
    (async () => {
      const provider = new GoogleAuthProvider();

      try {
        const credentioals = await signInWithPopup(auth, provider);

        const { user } = credentioals;

        const accessToken = await user.getIdToken();
        const userID = user.uid;

        const userBd = await getUserInfo(userID);

        const newUserData = {
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

          providerId: credentioals.providerId,
        };

        if (!userBd) {
          await setDoc(
            doc(db, ECollectionNames.USERS, userID),
            newUserData.user,
          );
        }

        if (userEmail !== user.email) {
          setPairNames(null);
          setUserEmail(user.email);
        }

        setUser(newUserData);
        navigate('/');
      } catch (error: any) {
        const userError = {
          user: {
            id: null,
            email: null,
            firstName: '',
            secondName: '',
            avatarURL: '',
            isEmailVerified: false,
            isAgreeLegalAgreements: false,
            isEligibilityTestCompleted: false,
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
      }
    })();
  };

  // const handleFacebookAuth = () => {
  //   (async () => {
  //     const provider = new FacebookAuthProvider();

  //     try {
  //       const credentioals = await signInWithPopup(auth, provider);

  //       const { user } = credentioals;

  //       const accessToken = await user.getIdToken();

  //       const userID = user.uid;

  //       const userBd = await getUserInfo(userID);

  //       const newUserData = {
  //         user: {
  //           id: userID,
  //           email: user.email,
  //           firstName: userBd?.firstName ?? '',
  //           secondName: userBd?.secondName ?? '',
  //           avatarURL: userBd?.avatarURL ?? '',
  //           isEmailVerified: user.emailVerified,
  //           isAgreeLegalAgreements: userBd?.isAgreeLegalAgreements ?? false,
  //           isEligibilityTestCompleted:
  //             userBd?.isEligibilityTestCompleted ?? false,
  //           testsCompletedInfo: {
  //             basicPersonalInfo:
  //               userBd?.testsCompletedInfo.basicPersonalInfo ?? 0,
  //             familyNMarriage: userBd?.testsCompletedInfo.familyNMarriage ?? 0,
  //             immigrationNTravel:
  //               userBd?.testsCompletedInfo.immigrationNTravel ?? 0,
  //             employment: userBd?.testsCompletedInfo.employment ?? 0,
  //             financials: userBd?.testsCompletedInfo.financials ?? 0,
  //             disclaimer: userBd?.testsCompletedInfo.disclaimer ?? 0,
  //             miscellaneous: userBd?.testsCompletedInfo.miscellaneous ?? 0,
  //           },
  //           token: accessToken,
  //           isAdmin: userBd?.isAdmin ?? false,
  //           authProviderId: null,
  //         },
  //         error: {
  //           code: '',
  //           message: '',
  //         },
  //       };

  //       if (!userBd) {
  //         await setDoc(
  //           doc(db, ECollectionNames.USERS, userID),
  //           newUserData.user,
  //         );
  //         setUser(newUserData);
  //       }

  //       navigate('/');
  //     } catch (error: any) {
  //       const userError = {
  //         user: {
  //           id: null,
  //           email: null,
  //           firstName: '',
  //           secondName: '',
  //           avatarURL: '',
  //           isEmailVerified: false,
  //           isAgreeLegalAgreements: false,
  //           isEligibilityTestCompleted: false,
  //           testsCompletedInfo: {
  //             basicPersonalInfo: 0,
  //             familyNMarriage: 0,
  //             immigrationNTravel: 0,
  //             employment: 0,
  //             financials: 0,
  //             disclaimer: 0,
  //             miscellaneous: 0,
  //           },
  //           token: null,
  //           isAdmin: false,
  //           authProviderId: null,
  //         },
  //         error: {
  //           code: error.code,
  //           message: error.message,
  //         },
  //       };

  //       setUser(userError);
  //     }
  //   })();
  // };

  const SIGN_IN_OR_SIGNUP = isSignIn ? 'Sign in' : 'Sign up';
  const WELCOME_MESSAGE = isSignIn ? 'Welcome back' : 'Create your account';

  return (
    <div className={css.authWrapper}>
      {!isResetPassword && (
        <div className={css.authPage}>
          <div className={css.formWrapper}>
            <Logo className={css.authLogo} />

            <h1 className={css.title}>{WELCOME_MESSAGE}</h1>

            <AuthForm
              isSignIn={isSignIn}
              onToggle={handleToggleSignIn}
              toggleResetPassword={toggleResetPassword}
            />

            <span className={css.or}>--------------- OR ----------------</span>

            <div className={css.alternativeWrapper}>
              {/* <Button
              onClick={handleFacebookAuth}
              className={css.facebookButton}
              styled="withIcon"
              color="facebook"
            >
              <IoLogoFacebook size={30} />

              {`${SIGN_IN_OR_SIGNUP} with Facebook`}
            </Button> */}

              <Button
                onClick={handleGoogleAuth}
                styled="withIcon"
                color="google"
              >
                <FcGoogle size={30} />

                {`${SIGN_IN_OR_SIGNUP} with Google`}
              </Button>
            </div>
          </div>

          {!isSignIn && (
            <span className={css.policyWarn}>
              By signing up, you agree to our terms of service and privacy
              policy.
            </span>
          )}
        </div>
      )}
      {isResetPassword && <ResetPassword onBack={toggleResetPassword} />}
    </div>
  );
};

export { AuthPage };
