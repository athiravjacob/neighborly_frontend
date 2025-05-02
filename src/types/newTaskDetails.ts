import { NeighborInfo } from "./neighbor";

export enum TaskStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  DISPUTED = 'disputed'
}
export interface newTaskDetails {
  _id: string|undefined;
  createdBy: string; 
  assignedNeighbor?: NeighborInfo | null; 
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
  task_status?: TaskStatus; 
  payment_status?: PaymentStatus
 
}