import React, { useState } from 'react';
import { Clock } from 'lucide-react';

interface ScheduleTaskProps {
  onContinue: (data: { date: string; time: string }) => void; // Updated to accept date and time
  selectedHelper: any;
  taskData: { location: string; taskSize:string; taskDetails: string,category:string,subCategory:string };
}

export const ScheduleTask: React.FC<ScheduleTaskProps> = ({
  onContinue,
  selectedHelper,
  taskData,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('14:00');
  const [timePreference, setTimePreference] = useState<string>('');
  const [isFlexible, setIsFlexible] = useState(false);

  // Generate next 7 days from today (April 5, 2025 as per system date)
  const today = new Date('2025-04-05');
  const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  // Get available dates from selectedHelper
  const availableDates = selectedHelper.availability.map((slot: { date: string | number | Date }) =>
    new Date(slot.date).toDateString()
  );

  const handleSelectDate = (date: Date) => {
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    setSelectedDate(formattedDate);
  };

  const formatTimeDisplay = (time24: string): string => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'pm' : 'am';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes}${period}`;
  };

  const handleContinue = () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    
    // Determine the time to pass (either timePreference or formatted selectedTime)
    const timeSelection = timePreference || formatTimeDisplay(selectedTime);
    const finalTime = isFlexible ? `${timeSelection} (Flexible)` : timeSelection;

    // Pass the selected date and time to the onContinue function
    onContinue({
      date: selectedDate,
      time: finalTime,
    });
  };
  const estHours = (size: string):Number  => {
    if (size === 'Small') return 2
    if (size === 'Medium') return 4
    if (size === 'Large') return 6
    return 0
  }

  const hourlyRate = selectedHelper.skills[0].hourlyRate
  const estimatedHours = Number(estHours(taskData.taskSize))*hourlyRate;
  const estimatedCost = hourlyRate * estimatedHours;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div className="text-black p-6">
        <p className="opacity-90 p-4 bg-gray-100 rounded-lg">
          Choose when you'd like your task completed
        </p>
      </div>

      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Date Selection - Simplified 7-day view */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-4">Select Date</h3>
            <div className="flex flex-wrap gap-2 bg-violet-50 rounded-lg p-4">
              {nextSevenDays.map((date, index) => {
                const isAvailable = availableDates.includes(date.toDateString());
                const isSelected = selectedDate?.includes(date.getDate().toString());
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectDate(date)}
                    disabled={!isAvailable}
                    className={`
                      w-20 p-2 rounded-lg text-center
                      ${isAvailable ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                      ${isSelected ? 'ring-2 ring-violet-600' : ''}
                    `}
                  >
                    <div className="text-sm font-medium">
                      {date.toLocaleString('default', { weekday: 'short' })}
                    </div>
                    <div className="text-lg">{date.getDate()}</div>
                    <div className="text-xs">
                      {date.toLocaleString('default', { month: 'short' })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-violet-700" size={20} />
              <h3 className="font-semibold text-lg">Select Time</h3>
            </div>
            
            <div className="bg-violet-50 rounded-lg p-4 mb-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-violet-900 mb-2">Time Preference</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'morning', label: 'Morning', time: '8am - 12pm' },
                    { id: 'afternoon', label: 'Afternoon', time: '12pm - 5pm' },
                    { id: 'evening', label: 'Evening', time: '5pm - 9pm' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setTimePreference(option.label + ' (' + option.time + ')');
                        setSelectedTime('');
                      }}
                      className={`
                        p-3 border rounded-lg text-center
                        ${timePreference.includes(option.label)
                          ? 'bg-violet-100 border-violet-400 text-violet-800'
                          : 'border-violet-200 hover:bg-violet-50'}
                      `}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-violet-600">{option.time}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <label className="flex items-center text-violet-900">
                <input
                  type="checkbox"
                  checked={isFlexible}
                  onChange={() => setIsFlexible(!isFlexible)}
                  className="mr-2 h-4 w-4 accent-violet-600"
                />
                I'm flexible with my time
              </label>
            </div>
          </div>
        </div>

        {/* Summary and Continue */}
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
                <span className="font-medium">{taskData.location}</span>
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
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {timePreference || (selectedTime ? formatTimeDisplay(selectedTime) : 'Not selected')}
                  {isFlexible ? ' (Flexible)' : ''}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Estimated Cost:</span>
                <span className="font-medium text-violet-700">₹{estimatedCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleContinue}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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