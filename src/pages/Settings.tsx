
import { useTheme } from "@/context/ThemeContext";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="max-w-md space-y-6 bg-card rounded-xl shadow p-6 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="font-medium text-lg">Dark Mode</span>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
            aria-label="Toggle dark mode"
          />
        </div>
        {/* Placeholder for future styling/theme options */}
        <div className="border-t pt-4">
          <span className="text-slate-500 dark:text-slate-400 italic text-sm">
            More settings coming soon...
          </span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
