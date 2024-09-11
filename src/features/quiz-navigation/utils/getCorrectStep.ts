import { ETabRoutes } from '@/entities/sidebar';

const ELIGIBILITY_PRE_QUIZ_COUNT = 3;
const PERSONAL_PRE_QUIZ_COUNT = 1;

const getCorrectStep = (pathname: string, quizStep: number) => {
  if (pathname === ETabRoutes.ELIGIBILITY_QUIZ) {
    return quizStep - ELIGIBILITY_PRE_QUIZ_COUNT;
  }

  if (pathname === ETabRoutes.BASIC_PERSONAL_INFO) {
    return quizStep - PERSONAL_PRE_QUIZ_COUNT;
  }

  return quizStep;
};

export { getCorrectStep };
