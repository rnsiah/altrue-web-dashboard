"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export function Header({ title, user }: HeaderProps) {
  return (
    <header className="h-16 border-b bg-card px-4 lg:px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold">{title}</h1>
      
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-background border rounded-md px-3 py-1.5">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm w-48"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4AF37] rounded-full" />
        </Button>

        {/* User */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-medium">
            {user?.name?.charAt(0) || "U"}
          </div>
          <span className="text-sm font-medium hidden lg:inline">{user?.name || "User"}</span>
        </div>
      </div>
    </header>
  );
}
