'use client'

import { useState } from 'react'
import Link from 'next/link'
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
  ArrowRight, ArrowLeft, Megaphone, Calendar, DollarSign, 
  Users, Target, Upload, Check, AlertCircle, Loader2, 
  CheckCircle2, Info
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { campaignsApi, mockData } from '@/lib/api/company'
import type { Campaign } from '@/types/company'

const steps = [
  { id: 1, name: 'Basics', description: 'Name, dates, description' },
  { id: 2, name: 'Matching', description: 'Configure match rules' },
  { id: 3, name: 'Eligibility', description: 'Who can participate' },
  { id: 4, name: 'Budget', description: 'Set budget & escrow' },
  { id: 5, name: 'Preview', description: 'Review & launch' },
]

export default function CreateCampaignPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [campaignImage, setCampaignImage] = useState<File | null>(null)

  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    matchMultiplier: 1,
    maxMatchPerDonation: undefined,
    eligibleCauses: [],
    eligibleNonprofits: [],
    minDonationAmount: 10,
    budgetCap: 5000,
    escrowFunded: false,
  })

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setCampaignImage(acceptedFiles[0])
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  })

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.name?.trim()) return 'Campaign name is required'
        if (!formData.startDate) return 'Start date is required'
        if (!formData.endDate) return 'End date is required'
        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
          return 'End date must be after start date'
        }
        return ''
      case 2:
        if (!formData.matchMultiplier || formData.matchMultiplier < 0.1) {
          return 'Match multiplier is required'
        }
        return ''
      case 3:
        if (!formData.eligibleCauses?.length) return 'Select at least one eligible cause'
        return ''
      case 4:
        if (!formData.budgetCap || formData.budgetCap < 100) {
          return 'Budget must be at least $100'
        }
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
    if (currentStep < 5) setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setError('')
    }
  }

  const handleLaunch = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      // Upload image first if exists
      let imageUrl = ''
      if (campaignImage) {
        // Upload logic here
      }

      const campaignData = {
        ...formData,
        image: imageUrl,
        companyId: 'comp_123',
      }

      const campaign = await campaignsApi.create('comp_123', campaignData)
      
      // Fund escrow if user chose to
      if (formData.escrowFunded) {
        const escrowAmount = Math.round((formData.budgetCap || 0) * 0.3)
        await campaignsApi.fund(campaign.id, escrowAmount)
        await campaignsApi.launch(campaign.id)
      }

      router.push('/company/campaigns')
    } catch (err: any) {
      setError(err.message || 'Failed to create campaign')
    } finally {
      setIsSubmitting(false)
    }
  }

  const escrowRequired = Math.round((formData.budgetCap || 0) * 0.3)

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., Education Month 2024"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="What is this campaign about?"
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateField('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => updateField('endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Campaign Image</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-rose-500 bg-rose-50' : 'border-gray-300'
                }`}
              >
                <input {...getInputProps()} />
                {campaignImage ? (
                  <div className="space-y-2">
                    <Check className="h-8 w-8 mx-auto text-green-500" />
                    <p className="text-sm text-gray-600">{campaignImage.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="matchMultiplier">Match Multiplier *</Label>
              <select
                id="matchMultiplier"
                value={formData.matchMultiplier}
                onChange={(e) => updateField('matchMultiplier', parseFloat(e.target.value))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value={0.5}>50% (0.5:1)</option>
                <option value={1}>100% (1:1)</option>
                <option value={1.5}>150% (1.5:1)</option>
                <option value={2}>200% (2:1)</option>
                <option value={3}>300% (3:1)</option>
              </select>
              <p className="text-sm text-gray-500">
                At {formData.matchMultiplier}x, if someone donates $50, you match ${Math.round(50 * formData.matchMultiplier!)}.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMatch">Max Match Per Donation (optional)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="maxMatch"
                  type="number"
                  value={formData.maxMatchPerDonation || ''}
                  onChange={(e) => updateField('maxMatchPerDonation', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="No limit"
                  className="pl-7"
                />
              </div>
              <p className="text-sm text-gray-500">Leave blank for no limit per donation</p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Eligible Causes *</Label>
              <p className="text-sm text-gray-500">Select which causes this campaign supports</p>
              <div className="grid grid-cols-2 gap-3">
                {mockData.causes.map((cause) => (
                  <div key={cause} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cause-${cause}`}
                      checked={formData.eligibleCauses?.includes(cause)}
                      onCheckedChange={() => {
                        const causes = formData.eligibleCauses || []
                        updateField('eligibleCauses', 
                          causes.includes(cause) 
                            ? causes.filter(c => c !== cause)
                            : [...causes, cause]
                        )
                      }}
                    />
                    <Label htmlFor={`cause-${cause}`} className="text-sm font-normal cursor-pointer">
                      {cause}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minDonation">Minimum Donation Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="minDonation"
                  type="number"
                  value={formData.minDonationAmount || 10}
                  onChange={(e) => updateField('minDonationAmount', parseInt(e.target.value))}
                  className="pl-7"
                />
              </div>
              <p className="text-sm text-gray-500">Minimum donation required to trigger a match</p>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budgetCap">Campaign Budget Cap *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="budgetCap"
                  type="number"
                  value={formData.budgetCap}
                  onChange={(e) => updateField('budgetCap', parseInt(e.target.value))}
                  className="pl-7"
                />
              </div>
              <p className="text-sm text-gray-500">Maximum total matching for this campaign</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900">Required Escrow: {escrowRequired.toLocaleString()}</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    To launch this campaign, you need to pre-fund 30% of the budget ({escrowRequired.toLocaleString()}).
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="fundNow"
                checked={formData.escrowFunded}
                onCheckedChange={(checked) => updateField('escrowFunded', checked)}
              />
              <Label htmlFor="fundNow" className="text-sm font-normal cursor-pointer">
                Fund escrow now and launch immediately
              </Label>
            </div>

            {!formData.escrowFunded && (
              <p className="text-sm text-gray-500">
                If not funded now, your campaign will be created as a draft and you'll need to fund it before launching.
              </p>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {campaignImage ? (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Check className="h-8 w-8 text-green-500" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Megaphone className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{formData.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">{formData.matchMultiplier}x Match</Badge>
                      <Badge variant="outline">{formData.eligibleCauses?.length} causes</Badge>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Duration</span>
                    <p className="font-medium">
                      {new Date(formData.startDate!).toLocaleDateString()} - {new Date(formData.endDate!).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Budget Cap</span>
                    <p className="font-medium">${formData.budgetCap?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Required Escrow</span>
                    <p className="font-medium">${escrowRequired.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Launch Status</span>
                    <p className="font-medium">
                      {formData.escrowFunded ? 'Will launch immediately' : 'Draft - requires funding'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {formData.escrowFunded && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-green-800">
                    ${escrowRequired.toLocaleString()} will be charged from your wallet to fund this campaign.
                  </p>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/company/campaigns" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to Campaigns
        </Link>
        <h1 className="text-2xl font-bold mt-4">Create Campaign</h1>
        <p className="text-gray-600">Set up a new matching campaign</p>
      </div>

      {/* Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className={`flex-1 flex flex-col items-center ${
            index < steps.length - 1 ? 'relative' : ''
          }`}>
            {index < steps.length - 1 && (
              <div className={`absolute top-4 left-1/2 w-full h-0.5 ${
                currentStep > step.id ? 'bg-rose-500' : 'bg-gray-200'
              }`} />
            )}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10 ${
              currentStep > step.id 
                ? 'bg-rose-500 text-white' 
                : currentStep === step.id 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
            }`}>
              {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
            </div>
            <span className={`text-xs mt-2 ${
              currentStep >= step.id ? 'text-gray-900 font-medium' : 'text-gray-500'
            }`}>
              {step.name}
            </span>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
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
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            
            {currentStep < 5 ? (
              <Button onClick={nextStep}>
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleLaunch} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    {formData.escrowFunded ? 'Launch Campaign' : 'Save as Draft'} <Check className="h-4 w-4 ml-2" />
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
