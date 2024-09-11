import { DocumentData } from 'firebase/firestore';

const getUserAnswerById = (
  answers: DocumentData | never[],
  questionId: string,
) => {
  return answers.find(
    (answer: DocumentData) => answer?.questionId === questionId,
  )?.answer;
};

export { getUserAnswerById };
