import { useEffect, useState } from "react";
import { Availability, CalendarEvent, daysOfWeek } from "./FetchAvailability";
import { Calendar, Clock } from "lucide-react";

interface CalendarPreviewProps {
  availability: Availability[];
  isLoading: boolean;
}

export const CalendarPreview: React.FC<CalendarPreviewProps> = ({ availability, isLoading }) => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  // Convert minutes to time string
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  // Get next 7 days
  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Generate calendar events for the next 7 days
  useEffect(() => {
    const events: CalendarEvent[] = [];
    const today = new Date();
    
    availability.forEach(({ dayOfWeek, timeslot }) => {
      if (timeslot.length === 0) return;
      const dayIndex = daysOfWeek.indexOf(dayOfWeek);
      
      timeslot.forEach((slot, index) => {
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          date.setHours(0, 0, 0, 0);
          
          if (date.getDay() === dayIndex) {
            const start = new Date(date);
            start.setMinutes(slot.startTime);
            const end = new Date(date);
            end.setMinutes(slot.endTime);
            
            if (start > new Date()) {
              events.push({
                id: `${dayOfWeek}-${index}-${start.toISOString()}`,
                start,
                end,
                title: `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
              });
            }
          }
        }
      });
    });
    setCalendarEvents(events.sort((a, b) => a.start.getTime() - b.start.getTime()));
  }, [availability]);

  const next7Days = getNext7Days();

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="h-6 w-6 text-green-600" />
        <h3 className="text-2xl font-bold text-gray-800">7-Day Availability Calendar</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading availability...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          {next7Days.map((date, i) => {
            const dayEvents = calendarEvents.filter((event) =>
              event.start.toDateString() === date.toDateString()
            );
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={i} 
                className={`border-2 rounded-2xl p-4 min-h-[200px] transition-all hover:shadow-lg ${
                  isToday 
                    ? 'border-blue-500 bg-blue-50' 
                    : dayEvents.length > 0 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-center mb-4">
                  <div className={`text-xs font-semibold uppercase tracking-wide ${
                    isToday ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-2xl font-bold ${
                    isToday ? 'text-blue-800' : 'text-gray-800'
                  }`}>
                    {date.getDate()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  {isToday && (
                    <div className="text-xs font-medium text-blue-600 mt-1">TODAY</div>
                  )}
                </div>

                <div className="space-y-2">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-green-600" />
                          <span className="text-sm font-medium text-gray-800">
                            {event.title}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Available
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-gray-400 text-sm">No availability</div>
                      <div className="text-xs text-gray-300 mt-1">Set times above</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{calendarEvents.length}</div>
            <div className="text-sm text-gray-600">Total Slots</div>
          </div>
          <div className="bg-white p-4 rounded-xl">
            <div className="text-2xl font-bold text-green-600">
              {new Set(calendarEvents.map(e => e.start.toDateString())).size}
            </div>
            <div className="text-sm text-gray-600">Available Days</div>
          </div>
          <div className="bg-white p-4 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(calendarEvents.reduce((acc, event) => {
                return acc + (event.end.getTime() - event.start.getTime()) / (1000 * 60);
              }, 0) / 60 * 10) / 10}
            </div>
            <div className="text-sm text-gray-600">Total Hours</div>
          </div>
          <div className="bg-white p-4 rounded-xl">
            <div className="text-2xl font-bold text-orange-600">
              {7 - new Set(calendarEvents.map(e => e.start.toDateString())).size}
            </div>
            <div className="text-sm text-gray-600">Days Off</div>
          </div>
        </div>
      </div>
    </div>
  );
};
