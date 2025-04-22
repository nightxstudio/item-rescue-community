
/**
 * Formats a date string into a more readable format
 * @param dateString The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Unknown date';
  
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) return 'Invalid date';
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
