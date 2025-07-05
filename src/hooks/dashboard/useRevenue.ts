import { useQuery } from "@tanstack/react-query"
import { fetchRevenueSummary } from "../../api/adminApiRequests"

export const useRevenue = () => {
    return useQuery({
        queryKey: ['revenueSummary'],
        queryFn:fetchRevenueSummary
    })
}