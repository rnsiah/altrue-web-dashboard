'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const DONATION_AMOUNTS = [10, 25, 50, 100];
const CAUSES = [
  { name: 'Education', matchMultiplier: 4, icon: '📚' },
  { name: 'Health', matchMultiplier: 3, icon: '🏥' },
  { name: 'Climate', matchMultiplier: 5, icon: '🌱' },
  { name: 'Water', matchMultiplier: 3, icon: '💧' },
];

export function MultiplierCalculator() {
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedCause, setSelectedCause] = useState(CAUSES[0]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const totalImpact = selectedAmount * selectedCause.matchMultiplier;
  const companyMatch = totalImpact - selectedAmount;

  useEffect(() => {
    setIsCalculating(true);
    setShowResult(false);
    const timer = setTimeout(() => {
      setIsCalculating(false);
      setShowResult(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedAmount, selectedCause]);

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    const num = parseInt(value);
    if (!isNaN(num) && num > 0) {
      setSelectedAmount(num);
    }
  };

  return (
    <section id="how-it-works" className="relative py-32 bg-[#0A0A0A] overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Interactive Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-[#111111] rounded-3xl p-8 border border-white/5 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold text-white">Try It Yourself</h3>
              </div>

              {/* Amount Selection */}
              <div className="mb-8">
                <label className="text-white/60 text-sm mb-4 block">I want to give:</label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {DONATION_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={`px-6 py-3 rounded-xl font-medium transition-all ${
                        selectedAmount === amount && customAmount === ''
                          ? 'bg-[#D4AF37] text-black'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
                    <input
                      type="number"
                      placeholder="Custom"
                      value={customAmount}
                      onChange={(e) => handleCustomAmount(e.target.value)}
                      className="w-32 px-6 py-3 pl-8 rounded-xl bg-white/5 text-white placeholder-white/40 border border-transparent focus:border-[#D4AF37]/50 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Cause Selection */}
              <div className="mb-8">
                <label className="text-white/60 text-sm mb-4 block">To:</label>
                <div className="grid grid-cols-2 gap-3">
                  {CAUSES.map((cause) => (
                    <button
                      key={cause.name}
                      onClick={() => setSelectedCause(cause)}
                      className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                        selectedCause.name === cause.name
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                          : 'bg-white/5 text-white hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      <span>{cause.icon}</span>
                      {cause.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Visualization */}
              <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/5">
                <AnimatePresence mode="wait">
                  {isCalculating ? (
                    <motion.div
                      key="calculating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-32 flex items-center justify-center"
                    >
                      <motion.div
                        className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-white/60 text-sm mb-4">Your ${selectedAmount} becomes:</p>
                      
                      {/* Flow visualization */}
                      <div className="space-y-3 mb-6">
                        <motion.div
                          className="flex items-center gap-3"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <span className="text-2xl">💰</span>
                          <div className="flex-1">
                            <div className="text-white font-medium">You</div>
                            <div className="text-[#D4AF37]">${selectedAmount}</div>
                          </div>
                        </motion.div>
                        
                        <motion.div
                          className="flex items-center gap-3"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="w-8 flex justify-center">
                            <motion.div
                              animate={{ y: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <ArrowRight className="h-4 w-4 text-white/30 rotate-90" />
                            </motion.div>
                          </div>
                          <div className="flex-1">
                            <span className="text-white/40 text-sm">+ Company Matching</span>
                          </div>
                        </motion.div>
                        
                        <motion.div
                          className="flex items-center gap-3"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <span className="text-2xl">🏢</span>
                          <div className="flex-1">
                            <div className="text-white font-medium">Partner Companies</div>
                            <div className="text-[#D4AF37]">+${companyMatch}</div>
                          </div>
                        </motion.div>
                      </div>

                      <div className="border-t border-white/10 pt-4">
                        <motion.div
                          className="text-center"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.4, type: 'spring' }}
                        >
                          <p className="text-white/60 text-sm mb-1">Total Impact</p>
                          <motion.p
                            className="text-5xl font-bold text-[#D4AF37]"
                            animate={{
                              textShadow: [
                                '0 0 20px rgba(212, 175, 55, 0)',
                                '0 0 40px rgba(212, 175, 55, 0.5)',
                                '0 0 20px rgba(212, 175, 55, 0)',
                              ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            ${totalImpact.toLocaleString()}
                          </motion.p>
                          <p className="text-white/40 text-sm mt-2">
                            That&apos;s {selectedCause.matchMultiplier}x your original gift
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Right side - Explanation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span
              className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              The Multiplier Effect
            </motion.span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6 leading-tight">
              Stop Donating Alone.
              <br />
              <span className="text-[#D4AF37]">Start Multiplying.</span>
            </h2>
            <p className="text-lg text-white/60 mb-8 leading-relaxed">
              Traditional giving is 1:1. You give $10, the cause gets $10.
              With Altrue, companies compete to match your donation—turning
              your generosity into a movement.
            </p>

            <div className="space-y-6 mb-10">
              {[
                { icon: '💡', title: 'Smart Matching', desc: 'Our AI finds the best company matches for your donation' },
                { icon: '⚡', title: 'Instant Results', desc: 'See your impact multiply in real-time as you donate' },
                { icon: '🌍', title: 'Maximum Impact', desc: 'Every dollar goes 2-10x further with corporate partners' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                    <p className="text-white/50">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/register">
              <Button
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#C4A035] text-black font-semibold px-8 group"
              >
                Make Your First Multiplied Donation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
