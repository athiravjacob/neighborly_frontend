
export interface newTaskDetails {
  createdBy: string; 
  assignedNeighbor?: string | null; 
  location: string;
  category: string;
  subCategory: string;
  description: string;
  est_hours: number;
  prefferedDate: Date | string;
  timeSlot: {
    startTime: number; 
    endTime?: number;
  };
  ratePerHour: number;
 
}