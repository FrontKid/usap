import { RouteObject, createHashRouter as Router } from 'react-router-dom';

import { baseLayout } from './layout/baseLayout';

import { AuthPage } from '@/pages/auth';
import { Home } from '@/pages/home';
import { EligibilityQuiz } from '@/pages/eligibility-quiz';
import { BasicPersonalInfo } from '@/pages/basic-personal-info';
import { FamilyNMarriage } from '@/pages/family-n-marriage';
import { ImmigrationNTravel } from '@/pages/immigration-and-travel';
import { Employment } from '@/pages/employment';
import { Financials } from '@/pages/financials';
import { Miscellaneous } from '@/pages/miscellaneous';
import { Disclaimer } from '@/pages/disclaimer';

import { AdminGuard, AuthGuard, GuestGuard } from '@/shared/utils';
import { ETabRoutes } from '@/entities/sidebar';
import { AdminPanel } from '@/pages/admin';
import { Forms } from '@/pages/forms';

const routes: RouteObject[] = [
  {
    element: (
      <AuthGuard>
        <AuthPage />
      </AuthGuard>
    ),
    path: '/auth',
  },
  {
    element: baseLayout,
    path: '/',
    children: [
      {
        index: true,
        element: (
          <GuestGuard>
            <Home />
          </GuestGuard>
        ),
      },
      {
        path: ETabRoutes.ELIGIBILITY_QUIZ,
        element: (
          <GuestGuard>
            <EligibilityQuiz />
          </GuestGuard>
        ),
      },

      {
        path: ETabRoutes.BASIC_PERSONAL_INFO,
        element: (
          <GuestGuard>
            <BasicPersonalInfo />
          </GuestGuard>
        ),
      },
      {
        path: ETabRoutes.FAMILY_AND_MARRIAGE,
        element: (
          <GuestGuard>
            <FamilyNMarriage />
          </GuestGuard>
        ),
      },
      {
        path: ETabRoutes.IMMIGRATION_AND_TRAVEL,
        element: (
          <GuestGuard>
            <ImmigrationNTravel />
          </GuestGuard>
        ),
      },
      {
        path: ETabRoutes.EMPLOYMENT,
        element: (
          <GuestGuard>
            <Employment />
          </GuestGuard>
        ),
      },
      {
        path: ETabRoutes.FINANCIALS,
        element: (
          <GuestGuard>
            <Financials />
          </GuestGuard>
        ),
      },
      {
        path: ETabRoutes.DISCLAIMER,
        element: (
          <GuestGuard>
            <Disclaimer />
          </GuestGuard>
        ),
      },
      {
        path: ETabRoutes.MISCELLANEOUS,
        element: (
          <GuestGuard>
            <Miscellaneous />
          </GuestGuard>
        ),
      },
      {
        path: ETabRoutes.ADMIN_PANEL,
        element: (
          <GuestGuard>
            <AdminGuard>
              <AdminPanel />
            </AdminGuard>
          </GuestGuard>
        ),
      },
      {
        path: `${ETabRoutes.ADMIN_PANEL}/:id`,
        element: (
          <GuestGuard>
            <AdminGuard>
              <Forms />
            </AdminGuard>
          </GuestGuard>
        ),
      },
      {
        path: '*',
        element: <h1>Ooops...</h1>,
      },
    ],
  },
  {
    path: '*',
    element: <h1>Ooops...</h1>,
  },
];

const appRouter = () => Router(routes);

export { appRouter };
