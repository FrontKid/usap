import { FC, ReactNode } from 'react';

import css from './ControlCard.module.scss';

type TControlCardProps = {
  children: ReactNode;
};

const ControlCard: FC<TControlCardProps> = ({ children }) => {
  return <article className={css.card}>{children}</article>;
};

export { ControlCard };
