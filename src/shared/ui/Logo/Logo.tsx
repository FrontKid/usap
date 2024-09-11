import { FC } from 'react';
import cn from 'classnames';
import { FaEarthAmericas } from 'react-icons/fa6';

import { Link } from 'react-router-dom';
import css from './Logo.module.scss';

interface ILogo {
  className?: string;
}

const Logo: FC<ILogo> = ({ className = '' }) => {
  return (
    <div className={cn(className, css.logo)}>
      <Link className={css.logoLink} to="/">
        <FaEarthAmericas className={css.earth} />
        <span className={css.logoText}>Greenbroad</span>
      </Link>
    </div>
  );
};

export { Logo };
