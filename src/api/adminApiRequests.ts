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
    const response = await api.get('/admin/users');
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
    const response = await api.get('/admin/neighbors');
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
    const response = await api.get('/admin/tasks');
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
    const verificationResult = await api.patch(`/admin/neighbors/${neighborId}/verification`, {});
    if (verificationResult) return true
    return false
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to verify neighbor');
    }
    throw new Error('An unexpected error occurred');
  }
}

export const updateBanStatus = async (id: string, type: 'neighbor' | 'user'): Promise<boolean> => {
  try {
    const endpoint = type === 'neighbor' ? `/admin/neighbors/${id}/ban` : `/admin/users/${id}/ban`;
    const banResult = await api.patch(endpoint);
    return banResult.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error Banned/Unbanned');
    }
    throw new Error('An unexpected error occurred');
  }
}