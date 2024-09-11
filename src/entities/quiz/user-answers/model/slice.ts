import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DocumentData } from 'firebase/firestore';

interface IInitialState {
  userAnswers: {
    [id: string]: DocumentData;
  };
}

const initialState: IInitialState = {
  userAnswers: {},
};

const userAnswerSlice = createSlice({
  name: 'user-answer',
  initialState,
  reducers: {
    setUserAnswers: (state, action: PayloadAction<DocumentData>) => ({
      ...state,
      userAnswers: action.payload,
    }),
  },
});

export const userAnswerSelector = (state: RootState) => state.userAnswers;

export { userAnswerSlice };
export const { setUserAnswers } = userAnswerSlice.actions;
export default userAnswerSlice.reducer;
