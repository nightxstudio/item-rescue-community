
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  User,
  LayoutDashboard,
  FileSearch,
  Info,
  HelpCircle,
  Settings,
  Trash2
} from "lucide-react";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { useEffect } from "react";

type SidebarLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

type SidebarProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  isMobile?: boolean;
}

const Sidebar = ({ isOpen, onOpenChange, isMobile = false }: SidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links: SidebarLink[] = [
    {
      name: "Profile",
      href: "/profile",
      icon: User
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Lost Items",
      href: "/lost-items",
      icon: FileSearch
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
      name: "Donation",
      href: "/donation",
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
    }
  ];

  if (!user) return null;

  const handleLinkClick = (href: string) => {
    navigate(href);
    if (isMobile && onOpenChange) {
      onOpenChange(false);
    }
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col flex-grow p-4 overflow-y-auto">
      <div className="flex items-center justify-center mb-6 mt-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
          {user.name || "Complete your profile"}
        </h3>
        {user.occupation && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {user.occupation === 'student'
              ? user.studentType === 'school'
                ? 'School Student'
                : 'College Student'
              : 'Working Professional'
            }
          </p>
        )}
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.name}>
              {isMobile ? (
                <SheetClose asChild>
                  <Link
                    to={link.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all hover:bg-primary/10 hover:text-primary",
                      location.pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-slate-700 dark:text-slate-300"
                    )}
                    onClick={() => handleLinkClick(link.href)}
                  >
                    <link.icon className="w-5 h-5 mr-3" />
                    {link.name}
                  </Link>
                </SheetClose>
              ) : (
                <Link
                  to={link.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all hover:bg-primary/10 hover:text-primary",
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-slate-700 dark:text-slate-300"
                  )}
                >
                  <link.icon className="w-5 h-5 mr-3" />
                  {link.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  // For mobile, render sidebar in Sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="p-0 w-64 bg-sidebar dark:bg-slate-900">
          {renderSidebarContent()}
        </SheetContent>
      </Sheet>
    );
  }

  // For desktop, render sidebar directly
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-sidebar dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed left-0 top-0 z-40 pt-16">
      {renderSidebarContent()}
    </aside>
  );
};

export default Sidebar;
