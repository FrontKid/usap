/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { useLocation } from 'react-router-dom';

import { useLocalStorage } from '@uidotdev/usehooks';
import { DocumentData } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { NextQuiz, PreviousQuiz } from '@/features/quiz-navigation';

import {
  basicPersonalInfoSelector,
  disclaimerQuizSelector,
  eligibilityQuizSelector,
  employmentSelector,
  familyNMarriageQuizSelector,
  financialsQuizSelector,
  immigrationNtravelSelector,
  miscellaneousQuizSelector,
  quizNavigationSelector,
  setUserAnswers,
  userAnswerSelector,
} from '@/entities/quiz';

import { Button } from '@/shared/ui';
import { useAppSelector } from '@/shared/hooks';

import { ETabRoutes } from '@/entities/sidebar';

import css from './Footer.module.scss';
import { getCurrentStep, getValueForInput } from '@/shared/utils';
import {
  deleteMultipleUserAnswers,
  deleteUserAnswer,
  getAllUserAnswers,
} from '@/shared/firebase/services';
import { ISponsorImmigrantPair } from '@/shared/types';

function toPascalCase(kebabStr: string): string {
  return kebabStr
    .replace(/(^\/|-)/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

const Footer = () => {
  const dispatch = useDispatch();

  const { isAnswerIncorrect, quizStep } = useAppSelector(
    quizNavigationSelector,
  );

  // prettier-ignore
  const [applicantNicknams]
    = useLocalStorage<ISponsorImmigrantPair>('sponsorImmigrantPair');

  const { userAnswers } = useAppSelector(userAnswerSelector);
  const { eligibilityQuiz } = useAppSelector(eligibilityQuizSelector);
  const { basicPersonalData, totalQuizesWithInfo } = useAppSelector(
    basicPersonalInfoSelector,
  );
  const { familyNMarriageQuiz } = useAppSelector(familyNMarriageQuizSelector);
  const { immigrationNtravelQuiz } = useAppSelector(immigrationNtravelSelector);
  const { employmentQuiz } = useAppSelector(employmentSelector);
  const { financialsQuiz } = useAppSelector(financialsQuizSelector);
  const { disclaimerQuiz } = useAppSelector(disclaimerQuizSelector);
  const { miscellaneousQuiz } = useAppSelector(miscellaneousQuizSelector);

  const [userData] = useLocalStorage<TUser>('user');
  const userId = userData?.user.id ?? '0';
  const { pathname } = useLocation();

  // prettier-ignore
  const currentImmigrantEmploymentStatus
 = getValueForInput(
   Object.values(userAnswers).find(el => el.questionId === '59')?.answer,
   'currentEmployment',
 );

  // prettier-ignore
  const currentSponsorEmploymentStatus
 = getValueForInput(
   Object.values(userAnswers).find(el => el.questionId === '61')?.answer,
   'currentSponsorEmployment',
 );

  // prettier-ignore
  const isEligibilityQuizEnd
    = pathname === ETabRoutes.ELIGIBILITY_QUIZ
    && quizStep < eligibilityQuiz.totalQuizesWithInfo;

  // prettier-ignore
  const isBasicPersonalQuizEnd
    = pathname === ETabRoutes.BASIC_PERSONAL_INFO
    && quizStep < totalQuizesWithInfo;

  const correctCountOfQuiz = isEligibilityQuizEnd || isBasicPersonalQuizEnd;
  // prettier-ignore
  const isAnswerChosen
    = Object.values(userAnswers).filter(el => el.questionId !== '80').length === quizStep - 3
    && correctCountOfQuiz;

  const isAdvanceParoleChosen =
    quizStep === 18 && pathname === ETabRoutes.ELIGIBILITY_QUIZ
      ? Object.values(userAnswers).find(el => el.questionId === '80')?.id
      : true;

  // prettier-ignore
  const isApplicantNamesEntered =
  (quizStep === 2 && pathname === ETabRoutes.ELIGIBILITY_QUIZ) ?
    !!applicantNicknams?.immigrantName && !!applicantNicknams?.sponsorName : true;

  // prettier-ignore
  const isImmigrantChooseEmploymentStatus
    = pathname === ETabRoutes.EMPLOYMENT && quizStep === 1 ? !!currentImmigrantEmploymentStatus : true;

  // prettier-ignore
  const isSponsorChooseEmploymentStatus
    = pathname === ETabRoutes.EMPLOYMENT && quizStep === 3 ? !!currentSponsorEmploymentStatus : true;

  // prettier-ignore
  const isPreviousButtonShown
    = pathname === ETabRoutes.ELIGIBILITY_QUIZ && quizStep === 0;

  const handleClearPage = async () => {
    const allUsersAnswers = await getAllUserAnswers(userId);

    const getCurrentUserAnswerOnPage = Object.values(allUsersAnswers)
      .filter(
        (el: DocumentData) => el.questionsTypeId === toPascalCase(pathname),
      )
      .sort((el, el2) => el.questionId - el2.questionId);

    if (quizStep >= getCurrentStep(pathname, quizStep)) {
      switch (pathname) {
        case ETabRoutes.ELIGIBILITY_QUIZ: {
          const answerId = getCurrentUserAnswerOnPage[quizStep - 3]?.id;

          await deleteUserAnswer(userId, answerId);

          dispatch(
            setUserAnswers(
              getCurrentUserAnswerOnPage.filter(el => el.id !== answerId),
            ),
          );
          break;
        }

        case ETabRoutes.BASIC_PERSONAL_INFO: {
          if (quizStep - 1 === 0) {
            const firstIds = getCurrentUserAnswerOnPage
              .filter(el => ['15', '16', '17'].includes(el.questionId))
              .map(el => el.id);

            await deleteMultipleUserAnswers(userId, firstIds);

            dispatch(
              setUserAnswers(
                getCurrentUserAnswerOnPage.filter(
                  el => !firstIds.includes(el.id),
                ),
              ),
            );
          } else if (quizStep - 1 === 1) {
            const secondPageIds = getCurrentUserAnswerOnPage
              .filter(el => ['18', '19'].includes(el.questionId))
              .map(el => el.id);

            await deleteMultipleUserAnswers(userId, secondPageIds);

            dispatch(
              setUserAnswers(
                getCurrentUserAnswerOnPage.filter(
                  el => !secondPageIds.includes(el.id),
                ),
              ),
            );
          } else {
            const dataId = [...basicPersonalData].sort(
              (el: any, el2: any) => el.id - el2.id,
            )[quizStep + 2]?.id;

            const answerId = getCurrentUserAnswerOnPage.find(
              el => el.questionId === dataId,
            ).id;

            await deleteUserAnswer(userId, answerId);

            dispatch(
              setUserAnswers(
                getCurrentUserAnswerOnPage.filter(el => el.id !== answerId),
              ),
            );
          }

          break;
        }

        case ETabRoutes.FAMILY_AND_MARRIAGE: {
          const dataId = [...familyNMarriageQuiz.data].sort(
            (el: any, el2: any) => el.id - el2.id,
          )[quizStep - 1]?.id;

          const answerId = getCurrentUserAnswerOnPage.find(
            el => el.questionId === dataId,
          ).id;

          await deleteUserAnswer(userId, answerId);

          dispatch(
            setUserAnswers(
              getCurrentUserAnswerOnPage.filter(el => el.id !== answerId),
            ),
          );

          break;
        }

        case ETabRoutes.IMMIGRATION_AND_TRAVEL: {
          const dataId = [...immigrationNtravelQuiz.data].sort(
            (el: any, el2: any) => el.id - el2.id,
          )[quizStep - 1]?.id;

          const answerId = getCurrentUserAnswerOnPage.find(
            el => el.questionId === dataId,
          ).id;

          await deleteUserAnswer(userId, answerId);

          dispatch(
            setUserAnswers(
              getCurrentUserAnswerOnPage.filter(el => el.id !== answerId),
            ),
          );

          break;
        }

        case ETabRoutes.EMPLOYMENT: {
          const dataId = [...employmentQuiz.data].sort(
            (el: any, el2: any) => el.id - el2.id,
          )[quizStep - 1]?.id;

          const answerId = getCurrentUserAnswerOnPage.find(
            el => el.questionId === dataId,
          ).id;

          await deleteUserAnswer(userId, answerId);

          dispatch(
            setUserAnswers(
              getCurrentUserAnswerOnPage.filter(el => el.id !== answerId),
            ),
          );

          break;
        }

        case ETabRoutes.FINANCIALS: {
          const dataId = [...financialsQuiz.data].sort(
            (el: any, el2: any) => el.id - el2.id,
          )[quizStep - 1]?.id;

          const answerId = getCurrentUserAnswerOnPage.find(
            el => el.questionId === dataId,
          ).id;

          await deleteUserAnswer(userId, answerId);

          dispatch(
            setUserAnswers(
              getCurrentUserAnswerOnPage.filter(el => el.id !== answerId),
            ),
          );

          break;
        }

        case ETabRoutes.DISCLAIMER: {
          const dataId = [...disclaimerQuiz.data].sort(
            (el: any, el2: any) => el.id - el2.id,
          )[quizStep - 1]?.id;

          const answerId = getCurrentUserAnswerOnPage.find(
            el => el.questionId === dataId,
          ).id;

          await deleteUserAnswer(userId, answerId);

          dispatch(
            setUserAnswers(
              getCurrentUserAnswerOnPage.filter(el => el.id !== answerId),
            ),
          );

          break;
        }

        case ETabRoutes.MISCELLANEOUS: {
          const dataId = [...miscellaneousQuiz.data].sort(
            (el: any, el2: any) => el.id - el2.id,
          )[quizStep - 1]?.id;

          const answerId = getCurrentUserAnswerOnPage.find(
            el => el.questionId === dataId,
          ).id;

          await deleteUserAnswer(userId, answerId);

          dispatch(
            setUserAnswers(
              getCurrentUserAnswerOnPage.filter(el => el.id !== answerId),
            ),
          );

          break;
        }

        default:
      }
    }
  };

  return (
    <>
      {!pathname.includes(ETabRoutes.ADMIN_PANEL) && (
        <footer className={css.footer}>
          <div className={css.buttonContainer}>
            <Button onClick={handleClearPage} className={css.buttonClear}>
              Clear Page
            </Button>

            <div className={css.navigationContainer}>
              {!isPreviousButtonShown && <PreviousQuiz />}
              {!isAnswerIncorrect && (
                <NextQuiz
                  isDisable={
                    isAnswerChosen ||
                    !isAdvanceParoleChosen ||
                    !isSponsorChooseEmploymentStatus ||
                    !isApplicantNamesEntered ||
                    !isImmigrantChooseEmploymentStatus
                  }
                />
              )}
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export { Footer };
