import { DocumentData } from 'firebase/firestore';

import { IQuestions } from '../firebase/services';

function getAllAnswersCount(answers: DocumentData[], quizez: IQuestions[]) {
  let countOfAnswers = 0;

  answers?.forEach(el => {
    // prettier-ignore
    const isAnswerTypeData
      = quizez.find(basicEl => basicEl.id === el.questionId)
        ?.answerType === 'data';

    if (Array.isArray(el.answer)) {
      if (isAnswerTypeData) {
        countOfAnswers += el.answer.length;
      } else {
        countOfAnswers += 1;
      }
    } else {
      countOfAnswers += 1;
    }
  });

  return countOfAnswers;
}

export { getAllAnswersCount };
