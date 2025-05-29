export interface AvailabilityEvent {
    dayOfWeek: string;
    id: string;
    start: Date;
    end: Date;
    title: string;
}
  

export interface BackendAvailability {
  dayOfWeek:"sun" | "mon" | "tue" | "wed" | "thur" | "fri" | "sat";
  timeslot: { startTime: number; endTime: number }[];
}