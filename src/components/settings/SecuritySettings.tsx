
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { useUserSettings } from "@/hooks/useUserSettings";

export const SecuritySettings = () => {
  const { settings, updateSettings, isLoading } = useUserSettings();
  const [autoLogoutMinutes, setAutoLogoutMinutes] = useState<number | null>(
    settings.autoLogoutMinutes
  );

  // Update state when settings load
  useEffect(() => {
    if (!isLoading) {
      setAutoLogoutMinutes(settings.autoLogoutMinutes);
    }
  }, [settings.autoLogoutMinutes, isLoading]);

  const handleAutoLogoutChange = async (value: string) => {
    const minutes = value === "disabled" ? null : parseInt(value, 10);
    setAutoLogoutMinutes(minutes);
    const success = await updateSettings({ autoLogoutMinutes: minutes });
    
    if (success) {
      toast.success(`Auto-logout timer ${minutes === null ? "disabled" : `set to ${value} minutes`}`);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-3">Security</h2>
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Auto-Logout Timer (IST)
              </Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Automatically log out after a period of inactivity
              </p>
            </div>
            <Select 
              value={autoLogoutMinutes === null ? "disabled" : autoLogoutMinutes.toString()} 
              onValueChange={handleAutoLogoutChange}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select timeout" />
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
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">Recent Login Activity</h3>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No recent login activity to display.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
