
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Cookie } from "lucide-react";

export const CookieSettings = () => {
  const [essentialCookies] = useState(true); // Always enabled
  const [analyticsCookies, setAnalyticsCookies] = useState(() => {
    return localStorage.getItem("analyticsCookies") === "true";
  });
  const [marketingCookies, setMarketingCookies] = useState(() => {
    return localStorage.getItem("marketingCookies") === "true";
  });

  const handleAnalyticsCookies = (checked: boolean) => {
    setAnalyticsCookies(checked);
    localStorage.setItem("analyticsCookies", String(checked));
    toast.success(
      checked ? "Analytics cookies enabled" : "Analytics cookies disabled"
    );
  };

  const handleMarketingCookies = (checked: boolean) => {
    setMarketingCookies(checked);
    localStorage.setItem("marketingCookies", String(checked));
    toast.success(
      checked ? "Marketing cookies enabled" : "Marketing cookies disabled"
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-3">Cookie Preferences</h2>
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base flex items-center gap-2">
              <Cookie className="w-4 h-4" />
              Essential Cookies
            </Label>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Required for basic site functionality
            </p>
          </div>
          <Switch checked={essentialCookies} disabled aria-label="Toggle essential cookies" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Analytics Cookies</Label>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Help us improve our website by collecting usage information
            </p>
          </div>
          <Switch
            checked={analyticsCookies}
            onCheckedChange={handleAnalyticsCookies}
            aria-label="Toggle analytics cookies"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Marketing Cookies</Label>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Used for personalized advertisements
            </p>
          </div>
          <Switch
            checked={marketingCookies}
            onCheckedChange={handleMarketingCookies}
            aria-label="Toggle marketing cookies"
          />
        </div>
      </Card>
    </div>
  );
};
