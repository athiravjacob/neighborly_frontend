// hooks/useServiceLocation.ts
import { useState } from "react";
import { Coordinates } from "../types/locationDTO";

export const useServiceLocation = () => {
  // Hardcoded city options (replace with API call if dynamic)
  const cityOptions = ["Kochi", "Aluva", "Muvattupuzha", "Kothamangalam", "Vypin"];

  const [city, setCity] = useState<string>("");
  const [radius, setRadius] = useState<number>(5);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      console.error("Geolocation not supported by this browser.");
    }
  };

  return {
    cityOptions,
    city,
    setCity,
    radius,
    setRadius,
    coordinates,
    setCoordinates,
    handleGetLocation,
  };
};