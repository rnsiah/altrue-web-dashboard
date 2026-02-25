import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function NonprofitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header for portal pages */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/nonprofit" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
              <span className="font-bold text-xl">Altrue for Nonprofits</span>
            </Link>
            <div className="text-sm text-gray-600">
              Questions? Contact{' '}
              <a href="mailto:support@altrue.com" className="text-rose-500">
                support@altrue.com
              </a>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
