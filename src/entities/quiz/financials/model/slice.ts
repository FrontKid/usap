/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IQuestions } from '@/shared/firebase/services';

interface IInitialState {
  financialsQuiz: {
    totalQuizes: number;
    totalQuizesWithInfo: number;
    TOTAL_FIELDS: number;
    financialsIncompleteQuizItems: string[];
    data: IQuestions[];
  };
}

const initialState: IInitialState = {
  financialsQuiz: {
    totalQuizes: 6,
    totalQuizesWithInfo: 7,
    financialsIncompleteQuizItems: [],
    TOTAL_FIELDS: 14,
    data: [],
  },
};

const financialsQuizSlice = createSlice({
  name: 'financialsQuiz',
  initialState,
  reducers: {
    setFinancialsQuiz: (state, action: PayloadAction<IQuestions[]>) => {
      state.financialsQuiz.data = action.payload;
    },
    setFinancialsIncompleteQuizItems: (
      state,
      action: PayloadAction<string[]>,
    ) => {
      state.financialsQuiz.financialsIncompleteQuizItems = action.payload;
    },
  },
});

const financialsQuizSelector = (state: RootState) => state.financialsQuiz;

export { financialsQuizSlice, financialsQuizSelector };

// prettier-ignore
export const { setFinancialsQuiz, setFinancialsIncompleteQuizItems }
  = financialsQuizSlice.actions;
