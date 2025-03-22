// src/api/adminApi.ts
import { UserInfo } from '../types/settings';
import api from './apiConfig';
import axios from 'axios';



interface AuthResponse {
  user: UserInfo;
  accessToken: string;
}

export const adminLogin = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/admin/login', { email, password });
    console.log(response)
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Admin login failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const getAllUsers = async (): Promise<UserInfo[]> => {
  try {
    const response = await api.get('/admin/user-list');
    return response.data.data.users; // Adjust based on your successResponse format
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch users');
    }
    throw new Error('An unexpected error occurred');
  }
};