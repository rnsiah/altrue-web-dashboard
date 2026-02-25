'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Heart, Users, Building2, TrendingUp, CheckCircle, ArrowRight,
  Globe, Handshake, FileText, DollarSign, Gift, Shield,
  Star, Zap, Award, Target
} from 'lucide-react'

const stats = [
  { value: '$2.4M+', label: 'Total Raised' },
  { value: '15,000+', label: 'Active Donors' },
  { value: '200+', label: 'Verified Nonprofits' },
  { value: '50+', label: 'Company Partners' },
]

const trustBadges = [
  { icon: Shield, text: '501(c)(3) Verified' },
  { icon: Shield, text: '256-bit SSL' },
  { icon: DollarSign, text: 'Transparent Fees' },
  { icon: CheckCircle, text: 'PCI DSS Compliant' },
]

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('donors')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="font-bold text-xl">Altrue</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 hidden sm:block">
                How It Works
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 hidden sm:block">
                Pricing
              </Link>
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#D4AF37]/10 via-white to-white">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-6 bg-[#D4AF37]/10 text-[#B8962E] hover:bg-[#D4AF37]/10 px-4 py-1">
            The Giving Platform for Everyone
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Your Donation,
            <br />
            <span className="text-[#D4AF37]">Multiplied.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join the only platform where companies match your gifts 2x, 5x, even 10x. 
            See exactly where every dollar goes and the lives you change.
          </p>
          
          {/* User Type Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="donors" className="gap-2">
                <Users className="h-4 w-4" /> I'm a Donor
              </TabsTrigger>
              <TabsTrigger value="nonprofits" className="gap-2">
                <Heart className="h-4 w-4" /> I'm a Nonprofit
              </TabsTrigger>
              <TabsTrigger value="companies" className="gap-2">
                <Building2 className="h-4 w-4" /> I'm a Company
              </TabsTrigger>
            </TabsList>

            <TabsContent value="donors" className="text-left">
              <Card className="border-[#D4AF37]/20 bg-[#D4AF37]/5">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-3">Turn $10 Into $100</h3>
                  <p className="text-gray-600 mb-6">
                    Stop donating alone. Our company partners match your gifts automatically—
                    multiplying your impact without spending another penny.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/register">
                      <Button size="lg" className="w-full sm:w-auto gap-2 bg-[#D4AF37] hover:bg-[#C4A035] text-white">
                        Start Giving Free <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="#how-it-works">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        See How Matching Works
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nonprofits" className="text-left">
              <Card className="border-[#2563EB]/20 bg-[#2563EB]/5">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-3">Stop Chasing Grants. Start Receiving.</h3>
                  <p className="text-gray-600 mb-6">
                    Connect with 15,000+ donors and 50+ company matching programs. 
                    We handle the paperwork—you focus on your mission. Free forever.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/nonprofit/apply">
                      <Button size="lg" className="w-full sm:w-auto gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
                        Get Verified Free <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/nonprofit">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        See Success Stories
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="companies" className="text-left">
              <Card className="border-[#D97706]/20 bg-[#D97706]/5">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-3">Launch CSR in 10 Minutes—Not 10 Months</h3>
                  <p className="text-gray-600 mb-6">
                    The only platform that automates employee matching, tracks ESG metrics, 
                    and proves ROI. 73% of employees prefer companies that give back.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/company/apply">
                      <Button size="lg" className="w-full sm:w-auto gap-2 bg-[#D97706] hover:bg-[#B45309] text-white">
                        Start Free Trial <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/company">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        View Pricing
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Altrue Works</h2>
            <p className="text-gray-600">Three simple steps to multiply your impact</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-[#D4AF37]" />
                </div>
                <h3 className="font-bold text-lg mb-2">1. Discover</h3>
                <p className="text-gray-600 text-sm">
                  Browse causes that matter—education, climate, health, poverty—all verified 501(c)(3).
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-[#D4AF37]" />
                </div>
                <h3 className="font-bold text-lg mb-2">2. Give</h3>
                <p className="text-gray-600 text-sm">
                  Donate any amount. Companies automatically match, amplifying your impact instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-[#D4AF37]" />
                </div>
                <h3 className="font-bold text-lg mb-2">3. Track Impact</h3>
                <p className="text-gray-600 text-sm">
                  Watch your giving come alive with real stories, photos, and lives changed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Altrue Works</h2>
            <p className="text-gray-600">Tools designed to maximize your impact</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Automatic Company Matching</h3>
                <p className="text-gray-600 text-sm">
                  Your $10 becomes $100 when companies match. No extra work—just amplified impact.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">100% Verified Nonprofits</h3>
                <p className="text-gray-600 text-sm">
                  Every organization is 501(c)(3) verified. Your money goes exactly where you send it.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">See Your Impact</h3>
                <p className="text-gray-600 text-sm">
                  Real photos, real stories, real results. Know exactly how you changed lives.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Earn Rewards</h3>
                <p className="text-gray-600 text-sm">
                  Unlock badges, streaks, and perks. Giving feels good—we make it feel great.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Give Together</h3>
                <p className="text-gray-600 text-sm">
                  Join team challenges with friends, family, or coworkers. Multiply your collective impact.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Instant Tax Receipts</h3>
                <p className="text-gray-600 text-sm">
                  Automatic tax-compliant receipts. No paperwork, no waiting, no hassle.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Donors, Nonprofits & Companies</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />)}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "I never thought my $20 could matter. Through Altrue matching, I've funded 3 scholarships this year. It actually feels like I'm making a difference."
                </p>
                <div>
                  <p className="font-semibold">Sarah M.</p>
                  <p className="text-sm text-gray-500">Donor since 2023</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />)}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "We went from $50K to $340K in our first year. Altrue's company matching partnerships did what 10 grant applications couldn't."
                </p>
                <div>
                  <p className="font-semibold">James Chen</p>
                  <p className="text-sm text-gray-500">Executive Director, Education Forward</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />)}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Employee engagement increased 40% after launching our CSR program. The automated matching saves us 20 hours a month."
                </p>
                <div>
                  <p className="font-semibold">Lisa Rodriguez</p>
                  <p className="text-sm text-gray-500">VP People, TechCorp</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8">
            {trustBadges.map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-gray-600">
                <badge.icon className="h-5 w-5 text-[#22C55E]" />
                <span className="font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600">No hidden fees. No surprises.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Donors */}
            <Card className="border-2 border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle>For Donors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">Free</div>
                <p className="text-gray-600 text-sm mb-4">Always free to give</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Free account
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Company matching
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Impact tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Tax receipts
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Nonprofits */}
            <Card className="border-2 border-[#2563EB]/20">
              <CardHeader>
                <CardTitle>For Nonprofits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">Free</div>
                <p className="text-gray-600 text-sm mb-4">3% transaction fee only</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Free profile page
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Unlimited projects
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Company partnerships
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Impact reporting
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Companies */}
            <Card className="border-2 border-[#D97706]/20">
              <CardHeader>
                <CardTitle>For Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">$0-999<span className="text-lg font-normal">/mo</span></div>
                <p className="text-gray-600 text-sm mb-4">Free tier available</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Free tier available
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Unlimited matching
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    ESG reporting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    API access (Pro+)
                  </li>
                </ul>
                <Link href="/company">
                  <Button variant="outline" className="w-full mt-4">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Is my donation tax-deductible?",
                a: "Yes! Every nonprofit on Altrue is 501(c)(3) verified. You receive instant tax receipts for every donation."
              },
              {
                q: "How does company matching work?",
                a: "Companies set a match ratio (e.g., 1:1, 2:1). When you donate $10, Altrue automatically processes an additional $10-$100 from the company's fund. You don't do anything extra."
              },
              {
                q: "What percentage reaches the nonprofit?",
                a: "97% for individual donors (3% fee). Companies on Pro/Enterprise plans pay even lower fees (0.5-1%), meaning more impact per dollar."
              },
              {
                q: "Is there a mobile app?",
                a: "Yes! Available on iOS and Android. Donate, track impact, and manage your giving on the go."
              },
              {
                q: "How long does nonprofit verification take?",
                a: "Our team reviews applications within 24-48 hours to verify 501(c)(3) status. Once approved, you're live and ready to receive donations."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#D4AF37]">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Multiply Your Impact?</h2>
          <p className="text-white/90 mb-8">
            Join thousands of donors, nonprofits, and companies already making a difference on Altrue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/nonprofit/apply">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#D4AF37]">
                Register Nonprofit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-[#D4AF37] fill-[#D4AF37]" />
                <span className="font-bold text-xl">Altrue</span>
              </div>
              <p className="text-gray-600 text-sm">
                The giving platform that multiplies your impact through company matching.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Donors</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/register" className="hover:text-[#D4AF37]">Sign Up</Link></li>
                <li><Link href="#features" className="hover:text-[#D4AF37]">How It Works</Link></li>
                <li><Link href="#pricing" className="hover:text-[#D4AF37]">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Nonprofits</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/nonprofit/apply" className="hover:text-[#D4AF37]">Apply</Link></li>
                <li><Link href="/nonprofit" className="hover:text-[#D4AF37]">Learn More</Link></li>
                <li><Link href="#" className="hover:text-[#D4AF37]">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Companies</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/company" className="hover:text-[#D4AF37]">CSR Solutions</Link></li>
                <li><Link href="/company/apply" className="hover:text-[#D4AF37]">Get Started</Link></li>
                <li><Link href="#" className="hover:text-[#D4AF37]">Pricing</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-gray-600 text-sm">
            <p>© 2024 Altrue Global. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
