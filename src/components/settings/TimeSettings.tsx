
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Clock, CalendarDays, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export const TimeSettings = () => {
  const { isLoggedIn, user } = useAuth();
  const [timeFormat, setTimeFormat] = useState('24h');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  useEffect(() => {
    if (isLoggedIn && user?.uid) {
      const fetchSettings = async () => {
        const { data, error } = await supabase
          .from('user_settings')
          .select('time_format, date_format')
          .eq('user_id', user.uid)
          .single();
        
        if (data && !error) {
          setTimeFormat(data.time_format);
          setDateFormat(data.date_format);
        }
      };
      
      fetchSettings();
    }
  }, [isLoggedIn, user?.uid]);

  const updateSetting = async (setting: string, value: string) => {
    if (!isLoggedIn || !user?.uid) return;

    const { error } = await supabase
      .from('user_settings')
      .update({ [setting]: value })
      .eq('user_id', user.uid);
      
    if (error) {
      console.error(`Error updating ${setting}:`, error);
      toast.error(`Failed to save ${setting} setting`);
      return false;
    }
    return true;
  };

  const handleTimeFormatChange = async (value: string) => {
    setTimeFormat(value);
    if (await updateSetting('time_format', value)) {
      toast.success("Time format updated");
    }
  };

  const handleDateFormatChange = async (value: string) => {
    setDateFormat(value);
    if (await updateSetting('date_format', value)) {
      toast.success("Date format updated");
    }
  };

  const resetToDefaults = async () => {
    if (!isLoggedIn || !user?.uid) return;

    const defaults = {
      time_format: '24h',
      date_format: 'DD/MM/YYYY'
    };

    const { error } = await supabase
      .from('user_settings')
      .update(defaults)
      .eq('user_id', user.uid);

    if (error) {
      console.error('Error resetting settings:', error);
      toast.error('Failed to reset settings');
      return;
    }

    setTimeFormat(defaults.time_format);
    setDateFormat(defaults.date_format);
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-3">Date & Time Settings</h2>
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Time Format</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose your preferred time format
              </p>
            </div>
            <Select value={timeFormat} onValueChange={handleTimeFormatChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select time format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    12-hour
                  </div>
                </SelectItem>
                <SelectItem value="24h">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    24-hour
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Date Format</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose your preferred date format
              </p>
            </div>
            <Select value={dateFormat} onValueChange={handleDateFormatChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    DD/MM/YYYY
                  </div>
                </SelectItem>
                <SelectItem value="MM/DD/YYYY">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    MM/DD/YYYY
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-4 flex flex-col gap-2">
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2"
              onClick={resetToDefaults}
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              More customization options coming in future updates!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
