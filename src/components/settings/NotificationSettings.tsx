
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Bell } from "lucide-react";

export const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem("notificationsEnabled");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const handleNotificationToggle = (checked: boolean) => {
    setNotificationsEnabled(checked);
    localStorage.setItem("notificationsEnabled", JSON.stringify(checked));
    
    toast.success(
      checked ? "Notifications enabled" : "Notifications disabled",
      {
        description: checked 
          ? "You will receive notifications for new lost and found items" 
          : "You will not receive notifications for new items",
      }
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-3">Notifications</h2>
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notification Preferences
            </Label>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Receive notifications for new lost and found items
            </p>
          </div>
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={handleNotificationToggle}
            aria-label="Toggle notifications"
          />
        </div>
      </Card>
    </div>
  );
};
