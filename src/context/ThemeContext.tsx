
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    const themeMode = localStorage.getItem("themeMode");
    
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

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
