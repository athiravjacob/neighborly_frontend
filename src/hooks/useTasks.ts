import { Mutation, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { newTaskDetails } from "../types/newTaskDetails";
import { showTasks } from "../api/taskApiRequests";


export const useTasks = (userId: string | undefined, role: string) => {
  // const queryClient = useQueryClient()
  const { data: tasks = [], isLoading, error } = useQuery<newTaskDetails[], Error>({
    queryKey: ["tasks", userId],
    queryFn: () => showTasks(userId!,role),
    enabled: !!userId,
    placeholderData:[]
  })

 
  return {tasks,isLoading,error}
}

