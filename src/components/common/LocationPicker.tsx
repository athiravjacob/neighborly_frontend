import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import { toast } from 'react-toastify';
import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
  height: string;
  initialCoordinates: { lat: number; lng: number };
  onLocationChange: (data: { coordinates: { lat: number; lng: number }; address: string }) => void;
  showRadius?: boolean;
  radius?: number;
  showAddressInput?: boolean;
}

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Fetch address from Nominatim API using React Query
const fetchAddress = async (coordinates: { lat: number; lng: number }) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}`,
    {
      headers: {
        'User-Agent': 'YourAppName/1.0 (contact@yourdomain.com)',
      },
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.display_name || 'Unknown location';
};

const MapController: React.FC<{
  coordinates: { lat: number; lng: number };
  setCoordinates: (coords: { lat: number; lng: number }) => void;
  onLocationChange: (data: { coordinates: { lat: number; lng: number }; address: string }) => void;
}> = ({ coordinates, setCoordinates, onLocationChange }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([coordinates.lat, coordinates.lng], 13);

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const newCoordinates = { lat: e.latlng.lat, lng: e.latlng.lng };
      setCoordinates(newCoordinates);
      onLocationChange({ coordinates: newCoordinates, address: '' }); // Update coordinates immediately
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, setCoordinates, onLocationChange]);

  return null;
};

export const LocationPicker: React.FC<LocationPickerProps> = ({
  height,
  initialCoordinates,
  onLocationChange,
  showRadius = false,
  radius = 5,
  showAddressInput = false,
}) => {
  const [coordinates, setCoordinates] = useState(initialCoordinates);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Fetch address with React Query
  const { data: address, isLoading: isAddressLoading, error: addressError } = useQuery({
    queryKey: ['address', coordinates],
    queryFn: () => fetchAddress(coordinates),
    enabled: hasInteracted, // Only fetch after user interaction
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  });

  // Update parent component when address is fetched
  useEffect(() => {
    if (address && hasInteracted) {
      onLocationChange({ coordinates, address });
    }
  }, [address, coordinates, onLocationChange, hasInteracted]);

  // Handle address fetch errors
  useEffect(() => {
    if (addressError) {
      let message = 'Failed to fetch address. Please try again.';
      if ((addressError as Error).message.includes('429')) {
        message = 'Too many requests. Please try again later.';
      } else if ((addressError as Error).message.includes('NetworkError')) {
        message = 'Network error. Please check your connection.';
      }
      toast.error(message);
      onLocationChange({ coordinates, address: '' });
    }
  }, [addressError, coordinates, onLocationChange]);

  // Get current location on mount, only if no user interaction
  useEffect(() => {
    let isMounted = true;
    if (!hasInteracted && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!isMounted) return;
          const newCoordinates = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCoordinates(newCoordinates);
          setHasInteracted(true); // Trigger address fetch
        },
        (error) => {
          if (!isMounted) return;
          toast.info(
            'Unable to get your location. Defaulting to provided coordinates. Try enabling location services.',
            { autoClose: 5000 }
          );
          setCoordinates(initialCoordinates);
          setHasInteracted(true); // Trigger address fetch
        },
        { timeout: 10000 }
      );
    } else if (!navigator.geolocation) {
      toast.info('Geolocation is not supported by your browser. Defaulting to provided coordinates.');
      setCoordinates(initialCoordinates);
      setHasInteracted(true); // Trigger address fetch
    }
    return () => {
      isMounted = false;
    };
  }, [initialCoordinates]);

  // Handle marker drag end
  const handleMarkerDragEnd = (event: L.LeafletEvent) => {
    const marker = event.target;
    const position = marker.getLatLng();
    const newCoordinates = { lat: position.lat, lng: position.lng };
    setCoordinates(newCoordinates);
    setHasInteracted(true); // Trigger address fetch
  };

  // Handle manual geolocation trigger
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoordinates = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCoordinates(newCoordinates);
          setHasInteracted(true); // Trigger address fetch
          toast.success('Location updated to your current position!');
        },
        (error) => {
          toast.error('Failed to get your location. Please try again.');
        },
        { timeout: 10000 }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
    }
  };

  // Memoize MapContainer to prevent unnecessary re-renders
  const mapContainer = useMemo(
    () => (
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={13}
        style={{ height, width: '100%' }}
        key={`${coordinates.lat}-${coordinates.lng}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={[coordinates.lat, coordinates.lng]}
          draggable={true}
          icon={customIcon}
          eventHandlers={{
            dragend: handleMarkerDragEnd,
          }}
        />
        {showRadius && (
          <Circle
            center={[coordinates.lat, coordinates.lng]}
            radius={radius * 1000}
            pathOptions={{ color: 'violet', fillColor: 'violet', fillOpacity: 0.2 }}
          />
        )}
        <MapController
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          onLocationChange={onLocationChange}
        />
      </MapContainer>
    ),
    [coordinates, height, radius, showRadius, onLocationChange]
  );

  return (
    <div className="w-full space-y-2">
      <div className="w-full rounded-lg overflow-hidden border border-gray-300">
        {mapContainer}
        {isAddressLoading && (
          <div className="absolute top-2 left-2 bg-white p-2 rounded shadow">
            Loading address...
          </div>
        )}
      </div>
      {showAddressInput && (
        <input
          type="text"
          value={address || ''}
          readOnly
          placeholder="Selected location will appear here (e.g., New York, NY)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
          aria-label="Selected location address"
        />
      )}
      <button
        onClick={handleGetCurrentLocation}
        aria-label="Use my current location"
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span>Use My Current Location</span>
      </button>
    </div>
  );
};