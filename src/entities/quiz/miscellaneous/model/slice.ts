/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IQuestions } from '@/shared/firebase/services';

interface IInitialState {
  miscellaneousQuiz: {
    totalQuizes: number;
    totalQuizesWithInfo: number;
    TOTAL_FIELDS: number;
    miscellaneousIncompleteQuizItems: string[];
    data: IQuestions[];
  };
}

const initialState: IInitialState = {
  miscellaneousQuiz: {
    totalQuizes: 2,
    totalQuizesWithInfo: 3,
    miscellaneousIncompleteQuizItems: [],
    TOTAL_FIELDS: 2,
    data: [],
  },
};

const miscellaneousQuizSlice = createSlice({
  name: 'miscellaneousQuiz',
  initialState,
  reducers: {
    setMiscellaneousQuiz: (state, action: PayloadAction<IQuestions[]>) => {
      state.miscellaneousQuiz.data = action.payload;
    },
    setMiscellaneousIncompleteQuizItems: (
      state,
      action: PayloadAction<string[]>,
    ) => {
      state.miscellaneousQuiz.miscellaneousIncompleteQuizItems = action.payload;
    },
  },
});

const miscellaneousQuizSelector = (state: RootState) => state.miscellaneousQuiz;

export { miscellaneousQuizSlice, miscellaneousQuizSelector };

// prettier-ignore
export const { setMiscellaneousQuiz, setMiscellaneousIncompleteQuizItems }
  = miscellaneousQuizSlice.actions;
