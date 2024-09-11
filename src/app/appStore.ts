import { configureStore } from '@reduxjs/toolkit';
import {
  quizNavigationSlice,
  eligibilityQuizSlice,
  basicPersonalInfoSlice,
  familyNMarriageQuizSlice,
  immigrationNtravelSlice,
  employmentQuizSlice,
  miscellaneousQuizSlice,
  disclaimerQuizSlice,
} from '@/entities/quiz';
import { userAnswerSlice } from '@/entities/quiz/user-answers/model/slice';
import { financialsQuizSlice } from '@/entities/quiz/financials/model/slice';

const makeStore = () => {
  const store = configureStore({
    reducer: {
      quizNavigation: quizNavigationSlice.reducer,
      userAnswers: userAnswerSlice.reducer,
      eligibilityQuiz: eligibilityQuizSlice.reducer,
      basicPersonalInfo: basicPersonalInfoSlice.reducer,
      familyNMarriageQuiz: familyNMarriageQuizSlice.reducer,
      immigrationNtravelQuiz: immigrationNtravelSlice.reducer,
      employmentQuiz: employmentQuizSlice.reducer,
      financialsQuiz: financialsQuizSlice.reducer,
      miscellaneousQuiz: miscellaneousQuizSlice.reducer,
      disclaimerQuiz: disclaimerQuizSlice.reducer,
    },
  });

  return store;
};

const appStore = makeStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
type RootState = ReturnType<typeof appStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
type AppDispatch = typeof appStore.dispatch;

export { appStore };
export type { RootState, AppDispatch };
