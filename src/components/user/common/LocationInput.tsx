// src/components/LocationInput.tsx
import React, { useState } from "react";

const LocationInput: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  const handleDetectLocation = () => {
    setIsDetecting(true);
    setLocation("Detecting...");

    // Simulate geolocation (replace with real API call later)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
            setLocation(`${latitude}, ${longitude}`);
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            .then((response) => response.json())
                .then((data) => {
                console.log(data)
              if (data.display_name) {
                setLocation(`${data.address.county} ,${data.address.state_district}`);
              }
            })
            .catch((error) => console.error('Error fetching location:', error));
        setIsDetecting(false);
      },
      (error) => {
        setLocation("Permission Denied");
        setIsDetecting(false);
      },
      { timeout: 5000 }
    );
  };

  return (
    <div className="relative w-64">
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location"
        className="w-full pl-4 pr-10 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-white"
        disabled={isDetecting}
      />
      <button
        onClick={handleDetectLocation}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-violet-800 transition-colors"
        aria-label="Detect my location"
        disabled={isDetecting}
      >
        📍
      </button>
    </div>
  );
};

export default LocationInput;