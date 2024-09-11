import { DocumentData } from 'firebase/firestore';

const LIVE_TOGETHER = 'Both of you are living together';

const hasLiveTogetherQuestionRender = (
  data: { [id: string]: DocumentData },
  questionId: string,
) => {
  // prettier-ignore
  const userAnswer
    = Object.values(data)
      ?.find(el => el.questionId === questionId)?.answer ?? [];

  if (userAnswer.includes(LIVE_TOGETHER)) {
    return false;
  }

  return true;
};

export { hasLiveTogetherQuestionRender };
