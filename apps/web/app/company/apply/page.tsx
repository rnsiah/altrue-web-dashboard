'use client'

import { useState, useCallback } from 'react'
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
import { 
  ArrowLeft, ArrowRight, Building2, Upload, 
  Heart, Check, AlertCircle, Loader2 
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { mockData, companyApplicationsApi } from '@/lib/api/company'

const steps = [
  { id: 1, name: 'Company Information' },
  { id: 2, name: 'Mission & Values' },
  { id: 3, name: 'Commitment' },
  { id: 4, name: 'Contact' },
]

export default function CompanyApplicationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    companyName: '',
    ein: '',
    website: '',
    yearStarted: '',
    mission: '',
    description: '',
    causes: [] as string[],
    annualCommitment: '',
    monthlyBudget: '',
    logo: null as File | null,
    contactName: '',
    email: '',
    phone: '',
    address: '',
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      updateField('logo', acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.companyName.trim()) return 'Company name is required'
        if (!formData.ein.trim()) return 'EIN is required'
        if (formData.ein.length !== 9 && !/^\d{2}-?\d{7}$/.test(formData.ein)) {
          return 'Please enter a valid 9-digit EIN'
        }
        return ''
      case 2:
        if (!formData.mission.trim()) return 'Mission statement is required'
        if (formData.causes.length === 0) return 'Please select at least one cause'
        return ''
      case 3:
        if (!formData.annualCommitment || parseInt(formData.annualCommitment) < 10000) {
          return 'Annual commitment must be at least $10,000'
        }
        if (!formData.monthlyBudget) return 'Monthly budget estimate is required'
        return ''
      case 4:
        if (!formData.contactName.trim()) return 'Contact name is required'
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          return 'Please enter a valid email address'
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
    const validationError = validateStep()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // In a real implementation, you would upload the logo first
      // and then submit the application with the logo URL
      const applicationData = {
        companyName: formData.companyName,
        ein: formData.ein.replace(/-/g, ''),
        website: formData.website,
        yearStarted: formData.yearStarted ? parseInt(formData.yearStarted) : undefined,
        mission: formData.mission,
        description: formData.description,
        causes: formData.causes,
        annualCommitment: parseInt(formData.annualCommitment),
        monthlyBudget: parseInt(formData.monthlyBudget),
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      }

      const response = await companyApplicationsApi.create(applicationData)
      router.push(`/company/apply/success?id=${response.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please try again.')
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
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                placeholder="Acme Corporation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ein">EIN (Employer Identification Number) *</Label>
              <Input
                id="ein"
                value={formData.ein}
                onChange={(e) => updateField('ein', e.target.value)}
                placeholder="12-3456789"
              />
              <p className="text-sm text-gray-500">
                Your 9-digit EIN is used for verification purposes only.
              </p>
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
              <Label htmlFor="yearStarted">Year Started</Label>
              <Input
                id="yearStarted"
                type="number"
                value={formData.yearStarted}
                onChange={(e) => updateField('yearStarted', e.target.value)}
                placeholder="2010"
                min={1900}
                max={new Date().getFullYear()}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mission">Mission Statement *</Label>
              <textarea
                id="mission"
                value={formData.mission}
                onChange={(e) => updateField('mission', e.target.value)}
                placeholder="What drives your company?"
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Tell us about your company..."
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-3">
              <Label>Causes You Support *</Label>
              <p className="text-sm text-gray-500">Select all that apply</p>
              <div className="grid grid-cols-2 gap-3">
                {mockData.causes.map((cause) => (
                  <div key={cause} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cause-${cause}`}
                      checked={formData.causes.includes(cause)}
                      onCheckedChange={() => toggleCause(cause)}
                    />
                    <Label 
                      htmlFor={`cause-${cause}`}
                      className="text-sm font-normal cursor-pointer"
                    >
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
              <Label htmlFor="annualCommitment">Annual Matching Commitment *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="annualCommitment"
                  type="number"
                  value={formData.annualCommitment}
                  onChange={(e) => updateField('annualCommitment', e.target.value)}
                  placeholder="10000"
                  min={10000}
                  className="pl-7"
                />
              </div>
              <p className="text-sm text-gray-500">Minimum $10,000 annually</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyBudget">Estimated Monthly Budget *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="monthlyBudget"
                  type="number"
                  value={formData.monthlyBudget}
                  onChange={(e) => updateField('monthlyBudget', e.target.value)}
                  placeholder="1000"
                  className="pl-7"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Company Logo</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                {formData.logo ? (
                  <div className="space-y-2">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                      <Check className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600">{formData.logo.name}</p>
                    <p className="text-xs text-gray-500">Click or drag to replace</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {isDragActive ? 'Drop the logo here' : 'Drag & drop logo, or click to select'}
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => updateField('contactName', e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="john@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Company Address</Label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="123 Main St, City, State, ZIP"
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/company" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="font-bold text-gray-900">Altrue</span>
            </Link>
            <Link href="/company/apply/status">
              <Button variant="ghost" size="sm">
                Check Status
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep > step.id 
                      ? 'bg-green-500 text-white' 
                      : currentStep === step.id 
                        ? 'bg-[#D4AF37] text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className={`ml-2 text-sm hidden sm:block ${
                    currentStep >= step.id ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-12 sm:w-24 h-0.5 mx-2 sm:mx-4 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#D4AF37]" />
                {steps[currentStep - 1].name}
              </CardTitle>
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
                
                {currentStep < 4 ? (
                  <Button onClick={nextStep} className="gap-2">
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application <Check className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-gray-500 mt-6">
            By submitting, you agree to our{' '}
            <Link href="/terms" className="text-[#D4AF37] hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-[#D4AF37] hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
