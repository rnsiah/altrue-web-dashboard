'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Settings, Plus, Trash2, Heart, DollarSign, 
  AlertCircle, Check, RefreshCcw
} from 'lucide-react'
import { matchRulesApi, mockData } from '@/lib/api/company'
import type { GlobalMatchSettings } from '@/types/company'

const mockSettings: GlobalMatchSettings = {
  defaultMultiplier: 1,
  monthlyBudgetCap: 10000,
  autoPauseThreshold: 500,
  eligibleCauses: ['Education', 'Climate Change', 'Healthcare'],
  excludedNonprofits: [],
  minDonationAmount: 10,
  maxMatchPerDonation: 500,
}

const causeMultipliers = [
  { cause: 'Climate Change', multiplier: 2 },
  { cause: 'Education', multiplier: 1.5 },
]

export default function MatchingRulesPage() {
  const [settings, setSettings] = useState<GlobalMatchSettings>(mockSettings)
  const [autoRefill, setAutoRefill] = useState({
    enabled: true,
    threshold: 1000,
    amount: 2000,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await matchRulesApi.update('comp_123', settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (field: keyof GlobalMatchSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const toggleCause = (cause: string) => {
    const causes = settings.eligibleCauses
    updateSetting('eligibleCauses', 
      causes.includes(cause) 
        ? causes.filter(c => c !== cause)
        : [...causes, cause]
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Matching Rules</h1>
        <p className="text-gray-600">Configure your default matching behavior</p>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-rose-500" />
            Global Match Settings
          </CardTitle>
          <CardDescription>
            These settings apply to all donations unless overridden by a campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="defaultMultiplier">Default Match Percentage</Label>
              <select
                id="defaultMultiplier"
                value={settings.defaultMultiplier}
                onChange={(e) => updateSetting('defaultMultiplier', parseFloat(e.target.value))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value={0.1}>10%</option>
                <option value={0.25}>25%</option>
                <option value={0.5}>50%</option>
                <option value={1}>100% (1:1)</option>
                <option value={2}>200% (2:1)</option>
              </select>
              <p className="text-sm text-gray-500">
                Example: At 100%, you match dollar-for-dollar
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyBudget">Monthly Budget Cap</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="monthlyBudget"
                  type="number"
                  value={settings.monthlyBudgetCap}
                  onChange={(e) => updateSetting('monthlyBudgetCap', parseInt(e.target.value))}
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minDonation">Minimum Donation</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="minDonation"
                  type="number"
                  value={settings.minDonationAmount}
                  onChange={(e) => updateSetting('minDonationAmount', parseInt(e.target.value))}
                  className="pl-7"
                />
              </div>
              <p className="text-sm text-gray-500">Minimum donation to trigger a match</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMatch">Max Match Per Donation</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="maxMatch"
                  type="number"
                  value={settings.maxMatchPerDonation}
                  onChange={(e) => updateSetting('maxMatchPerDonation', parseInt(e.target.value))}
                  className="pl-7"
                />
              </div>
              <p className="text-sm text-gray-500">Maximum you'll match on a single donation</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="autoPause">Auto-Pause Threshold</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="autoPause"
                type="number"
                value={settings.autoPauseThreshold}
                onChange={(e) => updateSetting('autoPauseThreshold', parseInt(e.target.value))}
                className="pl-7"
              />
            </div>
            <p className="text-sm text-gray-500">
              Matching will pause when your wallet balance falls below this amount
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cause-Specific Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            Cause-Specific Rules
          </CardTitle>
          <CardDescription>
            Set different match multipliers for specific causes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {causeMultipliers.map((rule) => (
              <div key={rule.cause} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{rule.cause}</span>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{rule.multiplier}x match</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4 gap-2">
            <Plus className="h-4 w-4" /> Add Rule
          </Button>
        </CardContent>
      </Card>

      {/* Eligible Causes */}
      <Card>
        <CardHeader>
          <CardTitle>Eligible Causes</CardTitle>
          <CardDescription>
            Select which causes you'll match donations for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {mockData.causes.map((cause) => (
              <div key={cause} className="flex items-center space-x-2">
                <Checkbox
                  id={`eligible-${cause}`}
                  checked={settings.eligibleCauses.includes(cause)}
                  onCheckedChange={() => toggleCause(cause)}
                />
                <Label htmlFor={`eligible-${cause}`} className="text-sm font-normal cursor-pointer">
                  {cause}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-Refill */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCcw className="h-5 w-5 text-rose-500" />
            Auto-Refill Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Enable Auto-Refill</Label>
              <p className="text-sm text-gray-500">Automatically add funds when balance is low</p>
            </div>
            <Switch
              checked={autoRefill.enabled}
              onCheckedChange={(checked) => setAutoRefill(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {autoRefill.enabled && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="threshold">Refill Threshold</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="threshold"
                    type="number"
                    value={autoRefill.threshold}
                    onChange={(e) => setAutoRefill(prev => ({ ...prev, threshold: parseInt(e.target.value) }))}
                    className="pl-7"
                  />
                </div>
                <p className="text-sm text-gray-500">Refill when balance drops below this amount</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Refill Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="amount"
                    type="number"
                    value={autoRefill.amount}
                    onChange={(e) => setAutoRefill(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                    className="pl-7"
                  />
                </div>
                <p className="text-sm text-gray-500">Amount to add when refilling</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            When an employee donates <strong>$50</strong> to{' '}
            <strong>{settings.eligibleCauses[0] || 'Education'}</strong>, 
            you'll match{' '}
            <strong>
              {formatCurrency(Math.min(
                50 * settings.defaultMultiplier, 
                settings.maxMatchPerDonation
              ))}
            </strong>.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? 'Saving...' : saved ? (
            <><Check className="h-4 w-4" /> Saved</>
          ) : (
            'Save Changes'
          )}
        </Button>
        {saved && (
          <span className="text-sm text-green-600">Settings saved successfully</span>
        )}
      </div>
    </div>
  )
}
