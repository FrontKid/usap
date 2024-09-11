import { FC, ReactNode } from 'react';
import cn from 'classnames';

import css from './InforCard.module.scss';

type TInfoCardProps = {
  children: ReactNode;
  icon?: string;
  className?: string;
};

const InfoCard: FC<TInfoCardProps> = ({ icon, children, className = '' }) => {
  return (
    <article className={cn(className, css.card)}>
      <img className={css.icon} src={icon} alt="info card icon" />
      <div className={css.contentBox}>{children}</div>
    </article>
  );
};

export { InfoCard };
