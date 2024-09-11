import { FC } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';
import { CiLogout } from 'react-icons/ci';
import { MdAdminPanelSettings } from 'react-icons/md';
import { signOut } from 'firebase/auth';

import { TabList } from '../TabList';

import { tabDTO } from '@/entities/sidebar';

import { Logo } from '@/shared/ui/Logo';
import { Button } from '@/shared/ui/Button';
import { auth } from '@/shared/firebase';

import css from './Sidebar.module.scss';

type TSidebarProps = {
  shoudListRender?: boolean;
};

const Sidebar: FC<TSidebarProps> = ({ shoudListRender = true }) => {
  const [userData, setCurrentUserData] = useLocalStorage<TUser>('user');

  const handleLogOut = () => {
    (async () => {
      setCurrentUserData(null);

      if (userData?.authProviderId) {
        await signOut(auth);
      }
    })();
  };

  return (
    <aside className={css.aside}>
      <div className={css.logoContainer}>
        <Logo />
      </div>
      {shoudListRender && (
        <TabList
          isCompletedInfo={userData?.user.isEligibilityTestCompleted ?? false}
          tabList={tabDTO}
        />
      )}

      <div className={css.logoutContainer}>
        <Button
          onClick={handleLogOut}
          className={css.logOut}
          color="textButton"
        >
          <span>{userData?.user.email}</span>
          <span className={css.logOutText}>
            <CiLogout
              className={css.logOutIcon}
              style={{ fontSize: '1.4rem' }}
            />
            SignOut
          </span>
        </Button>
        {userData?.user.isAdmin && (
          <Button
            className={css.adminPanel}
            color="textButton"
            to="/admin-panel"
          >
            <MdAdminPanelSettings size="3rem" />
          </Button>
        )}
      </div>
    </aside>
  );
};

export { Sidebar };
