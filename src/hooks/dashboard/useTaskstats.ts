import { useQuery } from "@tanstack/react-query"
import { fetchTaskStats } from "../../api/adminApiRequests"
import { taskStats } from "../../types/dashboard"

export const useTaskstats = () => {
    return useQuery<taskStats>({
        queryKey: ['taskStats'],
        queryFn :fetchTaskStats
    })
}