
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./Sidebar";

const APP_VERSION = "Stable 2.0.0";

const Header = () => {
  const { isLoggedIn, logout, isProfileComplete } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isLoggedIn && isProfileComplete) {
      e.preventDefault();
      navigate("/lost-items");
    }
  };

  const showHamburger = isLoggedIn && isProfileComplete;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex flex-col">
          <Link
            to={isLoggedIn && isProfileComplete ? "/lost-items" : "/"}
            onClick={handleLogoClick}
            className={
              "font-bold text-primary transition-transform hover:scale-105 duration-200 " +
              "truncate " +
              "select-none " +
              (isMobile
                ? "text-sm md:text-lg"
                : "text-2xl")
            }
            style={{
              maxWidth: "80vw",
            }}
          >
            Lost And Found Department
          </Link>
          <span className="text-xs text-slate-400 mt-0.5">{APP_VERSION}</span>
        </div>

        <div className="flex items-center gap-4">
          {showHamburger && isMobile && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                className="rounded-full"
                aria-label="Log out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="font-medium">
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="default" className="font-medium">
                  Sign Up
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile sidebar for smaller screens */}
      {isMobile && <Sidebar isOpen={sidebarOpen} onOpenChange={setSidebarOpen} isMobile={true} />}
    </header>
  );
};

export default Header;
