import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VerificationState {
    verificationStatus: Boolean;
    isPending:Boolean
}

const initialState: VerificationState = {
    verificationStatus: false,
    isPending:false
};

const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    setVerificationStatus: (state, action: PayloadAction<Boolean>) => {
          state.verificationStatus = action.payload;
          if (action.payload) {
            state.isPending = false; 
          }
      },
      setPendingStatus: (state, action: PayloadAction<boolean>) => {
        state.isPending = action.payload;
      },
    clearVerificationStatus: (state) => {
        state.verificationStatus = false;
        state.isPending = false;
    },
  },
});

export const { setVerificationStatus,setPendingStatus, clearVerificationStatus } = verificationSlice.actions;
export default verificationSlice.reducer;