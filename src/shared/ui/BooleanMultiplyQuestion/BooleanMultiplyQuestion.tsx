import { FC } from 'react';
import { DocumentData } from 'firebase/firestore';
import cn from 'classnames';

import { Button } from '../Button';
import { getCurentUserAnswer, TUserChoice } from '@/shared/utils';
import { IQuestions } from '@/shared/firebase/services';

import css from './BooleanMultiplyQuestion.module.scss';

type TBooleanMultiplyQuestionProps = {
  title: string;
  quizStep: number;
  answers: DocumentData[];
  quizData: IQuestions[];
  handleCheckboxAnswer: (userChoice: TUserChoice) => void;
  answerNegative: string;
  answerPositive: string;
  isDisabled?: boolean;
  chooseNegative?: boolean;
  choosePositive?: boolean;
  chooseAdditionField?: boolean;
  chooseSecondAdditionField?: boolean;
  className?: string;
  hasAdditionalOption?: boolean;
  hasSecondAdditionalOption?: boolean;
  answerAddition?: string;
  secondAnswerAddition?: string;
  wrapInDiv?: boolean;
  divStyles?: string;
};

const getSlicedAnswer = (answer: string) => {
  const trimmedAnswer = answer.trim();
  const firstSpaceIndex = trimmedAnswer.indexOf(' ');

  if (firstSpaceIndex !== -1) {
    const part2 = trimmedAnswer.substring(firstSpaceIndex + 1);

    return part2;
  }

  return trimmedAnswer;
};

const BooleanMultiplyQuestion: FC<TBooleanMultiplyQuestionProps> = ({
  title,
  quizStep,
  className = '',
  answers,
  quizData,
  handleCheckboxAnswer,
  isDisabled = false,
  chooseNegative = false,
  choosePositive = false,
  chooseAdditionField = false,
  chooseSecondAdditionField = false,
  hasAdditionalOption = false,
  hasSecondAdditionalOption = false,
  answerNegative,
  answerPositive,
  answerAddition,
  secondAnswerAddition,
  wrapInDiv = false,
  divStyles = '',
}) => {
  const buttons = (
    <>
      <Button
        isDisable={isDisabled}
        isActive={
          // prettier-ignore
          !(choosePositive
            || getCurentUserAnswer(quizStep, answers, quizData).includes(
              answerPositive,
            ))
        }
        onClick={() =>
          handleCheckboxAnswer({
            id: quizData[quizStep]?.id,
            answer: answerPositive,
          })
        }
        className={css.button}
      >
        {getSlicedAnswer(answerPositive)}
      </Button>

      <Button
        isDisable={isDisabled}
        isActive={
          // prettier-ignore
          !(chooseNegative
            || getCurentUserAnswer(quizStep, answers, quizData).includes(
              answerNegative,
            ))
        }
        onClick={() =>
          handleCheckboxAnswer({
            id: quizData[quizStep]?.id,
            answer: answerNegative,
          })
        }
        className={css.button}
      >
        {getSlicedAnswer(answerNegative)}
      </Button>

      {hasAdditionalOption && (
        <Button
          isDisable={isDisabled}
          isActive={
            // prettier-ignore
            !(chooseAdditionField
            || getCurentUserAnswer(quizStep, answers, quizData).includes(
              answerAddition ?? '',
            ))
          }
          onClick={() =>
            handleCheckboxAnswer({
              id: quizData[quizStep]?.id,
              answer: answerAddition ?? '',
            })
          }
          className={css.button}
        >
          {getSlicedAnswer(answerAddition ?? '')}
        </Button>
      )}

      {hasSecondAdditionalOption && (
        <Button
          isDisable={isDisabled}
          isActive={
            // prettier-ignore
            !(chooseSecondAdditionField
            || getCurentUserAnswer(quizStep, answers, quizData).includes(
              secondAnswerAddition ?? '',
            ))
          }
          onClick={() =>
            handleCheckboxAnswer({
              id: quizData[quizStep]?.id,
              answer: secondAnswerAddition ?? '',
            })
          }
          className={css.button}
        >
          {getSlicedAnswer(secondAnswerAddition ?? '')}
        </Button>
      )}
    </>
  );

  return wrapInDiv ? (
    <div className={cn(className, css.buttonWrapper)}>
      <span>{title}</span>
      <div className={divStyles}>{buttons}</div>
    </div>
  ) : (
    <div className={cn(className, css.buttonWrapper)}>
      <span>{title}</span>
      {buttons}
    </div>
  );
};

export { BooleanMultiplyQuestion };
