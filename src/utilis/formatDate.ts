export const formatDateTime = (date: string | Date): string => new Date(date).toLocaleDateString();

export const formatCreatedAt = (isoString: string): string => new Date(isoString).toLocaleString();

export const formatTime = (minutes: number) => {
    let hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const isPM = hours >= 12;
    const displayHours = hours % 12 === 0 ? 12 : hours % 12; 
    const ampm = isPM ? 'PM' : 'AM';
  
    return `${displayHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
  };
  