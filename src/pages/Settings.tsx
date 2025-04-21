
import { useTheme } from "@/context/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  const handleThemeChange = () => {
    toggleTheme();
    
    // Show success toast for theme change with animation
    toast.success(`${theme === 'dark' ? 'Light' : 'Dark'} Mode Activated`, {
      description: `Theme has been changed to ${theme === 'dark' ? 'light' : 'dark'} mode.`,
      position: "bottom-center",
      duration: 3000,
      className: "animate-in zoom-in-90 slide-in-from-bottom-5 duration-300",
    });
  };

  return (
    <div className="space-y-6">
      <motion.h1 
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Settings
      </motion.h1>
      
      <div className="max-w-md space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-6 hover:shadow-md transition-shadow">
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
        </motion.div>

        {/* Add more settings options here */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6 hover:shadow-md transition-shadow">
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
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
