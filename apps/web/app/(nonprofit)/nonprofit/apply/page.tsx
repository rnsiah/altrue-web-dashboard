'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, ArrowLeft, Check, Building2, FileText, 
  User, Upload, AlertCircle, Loader2
} from 'lucide-react'

const steps = [
  { id: 1, name: 'Organization', icon: Building2 },
  { id: 2, name: 'Mission', icon: FileText },
  { id: 3, name: 'Contact', icon: User },
  { id: 4, name: 'Review', icon: Check },
]

const causes = [
  'Climate Change',
  'Education',
  'Healthcare',
  'Poverty',
  'Animal Welfare',
  'Arts & Culture',
  'Human Rights',
  'Disaster Relief',
]

export default function NonprofitApplyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    // Step 1: Organization
    name: '',
    ein: '',
    yearStarted: '',
    website: '',
    
    // Step 2: Mission
    description: '',
    missionStatement: '',
    visionStatement: '',
    causes: [] as string[],
    
    // Step 3: Contact
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
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
        if (!formData.name || formData.name.length < 3) return 'Organization name is required (min 3 characters)'
        if (!formData.ein || formData.ein.length < 9) return 'Valid EIN is required'
        if (!formData.yearStarted || parseInt(formData.yearStarted) < 1800) return 'Valid year started is required'
        return ''
      case 2:
        if (!formData.description || formData.description.length < 50) return 'Description is required (min 50 characters)'
        if (!formData.missionStatement) return 'Mission statement is required'
        if (formData.causes.length === 0) return 'Please select at least one cause'
        return ''
      case 3:
        if (!formData.contactName) return 'Contact name is required'
        if (!formData.email || !formData.email.includes('@')) return 'Valid email is required'
        if (!formData.phone) return 'Phone number is required'
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
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setError('')
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      // TODO: Connect to API
      // await nonprofitsApi.create(formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      router.push('/nonprofit/apply/success')
    } catch (err: any) {
      setError(err.message || 'Failed to submit application')
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
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., Red Cross"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ein">EIN / Tax ID *</Label>
              <Input
                id="ein"
                value={formData.ein}
                onChange={(e) => updateField('ein', e.target.value)}
                placeholder="XX-XXXXXXX"
              />
              <p className="text-sm text-gray-500">Your 501(c)(3) Employer Identification Number</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearStarted">Year Founded *</Label>
              <Input
                id="yearStarted"
                type="number"
                value={formData.yearStarted}
                onChange={(e) => updateField('yearStarted', e.target.value)}
                placeholder="e.g., 1995"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://yourorganization.org"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Organization Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Tell us about your organization and what you do..."
                className="w-full min-h-[100px] p-3 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="missionStatement">Mission Statement *</Label>
              <textarea
                id="missionStatement"
                value={formData.missionStatement}
                onChange={(e) => updateField('missionStatement', e.target.value)}
                placeholder="Your organization's mission..."
                className="w-full min-h-[80px] p-3 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visionStatement">Vision Statement</Label>
              <textarea
                id="visionStatement"
                value={formData.visionStatement}
                onChange={(e) => updateField('visionStatement', e.target.value)}
                placeholder="Your vision for the future..."
                className="w-full min-h-[80px] p-3 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label>Causes You Support *</Label>
              <div className="flex flex-wrap gap-2">
                {causes.map((cause) => (
                  <button
                    key={cause}
                    type="button"
                    onClick={() => toggleCause(cause)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      formData.causes.includes(cause)
                        ? 'bg-[#D4AF37]/10 border-rose-300 text-[#A08224]'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {cause}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => updateField('contactName', e.target.value)}
                placeholder="e.g., John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="contact@organization.org"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="123 Main St"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => updateField('zip', e.target.value)}
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Organization Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <p className="font-medium">{formData.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">EIN:</span>
                  <p className="font-medium">{formData.ein}</p>
                </div>
                <div>
                  <span className="text-gray-500">Year Founded:</span>
                  <p className="font-medium">{formData.yearStarted}</p>
                </div>
                <div>
                  <span className="text-gray-500">Website:</span>
                  <p className="font-medium">{formData.website || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Mission & Causes</h3>
              <div className="text-sm space-y-2">
                <div>
                  <span className="text-gray-500">Description:</span>
                  <p className="mt-1">{formData.description}</p>
                </div>
                <div>
                  <span className="text-gray-500">Mission:</span>
                  <p className="mt-1">{formData.missionStatement}</p>
                </div>
                <div>
                  <span className="text-gray-500">Causes:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.causes.map(cause => (
                      <Badge key={cause} variant="secondary">{cause}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Contact Name:</span>
                  <p className="font-medium">{formData.contactName}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <p className="font-medium">{formData.phone}</p>
                </div>
                <div>
                  <span className="text-gray-500">Address:</span>
                  <p className="font-medium">
                    {formData.address && `${formData.address}, `}
                    {formData.city && `${formData.city}, `}
                    {formData.state} {formData.zip}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> After submission, our team will review your application. 
                You'll receive an email within 24-48 hours with next steps.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Register Your Nonprofit</h1>
          <p className="text-gray-600 mt-2">Join hundreds of nonprofits fundraising on Altrue</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-20 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-[#D4AF37]' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            {steps.map((step) => (
              <span key={step.id} className={currentStep >= step.id ? 'text-[#B8962E] font-medium' : 'text-gray-500'}>
                {step.name}
              </span>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].name}</CardTitle>
            <CardDescription>
              Step {currentStep} of {steps.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {renderStep()}

            <div className="flex justify-between mt-6 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              
              {currentStep < 4 ? (
                <Button onClick={nextStep}>
                  Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-[#D4AF37] hover:bg-[#B8962E]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application <Check className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
