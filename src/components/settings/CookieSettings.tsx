
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Cookie } from "lucide-react";
import { useUserSettings } from "@/hooks/useUserSettings";

export const CookieSettings = () => {
  const { settings, updateSettings, isLoading } = useUserSettings();
  
  const [allowCookies, setAllowCookies] = useState(settings.allowCookies);
  const [allowAnalytics, setAllowAnalytics] = useState(settings.allowAnalytics);
  const [allowMarketing, setAllowMarketing] = useState(settings.allowMarketing);

  // Update state when settings load or change
  useEffect(() => {
    if (!isLoading) {
      setAllowCookies(settings.allowCookies);
      setAllowAnalytics(settings.allowAnalytics);
      setAllowMarketing(settings.allowMarketing);
    }
  }, [settings, isLoading]);

  const handleAllowCookiesChange = async (value: boolean) => {
    setAllowCookies(value);
    const success = await updateSettings({ allowCookies: value });
    
    // If disabling all cookies, also disable other cookie types
    if (!value) {
      setAllowAnalytics(false);
      setAllowMarketing(false);
      await updateSettings({ 
        allowCookies: false,
        allowAnalytics: false,
        allowMarketing: false
      });
    }
    
    if (success) {
      toast.success(`Essential cookies ${value ? "enabled" : "disabled"}`);
    }
  };

  const handleAllowAnalyticsChange = async (value: boolean) => {
    setAllowAnalytics(value);
    const success = await updateSettings({ allowAnalytics: value });
    
    if (success) {
      toast.success(`Analytics cookies ${value ? "enabled" : "disabled"}`);
    }
  };

  const handleAllowMarketingChange = async (value: boolean) => {
    setAllowMarketing(value);
    const success = await updateSettings({ allowMarketing: value });
    
    if (success) {
      toast.success(`Marketing cookies ${value ? "enabled" : "disabled"}`);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Cookie className="w-5 h-5" /> 
        Cookie Preferences
      </h2>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Essential Cookies</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                These are necessary for the website to function and cannot be disabled.
              </p>
            </div>
            <Switch checked={true} disabled />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Functional Cookies</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                These enable personal features like remembering your preferences.
              </p>
            </div>
            <Switch 
              checked={allowCookies} 
              onCheckedChange={handleAllowCookiesChange} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Analytics Cookies</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                These help us improve our services by collecting anonymous usage data.
              </p>
            </div>
            <Switch 
              checked={allowAnalytics} 
              disabled={!allowCookies}
              onCheckedChange={handleAllowAnalyticsChange} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Marketing Cookies</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                These are used to track visitors across websites for advertising purposes.
              </p>
            </div>
            <Switch 
              checked={allowMarketing} 
              disabled={!allowCookies}
              onCheckedChange={handleAllowMarketingChange} 
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
