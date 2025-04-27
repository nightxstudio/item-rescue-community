
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

  // Default to MM/DD/YYYY format and 12h time
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
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
  
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12,
    year: 'numeric'
  };
  
  // Set the date format based on user preference
  if (dateFormat === 'DD/MM/YYYY') {
    options.day = '2-digit';
    options.month = '2-digit';
    return new Intl.DateTimeFormat('en-GB', options).format(date); // Use en-GB for DD/MM format
  } else {
    options.month = '2-digit';
    options.day = '2-digit';
    return new Intl.DateTimeFormat('en-US', options).format(date); // Use en-US for MM/DD format
  }
};
