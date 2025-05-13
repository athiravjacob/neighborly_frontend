import { userGeneralInfo } from "./UserDTO";
import { NeighborInfo } from "./neighbor";

export type TaskStatus = "pending" | "assigned" | "in_progress" | "completed" | "cancelled";

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  DISPUTED = 'disputed'
}
export interface newTaskDetails {
  _id?: string;
  createdBy: userGeneralInfo |null; 
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
  baseAmount?: number;
  platform_fee?: number;
  final_amount?: number;
  task_status?: TaskStatus; 
  payment_status?: PaymentStatus
 
}