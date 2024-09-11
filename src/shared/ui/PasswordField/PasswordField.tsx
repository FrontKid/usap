import { FC, useState } from 'react';
import { FaEye } from 'react-icons/fa';

import classNames from 'classnames';
import { InputField } from '../InputField';

import css from './PasswordField.module.scss';

type TPasswordField = {
  className: string;
};

const PasswordField: FC<TPasswordField> = ({ className = '' }) => {
  const [isVissible, setVissible] = useState(false);

  const handleToggle = () => {
    setVissible(!isVissible);
  };

  return (
    <InputField
      name="password"
      placeholder="your password"
      autoComplete="off"
      isCapitalize={false}
      labelWrapper={css.labelWrapper}
      wrapperContainer={className}
      type={isVissible ? 'text' : 'password'}
    >
      <FaEye
        size={20}
        title={isVissible ? 'Hide password' : 'Show password'}
        className={classNames(css.eye, {
          [css.active]: isVissible,
        })}
        onClick={handleToggle}
      />
    </InputField>
  );
};

export { PasswordField };
