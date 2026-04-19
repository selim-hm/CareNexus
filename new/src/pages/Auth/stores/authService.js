import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../utils/axiosInstance';

// Thunks for interacting with the backend auth API via Axios

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/register', userData);
      const token = response.headers['auth-token'] || response.data.accessToken || response.data.token;
      const refreshToken = response.headers['refresh-token'] || response.data.refreshToken;
      if (token) {
        localStorage.setItem('auth-token', token);
      }
      if (refreshToken) {
        localStorage.setItem('refresh-token', refreshToken);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/login', credentials);
      const accessToken = response.headers['auth-token'] || response.data.accessToken || response.data.token;
      const refreshToken = response.headers['refresh-token'] || response.data.refreshToken;

      if (accessToken) {
        localStorage.setItem('auth-token', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refresh-token', refreshToken);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/users/logout', {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (_err) {
      // Even if backend call fails, we proceed with local cleanup
    } finally {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('auth-user');
    }
  }
);

export const sendResetCode = createAsyncThunk(
  'auth/sendResetCode',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/forget-password/send-reset-password-email', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to send reset code. Please check your email.');
    }
  }
);

export const verifyResetCode = createAsyncThunk(
  'auth/verifyResetCode',
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/forget-password/validate-reset-password-code', { email, code });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Invalid or expired code.');
    }
  }
);

export const createNewPassword = createAsyncThunk(
  'auth/createNewPassword',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/forget-password/reset-password', { email, password });

      const token = response.headers['auth-token'] || response.data.accessToken;
      if (token) {
        localStorage.setItem('auth-token', token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to safely reset password.');
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ code }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/verifyEmail', { code });
      const token = response.headers['auth-token'] || response.data.accessToken || response.data.token;
      const refreshToken = response.headers['refresh-token'] || response.data.refreshToken;
      if (token) {
        localStorage.setItem('auth-token', token);
      }
      if (refreshToken) {
        localStorage.setItem('refresh-token', refreshToken);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Email verification failed');
    }
  }
);
