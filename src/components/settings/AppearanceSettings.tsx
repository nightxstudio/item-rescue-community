
import { useTheme } from "@/context/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Sun, Moon, Monitor } from "lucide-react";

export const AppearanceSettings = () => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const [fontSize, setFontSize] = useState(localStorage.getItem("fontSize") || "medium");
  const [density, setDensity] = useState(localStorage.getItem("density") || "comfortable");
  const [borderRadius, setBorderRadius] = useState(localStorage.getItem("borderRadius") || "medium");

  // Apply all settings on initial render
  useEffect(() => {
    document.documentElement.setAttribute("data-font-size", fontSize);
    document.documentElement.setAttribute("data-density", density);
    document.documentElement.setAttribute("data-radius", borderRadius);
  }, [fontSize, density, borderRadius]);

  const handleThemeModeChange = (value: "light" | "dark" | "system") => {
    setThemeMode(value);
    localStorage.setItem("themeMode", value);
    
    toast.success(`Theme mode set to ${value}`, {
      description: `Your theme will now ${value === 'system' ? 'follow your system preferences' : `stay in ${value} mode`}.`,
    });
  };

  const handleFontSizeChange = (value: string) => {
    setFontSize(value);
    localStorage.setItem("fontSize", value);
    document.documentElement.setAttribute("data-font-size", value);
    toast.success("Font size updated");
  };

  const handleDensityChange = (value: string) => {
    setDensity(value);
    localStorage.setItem("density", value);
    document.documentElement.setAttribute("data-density", value);
    toast.success("Display density updated");
  };

  const handleBorderRadiusChange = (value: string) => {
    setBorderRadius(value);
    localStorage.setItem("borderRadius", value);
    document.documentElement.setAttribute("data-radius", value);
    toast.success("Border radius updated");
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
