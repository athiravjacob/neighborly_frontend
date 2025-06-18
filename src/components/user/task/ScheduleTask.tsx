// import { toast } from "react-toastify";
// import { NeighborInfo } from "../../../types/neighbor";
// import { useMemo, useState } from "react";

// interface Availability {
//   date: string; // ISO date (e.g., "2025-06-11")
//   available: boolean;
// }

// interface TaskData {
//   lat: number;
//   lng: number;
//   address: string;
//   taskSize: string;
//   taskDetails: string;
//   category: string;
//   subCategory: string;
// }

// interface ScheduleTaskProps {
//   onContinue: (data: { date: string }) => void;
//   selectedHelper: NeighborInfo;
//   taskData: TaskData;
//   availability: Availability[];
// }

// export const ScheduleTask: React.FC<ScheduleTaskProps> = ({
//   onContinue,
//   selectedHelper,
//   taskData,
//   availability,
// }) => {
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);

//   const today = new Date();
//   const nextSevenDays = useMemo(() => {
//     return Array.from({ length: 7 }, (_, i) => {
//       const date = new Date(today);
//       date.setDate(today.getDate() + i);
//       return date;
//     });
//   }, []);

//   const formatDate = (date: Date): string => {
//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       month: "long",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const isDateAvailable = (date: Date): boolean => {
//     const dateStr = date.toISOString().split("T")[0];
//     const dayAvailability = availability.find((slot) => slot.date === dateStr);
//     return !!dayAvailability && dayAvailability.available;
//   };

//   const handleSelectDate = (date: Date) => {
//     const formattedDate = formatDate(date);
//     setSelectedDate(formattedDate);
//   };

//   const getEstimatedCostRange = (): { minCost: number; maxCost: number } => {
//     // Parse taskSize (e.g., "2-3hr")
//     const match = taskData.taskSize.match(/^(\d+)-(\d+)hr$/);
//     if (!match) {
//       return { minCost: 0, maxCost: 0 }; // Fallback if taskSize is invalid
//     }
//     const minDuration = parseInt(match[1], 10);
//     const maxDuration = parseInt(match[2], 10);
//     const hourlyRate = selectedHelper.skills[0].hourlyRate
//     return {
//       minCost: hourlyRate * minDuration,
//       maxCost: hourlyRate * maxDuration,
//     };
//   };

//   const handleContinue = () => {
//     if (!selectedDate) {
//       toast.error("Please select a date");
//       return;
//     }

//     const selectedDateObj = nextSevenDays.find((date) =>
//       selectedDate.includes(date.getDate().toString())
//     );
//     if (!selectedDateObj) {
//       toast.error("Invalid date selected");
//       return;
//     }

//     onContinue({
//       date: selectedDateObj.toISOString().split("T")[0],
//     });
//   };

//   const { minCost, maxCost } = getEstimatedCostRange();

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
//       <div className="p-6">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-2">Schedule Your Task</h2>
//         <p className="text-gray-600 mb-6">
//           Choose a date for <strong>{selectedHelper.name}</strong> to complete your task at{" "}
//           <strong>{taskData.address}</strong>.
//         </p>

//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="flex-1">
//             <h3 className="font-semibold text-lg mb-4">Select Date</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-violet-50 rounded-lg p-4">
//               {nextSevenDays.map((date, index) => {
//                 const isAvailable = isDateAvailable(date);
//                 const isSelected = selectedDate?.includes(date.getDate().toString());
//                 return (
//                   <button
//                     key={index}
//                     onClick={() => handleSelectDate(date)}
//                     disabled={!isAvailable}
//                     className={`
//                       p-3 rounded-lg text-center transition-colors
//                       ${
//                         isAvailable
//                           ? "bg-green-500 hover:bg-green-600 text-white"
//                           : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                       }
//                       ${isSelected ? "ring-2 ring-violet-600" : ""}
//                     `}
//                   >
//                     <div className="text-sm font-medium">
//                       {date.toLocaleString("default", { weekday: "short" })}
//                     </div>
//                     <div className="text-lg font-bold">{date.getDate()}</div>
//                     <div className="text-xs">
//                       {date.toLocaleString("default", { month: "short" })}
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         <div className="bg-gray-50 rounded-lg p-4 mt-4">
//           <h3 className="font-semibold text-lg mb-3">Task Summary</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600">Helper:</span>
//                 <span className="font-medium">{selectedHelper.name}</span>
//               </div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600">Location:</span>
//                 <span className="font-medium">{taskData.address}</span>
//               </div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600">Task Size:</span>
//                 <span className="font-medium">{taskData.taskSize}</span>
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600">Date:</span>
//                 <span className="font-medium">{selectedDate || "Not selected"}</span>
//               </div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600">Estimated Cost:</span>
//                 <span className="font-medium text-violet-700">
//                 ₹{minCost.toFixed(2)} - ₹{maxCost.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div className="mt-4">
//             <button
//               onClick={handleContinue}
//               disabled={!selectedDate}
//               className={`
//                 w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
//                 ${
//                   selectedDate
//                     ? "bg-violet-600 hover:bg-violet-700 text-white"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }
//               `}
//             >
//               Schedule and Continue
//             </button>
//             <p className="text-xs text-center text-gray-500 mt-2">
//               You'll be able to review and finalize your booking in the next step
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import { toast } from 'react-toastify';
import { NeighborInfo } from '../../../types/neighbor';
import { useMemo, useState } from 'react';

interface Availability {
  date: string; // ISO date (e.g., "2025-06-11")
  available: boolean;
}

interface TaskData {
  lat: number;
  lng: number;
  address: string;
  taskSize: string;
  taskDetails: string;
  category: string;
  subCategory: string;
}

interface ScheduleTaskProps {
  onContinue: (data: { date: string }) => void;
  selectedHelper: NeighborInfo;
  taskData: TaskData;
  availability: Availability[];
}

export const ScheduleTask: React.FC<ScheduleTaskProps> = ({
  onContinue,
  selectedHelper,
  taskData,
  availability,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = new Date();
  const nextSevenDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
  }, []);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isDateAvailable = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    const dayAvailability = availability.find((slot) => slot.date === dateStr);
    return !!dayAvailability && dayAvailability.available;
  };

  const handleSelectDate = (date: Date) => {
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
  };

  const getEstimatedCostRange = (): { minCost: number; maxCost: number } => {
    const match = taskData.taskSize.match(/^(\d+)-(\d+)hr$/);
    if (!match) {
      return { minCost: 0, maxCost: 0 };
    }
    const minDuration = parseInt(match[1], 10);
    const maxDuration = parseInt(match[2], 10);
    const hourlyRate = selectedHelper.skills[0].hourlyRate;
    return {
      minCost: hourlyRate * minDuration,
      maxCost: hourlyRate * maxDuration,
    };
  };

  const handleContinue = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    const selectedDateObj = nextSevenDays.find((date) => selectedDate.includes(date.getDate().toString()));
    if (!selectedDateObj) {
      toast.error('Invalid date selected');
      return;
    }

    onContinue({
      date: selectedDateObj.toISOString().split('T')[0],
    });
  };

  const { minCost, maxCost } = getEstimatedCostRange();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Schedule Your Task</h2>
        <p className="text-gray-600 mb-6">
          Choose a date for <strong>{selectedHelper.name}</strong> to complete your task at{' '}
          <strong>{taskData.address}</strong>.
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-4">Select Date</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-violet-50 rounded-lg p-4">
              {nextSevenDays.map((date, index) => {
                const isAvailable = isDateAvailable(date);
                const isSelected = selectedDate?.includes(date.getDate().toString());
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectDate(date)}
                    disabled={!isAvailable}
                    className={`
                      p-3 rounded-lg text-center transition-colors
                      ${
                        isAvailable
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }
                      ${isSelected ? 'ring-2 ring-violet-600' : ''}
                    `}
                  >
                    <div className="text-sm font-medium">
                      {date.toLocaleString('default', { weekday: 'short' })}
                    </div>
                    <div className="text-lg font-bold">{date.getDate()}</div>
                    <div className="text-xs">
                      {date.toLocaleString('default', { month: 'short' })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <h3 className="font-semibold text-lg mb-3">Task Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Helper:</span>
                <span className="font-medium">{selectedHelper.name}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{taskData.address}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Task Size:</span>
                <span className="font-medium">{taskData.taskSize}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{selectedDate || 'Not selected'}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Estimated Cost:</span>
                <span className="font-medium text-violet-700">
                  ₹{minCost.toFixed(2)} - ₹{maxCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleContinue}
              disabled={!selectedDate}
              className={`
                w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
                ${
                  selectedDate
                    ? 'bg-violet-600 hover:bg-violet-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Schedule and Continue
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              You'll be able to review and finalize your booking in the next step
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};