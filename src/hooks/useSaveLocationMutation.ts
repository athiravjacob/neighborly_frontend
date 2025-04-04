// hooks/useSaveLocationMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddServiceLocation } from "../api/neighborApiRequests";
import { Location, Coordinates } from "../types/locationDTO";

export const useSaveLocationMutation = (
  userId: string | undefined,
  city: string,
  radius: number,
  coordinates: Coordinates | null
) => {
  const queryClient = useQueryClient();

  return useMutation<Location, Error>({
    mutationFn: async () => {
      if (!userId || !city || !coordinates?.lat || !coordinates?.lng) {
        throw new Error("All fields (city, radius, coordinates) are required");
      }
      const locationData: Location = {
        city,
        radius,
        coordinates: [coordinates.lng, coordinates.lat], // Convert to [lng, lat] for API
      };
      return AddServiceLocation(userId, locationData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceLocation", userId] });
    },
    onError: (error) => {
      console.error("Error saving location:", error.message);
    },
  });
};