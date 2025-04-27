
import { supabase } from "@/integrations/supabase/client";

/**
 * Get current user's date and time format preferences
 */
export const getDateTimePreferences = async (userId: string) => {
  if (!userId) return { timeFormat: '12h', dateFormat: 'MM/DD/YYYY' };

  const { data, error } = await supabase
    .from('user_settings')
    .select('time_format, date_format')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return { timeFormat: '12h', dateFormat: 'MM/DD/YYYY' };
  }

  return {
    timeFormat: data.time_format,
    dateFormat: data.date_format
  };
};

/**
 * Formats a date string based on user preferences
 * This is a synchronous version that uses default formatting
 */
export const formatDate = (dateString: string | null | undefined, userId?: string): string => {
  if (!dateString) return 'Unknown date';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return 'Invalid date';

  // Default formatting - now using 12h format and MM/DD/YYYY as defaults
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

/**
 * Formats a date string based on user preferences - async version
 * This can be used when user preferences need to be fetched
 */
export const formatDateWithPreferences = async (dateString: string | null | undefined, userId?: string): Promise<string> => {
  if (!dateString) return 'Unknown date';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return 'Invalid date';

  const { timeFormat, dateFormat } = userId 
    ? await getDateTimePreferences(userId)
    : { timeFormat: '12h', dateFormat: 'MM/DD/YYYY' };

  const hour12 = timeFormat === '12h';
  
  let dateParts: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12,
    year: 'numeric'
  };
  
  if (dateFormat === 'DD/MM/YYYY') {
    dateParts = {
      ...dateParts,
      day: '2-digit',
      month: '2-digit'
    };
  } else {
    dateParts = {
      ...dateParts,
      month: '2-digit',
      day: '2-digit'
    };
  }

  return new Intl.DateTimeFormat('en-US', dateParts).format(date);
};
