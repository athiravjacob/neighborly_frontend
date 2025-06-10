export const daysOfWeek = [
  "mon" , "tue" , "wed" , "thur" , "fri" , "sat" , "sun"
];
// export interface Timeslot {
//   startTime: number;
//   endTime: number;
// }

// export interface Availability {
//   dayOfWeek: string;
//   timeslot: Timeslot[];
// }

// // Placeholder for API functions (replace with actual implementations)
// export const FetchAvailability = async (userId: string): Promise<Availability[]> => {
//   // Simulate API call
//   // Replace with your actual API call (e.g., axios.get(`/api/availability/${userId}`))
//   return daysOfWeek.map((day) => ({
//     dayOfWeek: day,
//     timeslot: day !== 'sunday' && day !== 'saturday' ? [{ startTime: 540, endTime: 1020 }] : [],
//   }));
// };

// export const ScheduleTimeslots = async (userId: string, availability: Availability[]): Promise<void> => {
//   // Simulate API call
//   // Replace with your actual API call (e.g., axios.post(`/api/availability/${userId}`, availability))
//   console.log('Saving availability for user:', userId, availability);
// };

export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface TimeSlot {
  startTime: number;
  endTime: number;
}

export interface Availability {
  dayOfWeek: DayOfWeek;
  timeslots: TimeSlot[];
}