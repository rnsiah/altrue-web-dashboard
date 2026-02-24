'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Heart, Search, ArrowLeft, CheckCircle, XCircle, 
  Clock, FileSearch, Loader2 
} from 'lucide-react'
import { companyApplicationsApi } from '@/lib/api/company'
import type { CompanyApplication } from '@/types/company'

export default function ApplicationStatusPage() {
  const [applicationId, setApplicationId] = useState('')
  const [application, setApplication] = useState<CompanyApplication | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!applicationId.trim()) return

    setLoading(true)
    setError('')
    setSearched(true)

    try {
      const data = await companyApplicationsApi.get(applicationId.trim())
      setApplication(data)
    } catch (err: any) {
      setError('Application not found. Please check your application ID and try again.')
      setApplication(null)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Declined</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/company" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
              <span className="font-bold text-gray-900">Altrue</span>
            </Link>
            <Link href="/company/apply">
              <Button variant="ghost" size="sm">Apply Now</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/company" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <Card>
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                <FileSearch className="h-6 w-6 text-rose-500" />
              </div>
              <CardTitle className="text-center">Check Application Status</CardTitle>
              <CardDescription className="text-center">
                Enter your application ID to view the current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="applicationId">Application ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="applicationId"
                      value={applicationId}
                      onChange={(e) => setApplicationId(e.target.value)}
                      placeholder="e.g., app_12345"
                      className="flex-1"
                    />
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Your application ID was emailed to you when you submitted your application.
                  </p>
                </div>
              </form>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {application && (
                <div className="mt-6 space-y-4">
                  <Separator />
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Application Details</h3>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(application.status)}
                        {getStatusBadge(application.status)}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company</span>
                        <span className="font-medium">{application.companyName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submitted</span>
                        <span>{new Date(application.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Commitment</span>
                        <span className="font-medium">
                          ${application.annualCommitment.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact Email</span>
                        <span>{application.email}</span>
                      </div>
                    </div>
                  </div>

                  {application.status === 'approved' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-900">Congratulations!</h4>
                          <p className="text-sm text-green-700 mt-1">
                            Your application has been approved. Check your email for onboarding instructions.
                          </p>
                          <Link href="/company/onboarding">
                            <Button className="mt-3" size="sm">
                              Start Onboarding
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {application.status === 'rejected' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-900">Application Declined</h4>
                          <p className="text-sm text-red-700 mt-1">
                            Unfortunately, we couldn't approve your application at this time. 
                            Please check your email for more details.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {application.status === 'pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-900">Under Review</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Our team is reviewing your application. You'll receive an email 
                            within 24-48 hours with our decision.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-sm text-gray-500 mt-6">
            Can't find your application ID?{' '}
            <a href="mailto:support@altrue.com" className="text-rose-500 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
