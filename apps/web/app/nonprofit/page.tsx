'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  Building2, 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle,
  ArrowRight,
  DollarSign,
  Globe,
  Handshake
} from 'lucide-react'

export default function NonprofitLandingPage() {
  const features = [
    {
      icon: <Globe className="h-6 w-6 text-rose-500" />,
      title: 'Free Profile Page',
      description: 'Beautiful, shareable profile to showcase your mission and impact.',
    },
    {
      icon: <Building2 className="h-6 w-6 text-blue-500" />,
      title: 'Company Matching',
      description: 'Partner with companies that match employee donations to your cause.',
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: 'Individual Donors',
      description: 'Connect with thousands of donors passionate about your mission.',
    },
    {
      icon: <FileText className="h-6 w-6 text-purple-500" />,
      title: 'Impact Reporting',
      description: 'Generate stunning reports for donors, boards, and stakeholders.',
    },
    {
      icon: <Handshake className="h-6 w-6 text-amber-500" />,
      title: 'Automated Engagement',
      description: 'Thank donors, send updates, and build relationships automatically.',
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-teal-500" />,
      title: 'Tax Compliance',
      description: 'Automatic tax receipts and compliance documentation.',
    },
  ]

  const stats = [
    { value: '$2.4M+', label: 'Raised by Nonprofits' },
    { value: '200+', label: 'Active Nonprofits' },
    { value: '50', label: 'Company Partners' },
    { value: '15,000+', label: 'Monthly Donors' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
              <span className="font-bold text-xl">Altrue</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/company" className="text-gray-600 hover:text-gray-900">
                For Companies
              </Link>
              <Link href="/nonprofit/apply">
                <Button>Register Nonprofit</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-rose-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-rose-100 text-rose-700 hover:bg-rose-100">
            Now accepting 501(c)(3) organizations
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Get Funded by{' '}
            <span className="text-rose-500">People + Companies</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop chasing grants. Start connecting with thousands of individual donors 
            and corporate matching programs that want to fund your mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/nonprofit/apply">
              <Button size="lg" className="gap-2">
                Create Free Profile <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Fundraise</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful tools to help you raise more money with less effort
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600">Get started in minutes, not months</p>
          </div>
          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Create Your Profile',
                description: 'Tell your story, upload your logo, and set your funding goals.',
              },
              {
                step: '2',
                title: 'Get Discovered',
                description: 'Donors browse by cause and find your organization.',
              },
              {
                step: '3',
                title: 'Receive Donations',
                description: 'Accept one-time and recurring donations from individuals and companies.',
              },
              {
                step: '4',
                title: 'Report Impact',
                description: 'Show donors exactly how you used their money with impact reports.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                  <span className="font-bold text-rose-600">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 mb-8">Free to join. Only pay when you receive donations.</p>
          <Card className="border-2 border-rose-200">
            <CardHeader>
              <CardTitle className="text-2xl">Free Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">$0<span className="text-lg font-normal text-gray-600">/month</span></div>
              <ul className="space-y-2 text-left max-w-xs mx-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free profile page</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Unlimited projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Company partnerships</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Impact reporting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>3% transaction fee</span>
                </li>
              </ul>
              <Link href="/nonprofit/apply">
                <Button className="w-full mt-4">Get Started Free</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-rose-500">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Fundraising?</h2>
          <p className="text-rose-100 mb-8">
            Join hundreds of nonprofits already raising money on Altrue
          </p>
          <Link href="/nonprofit/apply">
            <Button size="lg" variant="secondary" className="gap-2">
              Register Your Nonprofit <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 2024 Altrue Global. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
