// Instructions Component
export const Instructions: React.FC = () => (
    <div className="mb-8 p-5 bg-violet-50 rounded-xl border border-violet-100 flex items-start gap-4">
      <div className="text-violet-600 bg-violet-100 p-2 rounded-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </div>
      <div className="text-violet-800 text-sm">
        <h3 className="text-violet-900 font-semibold text-base mb-1">How to use this scheduler</h3>
        <ul className="space-y-1">
          <li className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-violet-600 rounded-full"></span>
            Toggle availability for each day
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-violet-600 rounded-full"></span>
            Set start and end times for available slots
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-violet-600 rounded-full"></span>
            Add multiple slots per day if needed
          </li>
        </ul>
      </div>
    </div>
  );