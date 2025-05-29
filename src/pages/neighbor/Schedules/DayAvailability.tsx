import { AvailabilitySlot } from "./Header";
import { TimeSlotInput } from "./TimeSlotInput";
import { Plus, Calendar, Clock } from "lucide-react";

export interface WeeklyAvailability {
  day: string; 
  isAvailable: boolean;
  timeSlots: AvailabilitySlot[];
}

// DayAvailability Component
export const DayAvailability: React.FC<{
  day: WeeklyAvailability;
  isMobile: boolean;
  onToggle: (day: string) => void;
  onUpdateTimeSlot: (day: string, index: number, field: "startTime" | "endTime", value: string) => void;
  onAddTimeSlot: (day: string) => void;
  onRemoveTimeSlot: (day: string, index: number) => void;
}> = ({ day, isMobile, onToggle, onUpdateTimeSlot, onAddTimeSlot, onRemoveTimeSlot }) => {
  return isMobile ? (
    // Mobile Design
    <div className={`
      relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-md
      ${day.isAvailable 
        ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200' 
        : 'bg-gray-50 border-gray-200'
      }
    `}>
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-violet-600" />
            <h3 className="text-lg font-semibold text-gray-900">{day.day}</h3>
          </div>
          
          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={day.isAvailable}
              onChange={() => onToggle(day.day)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
          </label>
        </div>
        
        {!day.isAvailable && (
          <div className="mt-3 flex items-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Day Off</span>
          </div>
        )}
      </div>

      {/* Time Slots */}
      {day.isAvailable && (
        <div className="px-4 pb-4">
          <div className="space-y-3">
            {day.timeSlots.length > 0 ? (
              day.timeSlots.map((slot, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-violet-100">
                  <TimeSlotInput
                    slot={slot}
                    index={index}
                    day={day.day}
                    onUpdate={onUpdateTimeSlot}
                    onRemove={onRemoveTimeSlot}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No time slots added yet</p>
              </div>
            )}
            
            {/* Add Time Slot Button */}
            <button
              onClick={() => onAddTimeSlot(day.day)}
              className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-violet-300 rounded-lg text-violet-600 hover:text-violet-700 hover:border-violet-400 hover:bg-violet-50 transition-all duration-200 font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Time Slot
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    // Desktop Design - Enhanced Table Row
    <tr className={`
      group transition-all duration-200 hover:bg-gradient-to-r
      ${day.isAvailable 
        ? 'hover:from-violet-50 hover:to-purple-50 border-l-4 border-l-violet-400' 
        : 'hover:from-gray-50 hover:to-gray-50 border-l-4 border-l-gray-300'
      }
    `}>
      {/* Day Column */}
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-violet-600" />
          <span className="font-semibold text-gray-900 text-lg">{day.day}</span>
        </div>
      </td>
      
      {/* Available Toggle Column */}
      <td className="p-4">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={day.isAvailable}
            onChange={() => onToggle(day.day)}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
        </label>
      </td>
      
      {/* Time Slots Column */}
      <td className="p-4">
        <div className="min-w-0">
          {day.isAvailable ? (
            day.timeSlots.length > 0 ? (
              <div className="space-y-2">
                {day.timeSlots.map((slot, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-violet-100 hover:shadow-md transition-shadow">
                    <TimeSlotInput
                      slot={slot}
                      index={index}
                      day={day.day}
                      onUpdate={onUpdateTimeSlot}
                      onRemove={onRemoveTimeSlot}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-4 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <Clock className="h-5 w-5 mr-2 opacity-50" />
                <span className="text-sm font-medium">No time slots</span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-4 py-3 rounded-lg">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Day Off</span>
            </div>
          )}
        </div>
      </td>
      
      {/* Actions Column */}
      <td className="p-4">
        {day.isAvailable && (
          <button
            onClick={() => onAddTimeSlot(day.day)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Add Slot
          </button>
        )}
      </td>
    </tr>
  );
};