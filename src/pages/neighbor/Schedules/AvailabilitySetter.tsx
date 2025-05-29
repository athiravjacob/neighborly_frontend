import { Plus, Trash2 } from "lucide-react";
import { Availability } from "./FetchAvailability";

// Component for setting availability
interface AvailabilitySetterProps {
  availability: Availability[];
  setAvailability: (newAvailability: Availability[]) => void;
  isLoading: boolean;
  isSaving: boolean;
  handleSave: () => Promise<void>;
  handleClearAll: () => void;
}

export const AvailabilitySetter: React.FC<AvailabilitySetterProps> = ({
  availability,
  setAvailability,
  isLoading,
  isSaving,
  handleSave,
  handleClearAll,
}) => {
  // Generate time options from 6:00 AM to 10:00 PM in 30-minute increments
  const timeOptions = Array.from({ length: 33 }, (_, i) => {
    const hour = Math.floor(i / 2) + 6;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  // Convert time string to minutes
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Convert minutes to time string
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  // Handle day availability toggle
  const handleDayAvailabilityChange = (index: number, checked: boolean) => {
    setAvailability(
      availability.map((item, i) =>
        i === index
          ? {
              ...item,
              timeslot: checked ? [{ startTime: 540, endTime: 1020 }] : [],
            }
          : item
      )
    );
  };

  // Handle add time slot
  const handleAddTimeSlot = (dayIndex: number) => {
    setAvailability(
      availability.map((item, i) =>
        i === dayIndex
          ? { ...item, timeslot: [...item.timeslot, { startTime: 540, endTime: 1020 }] }
          : item
      )
    );
  };

  // Handle remove time slot
  const handleRemoveTimeSlot = (dayIndex: number, slotIndex: number) => {
    setAvailability(
      availability.map((item, i) =>
        i === dayIndex
          ? { ...item, timeslot: item.timeslot.filter((_, idx) => idx !== slotIndex) }
          : item
      )
    );
  };

  // Handle time slot change
  const handleTimeSlotChange = (
    dayIndex: number,
    slotIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const minutes = timeToMinutes(value);
    setAvailability(
      availability.map((item, i) =>
        i === dayIndex
          ? {
              ...item,
              timeslot: item.timeslot.map((slot, idx) =>
                idx === slotIndex ? { ...slot, [field]: minutes } : slot
              ),
            }
          : item
      )
    );
  };

  // Guard clause for non-array availability
  if (!Array.isArray(availability)) {
    console.error('Availability is not an array:', availability);
    return <div>Error: Availability data is invalid</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Set Your Availability</h2>

        <div className="space-y-5">
          {availability.map((day, dayIndex) => (
            <div key={day.dayOfWeek} className="group">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-4">
                  <div className="w-20">
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {day.dayOfWeek === "sun"
                        ? "Sunday"
                        : day.dayOfWeek === "mon"
                        ? "Monday"
                        : day.dayOfWeek === "tue"
                        ? "Tuesday"
                        : day.dayOfWeek === "wed"
                        ? "Wednesday"
                        : day.dayOfWeek === "thu"
                        ? "Thursday"
                        : day.dayOfWeek === "fri"
                        ? "Friday"
                        : "Saturday"}
                    </span>
                  </div>

                  {day.timeslot.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {day.timeslot.map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className="flex items-center bg-blue-50 rounded-lg px-3 py-1 border border-blue-200"
                        >
                          <select
                            value={formatTime(slot.startTime)}
                            onChange={(e) =>
                              handleTimeSlotChange(dayIndex, slotIndex, "startTime", e.target.value)
                            }
                            className="bg-transparent border-none text-xs font-medium text-blue-800 focus:outline-none appearance-none cursor-pointer"
                          >
                            {timeOptions.slice(0, -1).map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          <span className="text-blue-600 text-xs mx-1">-</span>
                          <select
                            value={formatTime(slot.endTime)}
                            onChange={(e) =>
                              handleTimeSlotChange(dayIndex, slotIndex, "endTime", e.target.value)
                            }
                            className="bg-transparent border-none text-xs font-medium text-blue-800 focus:outline-none appearance-none cursor-pointer"
                          >
                            {timeOptions.slice(1).map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleRemoveTimeSlot(dayIndex, slotIndex)}
                            className="ml-2 text-blue-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddTimeSlot(dayIndex)}
                        className="flex items-center justify-center w-8 h-6 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Plus className="h-3 w-3 text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Not available</span>
                  )}
                </div>

                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={day.timeslot.length > 0}
                    onChange={(e) => handleDayAvailabilityChange(dayIndex, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {dayIndex < availability.length - 1 && <hr className="border-gray-100" />}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex gap-3">
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {isSaving ? "Saving..." : "Save Availability"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};