import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IQuestions } from '@/shared/firebase/services';

interface IInitialState {
  totalQuizes: number;
  totalQuizesWithInfo: number;
  TOTAL_FIELDS: number;
  basicPersonalData: IQuestions[];
  incompleteQuizItems: string[];
}

const initialState: IInitialState = {
  totalQuizes: 17,
  totalQuizesWithInfo: 18,
  basicPersonalData: [],
  TOTAL_FIELDS: 49,
  incompleteQuizItems: [],
};

const basicPersonalInfoSlice = createSlice({
  name: 'basic-personal-info',
  initialState,
  reducers: {
    setBasicPersonalInfo: (state, action: PayloadAction<IQuestions[]>) => ({
      ...state,
      basicPersonalData: action.payload,
    }),

    addIncompleteQuizItems: (state, action: PayloadAction<string[]>) => ({
      ...state,
      incompleteQuizItems: action.payload,
    }),

    removeIncompleteQuizItems: (state, action: PayloadAction<string>) => ({
      ...state,
      incompleteQuizItems: state.incompleteQuizItems.filter(
        el => el !== action.payload,
      ),
    }),
  },
});

export const basicPersonalInfoSelector = (state: RootState) =>
  state.basicPersonalInfo;

export { basicPersonalInfoSlice };
export const {
  setBasicPersonalInfo,
  addIncompleteQuizItems,
  removeIncompleteQuizItems,
} = basicPersonalInfoSlice.actions;
