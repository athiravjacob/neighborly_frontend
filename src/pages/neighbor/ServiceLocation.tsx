// components/ServiceLocation.tsx
import { useState, useEffect } from "react";
import { MapPin, Save, Loader2, Navigation } from "lucide-react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Coordinates } from "../../types/locationDTO";
import { useFetchServiceLocation } from "../../hooks/useFetchServiceLocation";
import { useSaveLocationMutation } from "../../hooks/useSaveLocationMutation";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const MapUpdater = ({ coordinates }: { coordinates: Coordinates }) => {
  const map = useMap();
  if (coordinates.lat && coordinates.lng) {
    map.setView([coordinates.lat, coordinates.lng], 12);
  }
  return null;
};

const ServiceLocation = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: serviceLocation, isLoading, isError, error } = useFetchServiceLocation(user?.id);
  // Initialize state with fetched data or defaults
  const [city, setCity] = useState<string>("");
  const [radius, setRadius] = useState<number>(5);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  // Pre-fill form with fetched data
  useEffect(() => {
    if (serviceLocation) {
      setCity(serviceLocation.city);
      setRadius(serviceLocation.radius);
      setCoordinates(serviceLocation.coordinates);
    }
  }, [serviceLocation]);

  const cityOptions = ["Kochi", "Aluva", "Muvattupuzha", "Kothamangalam", "Vypin"];
  const mutation = useSaveLocationMutation(user?.id, city, radius, coordinates);

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
          alert("Failed to get location. Please allow location access.");
        }
      );
    } else {
      console.error("Geolocation not supported by this browser.");
      alert("Geolocation is not supported by your browser.");
    }
  };

  const hasValidCoordinates = coordinates?.lat !== undefined && coordinates?.lng !== undefined;

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
          onClick={() => {
            console.log(city,radius,coordinates)
            console.log("Saving with:", { city, radius, coordinates });
            mutation.mutate();
          }}
          disabled={!city || !hasValidCoordinates || mutation.isPending}
          className={`px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors flex items-center gap-2 ${
            !city || !hasValidCoordinates ? "opacity-50 cursor-not-allowed" : ""
          }`}
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
          Failed to load location: {error?.message || "Unknown error"}
        </div>
      ) : !serviceLocation ? (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-200">
          No service location set. Please select a city and coordinates, then save.
        </div>
      ) : (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200">
          Current Location: {serviceLocation.city}, Radius: {serviceLocation.radius} km
        </div>
      )}

      <div className="space-y-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-violet-700 text-lg mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-violet-600" />
            Service Area Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              >
                <option value="" disabled>
                  Select a city
                </option>
                {cityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
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

        {hasValidCoordinates && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-violet-700 text-lg mb-4">Service Area Map</h3>
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
                <MapUpdater coordinates={coordinates} />
              </MapContainer>
            </div>
          </div>
        )}

        <button
          onClick={handleGetLocation}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
        >
          <Navigation className="h-5 w-5" />
          <span>Use My Current Location</span>
        </button>

        {mutation.isSuccess && (
          <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200">
            Location saved successfully!
          </div>
        )}
        {mutation.isError && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200">
            Failed to save location: {mutation.error?.message || "Unknown error"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceLocation;