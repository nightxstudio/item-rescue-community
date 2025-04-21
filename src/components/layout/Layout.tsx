
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";
import { cn } from "@/lib/utils";

const Layout = () => {
  const { isLoggedIn, isProfileComplete } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 antialiased">
      <Header />
      
      {isLoggedIn && isProfileComplete && (
        <>
          <Sidebar />
          <MobileNavigation />
        </>
      )}
      
      <main className={cn(
        "pt-16 transition-all duration-200",
        isLoggedIn && isProfileComplete ? "md:pl-64" : ""
      )}>
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
