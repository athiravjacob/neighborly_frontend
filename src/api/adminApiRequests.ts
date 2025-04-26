// src/api/adminApi.ts
import { UserDTO } from '../types/UserDTO';
import { UserInfo } from '../types/settings';
import api from './apiConfig';
import axios from 'axios';





export const adminLogin = async (email: string, password: string): Promise<UserDTO> => {
  try {
    const response = await api.post('/auth/admin/login', { email, password },{ withCredentials: true });
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
    const response = await api.get('/admin/userList');
    console.log(response.data.data)
    return response.data.data; 
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch users');
    }
    throw new Error('An unexpected error occurred');
  }
  
};

export const getAllNeighbors = async (): Promise<UserInfo[]> => {
  try {
    const response = await api.get('/admin/neighborList');
    console.log(response.data.data)
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch users');
    }
    throw new Error('An unexpected error occurred');
  }
}