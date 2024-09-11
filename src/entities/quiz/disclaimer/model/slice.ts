/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IQuestions } from '@/shared/firebase/services';

interface IInitialState {
  disclaimerQuiz: {
    totalQuizes: number;
    totalQuizesWithInfo: number;
    TOTAL_FIELDS: number;
    disclaimerIncompleteQuizItems: string[];
    data: IQuestions[];
  };
}

const initialState: IInitialState = {
  disclaimerQuiz: {
    totalQuizes: 9,
    totalQuizesWithInfo: 10,
    disclaimerIncompleteQuizItems: [],
    TOTAL_FIELDS: 90,
    data: [],
  },
};

const disclaimerQuizSlice = createSlice({
  name: 'disclaimerQuiz',
  initialState,
  reducers: {
    setDisclaimerQuiz: (state, action: PayloadAction<IQuestions[]>) => {
      state.disclaimerQuiz.data = action.payload;
    },
    setDisclaimerIncompleteQuizItems: (
      state,
      action: PayloadAction<string[]>,
    ) => {
      state.disclaimerQuiz.disclaimerIncompleteQuizItems = action.payload;
    },
  },
});

const disclaimerQuizSelector = (state: RootState) => state.disclaimerQuiz;

export { disclaimerQuizSlice, disclaimerQuizSelector };

// prettier-ignore
export const { setDisclaimerQuiz, setDisclaimerIncompleteQuizItems }
  = disclaimerQuizSlice.actions;
