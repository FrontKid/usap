import { IQuestions } from '@/shared/firebase/services';

const transformQuestionsToId = (questions: IQuestions[]) =>
  questions?.map(el => el.id);

export { transformQuestionsToId };
