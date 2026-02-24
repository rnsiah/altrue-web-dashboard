"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Heart,
  ShoppingBag,
  Gift,
  AlertCircle,
  CreditCard,
  Settings,
  Shield,
  Building2,
  Flag,
  ChevronDown,
  CheckCircle,
  Clock,
  XCircle,
  LogOut,
  ArrowLeftRight,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Nonprofits",
    href: "/admin/nonprofits",
    icon: <Heart className="w-5 h-5" />,
    badge: 0, // Pending approvals count
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: <Package className="w-5 h-5" />,
  },
  {
    label: "Rewards",
    href: "/admin/rewards",
    icon: <Gift className="w-5 h-5" />,
  },
  {
    label: "Causes",
    href: "/admin/causes",
    icon: <Flag className="w-5 h-5" />,
  },
  {
    label: "Companies",
    href: "/admin/companies",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    label: "Moderation",
    href: "/admin/moderation",
    icon: <Shield className="w-5 h-5" />,
    badge: 0, // Pending reports
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

// Mock user roles - in reality this comes from auth context
interface UserRole {
  type: "admin" | "user" | "nonprofit" | "company";
  label: string;
  href: string;
  organization?: string;
}

const userRoles: UserRole[] = [
  { type: "admin", label: "Admin Panel", href: "/admin" },
  { type: "user", label: "My Account", href: "/portal" },
  { type: "nonprofit", label: "Nonprofit Dashboard", href: "/nonprofit", organization: "Red Cross" },
  { type: "company", label: "Company Portal", href: "/company", organization: "Acme Corp" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full w-64 bg-slate-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-slate-900" />
          </div>
          <span className="font-bold text-lg">Altrue Admin</span>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="p-3 border-b border-slate-800">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-medium">Administrator</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              Switch Experience
            </div>
            <DropdownMenuSeparator />
            {userRoles.map((role) => (
              <DropdownMenuItem key={role.type} asChild>
                <Link
                  href={role.href}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <div className="flex flex-col">
                    <span>{role.label}</span>
                    {role.organization && (
                      <span className="text-xs text-muted-foreground">
                        {role.organization}
                      </span>
                    )}
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {mainNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? "bg-[#D4AF37] text-slate-900"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            {item.badge ? (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
            <span className="text-[#D4AF37] font-bold text-sm">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-slate-400">admin@altrue.global</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// Status badges for use in tables
export function StatusBadge({ status }: { status?: string | null }) {
  const safeStatus = status || "pending";
  
  const styles = {
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-600 border-green-500/20",
    rejected: "bg-red-500/10 text-red-600 border-red-500/20",
    active: "bg-green-500/10 text-green-600 border-green-500/20",
    inactive: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    suspended: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  const icons = {
    pending: <Clock className="w-3 h-3" />,
    approved: <CheckCircle className="w-3 h-3" />,
    rejected: <XCircle className="w-3 h-3" />,
    active: <CheckCircle className="w-3 h-3" />,
    inactive: <Clock className="w-3 h-3" />,
    suspended: <AlertCircle className="w-3 h-3" />,
  };

  const style = styles[safeStatus as keyof typeof styles] || styles.pending;
  const icon = icons[safeStatus as keyof typeof icons] || icons.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
        style
      )}
    >
      {icon}
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );
}
