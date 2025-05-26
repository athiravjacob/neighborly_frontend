export interface NeighborInfo {
  _id: string;
  name: string;
  email: string;
  phone: string;
  availableLocation: {
    city: string;
    radius: number;
    coordinates: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  skills: {
    category: string;
    subcategories: string[];
    hourlyRate: number;
    description: string;
  }[];
  availability: {
    date: Date;
    timeSlots: {
      startTime: number;
      endTime: number;
      note: "available" | "booked";
    }[];
    }[];
    isVerified: Boolean;
    idCardImage: string;

}