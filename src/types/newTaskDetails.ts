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
  createdBy: userGeneralInfo | null; 
  assignedNeighbor?: NeighborInfo | null; 
  location: string;
  category: string;
  subCategory: string;
  description: string;
  est_hours: string;
  prefferedDate: Date ;
  timeSlot?: {
    startTime?: number; 
    endTime?: number;
    note:"available"|"booked"

  };
  ratePerHour: number;
  est_amount:string
  actual_hours:number
  base_amount?: number;
  platform_fee?: number;
  final_amount?: number;
  extra_charges?: number;
  additional_notes?: string;
  task_status?: TaskStatus; 
  payment_status?: PaymentStatus;
  task_code?:string
}

export interface TaskRequestDetails{
  createdBy: userGeneralInfo | string; 
  assignedNeighbor?: NeighborInfo | string; 
  location: string;
  category: string;
  subCategory: string;
  description: string;
  est_hours: string;
  prefferedDate: Date | string;
  ratePerHour: number;
  est_amount:string

}