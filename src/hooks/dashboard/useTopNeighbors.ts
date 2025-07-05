import { useQuery } from "@tanstack/react-query"
import { fetchTopNeighbors } from "../../api/adminApiRequests"
import { top_neighbors } from "../../types/dashboard"

export const useTopNeighbors = () => {
    return useQuery<top_neighbors[]>({
        queryKey: ['topNeighbors'],
        queryFn :fetchTopNeighbors
    })
}