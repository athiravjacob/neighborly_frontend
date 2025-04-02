export interface Location {
    city: string;
    radius: number;
    coordinates: [number, number]; // [lat, lng]
  }
  
  export interface Coordinates {
    lat: number;
    lng: number;
  }