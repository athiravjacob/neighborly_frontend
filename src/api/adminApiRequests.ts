// src/api/adminApi.ts
import { UserDTO } from '../types/UserDTO';
import { NeighborInfo } from '../types/neighbor';
import { newTaskDetails } from '../types/newTaskDetails';
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
    return response.data.data; 
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch users');
    }
    throw new Error('An unexpected error occurred');
  }
  
};

export const getAllNeighbors = async (): Promise<NeighborInfo[]> => {
  try {
    const response = await api.get('/admin/neighborList');
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch users');
    }
    throw new Error('An unexpected error occurred');
  }
}

export const getAllTasks = async (): Promise<newTaskDetails[]> => {
  try {
    const response = await api.get('/admin/TaskList');
    console.log(response.data.data)
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch users');
    }
    throw new Error('An unexpected error occurred');
  }
}

export const verifyNeighbor = async (neighborId:string): Promise<Boolean> => {
  try {
    const response = await api.patch('/admin/verifyNeighbor', { neighborId });
    if (response) return true
    return false
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to verify neighbor');
    }
    throw new Error('An unexpected error occurred');
  }
}

export const banUnban = async (id: string, type: 'neighbor' | 'user'): Promise<Boolean> => {
  try {
    console.log(id,type)
    const response = await api.patch('/admin/ban_unban', { id,type });
    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error Banned/Unbanned');
    }
    throw new Error('An unexpected error occurred');
  }
}