export const formatDateTime = (date: string | Date): string => new Date(date).toLocaleDateString();

export const formatCreatedAt = (isoString: string): string => new Date(isoString).toLocaleString();