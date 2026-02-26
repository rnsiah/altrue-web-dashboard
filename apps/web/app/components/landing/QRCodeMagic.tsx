'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Smartphone, Share2, TrendingUp, Users, ArrowRight, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function QRCodeMagic() {
  const [scanCount, setScanCount] = useState(1247);
  const [recentScans, setRecentScans] = useState<string[]>([]);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    const cities = ['New York', 'London', 'Tokyo', 'Berlin', 'Sydney', 'Toronto', 'Paris', 'Singapore'];
    
    const interval = setInterval(() => {
      setScanCount(prev => prev + 1);
      setShowPulse(true);
      setRecentScans(prev => [cities[Math.floor(Math.random() * cities.length)], ...prev.slice(0, 4)]);
      setTimeout(() => setShowPulse(false), 500);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-32 bg-[#0A0A0A] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-semibold uppercase tracking-wider mb-4">
            <Scan className="w-4 h-4" />
            Viral Impact
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Turn Every Scan Into
            <span className="text-[#D4AF37]"> Support</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Our unique QR code technology turns everyday moments into fundraising opportunities. 
            Wear your cause. Share your story. Multiply your impact.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative mx-auto w-72 sm:w-80">
              {/* Phone Frame */}
              <div className="relative bg-[#111111] rounded-[3rem] p-3 border border-white/10 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#111111] rounded-b-2xl" />
                
                {/* Screen */}
                <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] rounded-[2.5rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="h-8 flex items-center justify-between px-6 pt-2">
                    <span className="text-white text-xs">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 bg-white rounded-sm" />
                      <div className="w-3 h-2 bg-white rounded-sm" />
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="p-6">
                    {/* QR Code */}
                    <motion.div
                      className="aspect-square bg-white rounded-2xl p-4 mb-6 relative"
                      whileHover={{ scale: 1.02 }}
                      animate={showPulse ? { scale: [1, 1.05, 1] } : {}}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <QrCodePattern />
                      </div>
                      
                      {/* Scan Animation */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent"
                        animate={{ y: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                    </motion.div>

                    {/* Info */}
                    <div className="text-center">
                      <p className="text-white font-semibold mb-1">Education Forward</p>
                      <p className="text-white/50 text-sm mb-4">Scan to support scholarships</p>
                      
                      {/* Scan Count */}
                      <div className="bg-[#D4AF37]/10 rounded-xl p-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Scan className="w-5 h-5 text-[#D4AF37]" />
                          <span className="text-[#D4AF37] font-bold text-2xl">
                            {scanCount.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-white/50 text-xs">Total scans this month</p>
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="h-1 w-24 bg-white/20 rounded-full mx-auto mb-2" />
                </div>
              </div>

              {/* Floating Stats */}
              <motion.div
                className="absolute -top-4 -right-8 bg-[#111111] rounded-2xl p-4 border border-white/10 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-white font-bold">$4,240</p>
                    <p className="text-white/50 text-xs">Raised from scans</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-8 bg-[#111111] rounded-2xl p-4 border border-white/10 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-white font-bold">89 donors</p>
                    <p className="text-white/50 text-xs">From QR codes</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              The Viral Loop of
              <span className="text-[#D4AF37]"> Wearable Impact</span>
            </h3>

            <div className="space-y-6 mb-8">
              {[
                {
                  icon: Smartphone,
                  title: 'Unique QR Codes',
                  desc: 'Every Altrue apparel item comes with a custom QR code linking directly to your nonprofit profile or cause.',
                  color: '#D4AF37',
                },
                {
                  icon: Share2,
                  title: 'Walking Billboards',
                  desc: 'Wearers become advocates. Every shirt, hat, or accessory becomes a conversation starter about your cause.',
                  color: '#3B82F6',
                },
                {
                  icon: TrendingUp,
                  title: 'Real-Time Donations',
                  desc: 'When someone scans, they can donate instantly. Track every scan and conversion in your dashboard.',
                  color: '#22C55E',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                    <p className="text-white/50 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-[#111111] rounded-2xl p-6 border border-white/5 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-white/50 text-sm">Live scans</span>
              </div>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {recentScans.map((city, i) => (
                    <motion.div
                      key={`${city}-${i}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-white/70">Someone in {city}</span>
                      <span className="text-[#D4AF37] text-xs">just scanned</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {recentScans.length === 0 && (
                  <p className="text-white/30 text-sm">Waiting for scans...</p>
                )}
              </div>
            </div>

            <Link href="/shop">
              <Button
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#C4A035] text-black font-semibold px-8 group"
              >
                Shop Altrue Apparel
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function QrCodePattern() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <pattern id="qrPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="10" height="10" fill="white" />
          <rect x="2" y="2" width="6" height="6" fill="#0A0A0A" />
        </pattern>
      </defs>
      
      {/* Position markers */}
      <rect x="5" y="5" width="25" height="25" fill="#0A0A0A" />
      <rect x="8" y="8" width="19" height="19" fill="white" />
      <rect x="11" y="11" width="13" height="13" fill="#0A0A0A" />
      
      <rect x="70" y="5" width="25" height="25" fill="#0A0A0A" />
      <rect x="73" y="8" width="19" height="19" fill="white" />
      <rect x="76" y="11" width="13" height="13" fill="#0A0A0A" />
      
      <rect x="5" y="70" width="25" height="25" fill="#0A0A0A" />
      <rect x="8" y="73" width="19" height="19" fill="white" />
      <rect x="11" y="76" width="13" height="13" fill="#0A0A0A" />
      
      {/* Data modules */}
      {Array.from({ length: 20 }).map((_, i) => (
        Array.from({ length: 20 }).map((_, j) => {
          if (
            (i < 4 && j < 4) || 
            (i > 15 && j < 4) || 
            (i < 4 && j > 15)
          ) return null;
          
          const x = 5 + j * 4.5;
          const y = 5 + i * 4.5;
          const size = 3.5;
          const show = Math.random() > 0.5;
          
          return show ? (
            <rect key={`${i}-${j}`} x={x} y={y} width={size} height={size} fill="#0A0A0A" rx="0.5" />
          ) : null;
        })
      ))}
      
      {/* Center logo */}
      <circle cx="50" cy="50" r="10" fill="#D4AF37" />
      <text x="50" y="55" textAnchor="middle" fill="#0A0A0A" fontSize="12" fontWeight="bold">A</text>
    </svg>
  );
}
