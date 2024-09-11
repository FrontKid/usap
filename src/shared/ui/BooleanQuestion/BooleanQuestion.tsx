import { FC } from 'react';

import { Button } from '../Button';

import { getReplacedName } from '@/shared/utils';
import { IQuestions } from '@/shared/firebase/services';

import css from './BooleanQuestin.module.scss';
import { SelectField } from '../SelectField';

type TInitialNames = {
  immigrantName: string;
  sponsorName: string;
};

type TAnswerId = {
  id: string;
  answer: string;
};

type TBooleanQuestionProps = {
  data: IQuestions;
  list?: string[];
  currentUserAnswer: string;
  initialNames: TInitialNames;
  positiveValue?: string;
  negativeValue?: string;
  label?: string;
  onClick: (answer: TAnswerId) => void;
};

const BooleanQuestion: FC<TBooleanQuestionProps> = ({
  data,
  initialNames,
  onClick,
  currentUserAnswer,
  list = [],
  positiveValue,
  negativeValue,
  label = '',
}) => {
  const POSITIVE_VALUE = positiveValue ?? 'Yes';
  const NEGATIVE_VALUE = negativeValue ?? 'No';

  return (
    <div className={css.questionWrapper}>
      <span className={css.title}>
        {label || getReplacedName(data?.question, initialNames)}
      </span>

      {data?.answerType === 'boolean' && (
        <>
          <Button
            isActive={!(currentUserAnswer === POSITIVE_VALUE)}
            onClick={() =>
              onClick({
                id: data?.id,
                answer: POSITIVE_VALUE,
              })
            }
            className={css.button}
          >
            {POSITIVE_VALUE}
          </Button>
          <Button
            isActive={!(currentUserAnswer === NEGATIVE_VALUE)}
            onClick={() =>
              onClick({
                id: data?.id,
                answer: NEGATIVE_VALUE,
              })
            }
            className={css.button}
          >
            {NEGATIVE_VALUE}
          </Button>
        </>
      )}

      {data?.answerType === 'list' && list?.length > 0 && (
        <SelectField
          list={list}
          onChange={onClick}
          question={data}
          defaultValue={currentUserAnswer}
          showDefaultOption
          defaultOption="Select current visa status"
        />
      )}
    </div>
  );
};

export { BooleanQuestion };
