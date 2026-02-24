'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  LayoutDashboard, Megaphone, Gift, Wallet, 
  FileText, Settings, Heart, ChevronLeft, ChevronRight,
  Medal, Receipt
} from 'lucide-react'
import { useState } from 'react'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/company/dashboard' },
  { icon: Megaphone, label: 'Campaigns', href: '/company/campaigns' },
  { icon: Medal, label: 'Matching Rules', href: '/company/matching-rules' },
  { icon: Gift, label: 'Rewards', href: '/company/rewards' },
  { icon: Wallet, label: 'Wallet', href: '/company/wallet' },
  { icon: Receipt, label: 'Billing', href: '/company/billing' },
  { icon: FileText, label: 'Impact Reports', href: '/company/reports' },
]

export function CompanySidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r flex-col transition-all duration-300 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}>
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`w-full justify-start gap-3 ${
                      collapsed ? 'px-2' : 'px-3'
                    } ${isActive ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : ''}`}
                    title={item.label}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                </Link>
              )
            })}
          </nav>
          
          <Separator className="my-4" />
          
          <nav className="px-2">
            <Link href="/company/settings">
              <Button
                variant={pathname === '/company/settings' ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-3 ${collapsed ? 'px-2' : 'px-3'}`}
                title="Settings"
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>Settings</span>}
              </Button>
            </Link>
          </nav>
        </ScrollArea>
        
        <div className="p-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="flex justify-around py-2">
          {sidebarItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center p-2">
                <item.icon className={`h-5 w-5 ${isActive ? 'text-rose-500' : 'text-gray-500'}`} />
                <span className={`text-xs mt-1 ${isActive ? 'text-rose-500' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
