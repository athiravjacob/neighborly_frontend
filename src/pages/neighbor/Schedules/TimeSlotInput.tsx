import moment from "moment";

// Interfaces
interface AvailabilitySlot {
    startTime: string; // e.g., "09:00"
    endTime: string; // e.g., "17:00"
  }
  
// TimeSlotInput Component
export const TimeSlotInput: React.FC<{
    slot: AvailabilitySlot;
    index: number;
    day: string;
    onUpdate: (day: string, index: number, field: "startTime" | "endTime", value: string) => void;
    onRemove: (day: string, index: number) => void;
  }> = ({ slot, index, day, onUpdate, onRemove }) => {
    const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
      const hours = Math.floor(i / 2);
      const minutes = i % 2 === 0 ? "00" : "30";
      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    });
  
    return (
      <div className="flex items-center gap-2 mb-2">
        <select
          value={slot.startTime}
          onChange={(e) => onUpdate(day, index, "startTime", e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {moment(time, "HH:mm").format("h:mm A")}
            </option>
          ))}
        </select>
        <span>-</span>
        <select
          value={slot.endTime}
          onChange={(e) => onUpdate(day, index, "endTime", e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {moment(time, "HH:mm").format("h:mm A")}
            </option>
          ))}
        </select>
        <button onClick={() => onRemove(day, index)} className="text-red-600 hover:text-red-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18"></path>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <path d="M6 6l2 12h8l2-12"></path>
          </svg>
        </button>
      </div>
    );
  };