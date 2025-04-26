
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { LanguageSettings } from "@/components/settings/LanguageSettings";
import { AccountManagement } from "@/components/settings/AccountManagement";
import { CookieSettings } from "@/components/settings/CookieSettings";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Settings = () => {
  const { isLoggedIn, user } = useAuth();

  // Initialize settings for new users
  useEffect(() => {
    const initializeSettings = async () => {
      if (!isLoggedIn || !user?.id) return;

      try {
        // Check if user has settings
        const { data, error } = await supabase
          .from('user_settings')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        // If no settings exist, create default settings
        if (error && error.code === 'PGRST116') {
          // Get defaults from localStorage or use hardcoded defaults
          const language = localStorage.getItem("language") || "en";
          const themeMode = localStorage.getItem("themeMode") || "dark";
          const fontSize = localStorage.getItem("fontSize") || "medium";
          const density = localStorage.getItem("density") || "comfortable";
          const borderRadius = localStorage.getItem("borderRadius") || "medium";
          
          // Create settings in database
          const { error: insertError } = await supabase
            .from('user_settings')
            .insert({
              user_id: user.id,
              language,
              theme_mode: themeMode,
              font_size: fontSize,
              density,
              border_radius: borderRadius,
              allow_cookies: true,
              allow_analytics: false,
              allow_marketing: false
            });
            
          if (insertError) {
            console.error("Error creating user settings:", insertError);
            toast.error("Failed to initialize settings");
          } else {
            // Apply default settings
            document.documentElement.setAttribute("data-font-size", fontSize);
            document.documentElement.setAttribute("data-density", density);
            document.documentElement.setAttribute("data-radius", borderRadius);
          }
        }
      } catch (err) {
        console.error("Error checking user settings:", err);
      }
    };
    
    initializeSettings();
  }, [isLoggedIn, user?.id]);

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
      
      <div className="max-w-3xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <LanguageSettings />
        </motion.div>

        <Separator />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <SecuritySettings />
        </motion.div>

        <Separator />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <AppearanceSettings />
        </motion.div>

        <Separator />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <NotificationSettings />
        </motion.div>

        <Separator />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <CookieSettings />
        </motion.div>

        <Separator />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <AccountManagement />
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
