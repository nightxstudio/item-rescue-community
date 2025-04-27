
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getDateTimePreferences } from "@/utils/dateUtils";

const ClockDisplay = () => {
  const [date, setDate] = useState(new Date());
  const [timeFormat, setTimeFormat] = useState('12h');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const { user } = useAuth();

  useEffect(() => {
    const loadPreferences = async () => {
      // First load from localStorage for quicker UI render
      const storedTimeFormat = localStorage.getItem('timeFormat') || '12h';
      const storedDateFormat = localStorage.getItem('dateFormat') || 'MM/DD/YYYY';
      
      setTimeFormat(storedTimeFormat);
      setDateFormat(storedDateFormat);
      
      // Then try to get from database if user is logged in
      if (user?.uid) {
        const prefs = await getDateTimePreferences(user.uid);
        
        // Update state and localStorage with database values
        setTimeFormat(prefs.timeFormat);
        setDateFormat(prefs.dateFormat);
        
        localStorage.setItem('timeFormat', prefs.timeFormat);
        localStorage.setItem('dateFormat', prefs.dateFormat);
      }
    };
    
    loadPreferences();
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeDisplay = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: timeFormat === '12h'
    };
    
    return date.toLocaleTimeString([], options);
  };

  const formatDateDisplay = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    
    // Use the appropriate locale based on date format
    if (dateFormat === 'DD/MM/YYYY') {
      return date.toLocaleDateString('en-GB', options);
    } else {
      return date.toLocaleDateString('en-US', options);
    }
  };
  
  return (
    <div className="text-right">
      <div className="text-base font-medium">{formatDateDisplay(date)}</div>
      <div className="text-sm text-muted-foreground">{formatTimeDisplay(date)}</div>
    </div>
  );
};

export default ClockDisplay;
