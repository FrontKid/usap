import { DocumentData } from 'firebase/firestore';
import { IQuestions } from '../firebase/services';

const getCurentUserAnswer = (
  quizStepN: number,
  answers: DocumentData[],
  quizData: IQuestions[],
) => {
  return (
    answers.find(el => el.questionId === quizData[quizStepN]?.id)?.answer ?? []
  );
};

export { getCurentUserAnswer };
