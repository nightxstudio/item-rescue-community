
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const ClockDisplay = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span className="flex items-center gap-2 text-xs text-muted-foreground ml-2 select-none">
      <Clock size={14} className="mr-1" />
      {formatDate(date)}, {formatTime(date)}
    </span>
  );
};

export default ClockDisplay;
