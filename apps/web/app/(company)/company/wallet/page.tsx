'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/components/ui/toaster'
import { 
  Wallet, Plus, ArrowDownLeft, ArrowUpRight, RefreshCcw,
  CreditCard, AlertTriangle, Loader2
} from 'lucide-react'
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from '@/components/ui/dialog'
import { companiesApi } from '@/lib/api/company'
import type { Transaction, PaymentMethod, Wallet as WalletType } from '@/types/company'

// Mock data fallback
const mockWallet: WalletType = {
  companyId: '2',
  balance: 5000,
  monthlyBudget: 10000,
  matchedThisMonth: 3500,
  remainingBudget: 6500,
  autoRefill: {
    enabled: false,
    threshold: 1000,
    amount: 2000,
  },
}

const mockTransactions: Transaction[] = []
const mockPaymentMethods: PaymentMethod[] = []

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletType>(mockWallet)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addFundsOpen, setAddFundsOpen] = useState(false)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const companyId = '2' // Using Agora Coffee for testing
      
      const [walletData, transactionsData, paymentMethodsData] = await Promise.all([
        companiesApi.getWallet(companyId).catch(() => null),
        companiesApi.getTransactions(companyId, { limit: 20 }).catch(() => []),
        companiesApi.getPaymentMethods(companyId).catch(() => []),
      ])
      
      if (walletData) setWallet(walletData)
      if (transactionsData) setTransactions(transactionsData)
      if (paymentMethodsData) setPaymentMethods(paymentMethodsData)
      
    } catch (err) {
      console.error('Failed to load wallet:', err)
      setError('Failed to load wallet data.')
      toast.error('Failed to load wallet', {
        description: 'Could not fetch latest data.',
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
      year: 'numeric',
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case 'match':
        return <ArrowUpRight className="h-4 w-4 text-[#D4AF37]" />
      case 'refund':
        return <ArrowDownLeft className="h-4 w-4 text-blue-500" />
      default:
        return <ArrowUpRight className="h-4 w-4 text-gray-500" />
    }
  }

  const monthlyProgress = (wallet.matchedThisMonth / wallet.monthlyBudget) * 100

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Wallet</h1>
          <p className="text-gray-600">Manage your matching funds</p>
        </div>
        <Button className="gap-2" onClick={() => setAddFundsOpen(true)}>
          <Plus className="h-4 w-4" /> Add Funds
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
          <span className="ml-2 text-gray-600">Loading wallet...</span>
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
            <Button variant="outline" size="sm" onClick={loadWalletData}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
      <>

      {/* Balance Alert */}
      {wallet.balance < 500 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <div className="flex-1">
            <p className="text-sm text-red-800">
              <strong>Low Balance Alert:</strong> Your wallet is below $500. Matching is paused until you add funds.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setAddFundsOpen(true)}>
            Add Funds
          </Button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                <p className="text-4xl font-bold">{formatCurrency(wallet.balance)}</p>
              </div>
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                <Wallet className="h-8 w-8 text-[#D4AF37]" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-t">
              <div>
                <p className="text-sm text-gray-600">Monthly Budget</p>
                <p className="font-semibold">{formatCurrency(wallet.monthlyBudget)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Matched This Month</p>
                <p className="font-semibold">{formatCurrency(wallet.matchedThisMonth)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="font-semibold">{formatCurrency(wallet.remainingBudget)}</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Monthly Progress</span>
                <span>{Math.round(monthlyProgress)}%</span>
              </div>
              <Progress value={monthlyProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Auto-Refill Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              Auto-Refill
            </CardTitle>
          </CardHeader>
          <CardContent>
            {wallet.autoRefill.enabled ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">Enabled</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Refill at</span>
                    <span className="font-medium">{formatCurrency(wallet.autoRefill.threshold)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Refill amount</span>
                    <span className="font-medium">{formatCurrency(wallet.autoRefill.amount)}</span>
                  </div>
                </div>
                <Link href="/company/matching-rules">
                  <Button variant="outline" size="sm" className="w-full">
                    Edit Settings
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-600 mb-3">Auto-refill is disabled</p>
                <Link href="/company/matching-rules">
                  <Button variant="outline" size="sm">Enable</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="deposits">Deposits</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="refunds">Refunds</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-[#B8962E]'}`}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500">{formatCurrency(transaction.balanceAfter)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="deposits" className="mt-4">
              <div className="space-y-3">
                {transactions.filter(t => t.type === 'deposit').map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <ArrowDownLeft className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-green-600">
                      +{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="matches" className="mt-4">
              <div className="space-y-3">
                {transactions.filter(t => t.type === 'match').map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <ArrowUpRight className="h-4 w-4 text-[#D4AF37]" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-[#B8962E]">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment Methods</CardTitle>
          <Button variant="outline" size="sm">Add Card</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-gray-200 rounded" />
                  <div>
                    <p className="font-medium">
                      {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last4}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expires {method.expMonth}/{method.expYear}
                    </p>
                  </div>
                </div>
                {method.isDefault && (
                  <Badge variant="secondary">Default</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Funds Dialog */}
      <Dialog open={addFundsOpen} onOpenChange={setAddFundsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Funds to Wallet</DialogTitle>
            <DialogDescription>
              Add funds to continue matching employee donations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                  className="pl-7"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {[100, 500, 1000, 2500].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(preset.toString())}
                >
                  ${preset}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFundsOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddFundsOpen(false); setAmount(''); }}>
              Add Funds
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
      )}
    </div>
  )
}
