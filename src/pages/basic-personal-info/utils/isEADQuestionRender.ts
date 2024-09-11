/* eslint-disable max-len */
import { DocumentData } from 'firebase/firestore';

// prettier-ignore
const WORK_PERMIT
  = 'Work permit (Form I-765: This allows you to work while greencard application is pending)';

const ALL_RECOMMENDED = 'All of the above (Recommended)';

const isEADQuestionRender = (
  data: { [id: string]: DocumentData },
  questionId: string,
) => {
  // prettier-ignore
  const userAnswer
    = Object.values(data)
      ?.find(el => el.questionId === questionId)?.answer ?? [];

  if (userAnswer.includes(WORK_PERMIT)) {
    return true;
  }

  if (userAnswer.length >= 3) {
    return true;
  }

  if (userAnswer.includes(ALL_RECOMMENDED)) {
    return true;
  }

  return false;
};

export { isEADQuestionRender };
