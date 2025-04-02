import { useEffect, useState } from "react";
import { useSaveLocationMutation } from "../../hooks/useSaveLocationMutation";
import { useServiceLocation } from "../../hooks/useServiceLocation";
import { MapPin, Save, Loader2, Navigation } from "lucide-react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Coordinates } from "../../types/locationDTO";
import { useFetchServiceLocation } from "../../hooks/useFetchServiceLocation";

const MapUpdater = ({ coordinates, radius }: { coordinates: Coordinates; radius: number }) => {
  const map = useMap();
  useEffect(() => {
    if (coordinates?.lat && coordinates?.lng) {
      map.setView([coordinates.lat, coordinates.lng], 12);
    }
  }, [coordinates, map]);
  return null;
};

const ServiceLocation = () => {
  const [isMapReady, setIsMapReady] = useState(false);
  const [showMap, setShowMap] = useState(false); // Controls map visibility
  const {
    locations,
    selectedLocation,
    setSelectedLocation,
    radius,
    setRadius,
    coordinates,
    setCoordinates,
    handleGetLocation,
    user,
  } = useServiceLocation();

  const { data: serviceLocation, isLoading, isSuccess, isError, error } = useFetchServiceLocation(user?.id);
  const mutation = useSaveLocationMutation(user?.id, selectedLocation, radius, coordinates);

  useEffect(() => {
    if (isSuccess && serviceLocation) {
      setSelectedLocation(serviceLocation.city || "");
      setRadius(serviceLocation.radius || 5);
      if (serviceLocation.coordinates && serviceLocation.coordinates.length === 2) {
        setCoordinates({
          lat: serviceLocation.coordinates[0],
          lng: serviceLocation.coordinates[1],
        });
        setShowMap(true); // Show map if coordinates exist from saved data
      } else {
        setShowMap(false); // Hide map if no coordinates in saved data
      }
    }
  }, [isSuccess, serviceLocation, setSelectedLocation, setRadius, setCoordinates]);

  useEffect(() => {
    if (coordinates.lat !== 0 && coordinates.lng !== 0) {
      const timer = setTimeout(() => setIsMapReady(true), 500);
      return () => clearTimeout(timer);
    }
  }, [coordinates]);

  const hasValidCoordinates = coordinates.lat !== 0 && coordinates.lng !== 0;

  const handleCitySelection = (city: string) => {
    if (city) {
      setSelectedLocation(city);
    }
  };

  const handleGetCurrentLocation = () => {
    handleGetLocation();
    setShowMap(true); // Show map when getting current location
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-white rounded-lg border border-gray-100">
        <Loader2 className="h-8 w-8 text-violet-600 animate-spin mr-2" />
        <p className="text-gray-600">Loading service location...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-md overflow-hidden p-6">
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <MapPin className="text-violet-600 h-6 w-6" />
          <h1 className="text-2xl font-bold text-gray-800">Set Your Service Location</h1>
        </div>
        <button
          onClick={() => mutation.mutate()}
          className={`px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors flex items-center gap-2 ${
            !selectedLocation || !hasValidCoordinates ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!selectedLocation || !hasValidCoordinates || mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Location</span>
            </>
          )}
        </button>
      </div>

      {isError ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200">
          Failed to load service location: {error?.message || "Unknown error"}
        </div>
      ) : !isSuccess && !serviceLocation && !selectedLocation && !hasValidCoordinates ? (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-200">
          You haven’t set a service location yet. Please select a city or use your current location, then save.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-violet-700 text-lg mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-violet-600" />
              Service Area Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Location: <span className="text-violet-600 font-semibold">{selectedLocation || "Not set"}</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedLocation || ""}
                    onChange={(e) => handleCitySelection(e.target.value)}
                    className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 appearance-none text-gray-800"
                  >
                    <option value="" disabled>
                      Select a city (optional)
                    </option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Radius: <span className="text-violet-600 font-semibold">{radius} km</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="1"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5 km</span>
                  <span>10 km</span>
                  <span>15 km</span>
                </div>
              </div>
            </div>
          </div>

          {showMap && hasValidCoordinates && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-violet-700 text-lg mb-4">Service Area Map</h3>
              {isMapReady ? (
                <div className="h-96 w-full rounded-lg overflow-hidden">
                  <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={12} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[coordinates.lat, coordinates.lng]} />
                    <Circle
                      center={[coordinates.lat, coordinates.lng]}
                      radius={radius * 1000}
                      pathOptions={{ color: "violet", fillColor: "violet", fillOpacity: 0.2 }}
                    />
                    <MapUpdater coordinates={coordinates} radius={radius} />
                  </MapContainer>
                </div>
              ) : (
                <div className="h-96 w-full rounded-lg flex items-center justify-center bg-gray-100">
                  <Loader2 className="h-8 w-8 text-violet-600 animate-spin mr-2" />
                  <p className="text-gray-500">Loading map...</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Latitude</p>
                  <p className="font-medium">{coordinates.lat.toFixed(6)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Longitude</p>
                  <p className="font-medium">{coordinates.lng.toFixed(6)}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleGetCurrentLocation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            <Navigation className="h-5 w-5" />
            <span>Use My Current Location</span>
          </button>

          {mutation.isSuccess && (
            <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Location saved successfully!
            </div>
          )}
          {mutation.isError && (
            <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200">
              Failed to save location: {mutation.error?.message || "Unknown error"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ServiceLocation;