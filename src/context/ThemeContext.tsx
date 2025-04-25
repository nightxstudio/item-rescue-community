
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

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
  const [theme, setTheme] = useState<Theme>(() => {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    const themeMode = localStorage.getItem("themeMode") as ThemeMode;
    
    if (savedTheme) {
      return savedTheme;
    } else if (themeMode === "system") {
      // Use system preference if themeMode is set to system
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else if (themeMode === "dark") {
      return "dark";
    } else if (themeMode === "light") {
      return "light";
    } else {
      // Default fallback
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
  });

  const [themeMode, setThemeModeState] = useState<ThemeMode>(
    () => localStorage.getItem("themeMode") as ThemeMode || "system"
  );

  useEffect(() => {
    // Update document when theme changes
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Save theme preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Effect to handle theme mode changes and system preference changes
  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (themeMode === "system") {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    // Apply theme mode
    if (themeMode === "system") {
      setTheme(mediaQuery.matches ? "dark" : "light");
    } else if (themeMode === "dark" || themeMode === "light") {
      setTheme(themeMode);
    }

    localStorage.setItem("themeMode", themeMode);

    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [themeMode]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    // Also update themeMode to match the manually selected theme
    setThemeModeState(newTheme);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    
    // Apply the appropriate theme based on the selected mode
    if (mode === "system") {
      const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(systemIsDark ? "dark" : "light");
    } else {
      setTheme(mode);
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
