import { FC } from 'react';
import cn from 'classnames';

import { Button } from '@/shared/ui/Button';
import { getSlicedString } from '@/shared/utils';

import css from './NestedTabsList.module.scss';
import { useAppSelector } from '@/shared/hooks';
import { quizNavigationSelector } from '@/entities/quiz';

type TNestedTabsListProps = {
  tabs: {
    id: number;
    title: string;
    slug: string;
    isActive: (quizStep: number) => boolean;
    quizStep: number;
  }[];
  handleTab: (slug: string, quizStep: number) => void;
  currentTabSliced: string;
};

const NestedTabsList: FC<TNestedTabsListProps> = ({
  tabs,
  handleTab,
  currentTabSliced,
}) => {
  const { quizStep } = useAppSelector(quizNavigationSelector);

  return (
    <ul className={css.tabsList}>
      {tabs.map(el => (
        <li key={el.id}>
          <Button
            onClick={() => handleTab(el.slug, el.quizStep)}
            title={el.title}
            className={cn(css.tabsButton, {
              [css.isActive]: currentTabSliced === el.slug,
              [css.isActive]: el?.isActive(quizStep),
            })}
            color="textButton"
          >
            {getSlicedString(el.title)}
          </Button>
        </li>
      ))}
    </ul>
  );
};

export { NestedTabsList };
