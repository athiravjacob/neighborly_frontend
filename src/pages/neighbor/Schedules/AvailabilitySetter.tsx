import { Plus, X, Copy } from "lucide-react";
import { Availability } from "./FetchAvailability";

// Define DayOfWeek type (matches FetchAvailability)
type DayOfWeek = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

interface Props {
  availability: Availability[];
  setAvailability: (newAvailability: Availability[]) => void;
  isLoading: boolean;
  isSaving: boolean;
  handleSave: () => Promise<void>;
  handleClearAll: () => void;
}

export const AvailabilitySetter: React.FC<Props> = ({
  availability,
  setAvailability,
  isLoading,
  isSaving,
  handleSave,
  handleClearAll,
}) => {
  const days = [
    { short: "Sun", full: "Sunday", abbrev: "sun", color: "bg-red-100 text-red-800" },
    { short: "Mon", full: "Monday", abbrev: "mon", color: "bg-blue-100 text-blue-800" },
    { short: "Tue", full: "Tuesday", abbrev: "tue", color: "bg-green-100 text-green-800" },
    { short: "Wed", full: "Wednesday", abbrev: "wed", color: "bg-yellow-100 text-yellow-800" },
    { short: "Thu", full: "Thursday", abbrev: "thu", color: "bg-purple-100 text-purple-800" },
    { short: "Fri", full: "Friday", abbrev: "fri", color: "bg-indigo-100 text-indigo-800" },
    { short: "Sat", full: "Saturday", abbrev: "sat", color: "bg-pink-100 text-pink-800" },
  ];

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  const timeToMinutes = (time: string): number => {
    if (!/^\d{2}:\d{2}$/.test(time)) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleAddTimeSlot = (day: DayOfWeek) => {
    const dayIndex = availability.findIndex((item) => item.dayOfWeek === day);
    if (dayIndex !== -1) {
      setAvailability(
        availability.map((item, i) =>
          i === dayIndex
            ? { ...item, timeslots: [...item.timeslots, { startTime: 540, endTime: 1020 }] }
            : item
        )
      );
    }
  };

  const handleTimeSlotChange = (
    day: DayOfWeek,
    slotIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const minutes = timeToMinutes(value);
    const dayIndex = availability.findIndex((item) => item.dayOfWeek === day);
    if (dayIndex !== -1) {
      setAvailability(
        availability.map((item, i) =>
          i === dayIndex
            ? {
                ...item,
                timeslots: item.timeslots.map((slot, idx) =>
                  idx === slotIndex
                    ? {
                        ...slot,
                        [field]: minutes,
                        // Ensure endTime > startTime
                        ...(field === "startTime" && minutes >= slot.endTime
                          ? { endTime: minutes + 60 }
                          : {}),
                        ...(field === "endTime" && minutes <= slot.startTime
                          ? { startTime: minutes - 60 }
                          : {}),
                      }
                    : slot
                ),
              }
            : item
        )
      );
    }
  };

  const handleRemoveTimeSlot = (day: DayOfWeek, slotIndex: number) => {
    const dayIndex = availability.findIndex((item) => item.dayOfWeek === day);
    if (dayIndex !== -1) {
      setAvailability(
        availability.map((item, i) =>
          i === dayIndex
            ? { ...item, timeslots: item.timeslots.filter((_, idx) => idx !== slotIndex) }
            : item
        )
      );
    }
  };

  const handleCopyTimeSlot = (day: DayOfWeek, slotIndex: number) => {
    const dayIndex = availability.findIndex((item) => item.dayOfWeek === day);
    if (dayIndex !== -1) {
      const slot = availability[dayIndex].timeslots[slotIndex];
      setAvailability(
        availability.map((item, i) =>
          i === dayIndex
            ? { ...item, timeslots: [...item.timeslots, { ...slot, _id: undefined }] }
            : item
        )
      );
    }
  };

  const toggleUnavailable = (day: DayOfWeek) => {
    const dayIndex = availability.findIndex((item) => item.dayOfWeek === day);
    if (dayIndex !== -1) {
      setAvailability(
        availability.map((item, i) =>
          i === dayIndex
            ? {
                ...item,
                timeslots: item.timeslots.length === 0 ? [{ startTime: 540, endTime: 1020 }] : [],
              }
            : item
        )
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-gray-600 ml-3 text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Set Your Weekly Availability</h1>
      {availability.map((item) => {
        const dayInfo = days.find((d) => d.abbrev === item.dayOfWeek);
        const isUnavailable = item.timeslots.length === 0;
        return (
          <div key={item.dayOfWeek} className="mb-6 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${dayInfo?.color} font-medium`}>
                {dayInfo?.short || item.dayOfWeek}
              </div>
              {isUnavailable ? (
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm italic">Unavailable</span>
                  <button
                    onClick={() => toggleUnavailable(item.dayOfWeek)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-sm font-medium">Add Availability</span>
                  </button>
                </div>
              ) : (
                <div className="flex-1 space-y-3">
                  {item.timeslots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="time"
                        value={formatTime(slot.startTime)}
                        onChange={(e) => handleTimeSlotChange(item.dayOfWeek, index, "startTime", e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 w-32 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="time"
                        value={formatTime(slot.endTime)}
                        onChange={(e) => handleTimeSlotChange(item.dayOfWeek, index, "endTime", e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 w-32 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
                      />
                      <button
                        onClick={() => handleCopyTimeSlot(item.dayOfWeek, index)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Copy Time Slot"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRemoveTimeSlot(item.dayOfWeek, index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Remove Time Slot"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddTimeSlot(item.dayOfWeek)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" /> Add Time Slot
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={handleClearAll}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Clear All
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSaving ? "Saving..." : "Save Schedule"}
        </button>
      </div>
    </div>
  );
};
