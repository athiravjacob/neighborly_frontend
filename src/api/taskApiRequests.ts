import axios from "axios";
import api from "./apiConfig"
import { newTaskDetails ,TaskStatus} from "../types/newTaskDetails";

//**************create new task ************************ */
export const createTask = async (newTask: newTaskDetails): Promise<void>=>{
  try {
    const sanitizedTask = { ...newTask };
    delete sanitizedTask._id
        const response = await api.post("/tasks", { newTask: sanitizedTask },{ withCredentials: true })
        console.log(response)
    } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
          console.log(error)
            throw new Error(error.response.data.message || "Failed to create task");
          }
          throw new Error("An unexpected error occurred");
    }
    
    
}
//*****************Fetch tasks of specific user or neighbor************ */

export const showTasks = async (userId: string, role: string): Promise<newTaskDetails[]> => {
  try {
    // Validate inputs
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Invalid user ID provided');
    }
    if (!['user', 'neighbor'].includes(role)) {
      throw new Error('Invalid role provided. Must be "user" or "neighbor"');
    }

    let response;
    if (role === 'user') {
      response = await api.get(`/users/${userId}/tasks`, { withCredentials: true });
    } else {
      response = await api.get(`/neighbors/${userId}/tasks`, { withCredentials: true });
    }

    // Validate response data
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      throw new Error('Invalid response format: tasks data is missing or not an array');
    }

    return response.data.data as newTaskDetails[];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to list tasks');
    }
    throw new Error(`An unexpected error occurred: ${error}`);
  }
};

//************************ Neighbor Accept Task  **************** */
export const acceptTask = async (taskId:string): Promise<Boolean> => {
    try {
      const response = await api.patch(`/tasks/${taskId}/accept`)
      console.log(response)
      if(response)
        return true
      else return false
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to update accepting task");
      }
      throw new Error("An unexpected error occurred");
    }
}
  
/************************fetch Status of specific Task **************** */
export const fetchTaskStatus = async (taskId:string): Promise<TaskStatus> => {
    try {
      const response = await api.get(`/tasks/${taskId}/status`)
        console.log(response.data.data)
        return response.data.data
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to update accepting task");
      }
      throw new Error("An unexpected error occurred");
    }
}
  
// *************** Verify taskcode **************

export const VerifyCode = async (taskId:string,neighborId:string,code:string): Promise<Boolean> => {
  try {
    
    const response = await api.patch(`/tasks/${taskId}/verify_task_code`, { neighborId, code })
    if (response.status === 200 && response.data?.success) {
      return true;
    }

    throw new Error(response.data?.message || "Failed to verify code");
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to verify code");
    }
    throw new Error("An unexpected error occurred while verifying task code");
  }

  
}
//************* Mark Task as complete ************ */

export const TaskComplete = async (taskId:string): Promise<Boolean> => {
  try {
    
    const response = await api.patch(`/tasks/${taskId}/complete`)
    if (response.status === 200 && response.data?.success) {
      return true;
    }

    throw new Error(response.data?.message || "Failed to verify code");
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to verify code");
    }
    throw new Error("An unexpected error occurred while verifying task code");
  }

  
}