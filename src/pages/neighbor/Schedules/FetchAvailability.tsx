import { Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface  TimeSlot {
  startTime: number;
  endTime: number;
  _id?: string;
}

export interface Availability {
  dayOfWeek: string;
  timeslot: TimeSlot[];
  _id?: string;
} 

export interface CalendarEvent {
  id: string;
  start: Date;
  end: Date;
  title: string;
}

export const daysOfWeek = ["sun", "mon", "tue", "wed", "thur", "fri", "sat"];

// // Mock API functions
// export const FetchAvailability = async (userId: string): Promise<Availability[]> => {
//   return [
//     {
//       dayOfWeek: "mon",
//       timeslot: [{ startTime: 540, endTime: 720, _id: "1" }, { startTime: 780, endTime: 1020, _id: "2" }],
//       _id: "68368e1003375a5a7bb73f0a",
//     },
//     {
//       dayOfWeek: "wed",
//       timeslot: [{ startTime: 480, endTime: 660, _id: "3" }],
//       _id: "68368e1003375a5a7bb73f0b",
//     },
//     {
//       dayOfWeek: "fri",
//       timeslot: [{ startTime: 540, endTime: 1020, _id: "4" }],
//       _id: "68368e1003375a5a7bb73f0c",
//     },
//     {
//       dayOfWeek: "sat",
//       timeslot: [{ startTime: 600, endTime: 900, _id: "5" }],
//       _id: "68368e1003375a5a7bb73f0e",
//     },
//   ];
// };