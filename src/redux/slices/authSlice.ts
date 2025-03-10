import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDTO } from '../../types/UserDTO';

// Define the auth state shape
interface AuthState {
  user: UserDTO | null;
  accessToken: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
};

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserDTO; accessToken: string;}>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

// Export actions and reducer
export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;