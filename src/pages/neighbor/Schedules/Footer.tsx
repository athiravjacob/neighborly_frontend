import { WeeklyAvailability } from "./DayAvailability";

// Footer Component
export const Footer: React.FC<{ weeklyAvailability: WeeklyAvailability[] }> = ({ weeklyAvailability }) => (
    <div className="mt-8 flex flex-col md:flex-row md:items-center gap-6 justify-between">
      <div className="bg-violet-50 p-4 rounded-xl flex items-center gap-3 flex-1">
        <div className="bg-violet-100 p-2 rounded-lg text-violet-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="6" x2="12" y2="12"></line>
            <line x1="12" y1="12" x2="16" y2="14"></line>
          </svg>
        </div>
        <div>
          <p className="text-violet-500 text-sm">Current timezone</p>
          <p className="text-violet-900 font-medium">
            {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </p>
        </div>
      </div>
      <div className="bg-violet-50 p-4 rounded-xl flex items-center gap-3 flex-1">
        <div className="bg-violet-100 p-2 rounded-lg text-violet-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <div>
          <p className="text-violet-500 text-sm">Total availability</p>
          <p className="text-violet-900 font-medium">
            {weeklyAvailability.reduce((count, { timeSlots }) => count + timeSlots.length, 0)} time slots
          </p>
        </div>
      </div>
    </div>
  );