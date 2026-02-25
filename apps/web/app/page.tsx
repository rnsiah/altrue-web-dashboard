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
              <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-rose-50 via-white to-white">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-6 bg-rose-100 text-rose-700 hover:bg-rose-100 px-4 py-1">
            The Giving Platform for Everyone
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Make an Impact.
            <br />
            <span className="text-rose-500">See the Difference.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Whether you're a donor, company, or nonprofit — Altrue connects you to the causes that matter and amplifies every dollar.
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
              <Card className="border-rose-200 bg-rose-50/50">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-3">Make Every Dollar Count</h3>
                  <p className="text-gray-600 mb-6">
                    Join thousands of donors turning small gifts into massive impact. 
                    Company matching means your $10 becomes $20, $50, or even $100.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/register">
                      <Button size="lg" className="w-full sm:w-auto gap-2">
                        Start Giving Today <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="#how-it-works">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        See How It Works
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nonprofits" className="text-left">
              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-3">Get Funded by People + Companies</h3>
                  <p className="text-gray-600 mb-6">
                    Stop chasing grants. Connect with thousands of donors and corporate 
                    matching programs that want to fund your mission. Free to join.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/nonprofit/apply">
                      <Button size="lg" className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700">
                        Create Free Profile <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/nonprofit">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="companies" className="text-left">
              <Card className="border-amber-200 bg-amber-50/50">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-3">Launch CSR in 10 Minutes</h3>
                  <p className="text-gray-600 mb-6">
                    The easiest way to launch, manage, and measure your corporate social 
                    responsibility program. Turn employee giving into a competitive advantage.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/company/apply">
                      <Button size="lg" className="w-full sm:w-auto gap-2 bg-amber-600 hover:bg-amber-700">
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
            <p className="text-gray-600">Three simple steps to amplify your impact</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-rose-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">1. Discover</h3>
                <p className="text-gray-600 text-sm">
                  Browse causes that matter to you — education, climate, health, poverty, and more.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-rose-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">2. Give</h3>
                <p className="text-gray-600 text-sm">
                  Donate any amount. Companies automatically match, amplifying your impact 2x, 5x, or more.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-rose-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">3. Track Impact</h3>
                <p className="text-gray-600 text-sm">
                  Watch your giving history come alive with real-time stats, stories, and lives changed.
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
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Everyone</h2>
            <p className="text-gray-600">Tools designed to maximize your impact</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Company Matching</h3>
                <p className="text-gray-600 text-sm">
                  Your donations automatically matched by corporate partners. $10 becomes $100.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Verified Nonprofits</h3>
                <p className="text-gray-600 text-sm">
                  Every nonprofit is 501(c)(3) verified. Your money goes to legitimate causes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Impact Reports</h3>
                <p className="text-gray-600 text-sm">
                  See exactly where your money goes. Real stories, real impact, full transparency.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Earn Rewards</h3>
                <p className="text-gray-600 text-sm">
                  Unlock badges, streaks, and perks for consistent giving. Gamify your generosity.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Team Challenges</h3>
                <p className="text-gray-600 text-sm">
                  Join donation challenges with friends, family, or coworkers. Multiply your impact.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-teal-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Instant Tax Receipts</h3>
                <p className="text-gray-600 text-sm">
                  Automatic tax-compliant receipts for every donation. No paperwork, no hassle.
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
            <h2 className="text-3xl font-bold mb-4">Loved by Donors, Nonprofits & Companies</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "I never thought my $20 could matter. Through Altrue, it's turned into $200 with company matches. I've funded 3 scholarships this year alone."
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
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "We went from $50K annual donations to $340K in our first year on Altrue. The company matching feature alone doubled our revenue."
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
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Our employee engagement increased 40% after launching our CSR program on Altrue. The automated matching saves us countless hours."
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
                <badge.icon className="h-5 w-5 text-green-500" />
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
            <Card className="border-2 border-rose-200">
              <CardHeader>
                <CardTitle>For Donors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">Free</div>
                <p className="text-gray-600 text-sm mb-4">Always free to give</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Free account
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Company matching
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Impact tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Tax receipts
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Nonprofits */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle>For Nonprofits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">Free</div>
                <p className="text-gray-600 text-sm mb-4">3% transaction fee</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Free profile page
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Unlimited projects
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Company partnerships
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Impact reporting
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Companies */}
            <Card className="border-2 border-amber-200">
              <CardHeader>
                <CardTitle>For Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">$0-999<span className="text-lg font-normal">/mo</span></div>
                <p className="text-gray-600 text-sm mb-4">Free to start</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Free tier available
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Unlimited matching
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    ESG reporting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
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
                a: "Yes! All nonprofits on Altrue are 501(c)(3) verified. You'll receive automatic tax receipts for every donation."
              },
              {
                q: "How does company matching work?",
                a: "Companies set a budget and match ratio (e.g., 1:1, 2:1). When an employee donates, Altrue automatically processes the match from the company's wallet."
              },
              {
                q: "What percentage goes to the nonprofit?",
                a: "For individual donors: 97% goes to the nonprofit (3% fee). For companies on Pro/Enterprise plans, fees are even lower (0.5-1%)."
              },
              {
                q: "Is there a mobile app?",
                a: "Yes! Available on iOS and Android. Donate, track impact, and manage campaigns on the go."
              },
              {
                q: "How long does nonprofit verification take?",
                a: "Our team reviews applications within 24-48 hours to verify 501(c)(3) status."
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-rose-500">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-rose-100 mb-8">
            Join thousands of donors, nonprofits, and companies already making an impact on Altrue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/nonprofit/apply">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-rose-500">
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
                <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
                <span className="font-bold text-xl">Altrue</span>
              </div>
              <p className="text-gray-600 text-sm">
                The giving platform that connects donors, companies, and nonprofits to maximize impact.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Donors</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/register" className="hover:text-rose-500">Sign Up</Link></li>
                <li><Link href="#features" className="hover:text-rose-500">How It Works</Link></li>
                <li><Link href="#pricing" className="hover:text-rose-500">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Nonprofits</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/nonprofit/apply" className="hover:text-rose-500">Apply</Link></li>
                <li><Link href="/nonprofit" className="hover:text-rose-500">Learn More</Link></li>
                <li><Link href="#" className="hover:text-rose-500">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Companies</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/company" className="hover:text-rose-500">CSR Solutions</Link></li>
                <li><Link href="/company/apply" className="hover:text-rose-500">Get Started</Link></li>
                <li><Link href="#" className="hover:text-rose-500">Pricing</Link></li>
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
