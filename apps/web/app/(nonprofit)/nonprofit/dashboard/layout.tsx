'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  DollarSign, 
  FileText, 
  Building2, 
  BarChart3,
  Settings,
  Heart
} from 'lucide-react'

const navItems = [
  { href: '/nonprofit/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/nonprofit/dashboard/donations', label: 'Donations', icon: DollarSign },
  { href: '/nonprofit/dashboard/projects', label: 'Projects', icon: FileText },
  { href: '/nonprofit/dashboard/partnerships', label: 'Partnerships', icon: Building2 },
  { href: '/nonprofit/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { href: '/nonprofit/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function NonprofitDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/nonprofit/dashboard" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="font-bold text-xl">Altrue Nonprofit</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Education Forward</span>
              <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                <span className="text-[#B8962E] font-bold text-sm">EF</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
