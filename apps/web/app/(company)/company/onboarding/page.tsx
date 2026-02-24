'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, ArrowLeft, Check, Building2, CreditCard, 
  Wallet, Settings, Heart, AlertCircle, Loader2, CheckCircle2
} from 'lucide-react'
import { companiesApi, mockData } from '@/lib/api/company'

const steps = [
  { id: 1, name: 'Account', icon: Building2 },
  { id: 2, name: 'Profile', icon: Building2 },
  { id: 3, name: 'Billing', icon: CreditCard },
  { id: 4, name: 'Wallet', icon: Wallet },
  { id: 5, name: 'Matching', icon: Settings },
]

const tiers = [
  { id: 'free', name: 'Free', monthlyFee: 0, description: 'For small teams getting started', features: ['Basic matching', 'Standard reports', 'Email support'] },
  { id: 'pro', name: 'Pro', monthlyFee: 99, description: 'For growing companies', features: ['Advanced matching', 'Custom campaigns', 'Priority support', 'API access'] },
  { id: 'enterprise', name: 'Enterprise', monthlyFee: 499, description: 'For large organizations', features: ['White-label', 'Custom integrations', 'Dedicated account manager', 'SSO'] },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    // Step 1: Account
    password: '',
    confirmPassword: '',
    
    // Step 2: Profile
    companyName: '',
    website: '',
    logo: '',
    socialLinks: { linkedin: '', twitter: '' },
    causes: [] as string[],
    
    // Step 3: Billing
    tier: 'pro',
    
    // Step 4: Wallet
    monthlyBudget: 1000,
    initialFunding: 300,
    autoRefill: false,
    
    // Step 5: Matching
    defaultMatchPercent: 100,
    eligibleCauses: [] as string[],
  })

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const toggleCause = (cause: string) => {
    setFormData(prev => ({
      ...prev,
      causes: prev.causes.includes(cause)
        ? prev.causes.filter(c => c !== cause)
        : [...prev.causes, cause]
    }))
  }

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.password || formData.password.length < 8) {
          return 'Password must be at least 8 characters'
        }
        if (formData.password !== formData.confirmPassword) {
          return 'Passwords do not match'
        }
        return ''
      case 2:
        if (!formData.companyName.trim()) return 'Company name is required'
        if (formData.causes.length < 3) return 'Please select at least 3 causes'
        return ''
      case 3:
        return ''
      case 4:
        if (formData.monthlyBudget < 100) return 'Monthly budget must be at least $100'
        if (formData.initialFunding < 30) return 'Initial funding must be at least 30%'
        return ''
      case 5:
        if (formData.eligibleCauses.length === 0) return 'Please select at least one eligible cause'
        return ''
      default:
        return ''
    }
  }

  const nextStep = () => {
    const validationError = validateStep()
    if (validationError) {
      setError(validationError)
      return
    }
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setError('')
    }
  }

  const handleComplete = async () => {
    const validationError = validateStep()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // In production, get companyId from session
      const companyId = 'comp_123'
      await companiesApi.completeOnboarding(companyId, {
        ...formData,
        tier: formData.tier as 'free' | 'pro' | 'enterprise',
      })
      router.push('/company/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Create Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="••••••••"
              />
              <p className="text-sm text-gray-500">Must be at least 8 characters</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                placeholder="Acme Corporation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://www.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Social Links</Label>
              <Input
                value={formData.socialLinks.linkedin}
                onChange={(e) => updateField('socialLinks', { ...formData.socialLinks, linkedin: e.target.value })}
                placeholder="LinkedIn URL"
                className="mb-2"
              />
              <Input
                value={formData.socialLinks.twitter}
                onChange={(e) => updateField('socialLinks', { ...formData.socialLinks, twitter: e.target.value })}
                placeholder="Twitter/X URL"
              />
            </div>
            <div className="space-y-3">
              <Label>Causes You Support *</Label>
              <p className="text-sm text-gray-500">Select 3-5 causes</p>
              <div className="grid grid-cols-2 gap-3">
                {mockData.causes.map((cause) => (
                  <div key={cause} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cause-${cause}`}
                      checked={formData.causes.includes(cause)}
                      onCheckedChange={() => toggleCause(cause)}
                    />
                    <Label htmlFor={`cause-${cause}`} className="text-sm font-normal cursor-pointer">
                      {cause}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Your Plan</Label>
              <div className="grid gap-4">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.tier === tier.id 
                        ? 'border-rose-500 bg-rose-50' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => updateField('tier', tier.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{tier.name}</h4>
                          {formData.tier === tier.id && (
                            <CheckCircle2 className="h-4 w-4 text-rose-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                        <ul className="mt-2 space-y-1">
                          {tier.features.map((feature) => (
                            <li key={feature} className="text-sm text-gray-600 flex items-center gap-1">
                              <Check className="h-3 w-3 text-green-500" /> {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          ${tier.monthlyFee}
                        </div>
                        <div className="text-sm text-gray-500">/month</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyBudget">Monthly Matching Budget *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="monthlyBudget"
                  type="number"
                  value={formData.monthlyBudget}
                  onChange={(e) => updateField('monthlyBudget', parseInt(e.target.value) || 0)}
                  className="pl-7"
                />
              </div>
              <p className="text-sm text-gray-500">Minimum $100/month</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Wallet className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Initial Wallet Funding</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Fund your wallet with 30% of your monthly budget to start matching immediately.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm">Required:</span>
                    <Badge variant="secondary">
                      ${Math.round(formData.monthlyBudget * 0.3).toLocaleString()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoRefill"
                checked={formData.autoRefill}
                onCheckedChange={(checked) => updateField('autoRefill', checked)}
              />
              <Label htmlFor="autoRefill" className="text-sm font-normal cursor-pointer">
                Enable auto-refill when balance is low
              </Label>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultMatch">Default Match Percentage</Label>
              <select
                id="defaultMatch"
                value={formData.defaultMatchPercent}
                onChange={(e) => updateField('defaultMatchPercent', parseInt(e.target.value))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value={10}>10%</option>
                <option value={25}>25%</option>
                <option value={50}>50%</option>
                <option value={100}>100% (1:1)</option>
                <option value={200}>200% (2:1)</option>
              </select>
              <p className="text-sm text-gray-500">
                Example: At 100%, if an employee donates $50, you match $50.
              </p>
            </div>
            
            <div className="space-y-3">
              <Label>Eligible Causes *</Label>
              <p className="text-sm text-gray-500">Which causes will you match donations for?</p>
              <div className="grid grid-cols-2 gap-3">
                {mockData.causes.map((cause) => (
                  <div key={cause} className="flex items-center space-x-2">
                    <Checkbox
                      id={`eligible-${cause}`}
                      checked={formData.eligibleCauses.includes(cause)}
                      onCheckedChange={() => {
                        setFormData(prev => ({
                          ...prev,
                          eligibleCauses: prev.eligibleCauses.includes(cause)
                            ? prev.eligibleCauses.filter(c => c !== cause)
                            : [...prev.eligibleCauses, cause]
                        }))
                      }}
                    />
                    <Label htmlFor={`eligible-${cause}`} className="text-sm font-normal cursor-pointer">
                      {cause}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Preview</h4>
              <p className="text-sm text-gray-600">
                When an employee donates $50 to {formData.eligibleCauses[0] || 'Education'}, 
                you'll match ${Math.round(50 * formData.defaultMatchPercent / 100)}.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Complete Your Setup</h1>
        <p className="text-gray-600">Let's get your company ready to amplify impact</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Step {currentStep} of {steps.length}</span>
          <span className="font-medium">{Math.round((currentStep / steps.length) * 100)}% complete</span>
        </div>
        <Progress value={(currentStep / steps.length) * 100} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => {
              const StepIcon = steps[currentStep - 1].icon
              return <StepIcon className="h-5 w-5 text-rose-500" />
            })()}
            {steps[currentStep - 1].name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {renderStep()}

          <Separator className="my-6" />

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            
            {currentStep < 5 ? (
              <Button onClick={nextStep} className="gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Setting up...
                  </>
                ) : (
                  <>
                    Complete Setup <Check className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
