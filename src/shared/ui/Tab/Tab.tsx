import { FC, ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import cn from 'classnames';

import { useLocalStorage } from '@uidotdev/usehooks';

import css from './Tab.module.scss';
import { NestedTabsList } from './ui/NestedTabsList';
import { useAppDispatch } from '@/shared/hooks';
import { setQuizPage } from '@/entities/quiz';

type TTabProps = {
  title: string;
  icon: ReactNode;
  slug: string;
  tabs: {
    id: number;
    title: string;
    slug: string;
    isActive: (quizStep: number) => boolean;
    quizStep: number;
  }[];
};

type TNavLinkStyle = (props: { isActive: boolean }) => string;

const linkStyle: TNavLinkStyle = ({ isActive }) =>
  cn(css.link, {
    [css.isActive]: isActive,
  });

const Tab: FC<TTabProps> = ({ title, icon, slug, tabs }) => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const [currentTab, setTab] = useLocalStorage<string[]>('currentTab', []);
  const [, currentTabSliced] = currentTab;

  const handleRouteTab = () => {
    const firstTab = tabs[0]?.slug ?? '';

    setTab([pathname, firstTab]);
  };

  const handleTab = (currentSlug: string, quizStep: number) => {
    setTab([pathname, currentSlug]);

    dispatch(setQuizPage(quizStep));
  };

  const isTabsRander = pathname === slug && !!tabs.length;

  return (
    <li
      className={cn(css.item, {
        [css.homeHr]: slug === '/',
      })}
    >
      <NavLink onClick={handleRouteTab} className={linkStyle} to={slug}>
        <span className={css.icon}>{icon}</span>
        <span className={css.title}>{title}</span>
      </NavLink>

      {isTabsRander && (
        <NestedTabsList
          tabs={tabs}
          handleTab={handleTab}
          currentTabSliced={currentTabSliced}
        />
      )}
    </li>
  );
};

export { Tab };
