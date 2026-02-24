'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Gift, Plus, Users, DollarSign, TrendingUp, 
  Upload, CheckCircle, Clock, AlertCircle
} from 'lucide-react'
import type { Reward } from '@/types/company'

// Mock data
const mockRewards: Reward[] = [
  {
    id: 'reward_1',
    companyId: 'comp_123',
    name: '$50 Nike Gift Card',
    description: 'Digital gift card for Nike.com',
    type: 'digital',
    minDonationAmount: 100,
    minLevel: 2,
    totalQuantity: 100,
    claimedCount: 45,
    unlockedCount: 78,
    redeemedCount: 42,
    expirationDate: '2024-12-31',
    status: 'active',
  },
  {
    id: 'reward_2',
    companyId: 'comp_123',
    name: 'Company Swag Box',
    description: 'Exclusive branded merchandise',
    type: 'physical',
    minDonationAmount: 250,
    minLevel: 3,
    totalQuantity: 50,
    claimedCount: 23,
    unlockedCount: 34,
    redeemedCount: 20,
    expirationDate: '2024-06-30',
    status: 'active',
  },
  {
    id: 'reward_3',
    companyId: 'comp_123',
    name: 'Volunteer Day Off',
    description: 'Extra PTO for volunteering',
    type: 'experience',
    minDonationAmount: 500,
    minStreakDays: 30,
    totalQuantity: 0, // unlimited
    claimedCount: 12,
    unlockedCount: 15,
    redeemedCount: 10,
    status: 'active',
  },
  {
    id: 'reward_4',
    companyId: 'comp_123',
    name: '$25 Amazon Card',
    description: 'Digital Amazon gift card',
    type: 'digital',
    minDonationAmount: 50,
    totalQuantity: 200,
    claimedCount: 156,
    unlockedCount: 189,
    redeemedCount: 148,
    expirationDate: '2024-01-15',
    status: 'expired',
  },
]

export default function RewardsPage() {
  const [rewards] = useState<Reward[]>(mockRewards)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'digital':
        return <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><DollarSign className="h-5 w-5 text-blue-500" /></div>
      case 'physical':
        return <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Gift className="h-5 w-5 text-purple-500" /></div>
      case 'experience':
        return <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"><TrendingUp className="h-5 w-5 text-orange-500" /></div>
      default:
        return <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><Gift className="h-5 w-5 text-gray-500" /></div>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const RewardCard = ({ reward }: { reward: Reward }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          {getTypeIcon(reward.type)}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{reward.name}</h3>
                  {getStatusBadge(reward.status)}
                </div>
                <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="text-xs">
                Min donation: {formatCurrency(reward.minDonationAmount)}
              </Badge>
              {reward.minLevel && (
                <Badge variant="outline" className="text-xs">
                  Level {reward.minLevel}+
                </Badge>
              )}
              {reward.minStreakDays && (
                <Badge variant="outline" className="text-xs">
                  {reward.minStreakDays} day streak
                </Badge>
              )}
            </div>

            {reward.totalQuantity > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    {reward.claimedCount} of {reward.totalQuantity} claimed
                  </span>
                  <span className="font-medium">
                    {Math.round((reward.claimedCount / reward.totalQuantity) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(reward.claimedCount / reward.totalQuantity) * 100} 
                  className="h-2"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {reward.unlockedCount} unlocked
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                {reward.redeemedCount} redeemed
              </span>
              {reward.expirationDate && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Expires {new Date(reward.expirationDate).toLocaleDateString()}
                </span>
              )}
            </div>

            {reward.totalQuantity > 0 && reward.claimedCount >= reward.totalQuantity && (
              <div className="mt-3 flex items-center gap-2 text-sm text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span>All codes claimed - upload more to continue</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Rewards</h1>
          <p className="text-gray-600">Create and manage employee rewards</p>
        </div>
        <Link href="/company/rewards/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Create Reward
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Active Rewards</p>
            <p className="text-2xl font-bold">
              {rewards.filter(r => r.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Unlocks</p>
            <p className="text-2xl font-bold">
              {rewards.reduce((sum, r) => sum + r.unlockedCount, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Claims</p>
            <p className="text-2xl font-bold">
              {rewards.reduce((sum, r) => sum + r.claimedCount, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Redemption Rate</p>
            <p className="text-2xl font-bold">
              {Math.round(
                (rewards.reduce((sum, r) => sum + r.redeemedCount, 0) /
                rewards.reduce((sum, r) => sum + r.claimedCount, 0)) * 100
              )}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rewards List */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        {['active', 'scheduled', 'expired', 'all'].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {rewards.filter(r => tab === 'all' || r.status === tab).length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Gift className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600 mb-4">No {tab} rewards</p>
                  <Link href="/company/rewards/new">
                    <Button>Create Reward</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              rewards
                .filter(r => tab === 'all' || r.status === tab)
                .map((reward) => <RewardCard key={reward.id} reward={reward} />)
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
