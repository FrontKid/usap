import { DocumentData } from 'firebase/firestore';

const getCorrectAnswerToCountMetrics = (
  quizData: DocumentData[],
  answers: DocumentData,
) => {
  const isAnswerRequredIds = quizData
    .filter(el => el.isRequired)
    .map(el => el.id);

  const updateForAnswerCount = Object.values(answers).filter(el =>
    isAnswerRequredIds.includes(el.questionId),
  );

  return [isAnswerRequredIds, updateForAnswerCount];
};

export { getCorrectAnswerToCountMetrics };
