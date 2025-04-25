
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export const NotificationSettings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-3">Notifications</h2>
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Notification Preferences</Label>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Receive notifications for new lost and found items
            </p>
          </div>
          <Switch
            defaultChecked={true}
            aria-label="Toggle notifications"
          />
        </div>
      </Card>
    </div>
  );
};
