
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Timer, History } from "lucide-react";

// Mock data for login history - in a real app, this would come from your backend
const mockLoginHistory = [
  {
    timestamp: "2024-04-25T10:30:00Z",
    browser: "Chrome",
    ip: "192.168.1.1",
    location: "Mumbai, India",
  },
  {
    timestamp: "2024-04-24T15:45:00Z",
    browser: "Firefox",
    ip: "192.168.1.2",
    location: "Delhi, India",
  },
  {
    timestamp: "2024-04-23T08:20:00Z",
    browser: "Safari",
    ip: "192.168.1.3",
    location: "Bangalore, India",
  },
];

export const SecuritySettings = () => {
  const [autoLogoutTimer, setAutoLogoutTimer] = useState(
    localStorage.getItem("autoLogoutTimer") || "30"
  );
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      const newTimer = setTimeout(() => {
        // In a real app, you would call your logout function here
        toast.info("You have been logged out due to inactivity", {
          description: "Please log in again to continue.",
        });
      }, parseInt(autoLogoutTimer) * 60 * 1000);
      setIdleTimer(newTimer);
    };

    const events = ["mousedown", "keydown", "touchstart", "mousemove"];
    events.forEach(event => document.addEventListener(event, resetIdleTimer));

    resetIdleTimer();

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      events.forEach(event => document.removeEventListener(event, resetIdleTimer));
    };
  }, [autoLogoutTimer]);

  const handleAutoLogoutChange = (value: string) => {
    setAutoLogoutTimer(value);
    localStorage.setItem("autoLogoutTimer", value);
    toast.success("Auto-logout timer updated", {
      description: `You will be logged out after ${value} minutes of inactivity.`,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-3">Security</h2>
      
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Auto-Logout Timer (IST)
              </Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Set inactivity period before automatic logout
              </p>
            </div>
            <Select value={autoLogoutTimer} onValueChange={handleAutoLogoutChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <Label className="text-base">Login History</Label>
            </div>
            <div className="space-y-4">
              {mockLoginHistory.map((login, index) => (
                <div key={index} className="text-sm p-3 bg-secondary/50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{new Date(login.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
                      <p className="text-slate-500 dark:text-slate-400">{login.browser}</p>
                    </div>
                    <div className="text-right">
                      <p>{login.ip}</p>
                      <p className="text-slate-500 dark:text-slate-400">{login.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
