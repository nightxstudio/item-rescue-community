
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export type UserSettingsType = {
  language: string;
  themeMode: string;
  fontSize: string;
  density: string;
  borderRadius: string;
  autoLogoutMinutes: number | null;
  allowCookies: boolean;
  allowAnalytics: boolean;
  allowMarketing: boolean;
};

const DEFAULT_SETTINGS: UserSettingsType = {
  language: "en",
  themeMode: "dark",
  fontSize: "medium",
  density: "comfortable",
  borderRadius: "medium",
  autoLogoutMinutes: null, // Disabled by default
  allowCookies: true,
  allowAnalytics: false,
  allowMarketing: false,
};

export const useUserSettings = () => {
  const { user, isLoggedIn } = useAuth();
  const [settings, setSettings] = useState<UserSettingsType>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch settings from the database when the user is logged in
  useEffect(() => {
    const fetchSettings = async () => {
      if (!isLoggedIn || !user?.uid) {
        // If not logged in, use local settings or defaults
        const localSettings = localStorage.getItem("userSettings");
        if (localSettings) {
          setSettings(JSON.parse(localSettings));
        } else {
          setSettings(DEFAULT_SETTINGS);
        }
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", user.uid)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching user settings:", error);
          toast.error("Failed to load your settings");
        }

        if (data) {
          // We found settings in the database
          setSettings({
            language: data.language || DEFAULT_SETTINGS.language,
            themeMode: data.theme_mode || DEFAULT_SETTINGS.themeMode,
            fontSize: data.font_size || DEFAULT_SETTINGS.fontSize,
            density: data.density || DEFAULT_SETTINGS.density,
            borderRadius: data.border_radius || DEFAULT_SETTINGS.borderRadius,
            autoLogoutMinutes: data.auto_logout_minutes,
            allowCookies: data.allow_cookies !== undefined ? data.allow_cookies : DEFAULT_SETTINGS.allowCookies,
            allowAnalytics: data.allow_analytics !== undefined ? data.allow_analytics : DEFAULT_SETTINGS.allowAnalytics,
            allowMarketing: data.allow_marketing !== undefined ? data.allow_marketing : DEFAULT_SETTINGS.allowMarketing,
          });
        } else {
          // No settings found, create default settings in the database
          const newSettings = DEFAULT_SETTINGS;
          
          if (user?.uid) {
            const { error: insertError } = await supabase
              .from("user_settings")
              .insert({
                user_id: user.uid,
                language: newSettings.language,
                theme_mode: newSettings.themeMode,
                font_size: newSettings.fontSize,
                density: newSettings.density,
                border_radius: newSettings.borderRadius,
                auto_logout_minutes: newSettings.autoLogoutMinutes,
                allow_cookies: newSettings.allowCookies,
                allow_analytics: newSettings.allowAnalytics,
                allow_marketing: newSettings.allowMarketing,
              });

            if (insertError) {
              console.error("Error creating default user settings:", insertError);
              toast.error("Failed to create default settings");
            }
          }
          
          setSettings(newSettings);
        }
      } catch (error) {
        console.error("Unexpected error fetching settings:", error);
        toast.error("An unexpected error occurred while loading your settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [user?.uid, isLoggedIn]);

  // Apply settings to document
  useEffect(() => {
    if (!isLoading) {
      // Apply language settings
      document.documentElement.setAttribute("lang", settings.language);
      document.documentElement.setAttribute("data-language", settings.language);
      
      // Apply font size
      document.documentElement.setAttribute("data-font-size", settings.fontSize);
      
      // Apply density
      document.documentElement.setAttribute("data-density", settings.density);
      
      // Apply border radius
      document.documentElement.setAttribute("data-radius", settings.borderRadius);

      // Also store in localStorage for non-logged in users and as a cache
      localStorage.setItem("userSettings", JSON.stringify(settings));
      
      // Store individual settings for backward compatibility
      localStorage.setItem("language", settings.language);
      localStorage.setItem("themeMode", settings.themeMode);
      localStorage.setItem("fontSize", settings.fontSize);
      localStorage.setItem("density", settings.density);
      localStorage.setItem("borderRadius", settings.borderRadius);
    }
  }, [settings, isLoading]);

  // Function to update settings
  const updateSettings = async (newSettings: Partial<UserSettingsType>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      
      // Update in the database if logged in
      if (isLoggedIn && user?.uid) {
        const { error } = await supabase
          .from("user_settings")
          .upsert({
            user_id: user.uid,
            language: updatedSettings.language,
            theme_mode: updatedSettings.themeMode,
            font_size: updatedSettings.fontSize,
            density: updatedSettings.density,
            border_radius: updatedSettings.borderRadius,
            auto_logout_minutes: updatedSettings.autoLogoutMinutes,
            allow_cookies: updatedSettings.allowCookies,
            allow_analytics: updatedSettings.allowAnalytics,
            allow_marketing: updatedSettings.allowMarketing,
          });

        if (error) {
          console.error("Error updating user settings:", error);
          toast.error("Failed to save your settings");
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Unexpected error updating settings:", error);
      toast.error("An unexpected error occurred while saving your settings");
      return false;
    }
  };

  return { settings, updateSettings, isLoading };
};
