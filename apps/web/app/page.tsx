import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
              <span className="text-xl font-bold text-gray-900">Altrue</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/company">
                <Button variant="outline">For Companies</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Altrue
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The social giving platform that multiplies your impact
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/company">
              <Button size="lg">For Companies</Button>
            </Link>
            <Link href="/company/apply">
              <Button size="lg" variant="outline">Apply Now</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
