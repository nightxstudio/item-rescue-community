
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
      if (user?.uid) {
        const prefs = await getDateTimePreferences(user.uid);
        setTimeFormat(prefs.timeFormat);
        setDateFormat(prefs.dateFormat);
      }
    };
    
    loadPreferences();
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeDisplay = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: timeFormat === '12h'
    });
  };

  const formatDateDisplay = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    
    return date.toLocaleDateString([], options);
  };
  
  return (
    <div className="text-right">
      <div className="text-base font-medium">{formatDateDisplay(date)}</div>
      <div className="text-sm text-muted-foreground">{formatTimeDisplay(date)}</div>
    </div>
  );
};

export default ClockDisplay;
