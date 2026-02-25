'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  DollarSign, Users, Heart, TrendingUp, ArrowRight, 
  Building2, FileText, Loader2, AlertTriangle
} from 'lucide-react'
import { toast } from '@/components/ui/toaster'

// Mock data for development
const mockNonprofit = {
  id: 1,
  name: 'Education Forward',
  logo: '/logo.png',
  description: 'Providing educational opportunities to underserved communities',
  mission: 'Every child deserves access to quality education',
  status: 'approved',
}

const mockStats = {
  totalDonations: 125000,
  monthlyDonations: 15000,
  totalDonors: 450,
  recurringDonors: 85,
  companyPartners: 3,
  activeProjects: 2,
}

const mockRecentDonations = [
  { id: 1, donor: 'John D.', amount: 250, message: 'Keep up the great work!', date: '2024-02-24', companyMatch: 'Google' },
  { id: 2, donor: 'Sarah M.', amount: 100, date: '2024-02-23' },
  { id: 3, donor: 'Mike R.', amount: 500, message: 'For the scholarship fund', date: '2024-02-22', companyMatch: 'Microsoft' },
  { id: 4, donor: 'Anonymous', amount: 50, date: '2024-02-21' },
]

const mockProjects = [
  { id: 1, name: 'Scholarship Fund 2024', goal: 50000, raised: 35000, donors: 120 },
  { id: 2, name: 'School Supplies Drive', goal: 10000, raised: 8200, donors: 89 },
]

const mockPartners = [
  { id: 1, name: 'Google', matchAmount: 25000, logo: '/google.png' },
  { id: 2, name: 'Microsoft', matchAmount: 15000, logo: '/microsoft.png' },
  { id: 3, name: 'Local Bank', matchAmount: 5000, logo: '/bank.png' },
]

export default function NonprofitDashboardPage() {
  const [nonprofit] = useState(mockNonprofit)
  const [stats] = useState(mockStats)
  const [recentDonations] = useState(mockRecentDonations)
  const [projects] = useState(mockProjects)
  const [partners] = useState(mockPartners)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // TODO: Fetch real data from API
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">{nonprofit.name}</h1>
          <p className="text-gray-600">{nonprofit.mission}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/nonprofit/dashboard/projects/new">
            <Button className="gap-2">
              <FileText className="h-4 w-4" /> New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalDonations)}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.monthlyDonations)}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donors</p>
                <p className="text-2xl font-bold">{stats.totalDonors}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Company Partners</p>
                <p className="text-2xl font-bold">{stats.companyPartners}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Donations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Donations</CardTitle>
              <Link href="/nonprofit/dashboard/donations">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5 text-[#D4AF37]" />
                      </div>
                      <div>
                        <p className="font-medium">{donation.donor}</p>
                        {donation.message && (
                          <p className="text-sm text-gray-500">&ldquo;{donation.message}&rdquo;</p>
                        )}
                        <p className="text-xs text-gray-400">{donation.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+{formatCurrency(donation.amount)}</p>
                      {donation.companyMatch && (
                        <Badge variant="secondary" className="text-xs">
                          Matched by {donation.companyMatch}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Projects</CardTitle>
              <Link href="/nonprofit/dashboard/projects">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{project.name}</h3>
                      <Badge>{project.donors} donors</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {formatCurrency(project.raised)} of {formatCurrency(project.goal)}
                        </span>
                        <span className="font-medium">
                          {Math.round((project.raised / project.goal) * 100)}%
                        </span>
                      </div>
                      <Progress value={(project.raised / project.goal) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Company Partners */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-amber-500" />
                Company Partners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partners.map((partner) => (
                  <div key={partner.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-bold">
                        {partner.name[0]}
                      </div>
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-sm text-gray-500">Total matched</p>
                      </div>
                    </div>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(partner.matchAmount)}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/nonprofit/dashboard/partnerships">
                <Button variant="outline" className="w-full mt-4">
                  View Partnerships
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/nonprofit/dashboard/donations">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" /> View All Donations
                </Button>
              </Link>
              <Link href="/nonprofit/dashboard/projects/new">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" /> Create Project
                </Button>
              </Link>
              <Link href="/nonprofit/dashboard/reports">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" /> Generate Report
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
