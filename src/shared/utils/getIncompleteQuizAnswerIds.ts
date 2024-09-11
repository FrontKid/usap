import { DocumentData } from 'firebase/firestore';
import { EQuestionsDataType } from '../types';

const getIncompleteQuizAnswerIds = (
  answersArray: DocumentData[],
  quizData: DocumentData[],
) => {
  const idOfUserAnswers = answersArray
    .filter(el => {
      const userAnswersArrayData = quizData.find(
        (el2: DocumentData) => el2.id === el.questionId,
      );

      if (userAnswersArrayData?.answerType === EQuestionsDataType.DATA) {
        if (el.answer.length < userAnswersArrayData.totalFields) {
          return false;
        }
      }

      return true;
    })
    .map(el => el.questionId);

  return quizData
    .filter(el => !idOfUserAnswers.includes(el.id))
    .map(el => el.id);
};

export { getIncompleteQuizAnswerIds };
