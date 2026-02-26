'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, Heart, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const WORLDS = [
  {
    id: 'donors',
    title: 'For Changemakers',
    subtitle: 'I WANT TO MAKE AN IMPACT',
    icon: User,
    color: '#D4AF37',
    quote: '"I gave $50 and it turned into $200. I watched in real-time as companies matched my gift. Now I\'m hooked."',
    features: [
      'Automatic company matching',
      'Track every dollar\'s journey',
      'Earn points & unlock rewards',
      'Share your impact story',
    ],
    cta: 'Join as a Changemaker',
    ctaLink: '/register',
    gradient: 'from-[#D4AF37]/20 to-transparent',
  },
  {
    id: 'nonprofits',
    title: 'For Heroes',
    subtitle: 'I RUN A NONPROFIT',
    icon: Heart,
    color: '#3B82F6',
    quote: '"We received $50K in matched donations last quarter. Altrue\'s corporate network changed our fundraising."',
    features: [
      'Company partnership matching',
      'QR code campaigns',
      'Real-time donation dashboard',
      'Supporter engagement tools',
    ],
    cta: 'Register Your Nonprofit',
    ctaLink: '/nonprofit/apply',
    gradient: 'from-[#3B82F6]/20 to-transparent',
  },
  {
    id: 'companies',
    title: 'For Leaders',
    subtitle: 'I LEAD A COMPANY',
    icon: Building2,
    color: '#F59E0B',
    quote: '"Our employees love seeing their donations matched 10x. It\'s become part of our culture."',
    features: [
      'Flexible matching programs',
      'Employee engagement portal',
      'Impact reporting & storytelling',
      'Cause marketing amplification',
    ],
    cta: 'Launch Your Program',
    ctaLink: '/company/apply',
    gradient: 'from-[#F59E0B]/20 to-transparent',
  },
];

export function ThreeWorlds() {
  const [activeWorld, setActiveWorld] = useState('donors');
  const currentWorld = WORLDS.find((w) => w.id === activeWorld) || WORLDS[0];

  return (
    <section className="relative py-32 bg-[#0A0A0A] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">
            One Platform, Three Worlds
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4">
            Built for Everyone Who Cares
          </h2>
        </motion.div>

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {WORLDS.map((world) => (
            <button
              key={world.id}
              onClick={() => setActiveWorld(world.id)}
              className={`relative px-6 py-3 rounded-full font-medium transition-all ${
                activeWorld === world.id
                  ? 'text-black'
                  : 'text-white/60 hover:text-white bg-white/5'
              }`}
            >
              {activeWorld === world.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#D4AF37] rounded-full"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <world.icon className="h-4 w-4" />
                {world.title}
              </span>
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {WORLDS.map((world, index) => {
            const Icon = world.icon;
            const isActive = world.id === activeWorld;

            return (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveWorld(world.id)}
                className={`relative group cursor-pointer rounded-3xl overflow-hidden transition-all duration-500 ${
                  isActive ? 'md:scale-105' : 'md:hover:scale-102'
                }`}
                style={{
                  perspective: '1000px',
                }}
              >
                <motion.div
                  className={`relative h-full bg-gradient-to-b ${world.gradient} backdrop-blur-sm border border-white/10 rounded-3xl p-8 transition-all duration-500 ${
                    isActive ? 'border-opacity-30' : 'border-opacity-5'
                  }`}
                  animate={{
                    rotateY: isActive ? 0 : index === 0 ? -5 : index === 2 ? 5 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                  whileHover={{
                    rotateY: 0,
                    transition: { duration: 0.3 },
                  }}
                >
                  {/* Glow effect for active card */}
                  {isActive && (
                    <motion.div
                      layoutId="cardGlow"
                      className="absolute inset-0 rounded-3xl"
                      style={{
                        boxShadow: `0 0 60px ${world.color}20, inset 0 0 60px ${world.color}10`,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${world.color}15` }}
                  >
                    <Icon className="h-7 w-7" style={{ color: world.color }} />
                  </div>

                  {/* Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={world.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p
                        className="text-xs font-bold uppercase tracking-wider mb-2"
                        style={{ color: world.color }}
                      >
                        {world.subtitle}
                      </p>
                      <h3 className="text-2xl font-bold text-white mb-4">{world.title}</h3>

                      <blockquote className="text-white/60 italic mb-6 text-sm leading-relaxed">
                        {world.quote}
                      </blockquote>

                      <div className="space-y-3 mb-8">
                        {world.features.map((feature, i) => (
                          <motion.div
                            key={feature}
                            className="flex items-center gap-2 text-sm text-white/80"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <CheckCircle
                              className="h-4 w-4 flex-shrink-0"
                              style={{ color: world.color }}
                            />
                            {feature}
                          </motion.div>
                        ))}
                      </div>

                      <Link href={world.ctaLink} onClick={(e) => e.stopPropagation()}>
                        <Button
                          className="w-full group/btn font-semibold"
                          style={{
                            backgroundColor: isActive ? world.color : 'transparent',
                            color: isActive ? '#000' : world.color,
                            borderColor: world.color,
                          }}
                          variant={isActive ? 'default' : 'outline'}
                        >
                          {world.cta}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
