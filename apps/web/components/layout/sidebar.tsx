"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Heart,
  Settings,
  Menu,
  X,
  LogOut,
  Shield,
  Activity,
  ChevronDown,
  ChevronRight,
  UserCircle,
} from "lucide-react";

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/donations", label: "Donations", icon: Heart },
];

const adminNavItems = [
  { href: "/dashboard/admin/processes", label: "Process Management", icon: Activity },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminExpanded, setAdminExpanded] = useState(true);
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch (e) {}
    window.location.href = "/login?logout=true";
  };

  const NavLink = ({ item }: { item: typeof mainNavItems[0] }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
          isActive
            ? "bg-[#D4AF37] text-black"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon size={18} />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b z-40 flex items-center px-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 -ml-2 rounded-md hover:bg-accent"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link href="/dashboard" className="flex items-center gap-2 ml-3">
          <div className="w-8 h-8 bg-[#D4AF37] rounded-md flex items-center justify-center">
            <span className="text-black font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-lg">Altrue</span>
        </Link>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 mt-16"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:mt-0 mt-16 lg:h-screen h-[calc(100vh-4rem)]"
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo - Desktop only */}
          <div className="hidden lg:flex h-16 items-center px-6 border-b">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#D4AF37] rounded-md flex items-center justify-center">
                <span className="text-black font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-lg">Altrue</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {mainNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}

            {/* Admin Section */}
            {isAdmin && (
              <div className="mt-6">
                <button
                  onClick={() => setAdminExpanded(!adminExpanded)}
                  className="flex items-center gap-3 px-4 py-2 w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Shield size={18} />
                  <span className="flex-1 text-left">Admin</span>
                  {adminExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                
                {adminExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {adminNavItems.map((item) => (
                      <NavLink key={item.href} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Link */}
            <div className="mt-6 pt-6 border-t">
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === "/dashboard/profile"
                    ? "bg-[#D4AF37] text-black"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <UserCircle size={18} />
                Profile
              </Link>
            </div>
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-medium">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate capitalize">{user?.role || "user"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile content padding */}
      <div className="lg:hidden h-16" />
    </>
  );
}
