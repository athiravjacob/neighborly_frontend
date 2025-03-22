import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface ScheduleTaskProps {
  onContinue: (schedule: { date: string; time: string }) => void;
  selectedHelper: string;
  taskData: { location: string; taskSize: string; taskDetails: string };
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

  // Generate dates for current month
  const currentDate = new Date(2025, 2, 1); // March 1, 2025
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(2025, 3, 0).getDate();
  
  // Calculate first day of month to determine offset
  const firstDayOfMonth = new Date(2025, 2, 1).getDay();
  
  // Generate dates array with empty slots for offset
  const calendarDays = Array(firstDayOfMonth).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(2025, 2, i);
    calendarDays.push({
      day: i,
      date: date,
      weekday: date.toLocaleString('en-US', { weekday: 'short' }),
      isWeekend: [0, 6].includes(date.getDay()),
    });
  }

  // Create weeks for calendar grid
  const calendarWeeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    calendarWeeks.push(calendarDays.slice(i, i + 7));
  }

  const handleSelectDate = (day: number) => {
    const selectedDateObj = new Date(2025, 2, day);
    const formattedDate = selectedDateObj.toLocaleDateString('en-US', {
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
    
    const timeSelection = timePreference || formatTimeDisplay(selectedTime);
    const flexibleNote = isFlexible ? ' (Flexible)' : '';
    
    onContinue({ 
      date: selectedDate, 
      time: timeSelection + flexibleNote 
    });
  };

  // Calculate estimated cost
  const hourlyRate = 56.78;
  const estimatedHours = 2; // Minimum hours
  const estimatedCost = hourlyRate * estimatedHours;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div className=" text-black p-6">
        {/* <h2 className="text-2xl font-bold mb-2">Schedule Your Task</h2> */}
        <p className="opacity-90 p-4 bg-gray-100 rounded-lg">
          Choose when you'd like your task completed
        </p>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Date Selection */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-violet-700" size={20} />
              <h3 className="font-semibold text-lg">Select Date</h3>
            </div>
            
            <div className="bg-violet-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-violet-900">{currentMonth} {currentYear}</h4>
                <div className="flex gap-2">
                  <button className="p-1 rounded hover:bg-violet-100 text-violet-700">
                    ←
                  </button>
                  <button className="p-1 rounded hover:bg-violet-100 text-violet-700">
                    →
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={index} className="text-center text-xs font-medium text-violet-700 py-1">
                    {day}
                  </div>
                ))}
                
                {calendarWeeks.map((week, weekIndex) => (
  <React.Fragment key={weekIndex}>
    {week.map((day, dayIndex) => (
      <button
        key={`${weekIndex}-${dayIndex}`}
        onClick={() => day?.day && handleSelectDate(day.day)}
        disabled={!day?.day}
        className={`
          aspect-square flex items-center justify-center text-sm rounded-full
          ${!day?.day ? 'cursor-default' : 'hover:bg-violet-100'}
          ${day?.isWeekend && day?.day ? 'text-violet-400' : ''}
          ${selectedDate?.includes(`${currentMonth} ${day?.day}`) 
            ? 'bg-violet-600 text-white hover:bg-violet-700' 
            : ''}
        `}
      >
        {day?.day || ''}
      </button>
    ))}
  </React.Fragment>
))}

              </div>
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
                <label className="block text-sm font-medium text-violet-900 mb-2">Specific Time</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => {
                    setSelectedTime(e.target.value);
                    setTimePreference('');
                  }}
                  className="w-full px-4 py-2 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                />
              </div>
              
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
                <span className="font-medium">#{selectedHelper}</span>
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