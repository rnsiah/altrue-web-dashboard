'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, FileCheck, Award, Globe, Server, Fingerprint } from 'lucide-react';

const TRUST_SIGNALS = [
  {
    icon: Shield,
    title: '501(c)(3) Verified',
    description: 'Every nonprofit is verified with the IRS before joining our platform.',
  },
  {
    icon: Lock,
    title: 'Bank-Level Security',
    description: '256-bit SSL encryption protects all your data and transactions.',
  },
  {
    icon: CheckCircle,
    title: 'PCI DSS Compliant',
    description: 'We meet the highest standards for payment card industry security.',
  },
  {
    icon: FileCheck,
    title: 'Transparent Fees',
    description: 'No hidden costs. Every fee is clearly displayed before you donate.',
  },
  {
    icon: Award,
    title: 'Certified B-Corp Pending',
    description: 'Committed to using business as a force for good.',
  },
  {
    icon: Server,
    title: 'SOC 2 Type II',
    description: 'Independent audits confirm our security and availability.',
  },
];

const STATS = [
  { value: '$2.4M+', label: 'Securely Processed' },
  { value: '99.99%', label: 'Uptime' },
  { value: '200+', label: 'Verified Partners' },
  { value: '0', label: 'Data Breaches' },
];

export function TrustSignals() {
  return (
    <section className="relative py-24 bg-[#0A0A0A] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/5 to-transparent" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 py-10 border-y border-white/5"
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl font-bold text-[#D4AF37] mb-2">{stat.value}</p>
              <p className="text-white/50 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-semibold uppercase tracking-wider mb-4">
            <Shield className="w-4 h-4" />
            Trust & Security
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Your Trust Is Our
            <span className="text-[#D4AF37]"> Foundation</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            We maintain the highest standards of security, transparency, and accountability 
            so you can give with complete confidence.
          </p>
        </motion.div>

        {/* Trust Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRUST_SIGNALS.map((signal, index) => (
            <motion.div
              key={signal.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/30 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4AF37]/20 transition-colors">
                  <signal.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">{signal.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{signal.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 pt-16 border-t border-white/5"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            {[
              { icon: Globe, text: 'Global Security' },
              { icon: Fingerprint, text: 'Biometric Ready' },
              { icon: Shield, text: 'Verified Safe' },
              { icon: Lock, text: 'Encrypted' },
            ].map((badge, i) => (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors"
              >
                <badge.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{badge.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
