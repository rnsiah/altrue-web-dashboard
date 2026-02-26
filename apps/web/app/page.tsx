'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from './components/landing/HeroSection';
import { FloatingNav } from './components/landing/FloatingNav';
import { CustomCursor } from './components/landing/CustomCursor';
import { MultiplierCalculator } from './components/landing/MultiplierCalculator';
import { ThreeWorlds } from './components/landing/ThreeWorlds';
import { EcosystemConstellation } from './components/landing/EcosystemConstellation';
import { LiveImpactMap } from './components/landing/LiveImpactMap';
import { ImpactStories } from './components/landing/ImpactStories';
import { QuizDemo } from './components/landing/QuizDemo';
import { RewardsShowcase } from './components/landing/RewardsShowcase';
import { QRCodeMagic } from './components/landing/QRCodeMagic';
import { TrustSignals } from './components/landing/TrustSignals';
import { FinalCTA } from './components/landing/FinalCTA';

// Smooth scroll polyfill for older browsers
function useSmoothScroll() {
  useEffect(() => {
    // Handle anchor link clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);
}

// Page load animation wrapper
function SectionWrapper({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  useSmoothScroll();

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] overflow-x-hidden">
      {/* Custom Cursor - Desktop Only */}
      <CustomCursor />
      
      {/* Floating Navigation */}
      <FloatingNav />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Multiplier Calculator - How It Works */}
        <SectionWrapper>
          <MultiplierCalculator />
        </SectionWrapper>

        {/* Three Worlds - User Types */}
        <SectionWrapper>
          <ThreeWorlds />
        </SectionWrapper>

        {/* Ecosystem Constellation */}
        <SectionWrapper>
          <EcosystemConstellation />
        </SectionWrapper>

        {/* Live Impact Map */}
        <SectionWrapper>
          <LiveImpactMap />
        </SectionWrapper>

        {/* Impact Stories */}
        <SectionWrapper>
          <ImpactStories />
        </SectionWrapper>

        {/* Quiz Demo */}
        <SectionWrapper>
          <QuizDemo />
        </SectionWrapper>

        {/* Rewards Showcase */}
        <SectionWrapper>
          <RewardsShowcase />
        </SectionWrapper>

        {/* QR Code Magic */}
        <SectionWrapper>
          <QRCodeMagic />
        </SectionWrapper>

        {/* Trust Signals */}
        <SectionWrapper>
          <TrustSignals />
        </SectionWrapper>

        {/* Final CTA */}
        <FinalCTA />
      </main>

      {/* Simple Footer */}
      <footer className="bg-[#0A0A0A] border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <span className="font-bold text-xl text-white">Altrue</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                The giving platform that multiplies your impact through company matching.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">For Donors</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/register" className="text-white/50 hover:text-[#D4AF37] transition-colors">Sign Up</a></li>
                <li><a href="#how-it-works" className="text-white/50 hover:text-[#D4AF37] transition-colors">How It Works</a></li>
                <li><a href="#stories" className="text-white/50 hover:text-[#D4AF37] transition-colors">Success Stories</a></li>
                <li><a href="#rewards" className="text-white/50 hover:text-[#D4AF37] transition-colors">Rewards</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">For Nonprofits</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/nonprofit/apply" className="text-white/50 hover:text-[#D4AF37] transition-colors">Apply</a></li>
                <li><a href="/nonprofit" className="text-white/50 hover:text-[#D4AF37] transition-colors">Learn More</a></li>
                <li><a href="/shop" className="text-white/50 hover:text-[#D4AF37] transition-colors">QR Apparel</a></li>
                <li><a href="#" className="text-white/50 hover:text-[#D4AF37] transition-colors">Resources</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">For Companies</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/company" className="text-white/50 hover:text-[#D4AF37] transition-colors">CSR Solutions</a></li>
                <li><a href="/company/apply" className="text-white/50 hover:text-[#D4AF37] transition-colors">Get Started</a></li>
                <li><a href="#" className="text-white/50 hover:text-[#D4AF37] transition-colors">Pricing</a></li>
                <li><a href="#" className="text-white/50 hover:text-[#D4AF37] transition-colors">Enterprise</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-sm">
              © {new Date().getFullYear()} Altrue Global. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-white/30 hover:text-white/60 transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/30 hover:text-white/60 transition-colors">Terms of Service</a>
              <a href="#" className="text-white/30 hover:text-white/60 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
