import { useQuery } from "@tanstack/react-query";
import { FetchServiceLocation } from "../api/neighborApiRequests"; // Adjust path
import { Location } from "../types/locationDTO"; // Adjust path

export const useFetchServiceLocation = (userId: string | undefined) => {
  return useQuery<Location, Error>({
    queryKey: ["serviceLocation", userId],
    queryFn: () => FetchServiceLocation(userId!),
    enabled: !!userId,
  });
};