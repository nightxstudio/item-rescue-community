
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, 
  X,
  User, 
  LayoutDashboard, 
  FileSearch, 
  Info, 
  HelpCircle, 
  Trash2,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const links: NavLink[] = [
    {
      name: "Profile",
      href: "/profile",
      icon: User
    },
    {
      name: "Lost Items",
      href: "/lost-items",
      icon: LayoutDashboard
    },
    {
      name: "Found Items",
      href: "/found-items",
      icon: FileSearch
    },
    {
      name: "Developer's Desk",
      href: "/developers-desk",
      icon: Info
    },
    {
      name: "FAQ",
      href: "/faq",
      icon: HelpCircle
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings
    },
    {
      name: "Delete Account",
      href: "/delete-account",
      icon: Trash2
    }
  ];

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-primary text-white p-3 rounded-full shadow-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <div className={cn(
        "fixed inset-0 z-40 bg-white dark:bg-slate-900 md:hidden transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-4 pt-20">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-lg font-medium rounded-md transition-all hover:bg-primary/10 hover:text-primary",
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-slate-700 dark:text-slate-300",
                    link.name === "Delete Account" ? "text-red-500" : ""
                  )}
                  onClick={closeMenu}
                >
                  <link.icon className="w-5 h-5 mr-3" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
