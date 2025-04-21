
import { useTheme } from "@/context/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleThemeChange = () => {
    toggleTheme();
    toast({
      title: `${theme === 'dark' ? 'Light' : 'Dark'} Mode Activated`,
      description: `Theme has been changed to ${theme === 'dark' ? 'light' : 'dark'} mode.`,
      className: `${theme === 'dark' ? 'bg-white text-black' : 'bg-slate-900 text-white'}`,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="max-w-md space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Dark Mode</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Toggle between light and dark themes
              </p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={handleThemeChange}
              aria-label="Toggle dark mode"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
