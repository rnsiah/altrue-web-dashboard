'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, Clock, Mail, ArrowRight, 
  Heart, FileSearch, Loader2 
} from 'lucide-react'
import { companyApplicationsApi } from '@/lib/api/company'
import type { CompanyApplication } from '@/types/company'

function SuccessContent() {
  const searchParams = useSearchParams()
  const applicationId = searchParams.get('id')
  
  const [application, setApplication] = useState<CompanyApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (applicationId) {
      loadApplication()
    } else {
      setLoading(false)
    }
  }, [applicationId])

  const loadApplication = async () => {
    try {
      const data = await companyApplicationsApi.get(applicationId!)
      setApplication(data)
    } catch (err: any) {
      setError('Could not load application details. Please check your application ID.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
          <span>Loading...</span>
        </div>
      </div>
    )
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
          </div>
        </div>
      </nav>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Application Submitted!</CardTitle>
              <CardDescription>
                Thank you for applying to join Altrue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {application && (
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Application ID</span>
                    <Badge variant="outline">{application.id}</Badge>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Company</span>
                    <span className="font-medium">{application.companyName}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" /> Pending Review
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Submitted</span>
                    <span className="text-sm">
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-rose-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Email Confirmation Sent</h4>
                    <p className="text-sm text-gray-600">
                      We've sent a confirmation email to your inbox with your application details.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-rose-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Review Process</h4>
                    <p className="text-sm text-gray-600">
                      Our team reviews applications within 24-48 hours. You'll receive an email once a decision is made.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileSearch className="h-5 w-5 text-rose-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Check Your Status</h4>
                    <p className="text-sm text-gray-600">
                      You can check your application status anytime using your application ID.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={`/company/apply/status?id=${applicationId}`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <FileSearch className="h-4 w-4" /> Check Status
                  </Button>
                </Link>
                <Link href="/company" className="flex-1">
                  <Button className="w-full gap-2">
                    Back to Home <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-gray-500">
                Questions? Contact us at{' '}
                <a href="mailto:support@altrue.com" className="text-rose-500 hover:underline">
                  support@altrue.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function ApplicationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
          <span>Loading...</span>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
