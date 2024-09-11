import { FC, ReactNode } from 'react';
import { Link, Path } from 'react-router-dom';
import cn from 'classnames';

import css from './Button.module.scss';

type TButtonType = 'submit' | 'button' | 'reset';
type TStyledType = 'withIcon';
type TColorType = 'google' | 'facebook' | 'textButton' | 'edit' | 'updateInfo';

type TButtonProps = {
  children: ReactNode;
  buttonType?: TButtonType;
  to?: string | Partial<Path>;
  className?: string;
  isDisable?: boolean;
  isActive?: boolean;
  styled?: TStyledType;
  title?: string;
  color?: TColorType;
  onClick?: (e: TButtonEvent) => void;
};

const Button: FC<TButtonProps> = ({
  children,
  className,
  styled = '',
  isActive = false,
  title = '',
  color = '',
  isDisable = false,
  buttonType = 'button',
  to,
  onClick = () => {},
}) => {
  return to ? (
    <Link
      className={cn(css.link, className, css[styled], css[color], {
        [css.nonActive]: isActive,
      })}
      onClick={onClick}
      title={title}
      to={to}
    >
      {children}
    </Link>
  ) : (
    <button
      disabled={isDisable}
      onClick={onClick}
      title={title}
      type={buttonType}
      className={cn(css.button, className, [css[styled], css[color]], {
        [css.nonActive]: isActive,
        [css.isDisable]: isDisable,
      })}
    >
      {children}
    </button>
  );
};

export { Button };
