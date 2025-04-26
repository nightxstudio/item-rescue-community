
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

type Theme = "light" | "dark";
type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, user } = useAuth();
  
  // Get initial theme mode from localStorage as a fallback
  const initialThemeMode = localStorage.getItem("themeMode") as ThemeMode || "system";
  
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialThemeMode);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    
    if (savedTheme) {
      return savedTheme;
    } else if (initialThemeMode === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      return initialThemeMode as Theme;
    }
  });

  // Sync theme mode with database when user is logged in
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      const fetchSettings = async () => {
        const { data, error } = await supabase
          .from('user_settings')
          .select('theme_mode')
          .eq('user_id', user.id)
          .single();
        
        if (data && !error) {
          setThemeModeState(data.theme_mode as ThemeMode);
          
          // Apply the theme based on the fetched theme mode
          if (data.theme_mode === 'system') {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            setTheme(systemTheme);
          } else {
            setTheme(data.theme_mode as Theme);
          }
        }
      };
      
      fetchSettings();
    }
  }, [isLoggedIn, user?.id]);

  // Update document when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Save theme preference to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Update system theme when preference changes
  useEffect(() => {
    if (themeMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? "dark" : "light");
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [themeMode]);

  const setThemeMode = async (newMode: ThemeMode) => {
    setThemeModeState(newMode);
    localStorage.setItem("themeMode", newMode);
    
    // Apply the theme based on mode
    if (newMode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTheme(systemTheme);
    } else {
      setTheme(newMode as Theme);
    }
    
    // Update in database if user is logged in
    if (isLoggedIn && user?.id) {
      const { error } = await supabase
        .from('user_settings')
        .update({ theme_mode: newMode })
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error updating theme mode in database:", error);
        toast.error("Failed to save theme settings");
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    // When toggling directly, we should also update the themeMode
    if (themeMode !== newTheme) {
      setThemeMode(newTheme as ThemeMode);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};
