
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Layout = () => {
  const { isLoggedIn, isProfileComplete, user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  useEffect(() => {
    const loadSidebarPreference = async () => {
      // Default behavior based on screen size (for auto)
      let shouldShowSidebar = !isMobile;
      
      // Check local storage first for faster UI rendering
      const storedBehavior = localStorage.getItem("sidebarBehavior");
      if (storedBehavior === "always") {
        shouldShowSidebar = true;
      } else if (storedBehavior === "hidden") {
        shouldShowSidebar = false;
      }
      
      // If logged in, get preference from database
      if (isLoggedIn && user?.uid) {
        try {
          const { data, error } = await supabase
            .from('user_settings')
            .select('sidebar_behavior')
            .eq('user_id', user.uid)
            .single();
            
          if (data && !error) {
            const behavior = data.sidebar_behavior;
            if (behavior === "always") {
              shouldShowSidebar = true;
            } else if (behavior === "hidden") {
              shouldShowSidebar = false;
            } else {
              // Auto behavior - show on desktop, hide on mobile
              shouldShowSidebar = !isMobile;
            }
            
            // Save to local storage for future use
            localStorage.setItem("sidebarBehavior", behavior || "auto");
          }
        } catch (error) {
          console.error("Error loading sidebar preference:", error);
        }
      }
      
      setSidebarVisible(shouldShowSidebar);
    };
    
    loadSidebarPreference();
  }, [isLoggedIn, user?.uid, isMobile]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 antialiased">
      <Header />
      
      {/* Render sidebar based on sidebar visibility preference */}
      {isLoggedIn && isProfileComplete && !isMobile && sidebarVisible && <Sidebar />}
      
      <main className={cn(
        "pt-16 transition-all duration-200",
        isLoggedIn && isProfileComplete && !isMobile && sidebarVisible ? "md:pl-64" : ""
      )}>
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
