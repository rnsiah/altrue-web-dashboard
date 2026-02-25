'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from '@/components/ui/toaster'
import { 
  DollarSign, Users, Megaphone, Wallet, ArrowRight, 
  Plus, TrendingUp, AlertTriangle, Heart, Gift, FileText
} from 'lucide-react'
import { companiesApi, campaignsApi } from '@/lib/api/company'
import type { DashboardStats, Campaign, ActivityItem } from '@/types/company'

// Mock data for development
const mockStats: DashboardStats = {
  matchedThisMonth: 5230,
  budgetRemaining: 4770,
  uniqueDonors: 147,
  activeCampaigns: 2,
  totalMatchedAllTime: 45680,
  nonprofitsSupported: 23,
}

const mockCampaigns: Campaign[] = [
  {
    id: 'camp_1',
    companyId: 'comp_123',
    name: 'Education Month',
    description: 'Supporting local schools and educational programs',
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    matchMultiplier: 2,
    budgetCap: 10000,
    matchedAmount: 5230,
    escrowAmount: 3000,
    escrowFunded: true,
    status: 'active',
    donorCount: 89,
    totalDonations: 124,
    createdAt: '2024-01-15',
    eligibleCauses: ['education', 'youth'],
  },
  {
    id: 'camp_2',
    companyId: 'comp_123',
    name: 'Climate Action Week',
    description: 'Environmental conservation initiatives',
    startDate: '2024-03-01',
    endDate: '2024-03-07',
    matchMultiplier: 1.5,
    budgetCap: 5000,
    matchedAmount: 0,
    escrowAmount: 1500,
    escrowFunded: true,
    status: 'pending_funding',
    donorCount: 0,
    totalDonations: 0,
    createdAt: '2024-01-20',
    eligibleCauses: ['climate', 'environment'],
  },
]

const mockActivity: ActivityItem[] = [
  { id: '1', type: 'donation_matched', description: 'John D. donated $50 to Education Nonprofit', amount: 50, createdAt: '2024-02-24T10:30:00Z' },
  { id: '2', type: 'reward_claimed', description: 'Sarah M. claimed your Nike reward', createdAt: '2024-02-24T09:15:00Z' },
  { id: '3', type: 'campaign_milestone', description: 'Campaign "Education Month" reached 50% of budget', createdAt: '2024-02-23T16:45:00Z' },
  { id: '4', type: 'funding_received', description: 'Added $1,000 to wallet', amount: 1000, createdAt: '2024-02-22T14:20:00Z' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivity)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState(2500)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: Get actual company ID from user session/context
      // For now using placeholder - in production this comes from auth
      const companyId = '1' // Replace with actual company ID from session
      
      const [statsData, campaignsData, walletData] = await Promise.all([
        companiesApi.getDashboard(companyId).catch(() => null),
        campaignsApi.list(companyId).catch(() => []),
        companiesApi.getWallet(companyId).catch(() => null),
      ])
      
      if (statsData) setStats(statsData)
      if (campaignsData) setCampaigns(campaignsData)
      if (walletData) setWalletBalance(walletData.balance)
      
    } catch (error) {
      console.error('Failed to load dashboard:', error)
      setError('Failed to load dashboard data. Using cached data.')
      toast.error('Error loading dashboard', {
        description: 'Could not fetch latest data. Showing cached information.',
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'donation_matched':
        return <Heart className="h-4 w-4 text-rose-500" />
      case 'reward_claimed':
        return <Gift className="h-4 w-4 text-purple-500" />
      case 'campaign_milestone':
        return <Megaphone className="h-4 w-4 text-blue-500" />
      case 'funding_received':
        return <Wallet className="h-4 w-4 text-green-500" />
      default:
        return <TrendingUp className="h-4 w-4 text-gray-500" />
    }
  }

  const monthlyBudget = 10000
  const matchedPercent = (stats.matchedThisMonth / monthlyBudget) * 100

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your impact overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/company/campaigns/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
          <span className="ml-2 text-gray-600">Loading dashboard...</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={loadDashboard}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Low Balance Alert */}
      {walletBalance < 500 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Low Wallet Balance</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Your wallet is below $500. Matching is paused until you add funds.</span>
            <Link href="/company/wallet">
              <Button variant="outline" size="sm">Add Funds</Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Matched This Month</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.matchedThisMonth)}</p>
              </div>
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-rose-500" />
              </div>
            </div>
            <Progress value={matchedPercent} className="mt-3 h-1" />
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(matchedPercent)}% of monthly budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Budget Remaining</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.budgetRemaining)}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Out of {formatCurrency(monthlyBudget)} monthly
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unique Donors</p>
                <p className="text-2xl font-bold">{stats.uniqueDonors}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              +12 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Megaphone className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              1 scheduled this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/company/campaigns/new">
          <Button variant="outline" className="gap-2">
            <Megaphone className="h-4 w-4" /> Create Campaign
          </Button>
        </Link>
        <Link href="/company/wallet">
          <Button variant="outline" className="gap-2">
            <Wallet className="h-4 w-4" /> Add Funds
          </Button>
        </Link>
        <Link href="/company/rewards/new">
          <Button variant="outline" className="gap-2">
            <Gift className="h-4 w-4" /> Create Reward
          </Button>
        </Link>
        <Link href="/company/reports">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" /> Generate Report
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Campaigns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active Campaigns</h2>
            <Link href="/company/campaigns">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {campaigns.filter(c => c.status === 'active').map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {formatCurrency(campaign.matchedAmount)} of {formatCurrency(campaign.budgetCap)} matched
                        </span>
                        <span className="font-medium">
                          {Math.round((campaign.matchedAmount / campaign.budgetCap) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(campaign.matchedAmount / campaign.budgetCap) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex gap-4 mt-3 text-sm text-gray-600">
                      <span>{campaign.donorCount} donors</span>
                      <span>•</span>
                      <span>{campaign.matchMultiplier}x match</span>
                      <span>•</span>
                      <span>Ends {formatDate(campaign.endDate)}</span>
                    </div>
                  </div>
                  
                  <Link href={`/company/campaigns/${campaign.id}`}>
                    <Button variant="outline" size="sm">Manage</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

          {campaigns.filter(c => c.status === 'active').length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Megaphone className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-600 mb-4">No active campaigns</p>
                <Link href="/company/campaigns/new">
                  <Button>Create Your First Campaign</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Wallet Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Wallet Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{formatCurrency(walletBalance)}</div>
              <p className="text-sm text-gray-600 mb-4">Current balance</p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Monthly progress</span>
                    <span>{Math.round((stats.matchedThisMonth / monthlyBudget) * 100)}%</span>
                  </div>
                  <Progress value={(stats.matchedThisMonth / monthlyBudget) * 100} className="h-1" />
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-gray-600">Auto-refill enabled</span>
                </div>
              </div>
              
              <Link href="/company/wallet">
                <Button variant="outline" className="w-full mt-4">
                  Manage Wallet
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.description}</p>
                      {activity.amount && (
                        <p className="text-sm font-medium text-rose-600">
                          +{formatCurrency(activity.amount)}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
