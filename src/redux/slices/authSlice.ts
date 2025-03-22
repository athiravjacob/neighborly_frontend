import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDTO } from '../../types/UserDTO';

interface AuthState {
  user: UserDTO | null;
  isAuthenticated: boolean,}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserDTO; }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;