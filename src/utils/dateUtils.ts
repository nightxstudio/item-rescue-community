
import { supabase } from "@/integrations/supabase/client";

/**
 * Get current user's date and time format preferences
 */
export const getDateTimePreferences = async (userId: string) => {
  if (!userId) return { timeFormat: '12h', dateFormat: 'MM/DD/YYYY' };

  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('time_format, date_format')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      console.warn("Failed to get date/time preferences:", error?.message);
      return { timeFormat: '12h', dateFormat: 'MM/DD/YYYY' };
    }

    return {
      // Add type-safe access with fallbacks
      timeFormat: data?.time_format ?? '12h',
      dateFormat: data?.date_format ?? 'MM/DD/YYYY'
    };
  } catch (err) {
    console.error("Error fetching date/time preferences:", err);
    return { timeFormat: '12h', dateFormat: 'MM/DD/YYYY' };
  }
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

  // Check if we have date format preference in local storage
  const storedDateFormat = localStorage.getItem("dateFormat");
  
  // Use en-GB locale for DD/MM/YYYY format
  if (storedDateFormat === 'DD/MM/YYYY') {
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  }
  
  // Default to en-US for MM/DD/YYYY format
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

  try {
    const { timeFormat, dateFormat } = userId 
      ? await getDateTimePreferences(userId)
      : { timeFormat: '12h', dateFormat: 'MM/DD/YYYY' };

    const hour12 = timeFormat === '12h';
    
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12,
      year: 'numeric',
      day: '2-digit',
      month: '2-digit',
    };
    
    // Set the date format based on user preference
    if (dateFormat === 'DD/MM/YYYY') {
      return new Intl.DateTimeFormat('en-GB', options).format(date);
    } else {
      return new Intl.DateTimeFormat('en-US', options).format(date);
    }
  } catch (error) {
    console.error("Error formatting date with preferences:", error);
    return date.toLocaleDateString();
  }
};
