import { createSlice } from '@reduxjs/toolkit';
import { 
  registerUser, 
  loginUser,
  logoutUser,
  sendResetCode, 
  verifyResetCode, 
  createNewPassword,
  verifyEmail
} from './authService';

// ── Helper: save/load user from localStorage ───────────────────────────────
const saveUser = (user) => {
  if (user && typeof window !== 'undefined') {
    localStorage.setItem('auth-user', JSON.stringify(user));
  }
};

const loadUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('auth-user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
// ───────────────────────────────────────────────────────────────────────────

const initialState = {
  user: loadUser(),
  token: typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null,
  isLoading: false,
  error: null,
  resetPhase: 'email', // 'email' | 'code' | 'new_password' | 'success'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('refresh-token');
        localStorage.removeItem('auth-user');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPasswordPhase: (state, action) => {
      state.resetPhase = action.payload; 
    },
    // Used by AuthInitializer to restore session on app boot
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      saveUser(state.user);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const user = action.payload.user || action.payload;
        const token = action.payload.accessToken || action.payload.token;
        state.user = user;
        if (token) state.token = token;
        saveUser(user);
      })
      .addCase(registerUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Login
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const user = action.payload.user || action.payload;
        const token = action.payload.accessToken || action.payload.token || state.token;
        state.user = user;
        state.token = token;
        saveUser(user);
      })
      .addCase(loginUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      // Logout (async — calls backend)
      .addCase(logoutUser.pending, (state) => { state.isLoading = true; })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if backend fails, clear client-side state
        state.isLoading = false;
        state.user = null;
        state.token = null;
      })
      
      // Password Step 1: Send Reset Code
      .addCase(sendResetCode.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(sendResetCode.fulfilled, (state) => { 
        state.isLoading = false; 
        state.resetPhase = 'code'; 
      })
      .addCase(sendResetCode.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Password Step 2: Verify Reset Code
      .addCase(verifyResetCode.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(verifyResetCode.fulfilled, (state) => { 
        state.isLoading = false; 
        state.resetPhase = 'new_password'; 
      })
      .addCase(verifyResetCode.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Password Step 3: Create New Password 
      .addCase(createNewPassword.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(createNewPassword.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.resetPhase = 'success'; 
        const user = action.payload.user || action.payload;
        state.user = user;
        if (action.payload.accessToken || action.payload.token) {
          state.token = action.payload.accessToken || action.payload.token;
        }
        saveUser(user);
      })
      .addCase(createNewPassword.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Verify Email
      .addCase(verifyEmail.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        const user = action.payload.user || action.payload;
        const token = action.payload.accessToken || action.payload.token || state.token;
        state.user = user;
        state.token = token;
        saveUser(user);
      })
      .addCase(verifyEmail.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { logout, clearError, resetPasswordPhase, setUser, updateUser } = authSlice.actions;
export default authSlice.reducer;
