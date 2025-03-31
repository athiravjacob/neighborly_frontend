import React, { useState, useEffect } from "react";

interface Coordinates {
  lat: number | null;
  lng: number | null;
}

const ServiceLocation: React.FC = () => {
  // Available locations
  const locations = [
    "Kochi", "Aluva", "Muvattupuzha", "Eloor", "Kakkanadu", "Thripunnithura",
    "Perumbavoor", "Angamaly", "Vyttila", "Edappally"
  ];

  // Radius options in km
  const radiusOptions = [5, 10, 15];

  // State management
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [radius, setRadius] = useState<number>(10);
  const [coordinates, setCoordinates] = useState<Coordinates>({ lat: null, lng: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Get current location
  const handleGetLocation = () => {
    setIsLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setError("Could not retrieve your location. Please check your permissions.");
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  // Save location data
  const handleSave = () => {
    if (!selectedLocation) {
      setError("Please select a location");
      return;
    }
    
    console.log("Selected Location:", selectedLocation);
    console.log("Radius:", radius + " km");
    console.log("Coordinates:", coordinates.lat, coordinates.lng);
    
    // Show success message temporarily
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-violet-950">Service Location</h1>
        <button
          onClick={handleSave}
          className={`px-4 py-2 bg-violet-700 text-white rounded-lg text-sm font-medium hover:bg-violet-800 flex items-center gap-2 shadow-sm ${
            !selectedLocation ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!selectedLocation}
        >
          Save Location
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Selection Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-violet-100 p-3 rounded-full text-violet-800 text-xl">
              📍
            </div>
            <div>
              <h3 className="font-semibold text-violet-800 text-lg">Select Service Area</h3>
              <p className="text-sm text-gray-600 mt-1">Choose a location and service radius</p>
            </div>
          </div>

          {/* Location Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Location
            </label>
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full py-2 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-violet-500 focus:border-violet-500 appearance-none"
              >
                <option value="" disabled>Select a location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Radius Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Radius: {radius} km
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="5"
                max="25"
                step="5"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              {radiusOptions.map((r) => (
                <span key={r}>{r}km</span>
              ))}
            </div>
          </div>

          {/* Radius Visualization */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Coverage Area</span>
              <span className="font-semibold text-violet-900">{Math.PI * radius * radius} km²</span>
            </div>
            
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-violet-600 rounded-full" 
                style={{ width: `${(radius / 25) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {radius < 10 ? "Small" : radius < 20 ? "Medium" : "Large"} coverage area
            </p>
          </div>
        </div>

        {/* Current Location Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-violet-100 p-3 rounded-full text-violet-800 text-xl">
              🔍
            </div>
            <div>
              <h3 className="font-semibold text-violet-800 text-lg">Current Location</h3>
              <p className="text-sm text-gray-600 mt-1">Get your precise coordinates</p>
            </div>
          </div>

          {coordinates.lat && coordinates.lng ? (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Latitude</span>
                <span className="text-sm text-violet-800 font-mono">{coordinates.lat.toFixed(6)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Longitude</span>
                <span className="text-sm text-violet-800 font-mono">{coordinates.lng.toFixed(6)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ● Active
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-center mb-6">
              <div className="text-gray-400 text-5xl mb-4">📱</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No location data</h3>
              <p className="text-sm text-gray-500 mb-2">Click the button below to fetch your current coordinates</p>
            </div>
          )}

          <button
            onClick={handleGetLocation}
            disabled={isLoading}
            className="w-full py-2 px-4 border border-violet-200 text-violet-700 rounded-lg text-sm font-medium hover:bg-violet-50 transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-violet-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Detecting Location...</span>
              </>
            ) : (
              <>
                <span>📍</span>
                <span>Get Current Location</span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              Location settings saved successfully!
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 italic">
              Your location data is only used to provide service in your area and will not be shared with third parties.
            </p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
        <div className="flex items-start gap-3">
          <div className="text-violet-600 text-xl mt-1">ℹ️</div>
          <div>
            <h4 className="font-medium text-violet-900 mb-1">Service Area Information</h4>
            <p className="text-sm text-violet-700">
              Setting a larger service radius increases your chances of receiving service requests, but may require longer travel times. Choose a radius that matches your mobility capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceLocation;