import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IInitialState {
  quizStep: number;
  isAnswerIncorrect: boolean;
}

const initialState: IInitialState = {
  quizStep: 0,
  isAnswerIncorrect: false,
};

const quizNavigationSlice = createSlice({
  name: 'quizNavigation',
  initialState,
  reducers: {
    incrementQuizPage: state => ({
      ...state,
      quizStep: state.quizStep + 1,
    }),

    decrementQuizPage: state => ({
      ...state,
      quizStep: state.quizStep - 1,
    }),

    resetQuizStep: state => ({
      ...state,
      quizStep: 0,
    }),

    setQuizPage: (state, action: PayloadAction<number>) => ({
      ...state,
      quizStep: action.payload,
    }),

    setInvalidAnswer: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isAnswerIncorrect: action.payload,
    }),

    toggleNextRoute: state => {
      return {
        ...state,
      };
    },
  },
});

const quizNavigationSelector = (state: RootState) => state.quizNavigation;

export const {
  incrementQuizPage,
  toggleNextRoute,
  decrementQuizPage,
  setInvalidAnswer,
  resetQuizStep,
  setQuizPage,
} = quizNavigationSlice.actions;

export { quizNavigationSlice, quizNavigationSelector };
export default quizNavigationSlice.reducer;
