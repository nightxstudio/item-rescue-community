
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
  const { settings, updateSettings, isLoading } = useUserSettings();
  const [theme, setTheme] = useState<Theme>("dark"); // Default to dark until settings load

  // Initialize theme based on settings or system preference
  useEffect(() => {
    if (!isLoading) {
      const themeMode = settings.themeMode as ThemeMode;
      
      if (themeMode === "system") {
        setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      } else {
        setTheme(themeMode as Theme);
      }
    }
  }, [settings.themeMode, isLoading]);

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
      if (settings.themeMode === "system") {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [settings.themeMode]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    updateSettings({ themeMode: newTheme });
  };

  const setThemeMode = (mode: ThemeMode) => {
    updateSettings({ themeMode: mode });
    
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
      themeMode: (settings.themeMode || "dark") as ThemeMode, 
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
