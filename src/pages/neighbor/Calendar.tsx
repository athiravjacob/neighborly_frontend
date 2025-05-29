import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import { CalendarPreview } from './Schedules/CalendarPreview';
import { AvailabilitySetter } from './Schedules/AvailabilitySetter';
import { RootState } from '../../redux/store';
import { Availability, FetchAvailability, daysOfWeek } from './Schedules/FetchAvailability';
import { ScheduleTimeslots } from '../../api/neighborApiRequests';

const CalendarSection: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  // Initialize default availability
  const defaultAvailability: Availability[] = daysOfWeek.map((day) => ({
    dayOfWeek: day,
    timeslot: day !== 'sun' ? [{ startTime: 540, endTime: 1020 }] : [],
  }));

  // Fetch availability query
  const { data: availability = defaultAvailability, isLoading } = useQuery({
    queryKey: ['availability', user?.id],
    queryFn: async () => {
      const result = await FetchAvailability(user?.id!);
      return Array.isArray(result) ? result : defaultAvailability;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Save availability mutation
  const saveMutation = useMutation({
    mutationFn: (newAvailability: Availability[]) =>
      ScheduleTimeslots(user?.id!, newAvailability),
    onMutate: async (newAvailability) => {
      await queryClient.cancelQueries({ queryKey: ['availability', user?.id] });
      const previousAvailability = queryClient.getQueryData<Availability[]>(['availability', user?.id]);
      queryClient.setQueryData(['availability', user?.id], newAvailability);
      return { previousAvailability };
    },
    onError: (err, newAvailability, context) => {
      queryClient.setQueryData(['availability', user?.id], context?.previousAvailability);
      alert('Failed to save availability');
    },
    onSuccess: () => {
      alert('Availability saved successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['availability', user?.id] });
    },
  });

  // Handle save
  const handleSave = async () => {
    for (const { dayOfWeek, timeslot } of availability) {
      for (const slot of timeslot) {
        if (slot.endTime <= slot.startTime) {
          alert(`Invalid time slot for ${dayOfWeek}: End time must be after start time`);
          return;
        }
      }
    }
    saveMutation.mutate(availability);
  };

  // Handle clear all
  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all availability?')) {
      const clearedAvailability = daysOfWeek.map((day) => ({
        dayOfWeek: day,
        timeslot: [],
      }));
      saveMutation.mutate(clearedAvailability);
    }
  };

  const setAvailability = (newAvailability: Availability[]) => {
    queryClient.setQueryData(['availability', user?.id], newAvailability);
  };

  // Prevent rendering if user is not logged in
  if (!user?.id) {
    return <div>Please log in to manage availability</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability Management</h1>
        <p className="text-gray-600">Set your availability and preview the next 7 days</p>
      </div>

      <AvailabilitySetter
        availability={availability}
        setAvailability={setAvailability}
        isLoading={isLoading}
        isSaving={saveMutation.isPending}
        handleSave={handleSave}
        handleClearAll={handleClearAll}
      />

      <CalendarPreview availability={availability} isLoading={isLoading} />
    </div>
  );
};

export default CalendarSection;