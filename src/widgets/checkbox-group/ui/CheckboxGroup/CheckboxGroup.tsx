import { FC } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import cn from 'classnames';

import { IImmigrationFormPreference } from '@/entities/multi-select';

import { TUserChoice, getSlicedString } from '@/shared/utils';

import css from './CheckboxGroup.module.scss';
import { Button } from '@/shared/ui';

type TCheckboxGroupProps = {
  checkBoxDTO: IImmigrationFormPreference[];
  questionId: string;
  className?: string;
  onClick: (userChoice: TUserChoice) => void;
  checkedItems: string[];
};

const CheckboxGroup: FC<TCheckboxGroupProps> = ({
  checkBoxDTO,
  onClick,
  className,
  questionId,
  checkedItems = [],
}) => {
  return (
    <article className={cn(css.wrapper, className)}>
      {checkBoxDTO.map(({ id, text, name }) => {
        const isSplitedTitle = getSlicedString(text, 100).includes(':');

        return (
          <Button color="textButton" className={css.button} key={id}>
            <input
              id={`${id}`}
              className={css.input}
              name={name}
              checked={checkedItems.includes(text)}
              type="checkbox"
              onChange={() => onClick({ id: questionId, answer: text })}
            />

            <label
              title={text}
              htmlFor={`${id}`}
              className={css.label}
              key={id}
            >
              <FaCheckCircle className={css.icon} size={48} />

              <span className={css.text}>
                {isSplitedTitle
                  ? getSlicedString(text, 100).split(':')[1]
                  : getSlicedString(text, 100)}
              </span>
            </label>
          </Button>
        );
      })}
    </article>
  );
};

export { CheckboxGroup };
