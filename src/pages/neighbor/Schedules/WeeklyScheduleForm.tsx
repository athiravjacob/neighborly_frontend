import { DayAvailability, WeeklyAvailability } from "./DayAvailability";

// WeeklyScheduleForm Component
export const WeeklyScheduleForm: React.FC<{
    weeklyAvailability: WeeklyAvailability[];
    isMobile: boolean;
    onToggle: (day: string) => void;
    onUpdateTimeSlot: (day: string, index: number, field: "startTime" | "endTime", value: string) => void;
    onAddTimeSlot: (day: string) => void;
    onRemoveTimeSlot: (day: string, index: number) => void;
  }> = ({ weeklyAvailability, isMobile, onToggle, onUpdateTimeSlot, onAddTimeSlot, onRemoveTimeSlot }) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-violet-800 mb-4">Weekly Schedule</h3>
      {isMobile ? (
        <div className="space-y-4">
          {weeklyAvailability.map((day) => (
            <DayAvailability
              key={day.day}
              day={day}
              isMobile={isMobile}
              onToggle={onToggle}
              onUpdateTimeSlot={onUpdateTimeSlot}
              onAddTimeSlot={onAddTimeSlot}
              onRemoveTimeSlot={onRemoveTimeSlot}
            />
          ))}
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-violet-800 font-semibold">
              <th className="p-2">Day</th>
              <th className="p-2">Availability</th>
              <th className="p-2">Time Slots</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {weeklyAvailability.map((day) => (
              <DayAvailability
                key={day.day}
                day={day}
                isMobile={isMobile}
                onToggle={onToggle}
                onUpdateTimeSlot={onUpdateTimeSlot}
                onAddTimeSlot={onAddTimeSlot}
                onRemoveTimeSlot={onRemoveTimeSlot}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );