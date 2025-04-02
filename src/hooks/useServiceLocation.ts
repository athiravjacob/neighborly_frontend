import { useState } from "react";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { Coordinates } from "../types/locationDTO";

export const useServiceLocation = () => {
  // Fallback locations (replace with backend API if available)
  const locations = [
    "Kochi",
    "Aluva",
    "Muvattupuzha",
    "Eloor",
    "Kakkanadu",
    "Thripunnithura",
    "Perumbavoor",
    "Angamaly",
    "Vyttila",
    "Edappally",
  ];
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [radius, setRadius] = useState<number>(5);
  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: 9.9312, // Default Kochi coordinates
    lng: 76.2673,
  });
  const { user } = useSelector((state: RootState) => state.auth);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords: Coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCoordinates(newCoords);
          setSelectedLocation("Current Location"); // Custom label for geolocation
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
    locations,
    selectedLocation,
    setSelectedLocation,
    radius,
    setRadius,
    coordinates,
    setCoordinates,
    handleGetLocation,
    user,
  };
};