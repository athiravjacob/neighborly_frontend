import { useMutation } from "@tanstack/react-query";
import { AddServiceLocation } from "../api/neighborApiRequests"; 
import { Location, Coordinates } from "../types/locationDTO"; 

export const useSaveLocationMutation = (
  userId: string | undefined,
  selectedLocation: string,
  radius: number,
  coordinates: Coordinates
) => {
  return useMutation<Location, Error>({
    mutationFn: async () => {
      if (!userId || !selectedLocation || !coordinates.lat || !coordinates.lng) {
        throw new Error("Invalid data for saving location");
      }
      const locationData: Location = {
        city: selectedLocation,
        radius,
        coordinates: [coordinates.lat, coordinates.lng],
      };
      return AddServiceLocation(userId, locationData);
    },
    onSuccess: (data) => {
      console.log("Location saved successfully:", data);
    },
    onError: (error) => {
      console.error("Error saving location:", error.message);
    },
  });
};