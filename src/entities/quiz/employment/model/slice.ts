/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IQuestions } from '@/shared/firebase/services';

interface IInitialState {
  employmentQuiz: {
    totalQuizes: number;
    totalQuizesWithInfo: number;
    TOTAL_FIELDS: number;
    employmentIncompleteQuizItems: string[];
    data: IQuestions[];
  };
}

const initialState: IInitialState = {
  employmentQuiz: {
    totalQuizes: 4,
    totalQuizesWithInfo: 5,
    employmentIncompleteQuizItems: [],
    TOTAL_FIELDS: 4,
    data: [],
  },
};

const employmentQuizSlice = createSlice({
  name: 'employmentQuiz',
  initialState,
  reducers: {
    setEmploymentQuiz: (state, action: PayloadAction<IQuestions[]>) => {
      state.employmentQuiz.data = action.payload;
    },
    setEmploymentIncompleteQuizItems: (
      state,
      action: PayloadAction<string[]>,
    ) => {
      state.employmentQuiz.employmentIncompleteQuizItems = action.payload;
    },
  },
});

const employmentSelector = (state: RootState) => state.employmentQuiz;

export { employmentQuizSlice, employmentSelector };
// prettier-ignore
export const { setEmploymentQuiz, setEmploymentIncompleteQuizItems }
  = employmentQuizSlice.actions;
