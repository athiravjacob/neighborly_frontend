import axios from "axios";
import api from "./apiConfig"
import { newTaskDetails ,TaskStatus} from "../types/newTaskDetails";

export const createTask = async (newTask: newTaskDetails): Promise<void>=>{
  try {
    const sanitizedTask = { ...newTask };
    delete sanitizedTask._id
        const response = await api.post("/task/create-task", { newTask: sanitizedTask },{ withCredentials: true })
        console.log(response)
    } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
          console.log(error)
            throw new Error(error.response.data.message || "Failed to create task");
          }
          throw new Error("An unexpected error occurred");
    }
    
    
}

export const showTasks = async (userId:string): Promise<newTaskDetails[]> => {
    try {
        const response = await api.get(`/task/show-task/${userId}`, { withCredentials: true })
        console.log(response.data.data)
        return response.data.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Failed to list task");
          }
          throw new Error("An unexpected error occurred");
    }
}
/************************Accept Task **************** */
export const acceptTask = async (taskId:string): Promise<Boolean> => {
    try {
      const response = await api.patch(`/task/accept-task`,{ taskId })
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
  
/************************Accept Task **************** */
export const fetchTaskStatus = async (taskId:string): Promise<TaskStatus> => {
    try {
      const response = await api.get(`/task/fetch-taskStatus/${taskId}`)
        console.log(response.data.data)
        return response.data.data
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to update accepting task");
      }
      throw new Error("An unexpected error occurred");
    }
  }