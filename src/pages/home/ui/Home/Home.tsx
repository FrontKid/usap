// import { CiLock, CiUnlock } from 'react-icons/ci';
// import cn from 'classnames';
import { useLocalStorage } from '@uidotdev/usehooks';
import { sendEmailVerification, reload } from 'firebase/auth';
import CircularProgress from '@mui/material/CircularProgress';
import { useCallback, useEffect } from 'react';

import { auth } from '@/shared/firebase';

import { Button, ControlCard, InfoCard } from '@/shared/ui';

import task from '/assets/icons/Task.svg';

import { updateUserEmailVarify } from '@/shared/firebase/services';
import { getUrlToContinueQuiz } from '../../utils/getUrlToContinueQuiz';

import css from './Home.module.scss';

const Home = () => {
  const [userData, setUserData] = useLocalStorage<TUser>('user');

  const handleResendEmailVarify = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
    } catch (error) {
      // console.log(error)
    }
  };

  const checkEmailVerification = useCallback(async () => {
    try {
      if (auth.currentUser) {
        await reload(auth.currentUser);

        if (auth.currentUser.emailVerified) {
          updateUserEmailVarify(
            userData?.user.id ?? '',
            { isEmailVerified: true },
            setUserData,
          );
        }
      }
    } catch (error) {
      // console.error('Error reloading user:', error);
    }
  }, [setUserData, userData]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkEmailVerification();
    }, 3000); // Проверка каждые 60 секунд

    if (auth.currentUser?.emailVerified) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [checkEmailVerification]);

  return (
    <>
      {userData?.user.isEmailVerified && (
        <ControlCard>
          <div className={css.cardContainer}>
            <div className={css.cardContent}>
              <h2 className={css.title}>Applications</h2>
              <span className={css.subtitle}>Basic Personal Info</span>
            </div>
            <div className={css.cardButtons}>
              <Button
                to={getUrlToContinueQuiz(
                  {
                    ...userData?.user?.testsCompletedInfo,
                  },
                  userData?.user?.isEligibilityTestCompleted,
                )}
                className={css.cardButton}
              >
                Resume
              </Button>
              {/* <Button className={css.cardButton}>
                <CiLock size={15} />
                Lock
              </Button>
              <Button className={cn(css.cardButton, css.isButtonActive)}>
                <CiUnlock size={15} />
                Unlock
              </Button> */}
            </div>
          </div>
        </ControlCard>
      )}

      {!userData?.user.isEmailVerified && (
        <InfoCard className={css.infoCard} icon={task}>
          <h2>Email Verification Required</h2>

          <p className={css.infoCardTextWithLoading}>
            Please check your inbox for verification email. Waiting for email to
            be verified
            <CircularProgress size={20} className={css.infoCardLoading} />
          </p>
          <p>
            Not received your verification email yet?
            <button onClick={handleResendEmailVarify}>click here</button>
            to resend the verification email.
          </p>
          <p>Issues? Please reach out to support using the chat button below</p>
        </InfoCard>
      )}
    </>
  );
};

export { Home };
