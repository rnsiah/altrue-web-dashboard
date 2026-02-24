import { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CompanySidebar } from '@/components/company/CompanySidebar'
import { CompanyHeader } from '@/components/company/CompanyHeader'

// Mock auth check - replace with real NextAuth session check
async function getSession() {
  // In production, use: await getServerSession(authOptions)
  return { user: { id: '1', name: 'Test User', companyId: 'comp_123' } }
}

export default async function CompanyLayout({ 
  children 
}: { 
  children: ReactNode 
}) {
  const session = await getSession()
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader user={session.user} />
      <div className="flex">
        <CompanySidebar />
        <main className="flex-1 lg:ml-64 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
