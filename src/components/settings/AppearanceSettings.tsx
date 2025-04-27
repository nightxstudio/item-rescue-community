
import { useTheme } from "@/context/ThemeContext";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Sun, Moon, Monitor, RotateCcw, Clock, CalendarDays, Sidebar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSidebar } from "@/components/ui/sidebar";

export const AppearanceSettings = () => {
  const { themeMode, setThemeMode } = useTheme();
  const { isLoggedIn, user } = useAuth();
  const [fontSize, setFontSize] = useState(localStorage.getItem("fontSize") || "medium");
  const [density, setDensity] = useState(localStorage.getItem("density") || "comfortable");
  const [borderRadius, setBorderRadius] = useState(localStorage.getItem("borderRadius") || "medium");
  const [timeFormat, setTimeFormat] = useState('12h');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [sidebarBehavior, setSidebarBehavior] = useState(localStorage.getItem("sidebarBehavior") || "auto");
  const { setOpen } = useSidebar();

  useEffect(() => {
    if (isLoggedIn && user?.uid) {
      const fetchSettings = async () => {
        const { data, error } = await supabase
          .from('user_settings')
          .select('font_size, density, border_radius, time_format, date_format, sidebar_behavior')
          .eq('user_id', user.uid)
          .single();
        
        if (data && !error) {
          // Using optional chaining and defaults for type safety
          setFontSize(data?.font_size ?? 'medium');
          setDensity(data?.density ?? 'comfortable');
          setBorderRadius(data?.border_radius ?? 'medium');
          setTimeFormat(data?.time_format ?? '12h');
          setDateFormat(data?.date_format ?? 'MM/DD/YYYY');
          setSidebarBehavior(data?.sidebar_behavior ?? 'auto');
          
          applySettings(
            data?.font_size ?? 'medium', 
            data?.density ?? 'comfortable', 
            data?.border_radius ?? 'medium', 
            data?.sidebar_behavior ?? 'auto'
          );
        }
      };
      
      fetchSettings();
    } else {
      applySettings(fontSize, density, borderRadius, sidebarBehavior);
    }
  }, [isLoggedIn, user?.uid]);

  const applySettings = (font: string, dens: string, radius: string, sidebar: string) => {
    document.documentElement.setAttribute("data-font-size", font);
    document.documentElement.setAttribute("data-density", dens);
    document.documentElement.setAttribute("data-radius", radius);
    
    applySidebarBehavior(sidebar);
  };

  const applySidebarBehavior = (behavior: string) => {
    localStorage.setItem("sidebarBehavior", behavior);
    
    switch (behavior) {
      case 'always':
        setOpen(true);
        break;
      case 'hidden':
        setOpen(false);
        break;
      case 'auto':
        // Let the responsive design handle it
        const isMobile = window.innerWidth < 768;
        setOpen(!isMobile);
        break;
    }
  };

  const handleThemeModeChange = (value: string) => {
    setThemeMode(value as "light" | "dark" | "system");
    
    toast.success(`Theme mode set to ${value}`, {
      description: `Your theme will now ${value === 'system' ? 'follow your system preferences' : `stay in ${value} mode`}.`,
    });
  };

  const updateSetting = async (setting: string, value: string) => {
    if (isLoggedIn && user?.uid) {
      const { error } = await supabase
        .from('user_settings')
        .update({ [setting]: value })
        .eq('user_id', user.uid);
        
      if (error) {
        console.error(`Error updating ${setting}:`, error);
        toast.error(`Failed to save ${setting} setting`);
        return false;
      }
    }
    return true;
  };

  const handleFontSizeChange = async (value: string) => {
    setFontSize(value);
    localStorage.setItem("fontSize", value);
    document.documentElement.setAttribute("data-font-size", value);
    
    if (await updateSetting('font_size', value)) {
      toast.success("Font size updated");
    }
  };

  const handleDensityChange = async (value: string) => {
    setDensity(value);
    localStorage.setItem("density", value);
    document.documentElement.setAttribute("data-density", value);
    
    if (await updateSetting('density', value)) {
      toast.success("Display density updated");
    }
  };

  const handleBorderRadiusChange = async (value: string) => {
    setBorderRadius(value);
    localStorage.setItem("borderRadius", value);
    document.documentElement.setAttribute("data-radius", value);
    
    if (await updateSetting('border_radius', value)) {
      toast.success("Border radius updated");
    }
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

  const handleSidebarBehaviorChange = async (value: string) => {
    setSidebarBehavior(value);
    applySidebarBehavior(value);
    
    if (await updateSetting('sidebar_behavior', value)) {
      toast.success("Sidebar behavior updated");
    }
  };

  const resetToDefaults = async () => {
    if (!isLoggedIn || !user?.uid) return;

    const defaults = {
      theme_mode: 'system',
      font_size: 'medium',
      density: 'comfortable',
      border_radius: 'medium',
      time_format: '12h',
      date_format: 'MM/DD/YYYY',
      sidebar_behavior: 'auto'
    };

    const { error } = await supabase
      .from('user_settings')
      .update(defaults)
      .eq('user_id', user.uid);

    if (error) {
      console.error('Error resetting appearance:', error);
      toast.error('Failed to reset appearance settings');
      return;
    }

    setThemeMode('system');
    setFontSize('medium');
    setDensity('comfortable');
    setBorderRadius('medium');
    setTimeFormat('12h');
    setDateFormat('MM/DD/YYYY');
    setSidebarBehavior('auto');
    applySidebarBehavior('auto');
    
    toast.success('Appearance settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-3">Appearance</h2>
      <Card className="p-6 space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="datetime">Date & Time</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="datetime" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Sidebar Behavior</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Control how the sidebar appears
                </p>
              </div>
              <Select value={sidebarBehavior} onValueChange={handleSidebarBehaviorChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select sidebar behavior" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always">
                    <div className="flex items-center gap-2">
                      <Sidebar className="w-4 h-4" />
                      Always Show
                    </div>
                  </SelectItem>
                  <SelectItem value="auto">
                    <div className="flex items-center gap-2">
                      <Sidebar className="w-4 h-4" />
                      Auto Collapse
                    </div>
                  </SelectItem>
                  <SelectItem value="hidden">
                    <div className="flex items-center gap-2">
                      <Sidebar className="w-4 h-4" />
                      Hide
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4 flex flex-col gap-2">
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2"
            onClick={resetToDefaults}
          >
            <RotateCcw className="w-4 h-4" />
            Reset Appearance
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            More appearance options coming in future updates!
          </p>
        </div>
      </Card>
    </div>
  );
};
