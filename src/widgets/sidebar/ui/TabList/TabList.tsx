import { FC, useEffect, useState } from 'react';

import { useLocalStorage } from '@uidotdev/usehooks';
import { ITabDTO } from '@/entities/sidebar';

import { Tab } from '@/shared/ui/Tab';

import css from './TabList.module.scss';

type TTabListProps = {
  tabList: ITabDTO[];
  isCompletedInfo: boolean;
};

const TabList: FC<TTabListProps> = ({ tabList, isCompletedInfo }) => {
  const tabSliced = isCompletedInfo ? tabList : tabList.slice(0, 2);
  const [pairNames] = useLocalStorage('sponsorImmigrantPair');
  const [, setSponsorImmigrantNames] = useState(pairNames);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedPairNames = pairNames;

      setSponsorImmigrantNames(updatedPairNames);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [pairNames]);

  return (
    <ul className={css.list}>
      {tabSliced.map(tab => (
        <Tab
          key={tab.id}
          title={tab.title}
          icon={tab.Icon}
          slug={tab.slug ?? ''}
          tabs={tab.tabs ?? []}
        />
      ))}
    </ul>
  );
};

export { TabList };
