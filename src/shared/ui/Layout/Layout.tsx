import { FC, ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useLocalStorage } from '@uidotdev/usehooks';
import { Sidebar } from '@/widgets/sidebar';

import css from './Layout.module.scss';

type TLayoutProps = {
  header?: ReactNode;
  footer?: ReactNode;
};

const Layout: FC<TLayoutProps> = props => {
  const location = useLocation();

  const isRootRoute = location.pathname === '/';
  const [userData] = useLocalStorage<TUser>('user');

  // prettier-ignore
  const shoudHeaderRender
    = userData?.user.isEligibilityTestCompleted
    && userData?.user.isEmailVerified;

  const shouldFooterRender = !isRootRoute && userData?.user.isEmailVerified;

  return (
    <>
      <div className={css.wrapper}>
        <Sidebar shoudListRender={userData?.user.isEmailVerified} />
        {shoudHeaderRender && props.header}
        <main className={css.contentWrapper}>
          <Outlet />
        </main>
        {shouldFooterRender && props.footer}
      </div>
    </>
  );
};

export { Layout };
