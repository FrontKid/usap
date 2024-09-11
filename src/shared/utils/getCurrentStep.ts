import { ETabRoutes } from '@/entities/sidebar';

const getCurrentStep = (path: string, step: number) => {
  switch (path) {
    case ETabRoutes.ELIGIBILITY_QUIZ:
      return step - 3;

    case ETabRoutes.BASIC_PERSONAL_INFO:
    case ETabRoutes.FAMILY_AND_MARRIAGE:
    case ETabRoutes.IMMIGRATION_AND_TRAVEL:
    case ETabRoutes.EMPLOYMENT:
    case ETabRoutes.FINANCIALS:
    case ETabRoutes.DISCLAIMER:
    case ETabRoutes.MISCELLANEOUS:
      return step - 1;

    default:
      return step;
  }
};

export { getCurrentStep };
