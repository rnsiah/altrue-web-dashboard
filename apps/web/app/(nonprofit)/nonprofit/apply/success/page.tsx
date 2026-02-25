'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, Clock, Mail, ArrowRight, 
  Heart, FileSearch
} from 'lucide-react'

export default function ApplicationSuccessPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Application Submitted!</CardTitle>
            <CardDescription>
              Thank you for applying to join Altrue Global
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Application Status</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Clock className="h-3 w-3 mr-1" /> Pending Review
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Review Time</span>
                <span className="font-medium">24-48 hours</span>
              </div>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-rose-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Email Confirmation Sent</h4>
                  <p className="text-sm text-gray-600">
                    We&apos;ve sent a confirmation email with your application details.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-rose-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Review Process</h4>
                  <p className="text-sm text-gray-600">
                    Our team reviews applications to verify 501(c)(3) status.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileSearch className="h-5 w-5 text-rose-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Next Steps</h4>
                  <p className="text-sm text-gray-600">
                    Once approved, you&apos;ll receive login credentials to access your dashboard.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/nonprofit" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to Nonprofit Home
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full gap-2">
                  Go to Altrue Home <ArrowRight className="h-4 w-4" />
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
    </div>
  )
}
