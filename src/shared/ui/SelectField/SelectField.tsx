/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react';
import { RxTriangleDown } from 'react-icons/rx';
import cn from 'classnames';

import { IQuestions } from '@/shared/firebase/services';

import css from './SelectField.module.scss';

type TAnswerId = {
  id: string;
  answer: string;
};

type TSelectFieldProps = {
  onChange: (value: TAnswerId) => void;
  question: IQuestions;
  defaultValue: string;
  list: any[];
  showDefaultOption?: boolean;
  defaultOption?: string;
  className?: string;
  disabled?: boolean;
};

const SelectField: FC<TSelectFieldProps> = ({
  list,
  onChange,
  question,
  defaultValue,
  disabled = false,
  showDefaultOption = false,
  defaultOption = '',
  className,
}) => {
  return (
    <div className={cn(css.selectInner, className)}>
      <RxTriangleDown className={css.arrowDown} />
      <select
        disabled={disabled}
        value={defaultValue}
        onChange={e => onChange({ id: question.id, answer: e.target.value })}
        className={css.select}
      >
        {showDefaultOption && (
          <option value="" disabled>
            {defaultOption}
          </option>
        )}
        {list?.map(el => (
          <option key={el} value={el}>
            {el}
          </option>
        ))}
      </select>
    </div>
  );
};

export { SelectField };
