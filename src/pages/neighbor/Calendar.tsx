import { useState, useEffect } from "react";
import { Calendar, momentLocalizer, SlotInfo } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FetchAvailability, ScheduleTimeslots } from "../../api/neighborApiRequests";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const localizer = momentLocalizer(moment);

interface AvailabilityEvent {
  id: string;
  start: Date;
  end: Date;
  title: string;
}

const CalendarSection = () => {
  const [events, setEvents] = useState<AvailabilityEvent[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient(); // Access QueryClient for cache management

  // Fetch availability with React Query
  const { data: fetchedEvents = [], isLoading: isFetching, error } = useQuery({
    queryKey: ['availability', user?.id],
    queryFn: () => FetchAvailability(user!.id),
    enabled: !!user?.id,
    placeholderData: [], // Start with empty array if no data yet
  });

  // Sync fetched events with local events state
  useEffect(() => {
    if (fetchedEvents) {
      const now = moment();
      setEvents(fetchedEvents.filter((event) => moment(event.end).isAfter(now)));
    }
  }, [fetchedEvents]);

  // Save availability with useMutation
  const saveMutation = useMutation({
    mutationFn: (availability: { date: string; timeSlots: { startTime: number; endTime: number }[] }[]) =>
      ScheduleTimeslots(user!.id, availability),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability', user?.id] });
      const notification = document.getElementById("success-notification");
      if (notification) {
        notification.classList.remove("hidden");
        setTimeout(() => notification.classList.add("hidden"), 3000);
      }
    },
    onError: (error) => {
      console.error("Error saving availability:", error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const generateEventId = (start: Date, end: Date) => {
    return `${start.toISOString()}-${end.toISOString()}`;
  };

  const handleSelectSlot = ({ start, end }: SlotInfo) => {
    const now = moment();
    if (moment(start).isBefore(now)) return;

    const startTime = moment(start).startOf("hour").toDate();
    let endTime = moment(end).startOf("hour").toDate();
    if (moment(endTime).diff(startTime, "hours") < 1) {
      endTime = moment(startTime).add(1, "hour").toDate();
    }

    const slotId = generateEventId(startTime, endTime);
    const isOverlapping = events.some((event) => {
      const eventStart = moment(event.start);
      const eventEnd = moment(event.end);
      const newStart = moment(startTime);
      const newEnd = moment(endTime);
      return (
        (newStart.isSameOrAfter(eventStart) && newStart.isBefore(eventEnd)) ||
        (newEnd.isAfter(eventStart) && newEnd.isSameOrBefore(eventEnd)) ||
        (newStart.isSameOrBefore(eventStart) && newEnd.isSameOrAfter(eventEnd))
      );
    });

    if (isOverlapping) {
      setEvents((prev) =>
        prev.filter((event) => {
          const eventStart = moment(event.start);
          const eventEnd = moment(event.end);
          const newStart = moment(startTime);
          const newEnd = moment(endTime);
          return !(
            (newStart.isSameOrAfter(eventStart) && newStart.isBefore(eventEnd)) ||
            (newEnd.isAfter(eventStart) && newEnd.isSameOrBefore(eventEnd)) ||
            (newStart.isSameOrBefore(eventStart) && newEnd.isSameOrAfter(eventEnd))
          );
        })
      );
    } else {
      const newEvent: AvailabilityEvent = {
        id: slotId,
        start: startTime,
        end: endTime,
        title: "Available",
      };
      setEvents((prev) => [...prev, newEvent]);
    }
  };

  const handleSelectEvent = (event: AvailabilityEvent) => {
    setEvents((prev) => prev.filter((e) => e.id !== event.id));
  };

  const handleSave = async () => {
    setIsLoading(true);
    const availabilityByDate: { [key: string]: { startTime: number; endTime: number }[] } = {};

    events.forEach((event) => {
      let current = moment(event.start);
      const end = moment(event.end);
      const dateKey = current.format("YYYY-MM-DD");
      if (!availabilityByDate[dateKey]) {
        availabilityByDate[dateKey] = [];
      }
      while (current.isBefore(end)) {
        availabilityByDate[dateKey].push({
          startTime: current.unix(),
          endTime: current.clone().add(1, "hour").unix(),
        });
        current.add(1, "hour");
      }
    });

    const availability = Object.entries(availabilityByDate).map(([date, timeSlots]) => ({
      date: moment(date).toISOString(),
      timeSlots,
    }));

    if (!user?.id) return;
    saveMutation.mutate(availability);
  };

  const handleClearAll = () => {
    if (events.length === 0) return;
    if (confirm("Are you sure you want to clear all your availability slots?")) {
      setEvents([]);
    }
  };

  const formatEventTitle = (event: AvailabilityEvent) => {
    return `${moment(event.start).format("h:mm A")} - ${moment(event.end).format("h:mm A")}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-5">
        <div>
          <h2 className="text-2xl font-bold text-violet-800">Schedule Your Availability</h2>
          <p className="text-gray-500 mt-2">Set up when you're free to meet with clients</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleClearAll}
            className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-violet-300 focus:outline-none flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            Clear All
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`px-6 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-all focus:ring-2 focus:ring-violet-300 focus:outline-none flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Schedule
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mb-8 p-5 bg-violet-50 rounded-xl border border-violet-100 flex items-start gap-4">
        <div className="text-violet-600 bg-violet-100 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </div>
        <div className="text-violet-800 text-sm">
          <h3 className="text-violet-900 font-semibold text-base mb-1">How to use this calendar</h3>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-violet-600 rounded-full"></span>
              Click or drag to select time slots when you're available
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-violet-600 rounded-full"></span>
              Click an existing slot to remove it
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-violet-600 rounded-full"></span>
              Your schedule will be visible to clients when booking
            </li>
          </ul>
        </div>
      </div>

      <div id="success-notification" className="hidden fixed top-6 right-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg z-50 max-w-md">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 className="text-green-800 font-medium">Success!</h4>
            <p className="text-green-700 text-sm">Your availability schedule has been saved.</p>
          </div>
        </div>
      </div>

      {isFetching && (
        <div className="text-center text-gray-500 mb-4">Loading availability...</div>
      )}
      {error && (
        <div className="text-center text-red-500 mb-4">
          Failed to load availability: {(error as Error).message}
        </div>
      )}
      {!isFetching && !error && fetchedEvents.length === 0 && (
        <div className="text-center text-gray-500 mb-4">
          No availability set yet. Select time slots and save to get started!
        </div>
      )}

      <div className="calendar-container rounded-xl overflow-hidden border border-gray-100 shadow-md">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor={formatEventTitle}
          defaultView={isMobile ? "day" : "week"}
          views={isMobile ? ["day", "week"] : ["week"]}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          min={new Date(0, 0, 0, 7, 0)} // 7 AM
          max={new Date(0, 0, 0, 21, 0)} // 9 PM
          step={60}
          timeslots={1}
          date={selectedDate}
          onNavigate={(date) => setSelectedDate(date)}
          style={{ height: 600 }}
          eventPropGetter={() => ({
            style: {
              background: "#7c3aed",
              borderColor: "#6d28d9",
              color: "white",
              borderRadius: "8px",
              padding: "4px 10px",
              fontWeight: "500",
              fontSize: "13px",
              boxShadow: "0 2px 4px rgba(124, 58, 237, 0.2)",
            },
          })}
          dayPropGetter={(date) => ({
            style: {
              backgroundColor: moment(date).isSame(new Date(), "day") ? "#f5f3ff" : "white",
              borderLeft:
                moment(date).day() === 0 || moment(date).day() === 6
                  ? "2px solid #f3f4f6"
                  : undefined,
            },
          })}
          slotPropGetter={(date) => ({
            style: {
              backgroundColor:
                moment(date).hours() < 9 || moment(date).hours() >= 17
                  ? "#f9fafb"
                  : "white",
              borderTop: "1px solid #f3f4f6",
            },
          })}
          dayLayoutAlgorithm="no-overlap"
          components={{
            toolbar: (props) => <CustomToolbar {...props} isMobile={isMobile} />,
          }}
        />
      </div>

      <div className="mt-8 flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div className="bg-violet-50 p-4 rounded-xl flex items-center gap-3 flex-1">
          <div className="bg-violet-100 p-2 rounded-lg text-violet-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="6" x2="12" y2="12"></line>
              <line x1="12" y1="12" x2="16" y2="14"></line>
            </svg>
          </div>
          <div>
            <p className="text-violet-500 text-sm">Current timezone</p>
            <p className="text-violet-900 font-medium">{Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
          </div>
        </div>
        <div className="bg-violet-50 p-4 rounded-xl flex items-center gap-3 flex-1">
          <div className="bg-violet-100 p-2 rounded-lg text-violet-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div>
            <p className="text-violet-500 text-sm">Total availability</p>
            <p className="text-violet-900 font-medium">{events.length} time slots</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// CustomToolbar remains unchanged
const CustomToolbar = ({ date, onNavigate, isMobile }: any) => {
  const goToBack = () => {
    onNavigate("PREV");
  };

  const goToNext = () => {
    onNavigate("NEXT");
  };

  const goToCurrent = () => {
    onNavigate("TODAY");
  };

  const label = () => {
    const dateObj = moment(date);
    return (
      <span className="text-violet-800 font-semibold text-lg">
        {dateObj.format(isMobile ? "MMMM D, YYYY" : "MMMM YYYY")}
      </span>
    );
  };

  return (
    <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-3">
        <button
          onClick={goToBack}
          className="p-2 rounded-lg hover:bg-violet-50 transition-colors text-violet-700"
          aria-label="Previous"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="p-2 rounded-lg hover:bg-violet-50 transition-colors text-violet-700"
          aria-label="Next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
        <button
          onClick={goToCurrent}
          className="ml-1 px-4 py-1.5 text-sm text-violet-700 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors font-medium"
        >``
          Today
        </button>
      </div>
      <div className="text-base">{label()}</div>
      {!isMobile && (
        <div className="flex items-center gap-2 bg-violet-100 px-4 py-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-700">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span className="text-sm font-medium text-violet-800">Week View</span>
        </div>
      )}
    </div>
  );
};

export default CalendarSection;