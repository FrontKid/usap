import { DocumentData } from 'firebase/firestore';
import { getValueForInput } from './getValueForInput';

const getInitialDateValue = (
  answers: DocumentData[],
  id: string,
  searchValue: string,
) => {
  const answer = answers.find(el => el.questionId === id)?.answer;
  const date = getValueForInput(answer, searchValue);

  if (!date) {
    return '';
  }

  return date;
};

export { getInitialDateValue };
