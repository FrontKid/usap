/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentData, doc, setDoc } from 'firebase/firestore';
import { v4 as getId } from 'uuid';
import { Dispatch } from '@reduxjs/toolkit';
import { ECollectionNames, EQuestionsTypeId } from '../types';
import { db } from '../firebase';
import { uptdateUserAnswers } from '../firebase/services';
import { EQuestionsDataType } from '../types/EQuestionDataType';

export type TUserChoice = {
  id: string;
  answer: string;
};

type TMultipleAnswer = 'multipleAnswer';

const storeAnswer = async (
  userAnswers: { [id: string]: DocumentData },
  userChoice: TUserChoice,
  user: User | null,
  questionsTypeId: EQuestionsTypeId,
  dispatch: Dispatch,
  setUserAnswers: (userAnswer: DocumentData) => any,
  isMultipleAnswer?: TMultipleAnswer,
  questionDataType?: EQuestionsDataType | '',
) => {
  if (!user) {
    return;
  }

  const userAnswer = Object.values(userAnswers).find(
    el => el.questionId === userChoice.id,
  );

  const userAnswerId = userAnswer?.id;

  if (!userAnswerId) {
    const answerId = getId();

    const createdAnswer = {
      id: answerId,
      questionsTypeId,
      questionId: userChoice.id,
      answer: isMultipleAnswer ? [userChoice.answer] : userChoice.answer,
      userId: user.id,
    };

    await setDoc(doc(db, ECollectionNames.ANSWERS, answerId), createdAnswer);

    dispatch(setUserAnswers({ ...userAnswers, [answerId]: createdAnswer }));

    return;
  }

  let updatedAnswer;

  if (isMultipleAnswer) {
    // prettier-ignore
    if (userAnswer.answer.includes(userChoice.answer)
      && questionDataType !== EQuestionsDataType.DATA) {
      updatedAnswer = userAnswer.answer.filter(
        (el: string) => el !== userChoice.answer,
      );
    } else if (questionDataType === EQuestionsDataType.DATA) {
      const lastElements: { [key: string]: string } = {};
      const userChoiceAnswerType = userChoice.answer.split(':')[0];

      userAnswer.answer.forEach((item: string) => {
        const [type] = item.split(':');

        if (type !== userChoiceAnswerType) {
          lastElements[type] = item;
        }
      });

      lastElements[userChoiceAnswerType] = userChoice.answer;
      updatedAnswer = Object.values(lastElements);
    } else {
      updatedAnswer = [...userAnswer.answer, userChoice.answer];
    }
  } else {
    updatedAnswer = userChoice.answer;
  }

  await uptdateUserAnswers(userAnswerId, { answer: updatedAnswer });

  const updateAnswerT = {
    ...userAnswers[userAnswerId],
    answer: updatedAnswer,
  };

  dispatch(setUserAnswers({ ...userAnswers, [userAnswerId]: updateAnswerT }));
};

export { storeAnswer };
