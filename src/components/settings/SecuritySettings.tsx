
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Timer, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/dateUtils";

type LoginHistory = {
  timestamp: string;
  browser: string;
  ip: string;
  location: string;
};

export const SecuritySettings = () => {
  const { user } = useAuth();
  const [autoLogoutTimer, setAutoLogoutTimer] = useState(
    localStorage.getItem("autoLogoutTimer") || "disabled"
  );
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load login history from API or database
    const fetchLoginHistory = async () => {
      if (!user?.uid) return;
      
      setIsLoading(true);
      try {
        // Get login history from Supabase auth.audit_log_entries
        // For now we'll use mock data, as the real implementation would require
        // admin privileges or an edge function to access the auth logs
        
        // This is where you would fetch real login history data
        // For example, via a Supabase edge function that has admin access
        
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
        
        setLoginHistory(mockLoginHistory);
      } catch (error) {
        console.error("Error fetching login history:", error);
        toast.error("Failed to load login history");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLoginHistory();
  }, [user?.uid]);

  // Setup and handle the auto-logout timer
  useEffect(() => {
    let idleTimer: NodeJS.Timeout | null = null;

    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (autoLogoutTimer !== "disabled") {
        const newTimer = setTimeout(() => {
          toast.info("You have been logged out due to inactivity", {
            description: "Please log in again to continue.",
          });
          console.log("Auto-logout triggered after", autoLogoutTimer, "minutes of inactivity");
          // Store auto-logout setting in the database
          if (user?.uid) {
            supabase
              .from('user_settings')
              .update({ auto_logout_minutes: parseInt(autoLogoutTimer) })
              .eq('user_id', user.uid)
              .then(({ error }) => {
                if (error) {
                  console.error("Error saving auto-logout setting:", error);
                }
              });
          }
          
          // Now actually log the user out
          localStorage.removeItem("isLoggedIn");
        }, parseInt(autoLogoutTimer) * 60 * 1000);
        idleTimer = newTimer;
      }
    };

    // Load user preference from database
    const loadAutoLogoutPreference = async () => {
      if (user?.uid) {
        try {
          const { data, error } = await supabase
            .from('user_settings')
            .select('auto_logout_minutes')
            .eq('user_id', user.uid)
            .single();
            
          if (!error && data?.auto_logout_minutes) {
            const value = data.auto_logout_minutes.toString();
            setAutoLogoutTimer(value);
            localStorage.setItem("autoLogoutTimer", value);
          }
        } catch (error) {
          console.error("Error loading auto-logout setting:", error);
        }
      }
    };
    
    loadAutoLogoutPreference();

    if (autoLogoutTimer !== "disabled") {
      const events = ["mousedown", "keydown", "touchstart", "mousemove"];
      events.forEach(event => document.addEventListener(event, resetIdleTimer));
      resetIdleTimer();

      return () => {
        if (idleTimer) clearTimeout(idleTimer);
        events.forEach(event => document.removeEventListener(event, resetIdleTimer));
      };
    }
  }, [autoLogoutTimer, user?.uid]);

  const handleAutoLogoutChange = async (value: string) => {
    setAutoLogoutTimer(value);
    localStorage.setItem("autoLogoutTimer", value);
    
    // Store the setting in the database
    if (user?.uid) {
      const minutes = value === "disabled" ? null : parseInt(value);
      const { error } = await supabase
        .from('user_settings')
        .update({ auto_logout_minutes: minutes })
        .eq('user_id', user.uid);
        
      if (error) {
        console.error("Error updating auto-logout setting:", error);
        toast.error("Failed to save auto-logout setting");
      } else {
        toast.success(
          value === "disabled" 
            ? "Auto-logout disabled" 
            : `Auto-logout timer set to ${value} minutes`
        );
      }
    }
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
                <SelectItem value="disabled">Disabled</SelectItem>
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
            
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : loginHistory.length > 0 ? (
              <div className="space-y-4">
                {loginHistory.map((login, index) => (
                  <div key={index} className="text-sm p-3 bg-secondary/50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{formatDate(login.timestamp)}</p>
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
            ) : (
              <p className="text-center py-4 text-slate-500">No login history available</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
