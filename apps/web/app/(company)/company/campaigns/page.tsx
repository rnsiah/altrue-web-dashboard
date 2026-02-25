'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/components/ui/toaster'
import { 
  Megaphone, Plus, Calendar, DollarSign, Users, 
  Play, Pause, Edit, Eye, MoreHorizontal, Clock, Loader2, AlertTriangle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { campaignsApi } from '@/lib/api/company'
import type { Campaign } from '@/types/company'

// Mock data fallback
const mockCampaigns: Campaign[] = []

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: Get actual company ID from session
      const companyId = '2' // Using Agora Coffee (ID: 2) for testing
      
      const data = await campaignsApi.list(companyId)
      if (data && data.length > 0) {
        setCampaigns(data)
      }
    } catch (err) {
      console.error('Failed to load campaigns:', err)
      setError('Failed to load campaigns. Using demo data.')
      toast.error('Failed to load campaigns', {
        description: 'Could not fetch latest data.',
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case 'draft':
      case 'pending_funding':
        return <Badge variant="outline">Draft</Badge>
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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
      year: 'numeric',
    })
  }

  const getDaysRemaining = (endDate: string) => {
    const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (days < 0) return 'Ended'
    if (days === 0) return 'Ends today'
    return `${days} days left`
  }

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{campaign.name}</h3>
              {getStatusBadge(campaign.status)}
            </div>
            <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
            
            {/* Progress bar for active/completed campaigns */}
            {(campaign.status === 'active' || campaign.status === 'completed') && (
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {formatCurrency(campaign.matchedAmount)} of {formatCurrency(campaign.budgetCap)}
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
            )}
            
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
              </span>
              {(campaign.status === 'active' || campaign.status === 'pending_funding') && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {getDaysRemaining(campaign.endDate)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {campaign.matchMultiplier}x match
              </span>
              {(campaign.donorCount > 0 || campaign.status === 'draft') && (
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {campaign.donorCount} donors
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href={`/company/campaigns/${campaign.id}`}>
              <Button variant="outline" size="sm">View</Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                {campaign.status === 'active' && (
                  <DropdownMenuItem>
                    <Pause className="h-4 w-4 mr-2" /> Pause
                  </DropdownMenuItem>
                )}
                {campaign.status === 'paused' && (
                  <DropdownMenuItem>
                    <Play className="h-4 w-4 mr-2" /> Resume
                  </DropdownMenuItem>
                )}
                {(campaign.status === 'draft' || campaign.status === 'pending_funding') && (
                  <DropdownMenuItem>
                    <DollarSign className="h-4 w-4 mr-2" /> Fund & Launch
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const filterCampaigns = (status: string) => {
    if (status === 'all') return campaigns
    if (status === 'pending') return campaigns.filter(c => c.status === 'draft' || c.status === 'pending_funding')
    return campaigns.filter(c => c.status === status)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-gray-600">Manage your matching campaigns</p>
        </div>
        <Link href="/company/campaigns/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Create Campaign
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
          <span className="ml-2 text-gray-600">Loading campaigns...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-600 mb-3">{error}</p>
            <Button variant="outline" size="sm" onClick={loadCampaigns}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        {['active', 'scheduled', 'pending', 'completed', 'all'].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {filterCampaigns(tab).length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Megaphone className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600 mb-4">
                    No {tab === 'pending' ? 'pending funding' : tab} campaigns
                  </p>
                  {tab !== 'completed' && (
                    <Link href="/company/campaigns/new">
                      <Button>Create Campaign</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              filterCampaigns(tab).map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
      )}
    </div>
  )
}
