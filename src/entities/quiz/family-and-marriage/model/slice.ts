/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IQuestions } from '@/shared/firebase/services';

interface IInitialState {
  familyNMarriageQuiz: {
    totalQuizes: number;
    totalQuizesWithInfo: number;
    incompleteFamilyNMarriageQuizItem: string[];
    TOTAL_FIELDS: number;
    data: IQuestions[];
  };
}

const initialState: IInitialState = {
  familyNMarriageQuiz: {
    totalQuizes: 17,
    totalQuizesWithInfo: 19,
    incompleteFamilyNMarriageQuizItem: [],
    TOTAL_FIELDS: 54,
    data: [],
  },
};

const familyNMarriageQuizSlice = createSlice({
  name: 'familyNMarriageQuiz',
  initialState,
  reducers: {
    setFamilyNMarriageQuiz: (state, action: PayloadAction<IQuestions[]>) => {
      state.familyNMarriageQuiz.data = action.payload;
    },

    setFamilyNMarriageIncompleteQuizItem: (
      state,
      action: PayloadAction<string[]>,
    ) => {
      // prettier-ignore
      state.familyNMarriageQuiz.incompleteFamilyNMarriageQuizItem
        = action.payload;
    },
  },
});

const familyNMarriageQuizSelector = (state: RootState) =>
  state.familyNMarriageQuiz;

export { familyNMarriageQuizSlice, familyNMarriageQuizSelector };

// prettier-ignore
export const { setFamilyNMarriageQuiz, setFamilyNMarriageIncompleteQuizItem }
  = familyNMarriageQuizSlice.actions;
