/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IQuestions } from '@/shared/firebase/services';

interface IInitialState {
  immigrationNtravelQuiz: {
    totalQuizes: number;
    totalQuizesWithInfo: number;
    TOTAL_FIELDS: number;
    incompleteImmigrationNtravelQuizItems: string[];
    data: IQuestions[];
  };
}

const initialState: IInitialState = {
  immigrationNtravelQuiz: {
    totalQuizes: 6,
    totalQuizesWithInfo: 8,
    TOTAL_FIELDS: 23,
    data: [],
    incompleteImmigrationNtravelQuizItems: [],
  },
};

const immigrationNtravelSlice = createSlice({
  name: 'immigrationNtravel',
  initialState,
  reducers: {
    setImmigrationNtravel: (state, action: PayloadAction<IQuestions[]>) => {
      state.immigrationNtravelQuiz.data = action.payload;
    },

    setIncompleteImmigrationNtravelQuizItems: (
      state,
      action: PayloadAction<string[]>,
    ) => {
      // prettier-ignore
      state.immigrationNtravelQuiz.incompleteImmigrationNtravelQuizItems
        = action.payload;
    },
  },
});

const immigrationNtravelSelector = (state: RootState) =>
  state.immigrationNtravelQuiz;

export { immigrationNtravelSlice, immigrationNtravelSelector };
export const {
  setImmigrationNtravel,
  setIncompleteImmigrationNtravelQuizItems,
} = immigrationNtravelSlice.actions;
