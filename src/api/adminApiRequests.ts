// src/api/adminApi.ts
import { UserDTO, userGeneralInfo } from '../types/UserDTO';
import { DisputeDetails, populated_disputeDetails } from '../types/complaintDetails';
import { RevenueSummary, taskStats, top_neighbors } from '../types/dashboard';
import { NeighborInfo } from '../types/neighbor';
import { newTaskDetails } from '../types/newTaskDetails';
import { Transaction } from '../types/transactions';
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

export const getAllUsers = async (): Promise<userGeneralInfo[]> => {
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
    const verificationResult = await api.patch(`/admin/neighbors/${neighborId}/verify`);
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


export const fetchAllDisputes = async (): Promise<populated_disputeDetails[]> => {
  try {
    const response = await api.get('/admin/disputes')
    return  response.data.data
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error Banned/Unbanned');
    }
    throw new Error('An unexpected error occurred');
  
  }
}

export const updateDisputeStatus = async (disputeId:string,status:string): Promise<DisputeDetails[]> => {
  try {
    const response = await api.patch(`/admin/disputes/${disputeId}/status`,{ status })
    console.log(response)
    return  response.data.data
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'error updating dispute status');
    }
    throw new Error('An unexpected error occurred');
  
  }
}
export const fetchAllTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get('/admin/transactions')
    console.log(response)
    return  response.data.data
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'error fetching transaction history');
    }
    throw new Error('An unexpected error occurred');
  
  }
}
export const fetchRevenueSummary = async (): Promise<RevenueSummary> => {
  try {
    const response = await api.get('/admin/revenue-summary')
    return  response.data.data
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'eror fetching revenue summary');
    }
    throw new Error('An unexpected error occurred');
  
  }
}

export const fetchTaskStats = async (): Promise<taskStats> => {
  try {
    const response = await api.get('/admin/task-stats')
    return  response.data.data
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'eror fetching tasks stats');
    }
    throw new Error('An unexpected error occurred');
  
  }
}

export const fetchTopNeighbors = async (): Promise<top_neighbors[]> => {
  try {
    const response = await api.get('/admin/top-neighbors')
    return  response.data.data
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'eror fetching top neighbors');
    }
    throw new Error('An unexpected error occurred');
  
  }
}