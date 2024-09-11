import { useLocation, useNavigate } from 'react-router-dom';
import { HiArrowSmRight } from 'react-icons/hi';
import { useLocalStorage } from '@uidotdev/usehooks';

import { FC, useState } from 'react';

import {
  basicPersonalInfoSelector,
  disclaimerQuizSelector,
  eligibilityQuizSelector,
  employmentSelector,
  familyNMarriageQuizSelector,
  financialsQuizSelector,
  immigrationNtravelSelector,
  incrementQuizPage,
  miscellaneousQuizSelector,
  quizNavigationSelector,
  resetQuizStep,
  setInvalidAnswer,
  setQuizPage,
  userAnswerSelector,
} from '@/entities/quiz';

import { Button } from '@/shared/ui';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { updateUserBasicInfo } from '@/shared/firebase/services';

import css from './NextQuiz.module.scss';
import { getCurrentStep, getValueForInput } from '@/shared/utils';
import { ETabRoutes } from '@/entities/sidebar';

interface INextQuiz {
  isDisable?: boolean;
}

const NextQuiz: FC<INextQuiz> = ({ isDisable = false }) => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(0);

  const { quizStep } = useAppSelector(quizNavigationSelector);
  const { eligibilityQuiz } = useAppSelector(eligibilityQuizSelector);
  const { immigrationNtravelQuiz } = useAppSelector(immigrationNtravelSelector);
  const { familyNMarriageQuiz } = useAppSelector(familyNMarriageQuizSelector);
  const { employmentQuiz } = useAppSelector(employmentSelector);
  const { financialsQuiz } = useAppSelector(financialsQuizSelector);
  const { disclaimerQuiz } = useAppSelector(disclaimerQuizSelector);
  const { miscellaneousQuiz } = useAppSelector(miscellaneousQuizSelector);
  const { basicPersonalData, totalQuizesWithInfo: basicPersonlTotalQuiz } =
    useAppSelector(basicPersonalInfoSelector);

  const { userAnswers } = useAppSelector(userAnswerSelector);

  const [userData, setUserInfo] = useLocalStorage<TUser>('user');
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const shouldGoToAnAdvanceParole =
    Object.values(userAnswers).find(el => el.questionId === '5')?.answer ===
    'CH - PAROLEE (HUMANITARIAN-HQ AUTH)';

  // const isEndOfEligibilityQuiz = shouldGoToAnAdvanceParole
  //   ? quizStep >= 18 && pathname === ETabRoutes.ELIGIBILITY_QUIZ
  //   : quizStep >= 17 && pathname === ETabRoutes.ELIGIBILITY_QUIZ;

  const isEndOfEligibilityQuiz =
    quizStep === 17 && pathname === ETabRoutes.ELIGIBILITY_QUIZ;

  const isEndOfBasicPersonalInfoQuiz =
    quizStep >= basicPersonlTotalQuiz &&
    pathname === ETabRoutes.BASIC_PERSONAL_INFO;

  const isEndOfFamilyNMarriageQuiz =
    quizStep >= familyNMarriageQuiz.totalQuizesWithInfo &&
    pathname === ETabRoutes.FAMILY_AND_MARRIAGE;

  const isEndOfImmgrationNTravel =
    quizStep >= immigrationNtravelQuiz.totalQuizesWithInfo &&
    pathname === ETabRoutes.IMMIGRATION_AND_TRAVEL;

  const isEndOfFinancialsQuiz =
    quizStep >= financialsQuiz.totalQuizesWithInfo &&
    pathname === ETabRoutes.FINANCIALS;

  const isEndOfDisclaimerQuiz =
    quizStep >= disclaimerQuiz.totalQuizesWithInfo &&
    pathname === ETabRoutes.DISCLAIMER;

  const isEndOfMiscellaneousQuiz =
    quizStep >= miscellaneousQuiz.totalQuizesWithInfo &&
    pathname === ETabRoutes.MISCELLANEOUS;

  const isEndOfEmploymentQuiz =
    quizStep >= employmentQuiz.totalQuizesWithInfo &&
    pathname === ETabRoutes.EMPLOYMENT;

  const lastAnswer = Object.values(userAnswers).filter(
    el => el.questionId !== '80',
  )[getCurrentStep(pathname, quizStep)];

  const getCorrectCurrentAnswer = (path: string) => {
    switch (path) {
      case ETabRoutes.ELIGIBILITY_QUIZ:
        return eligibilityQuiz.data.find(
          question => question.id === lastAnswer?.questionId,
        )?.correctAnswer;

      case ETabRoutes.BASIC_PERSONAL_INFO:
        return basicPersonalData.find(
          question => question.id === lastAnswer?.questionId,
        )?.correctAnswer;

      case ETabRoutes.FAMILY_AND_MARRIAGE:
        return familyNMarriageQuiz.data.find(
          question => question.id === lastAnswer?.questionId,
        )?.correctAnswer;

      case ETabRoutes.IMMIGRATION_AND_TRAVEL:
        return immigrationNtravelQuiz.data.find(
          question => question.id === lastAnswer?.questionId,
        )?.correctAnswer;

      case ETabRoutes.EMPLOYMENT:
        return employmentQuiz.data.find(
          question => question.id === lastAnswer?.questionId,
        )?.correctAnswer;

      case ETabRoutes.FINANCIALS:
        return financialsQuiz.data.find(
          question => question.id === lastAnswer?.questionId,
        )?.correctAnswer;

      case ETabRoutes.DISCLAIMER:
        return disclaimerQuiz.data.find(
          question => question.id === lastAnswer?.questionId,
        )?.correctAnswer;

      case ETabRoutes.MISCELLANEOUS:
        return miscellaneousQuiz.data.find(
          question => question.id === lastAnswer?.questionId,
        )?.correctAnswer;

      default:
        return [];
    }
  };

  const correctAnswer = getCorrectCurrentAnswer(pathname);

  const hasNotConfirmLegalAgreements =
    !userData?.user.isAgreeLegalAgreements && quizStep >= 1;
  const isCurrentAnswerCorrect = lastAnswer?.answer === correctAnswer;
  const isMultiplyLastAnswer = Array.isArray(lastAnswer?.answer);
  const isCurrectAnswerBoolean = correctAnswer !== null;
  const isBegginOfQuiz = quizStep > 2;

  const hasImmigrantOtherName =
    getValueForInput(
      Object.values(userAnswers).find(el => el.questionId === '25')?.answer,
      'otherNames',
    ) === 'Yes';

  const isLiveTogetherGroup = Object.values(userAnswers)
    .find(el => el.questionId === '18')
    ?.answer?.includes('Both of you are living together');

  const isLiveTogetherButtons =
    Object.values(userAnswers).find(el => el.questionId === '19')?.answer ===
    'Yes';

  // const countOfImmigrantOtherName = getValueForInput(
  //   Object.values(userAnswers).find(el => el.questionId === '25')?.answer,
  //   'otherNamesCount',
  // );

  const advanceParole = Object.values(userAnswers).find(
    el => el.questionId === '80',
  )?.answer;

  // prettier-ignore
  const isCountOfAssociatedOrganizationNegative
  = getValueForInput(
    Object.values(userAnswers).find(el => el.questionId === '71')?.answer,
    'hasBeenAssociatedWithOrganization',
  ) === 'No';

  const handleNextQuiz = () => {
    if (hasNotConfirmLegalAgreements) {
      dispatch(setInvalidAnswer(true));
      dispatch(incrementQuizPage());

      return;
    }

    if (
      !isCurrentAnswerCorrect &&
      isCurrectAnswerBoolean &&
      (pathname === ETabRoutes.ELIGIBILITY_QUIZ ? isBegginOfQuiz : false) &&
      !isMultiplyLastAnswer
    ) {
      dispatch(setInvalidAnswer(true));
      dispatch(incrementQuizPage());

      return;
    }

    if (pathname === ETabRoutes.ELIGIBILITY_QUIZ && quizStep === 16) {
      setStep(17);
    }

    if (
      pathname === ETabRoutes.ELIGIBILITY_QUIZ &&
      shouldGoToAnAdvanceParole &&
      quizStep - 2 === 5
    ) {
      setStep(quizStep - 2);
      dispatch(setQuizPage(17));
    }

    if (
      ETabRoutes.ELIGIBILITY_QUIZ === pathname &&
      advanceParole === 'No' &&
      shouldGoToAnAdvanceParole &&
      quizStep === 18
    ) {
      dispatch(setInvalidAnswer(true));
      dispatch(incrementQuizPage());
    }

    if (
      pathname === ETabRoutes.ELIGIBILITY_QUIZ &&
      shouldGoToAnAdvanceParole &&
      advanceParole === 'Yes' &&
      quizStep === 18
    ) {
      dispatch(setQuizPage(7));
    }

    if (isEndOfEligibilityQuiz && step !== 5) {
      dispatch(resetQuizStep());
      navigate(ETabRoutes.BASIC_PERSONAL_INFO);

      if (userData?.user.id) {
        updateUserBasicInfo(
          userData.user.id,
          {
            isEligibilityTestCompleted: true,
          },
          setUserInfo,
        );
      }

      return;
    }

    if (isEndOfBasicPersonalInfoQuiz) {
      dispatch(resetQuizStep());
      navigate(ETabRoutes.FAMILY_AND_MARRIAGE);
    }

    if (isEndOfFamilyNMarriageQuiz) {
      dispatch(resetQuizStep());
      navigate(ETabRoutes.IMMIGRATION_AND_TRAVEL);
    }

    if (isEndOfImmgrationNTravel) {
      dispatch(resetQuizStep());
      navigate(ETabRoutes.EMPLOYMENT);
    }

    if (isEndOfEmploymentQuiz) {
      dispatch(resetQuizStep());
      navigate(ETabRoutes.FINANCIALS);
    }

    if (isEndOfFinancialsQuiz) {
      dispatch(resetQuizStep());
      navigate(ETabRoutes.DISCLAIMER);
    }

    if (isEndOfDisclaimerQuiz) {
      dispatch(resetQuizStep());
      navigate(ETabRoutes.MISCELLANEOUS);
    }

    if (isEndOfMiscellaneousQuiz) {
      dispatch(resetQuizStep());
      navigate(ETabRoutes.HOME);
    }

    if (
      !hasImmigrantOtherName &&
      quizStep === 8 &&
      pathname === ETabRoutes.BASIC_PERSONAL_INFO
    ) {
      // if (!countOfImmigrantOtherName) {
      dispatch(incrementQuizPage());
      // }
    }

    if (
      !isLiveTogetherGroup &&
      !isLiveTogetherButtons &&
      quizStep === 16 &&
      pathname === ETabRoutes.BASIC_PERSONAL_INFO
    ) {
      dispatch(incrementQuizPage());
    }

    if (
      isCountOfAssociatedOrganizationNegative &&
      quizStep === 1 &&
      pathname === ETabRoutes.DISCLAIMER
    ) {
      dispatch(incrementQuizPage());
    }

    dispatch(incrementQuizPage());
  };

  return (
    <Button
      isDisable={isDisable}
      className={css.buttonContinue}
      onClick={handleNextQuiz}
    >
      Continue
      <HiArrowSmRight size={20} />
    </Button>
  );
};

export { NextQuiz };
