/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IQuestions } from '@/shared/firebase/services';

interface IInitialState {
  eligibilityQuiz: {
    totalQuizes: number;
    totalQuizesWithInfo: number;
    data: IQuestions[];
  };
}

const initialState: IInitialState = {
  eligibilityQuiz: {
    totalQuizes: 14,
    totalQuizesWithInfo: 17,
    data: [],
  },
};

const eligibilityQuizSlice = createSlice({
  name: 'eligibilityQuiz',
  initialState,
  reducers: {
    setEligibilityQuiz: (state, action: PayloadAction<IQuestions[]>) => {
      state.eligibilityQuiz.data = action.payload;
    },
  },
});

const eligibilityQuizSelector = (state: RootState) => state.eligibilityQuiz;

export { eligibilityQuizSlice, eligibilityQuizSelector };
export const { setEligibilityQuiz } = eligibilityQuizSlice.actions;
