
import { supabase } from "@/integrations/supabase/client";

/**
 * Get current user's date and time format preferences
 */
export const getDateTimePreferences = async (userId: string) => {
  if (!userId) return { timeFormat: '24h', dateFormat: 'DD/MM/YYYY' };

  const { data, error } = await supabase
    .from('user_settings')
    .select('time_format, date_format')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return { timeFormat: '24h', dateFormat: 'DD/MM/YYYY' };
  }

  return {
    timeFormat: data.time_format,
    dateFormat: data.date_format
  };
};

/**
 * Formats a date string based on user preferences
 */
export const formatDate = async (dateString: string | null | undefined, userId?: string): Promise<string> => {
  if (!dateString) return 'Unknown date';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return 'Invalid date';

  const { timeFormat, dateFormat } = userId 
    ? await getDateTimePreferences(userId)
    : { timeFormat: '24h', dateFormat: 'DD/MM/YYYY' };

  const hour12 = timeFormat === '12h';
  const dateParts = dateFormat === 'DD/MM/YYYY' 
    ? { day: '2-digit', month: '2-digit', year: 'numeric' }
    : { month: '2-digit', day: '2-digit', year: 'numeric' };

  return new Intl.DateTimeFormat('en-US', {
    ...dateParts,
    hour: '2-digit',
    minute: '2-digit',
    hour12
  }).format(date);
};
