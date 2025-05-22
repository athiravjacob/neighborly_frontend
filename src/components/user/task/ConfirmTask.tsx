import React from "react";
import { MapPin, Calendar, Clock, User, Hammer, IndianRupee } from "lucide-react";
import { NeighborInfo } from "../../../types/neighbor";

interface ConfirmTaskProps {
  onConfirm: () => void;
  taskData: { location: string; taskSize: string; taskDetails: string; category: string; subCategory: string };
  selectedHelper: NeighborInfo;
  schedule: { date: string; time: string };
}

export const ConfirmTask: React.FC<ConfirmTaskProps> = ({
  onConfirm,
  taskData,
  selectedHelper,
  schedule,
}) => {
  if (!selectedHelper) {
    return <div>Error: Helper not found.</div>;
  }

  // Calculate estimated time and cost based on task size
  const estimatedTimeMap: { [key: string]: number } = {
    Small: 1,
    Medium: 3,
    Large: 6,
  };
  const estimatedTime = estimatedTimeMap[taskData.taskSize] || 2;
  const estimatedCost = selectedHelper.skills[0].hourlyRate * estimatedTime;

  // Function to determine time preference (Morning, Afternoon, Evening)
  const getTimePreference = (time: string): string => {
    // Check if time already contains a preference label
    if (time.includes("Morning")) return "Morning";
    if (time.includes("Afternoon")) return "Afternoon";
    if (time.includes("Evening")) return "Evening";

    // Parse specific time (e.g., "2:00pm") to determine preference
    const match = time.match(/(\d+):(\d{2})(am|pm)/i);
    if (match) {
      let hours = parseInt(match[1]);
      const period = match[3].toLowerCase();
      if (period === "pm" && hours !== 12) hours += 12;
      if (period === "am" && hours === 12) hours = 0;

      if (hours >= 8 && hours < 12) return "Morning";
      if (hours >= 12 && hours < 17) return "Afternoon";
      if (hours >= 17 && hours < 21) return "Evening";
    }

    return time; 
  };

  const timePreference = getTimePreference(schedule.time);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div className="bg-violet-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Confirm Your Task</h2>
        <p className="opacity-90">
          Review the details below and request your Tasker to get started.
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Task Summary */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-[#2E1065] mb-4">Task Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Hammer size={18} className="text-gray-600" />
              <span className="text-gray-700">
                <span className="font-medium">Task:</span> {taskData.taskSize} Task
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-gray-600" />
              <span className="text-gray-700">
                <span className="font-medium">Location:</span> {taskData.location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-600" />
              <span className="text-gray-700">
                <span className="font-medium">Date:</span> {schedule.date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-gray-600" />
              <span className="text-gray-700">
                <span className="font-medium">Time:</span> {timePreference}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User size={18} className="text-gray-600" />
              <span className="text-gray-700">
                <span className="font-medium">Tasker:</span> {selectedHelper.name}
              </span>
            </div>
          </div>
        </div>

        {/* Task Description */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-[#2E1065] mb-4">Task Description</h3>
          <p className="text-gray-700">{taskData.taskDetails}</p>
        </div>

        {/* Cost Summary */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-[#2E1065] mb-4">Estimated Cost</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-gray-600" />
              <span className="text-gray-700">
                <span className="font-medium">Estimated Time:</span> {estimatedTime} hours
              </span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee size={18} className="text-gray-600" />
              <span className="text-gray-700">
                <span className="font-medium">Hourly Rate:</span> ₹{selectedHelper.skills[0].hourlyRate}/hr
              </span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee size={18} className="text-gray-600" />
              <span className="text-gray-700">
                <span className="font-medium">Estimated Total:</span> ₹{estimatedCost}
              </span>
            </div>
            <p className="text-sm text-gray-500 italic">
              Note: Final cost may vary based on actual time taken and any additional requirements.
            </p>
          </div>
        </div>

        {/* Request Button */}
        <button
          onClick={onConfirm}
          className="w-full px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
        >
          Request Tasker
        </button>
      </div>
    </div>
  );
};