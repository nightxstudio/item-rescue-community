
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const { isLoggedIn, isProfileComplete } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 antialiased">
      <Header />
      
      {/* Desktop sidebar - only render on non-mobile devices */}
      {isLoggedIn && isProfileComplete && !isMobile && <Sidebar />}
      
      <main className={cn(
        "pt-16 transition-all duration-200",
        isLoggedIn && isProfileComplete && !isMobile ? "md:pl-64" : ""
      )}>
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
