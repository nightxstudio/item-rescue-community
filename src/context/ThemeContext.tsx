
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUserSettings } from "@/hooks/useUserSettings";

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
  // Get cached theme from localStorage initially to prevent flashing
  const cachedThemeMode = localStorage.getItem("themeMode") as ThemeMode || "dark";
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  // Initial state based on localStorage or system preference
  const [theme, setTheme] = useState<Theme>(
    cachedThemeMode === "system" 
      ? prefersDarkMode ? "dark" : "light"
      : cachedThemeMode as Theme
  );
  
  const [themeMode, setThemeModeState] = useState<ThemeMode>(cachedThemeMode);
  
  // useUserSettings may use AuthContext, so we need try-catch
  const { settings, updateSettings, isLoading } = useUserSettings();

  // Update theme and themeMode when settings load
  useEffect(() => {
    if (!isLoading && settings) {
      const newThemeMode = settings.themeMode as ThemeMode;
      setThemeModeState(newThemeMode);
      
      if (newThemeMode === "system") {
        setTheme(prefersDarkMode ? "dark" : "light");
      } else {
        setTheme(newThemeMode as Theme);
      }
    }
  }, [settings?.themeMode, isLoading, prefersDarkMode]);

  // Apply theme class to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (themeMode === "system") {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [themeMode]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    const newThemeMode = newTheme;
    setThemeModeState(newThemeMode);
    updateSettings({ themeMode: newThemeMode });
    // Also update localStorage as fallback
    localStorage.setItem("themeMode", newThemeMode);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    updateSettings({ themeMode: mode });
    // Also update localStorage as fallback
    localStorage.setItem("themeMode", mode);
    
    if (mode === "system") {
      const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(systemIsDark ? "dark" : "light");
    } else {
      setTheme(mode);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themeMode, 
      toggleTheme, 
      setThemeMode 
    }}>
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
