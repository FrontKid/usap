import { ETabRoutes } from '@/entities/sidebar';

interface IQuizMetrics {
  basicPersonalInfo: number;
  disclaimer: number;
  employment: number;
  familyNMarriage: number;
  financials: number;
  immigrationNTravel: number;
  miscellaneous: number;
}

const getUrlToContinueQuiz = (
  metrics: IQuizMetrics,
  isEligibilityCompleted: boolean,
): ETabRoutes => {
  const QUIZ_COMPLETION_FULL = 100;

  if (!isEligibilityCompleted) {
    return ETabRoutes.ELIGIBILITY_QUIZ;
  }

  if (metrics.basicPersonalInfo !== QUIZ_COMPLETION_FULL) {
    return ETabRoutes.BASIC_PERSONAL_INFO;
  }

  if (metrics.familyNMarriage !== QUIZ_COMPLETION_FULL) {
    return ETabRoutes.FAMILY_AND_MARRIAGE;
  }

  if (metrics.immigrationNTravel !== QUIZ_COMPLETION_FULL) {
    return ETabRoutes.IMMIGRATION_AND_TRAVEL;
  }

  if (metrics.employment !== QUIZ_COMPLETION_FULL) {
    return ETabRoutes.EMPLOYMENT;
  }

  if (metrics.financials !== QUIZ_COMPLETION_FULL) {
    return ETabRoutes.FINANCIALS;
  }

  if (metrics.disclaimer !== QUIZ_COMPLETION_FULL) {
    return ETabRoutes.DISCLAIMER;
  }

  return ETabRoutes.MISCELLANEOUS;
};

export { getUrlToContinueQuiz };
