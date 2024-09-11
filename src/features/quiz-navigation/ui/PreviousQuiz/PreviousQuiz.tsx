import { HiArrowSmLeft } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';

import {
  decrementQuizPage,
  quizNavigationSelector,
  setInvalidAnswer,
  setQuizPage,
  userAnswerSelector,
} from '@/entities/quiz';

import { useAppDispatch, useAppSelector } from '@/shared/hooks';

import css from './PreviousQuiz.module.scss';
import { getValueForInput } from '@/shared/utils';
import { ETabRoutes } from '@/entities/sidebar';
import { navigationMap } from '../../model/navigationMap';

const PreviousQuiz = () => {
  const dispatch = useAppDispatch();
  const { quizStep, isAnswerIncorrect } = useAppSelector(
    quizNavigationSelector,
  );

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { userAnswers } = useAppSelector(userAnswerSelector);

  // prettier-ignore
  const hasImmigrantOtherName
    = getValueForInput(
      Object.values(userAnswers).find(el => el.questionId === '25')?.answer,
      'otherNames',
    ) === 'Yes';

  const isLiveTogetherGroup = Object.values(userAnswers)
    .find(el => el.questionId === '18')
    ?.answer?.includes('Both of you are living together');

  const isLiveTogetherButtons =
    Object.values(userAnswers).find(el => el.questionId === '19')?.answer ===
    'Yes';

  // prettier-ignore
  const isCountOfAssociatedOrganizationNegative
  = getValueForInput(
    Object.values(userAnswers).find(el => el.questionId === '71')?.answer,
    'hasBeenAssociatedWithOrganization',
  ) === 'No';

  const shoulddGoToAnAdvanceParole =
    Object.values(userAnswers).find(el => el.questionId === '5')?.answer ===
    'CH - PAROLEE (HUMANITARIAN-HQ AUTH)';

  const handlePriviousStep = () => {
    if (quizStep === -1 && ETabRoutes.ELIGIBILITY_QUIZ) {
      return;
    }

    const newRoute = navigationMap[pathname as ETabRoutes];

    if (newRoute && quizStep === 0) {
      navigate(newRoute);
    }

    if (isAnswerIncorrect) {
      dispatch(setInvalidAnswer(false));
    }

    if (
      !hasImmigrantOtherName &&
      pathname === ETabRoutes.BASIC_PERSONAL_INFO &&
      quizStep === 10
    ) {
      dispatch(decrementQuizPage());
    }

    if (
      !isLiveTogetherGroup &&
      !isLiveTogetherButtons &&
      pathname === ETabRoutes.BASIC_PERSONAL_INFO &&
      quizStep === 18
    ) {
      dispatch(decrementQuizPage());
    }

    if (
      ETabRoutes.ELIGIBILITY_QUIZ === pathname &&
      shoulddGoToAnAdvanceParole &&
      quizStep === 20
    ) {
      dispatch(setQuizPage(19));
    }

    if (
      ETabRoutes.ELIGIBILITY_QUIZ === pathname &&
      shoulddGoToAnAdvanceParole &&
      quizStep === 18
    ) {
      dispatch(setQuizPage(8));
    }

    if (
      isCountOfAssociatedOrganizationNegative &&
      ETabRoutes.DISCLAIMER &&
      quizStep === 3
    ) {
      dispatch(decrementQuizPage());
    }

    dispatch(decrementQuizPage());
  };

  return (
    <Button onClick={handlePriviousStep} className={css.buttonBack}>
      <HiArrowSmLeft size={20} />
      Back
    </Button>
  );
};

export { PreviousQuiz };
