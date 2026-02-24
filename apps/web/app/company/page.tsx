import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, Users, TrendingUp, Award, ArrowRight, 
  CheckCircle, Globe, Building2, Sparkles 
} from 'lucide-react'

export default function CompanyLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
              <span className="text-xl font-bold text-gray-900">Altrue</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/company/apply/status" className="text-sm text-gray-600 hover:text-gray-900">
                Check Application Status
              </Link>
              <Link href="/company/apply">
                <Button>Apply Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              Now accepting company applications
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Amplify Your{' '}
              <span className="text-rose-500">Impact</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join leading companies using Altrue to multiply employee donations, 
              engage your team, and showcase your corporate social responsibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/company/apply">
                <Button size="lg" className="gap-2">
                  Apply Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-500">$2.5M+</div>
              <div className="text-sm text-gray-600">Matched in 2024</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-500">500+</div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-500">10K+</div>
              <div className="text-sm text-gray-600">Active Donors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-500">1,200+</div>
              <div className="text-sm text-gray-600">Nonprofits</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Three simple steps to amplify your giving</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Apply</h3>
                <p className="text-gray-600">
                  Submit your company application. We verify your EIN and review your commitment to social impact.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Set Up Matching</h3>
                <p className="text-gray-600">
                  Configure your matching rules, create campaigns, and invite employees to join your giving program.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Amplify Impact</h3>
                <p className="text-gray-600">
                  Watch your impact multiply as employees donate and you match their contributions automatically.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Companies Choose Altrue</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Automated Matching</h3>
                <p className="text-sm text-gray-600">Set rules once and let our platform handle the rest.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Employee Engagement</h3>
                <p className="text-sm text-gray-600">Gamified giving with rewards and leaderboards.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">ESG Reporting</h3>
                <p className="text-sm text-gray-600">Generate detailed impact reports for stakeholders.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">1,200+ Verified Nonprofits</h3>
                <p className="text-sm text-gray-600">Access our curated network of charitable organizations.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-teal-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Easy Administration</h3>
                <p className="text-sm text-gray-600">Simple dashboard for managing budgets and campaigns.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-time Analytics</h3>
                <p className="text-sm text-gray-600">Track your impact with detailed metrics and insights.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  "Altrue helped us 3x our employee giving participation. The matching campaigns created real excitement in our office."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <div className="font-semibold">Sarah Chen</div>
                    <div className="text-sm text-gray-500">VP of People, TechCorp</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  "The ESG reports we generate from Altrue have become a key part of our annual sustainability report."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <div className="font-semibold">Michael Rodriguez</div>
                    <div className="text-sm text-gray-500">CSR Director, Global Inc</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  "Our employees love the rewards program. It's gamified giving in a way that feels authentic, not forced."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <div className="font-semibold">Emily Watson</div>
                    <div className="text-sm text-gray-500">CEO, StartupXYZ</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-rose-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Amplify Your Impact?
          </h2>
          <p className="text-rose-100 text-lg mb-8">
            Join hundreds of companies making a difference. Applications reviewed within 24-48 hours.
          </p>
          <Link href="/company/apply">
            <Button size="lg" variant="secondary" className="gap-2">
              Start Your Application <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
              <span className="text-white font-semibold">Altrue</span>
            </div>
            <div className="text-sm">
              © 2024 Altrue. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
