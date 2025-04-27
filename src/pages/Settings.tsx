
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

  useEffect(() => {
    const initializeSettings = async () => {
      if (!isLoggedIn || !user?.uid) return;

      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('id')
          .eq('user_id', user.uid)
          .single();
        
        if (error && error.code === 'PGRST116') {
          const language = localStorage.getItem("language") || "en";
          const themeMode = localStorage.getItem("themeMode") || "dark";
          const fontSize = localStorage.getItem("fontSize") || "medium";
          const density = localStorage.getItem("density") || "comfortable";
          const borderRadius = localStorage.getItem("borderRadius") || "medium";
          const sidebarBehavior = localStorage.getItem("sidebarBehavior") || "auto";
          
          const { error: insertError } = await supabase
            .from('user_settings')
            .insert({
              user_id: user.uid,
              language,
              theme_mode: themeMode,
              font_size: fontSize,
              density,
              border_radius: borderRadius,
              allow_cookies: true,
              allow_analytics: false,
              allow_marketing: false,
              time_format: '12h',
              date_format: 'MM/DD/YYYY',
              sidebar_behavior: sidebarBehavior
            });
            
          if (insertError) {
            console.error("Error creating user settings:", insertError);
            toast.error("Failed to initialize settings");
          } else {
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
  }, [isLoggedIn, user?.uid]);

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
          <AppearanceSettings />
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
          <NotificationSettings />
        </motion.div>

        <Separator />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <CookieSettings />
        </motion.div>

        <Separator />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <AccountManagement />
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
