import { useLocalStorage } from '@uidotdev/usehooks';

import { useLocation } from 'react-router-dom';
import { ProgressBar } from '@/shared/ui';

import css from './Header.module.scss';
import { ETabRoutes } from '@/entities/sidebar';

const Header = () => {
  const [userData] = useLocalStorage<TUser>('user');
  const { pathname } = useLocation();

  // prettier-ignore
  const basicPersonalInfoProgress
  = userData?.user.testsCompletedInfo?.basicPersonalInfo ?? 0;

  // prettier-ignore
  const familyNMarriageProgress
    = userData?.user.testsCompletedInfo?.familyNMarriage ?? 0;
  // prettier-ignore
  const immigrationNTravelProgress
    = userData?.user.testsCompletedInfo?.immigrationNTravel ?? 0;
  // prettier-ignore
  const employmentProgress = userData?.user.testsCompletedInfo?.employment ?? 0;
  // prettier-ignore
  const financialsProgress = userData?.user.testsCompletedInfo?.financials ?? 0;
  // prettier-ignore
  const disclaimerProgress = userData?.user.testsCompletedInfo?.disclaimer ?? 0;
  // prettier-ignore
  const miscellaneousProgress
    = userData?.user.testsCompletedInfo?.miscellaneous ?? 0;

  return (
    <>
      {!pathname.includes(ETabRoutes.ADMIN_PANEL) && (
        <header className={css.header}>
          <div className={css.headerWrapper}>
            <ProgressBar
              progress={basicPersonalInfoProgress}
              title="Basic Personal Info"
            />
            <ProgressBar
              progress={familyNMarriageProgress}
              title="Family and Marriage"
            />
            <ProgressBar
              progress={immigrationNTravelProgress}
              title="Immigration & Travel"
            />
            <ProgressBar progress={employmentProgress} title="Employment" />
            <ProgressBar progress={financialsProgress} title="Financials" />
            <ProgressBar progress={disclaimerProgress} title="Disclaimer" />
            <ProgressBar
              progress={miscellaneousProgress}
              title="Miscellaneous"
            />
          </div>
        </header>
      )}
    </>
  );
};

export { Header };
