import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RootState } from '../../redux/store';
import { AvailabilitySetter } from './Schedules/AvailabilitySetter';
import {  ScheduleTimeslots, fetchWeeklySchedule } from '../../api/neighborApiRequests';
import type { Availability } from './Schedules/FetchAvailability';

// Define DayOfWeek type
type DayOfWeek = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

const CalendarSection: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  // Initialize availability with all days
  const [availability, setAvailability] = useState<Availability[]>(
    ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((day) => ({
      dayOfWeek: day as DayOfWeek,
      timeslots: [],
    }))
  );

  // Fetch availability
  const { data, isLoading, error } = useQuery<Availability[], Error>({
    queryKey: ['availability', user?.id] as [string, string | undefined],
    queryFn: async () => {
      const response = await fetchWeeklySchedule(user!.id);
      console.log('FetchAvailability response:', response); // Debug log
      return response;
    },
    enabled: !!user?.id,
  });

  // Update availability state when data is fetched
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const allDays: Availability[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((day) => ({
        dayOfWeek: day as DayOfWeek,
        timeslots: data.find((a) => a.dayOfWeek === day)?.timeslots || [],
      }));
      setAvailability(allDays);
    } else if (data) {
      console.error('FetchAvailability returned non-array data:', data);
    }
  }, [data]);

  // Save availability
  const { mutateAsync: saveAvailability, isPending: isSaving } = useMutation({
    mutationFn: (data: Availability[]) => ScheduleTimeslots(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability', user!.id] });
      alert('Schedule saved successfully!');
    },
    onError: (error: Error) => {
      alert(`Error saving schedule: ${error.message}`);
    },
  });

  const handleSave = async () => {
    await saveAvailability(availability);
  };

  const handleClearAll = () => {
    setAvailability(availability.map((item) => ({ ...item, timeslots: [] })));
  };

  // Ensure user and neighborId exist
  if (!user?.id) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Set Weekly Availability</h1>
        <p className="text-red-600">Error: User not authenticated. Please log in to set availability.</p>
      </div>
    );
  }

  // Handle query error
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Set Weekly Availability</h1>
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="calendar-section">
      <AvailabilitySetter
        availability={availability}
        setAvailability={setAvailability}
        isLoading={isLoading}
        isSaving={isSaving}
        handleSave={handleSave}
        handleClearAll={handleClearAll}
      />
    </div>
  );
};

export default CalendarSection;