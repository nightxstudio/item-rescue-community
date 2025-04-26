
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useUserSettings } from "@/hooks/useUserSettings";

export const AppearanceSettings = () => {
  const { themeMode, setThemeMode } = useTheme();
  const { settings, updateSettings, isLoading } = useUserSettings();
  const [fontSize, setFontSize] = useState(settings.fontSize || "medium");
  const [density, setDensity] = useState(settings.density || "comfortable");
  const [borderRadius, setBorderRadius] = useState(settings.borderRadius || "medium");

  useEffect(() => {
    if (!isLoading) {
      setFontSize(settings.fontSize);
      setDensity(settings.density);
      setBorderRadius(settings.borderRadius);
    }
  }, [settings, isLoading]);

  const handleThemeModeChange = async (value: "light" | "dark" | "system") => {
    setThemeMode(value);
    const success = await updateSettings({ themeMode: value });
    
    if (success) {
      toast.success(`Theme mode set to ${value}`, {
        description: `Your theme will now ${value === 'system' ? 'follow your system preferences' : `stay in ${value} mode`}.`,
      });
    }
  };

  const handleFontSizeChange = async (value: string) => {
    setFontSize(value);
    const success = await updateSettings({ fontSize: value });
    
    if (success) {
      toast.success("Font size updated");
    }
  };

  const handleDensityChange = async (value: string) => {
    setDensity(value);
    const success = await updateSettings({ density: value });
    
    if (success) {
      toast.success("Display density updated");
    }
  };

  const handleBorderRadiusChange = async (value: string) => {
    setBorderRadius(value);
    const success = await updateSettings({ borderRadius: value });
    
    if (success) {
      toast.success("Border radius updated");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-3">Appearance</h2>
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Theme Mode</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose your preferred theme mode
              </p>
            </div>
            <Select value={themeMode} onValueChange={handleThemeModeChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select theme mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Font Size</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Adjust the text size
              </p>
            </div>
            <Select value={fontSize} onValueChange={handleFontSizeChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Display Density</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Adjust the spacing between elements
              </p>
            </div>
            <Select value={density} onValueChange={handleDensityChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select density" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Border Radius</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Adjust the roundness of elements
              </p>
            </div>
            <Select value={borderRadius} onValueChange={handleBorderRadiusChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select border radius" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
};
