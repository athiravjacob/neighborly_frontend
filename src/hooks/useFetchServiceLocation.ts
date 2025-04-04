// hooks/useFetchServiceLocation.ts
import { useQuery } from "@tanstack/react-query";
import { FetchServiceLocation } from "../api/neighborApiRequests";
import { Location, Coordinates } from "../types/locationDTO";

export const useFetchServiceLocation = (userId: string | undefined) => {
  return useQuery<CoordinatesLocation, Error>({
    queryKey: ["serviceLocation", userId],
    queryFn: async () => {
      const data = await FetchServiceLocation(userId!);
      // Convert [lng, lat] to { lat, lng }
      return {
        city: data.city,
        radius: data.radius,
        coordinates: {
          lat: data.coordinates[1], // Second element is latitude
          lng: data.coordinates[0], // First element is longitude
        },
      };
    },
    enabled: !!userId,
  });
};

// Updated type to match the component's expectation
export interface CoordinatesLocation {
  city: string;
  radius: number;
  coordinates: Coordinates; // { lat: number, lng: number }
}