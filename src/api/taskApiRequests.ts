import axios from "axios";
import api from "./apiConfig"
import { newTaskDetails } from "../types/newTaskDetails";

export const createTask = async (newTask: newTaskDetails): Promise<void>=>{
    try {
        const response = await api.post("/task/create-task", { newTask },{ withCredentials: true })
        console.log(response)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
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