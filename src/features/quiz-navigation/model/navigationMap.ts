import { ETabRoutes } from '@/entities/sidebar';

type NavigationMap = {
  [key in ETabRoutes]?: ETabRoutes;
};

const navigationMap: NavigationMap = {
  [ETabRoutes.BASIC_PERSONAL_INFO]: ETabRoutes.ELIGIBILITY_QUIZ,
  [ETabRoutes.FAMILY_AND_MARRIAGE]: ETabRoutes.BASIC_PERSONAL_INFO,
  [ETabRoutes.IMMIGRATION_AND_TRAVEL]: ETabRoutes.FAMILY_AND_MARRIAGE,
  [ETabRoutes.EMPLOYMENT]: ETabRoutes.IMMIGRATION_AND_TRAVEL,
  [ETabRoutes.FINANCIALS]: ETabRoutes.EMPLOYMENT,
  [ETabRoutes.DISCLAIMER]: ETabRoutes.FINANCIALS,
  [ETabRoutes.MISCELLANEOUS]: ETabRoutes.DISCLAIMER,
};

export { navigationMap };
