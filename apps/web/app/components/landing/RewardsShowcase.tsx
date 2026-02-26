'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, Star, Zap, Gift, Crown, ChevronRight, Sparkles } from 'lucide-react';

const LEVELS = [
  {
    level: 1,
    name: 'Seedling',
    color: '#22C55E',
    minPoints: 0,
    maxPoints: 499,
    icon: '🌱',
    perks: ['Basic profile badge', 'Access to leaderboards'],
  },
  {
    level: 2,
    name: 'Sprout',
    color: '#3B82F6',
    minPoints: 500,
    maxPoints: 1499,
    icon: '🌿',
    perks: ['Sprout badge', '5% bonus on matched donations', 'Early access to new causes'],
  },
  {
    level: 3,
    name: 'Guardian',
    color: '#F59E0B',
    minPoints: 1500,
    maxPoints: 3999,
    icon: '🛡️',
    perks: ['Guardian badge', '10% bonus on matched donations', 'Exclusive NFT rewards', 'VIP support'],
  },
  {
    level: 4,
    name: 'Champion',
    color: '#D4AF37',
    minPoints: 4000,
    maxPoints: 9999,
    icon: '👑',
    perks: ['Champion badge', '20% bonus on matched donations', 'Private events access', 'Founding member status'],
  },
  {
    level: 5,
    name: 'Legend',
    color: '#A855F7',
    minPoints: 10000,
    maxPoints: Infinity,
    icon: '🏆',
    perks: ['Legend badge', 'Unlimited matching bonus', 'Annual gala invitation', 'Board advisory access', 'Lifetime perks'],
  },
];

const CURRENT_POINTS = 875;

export function RewardsShowcase() {
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const currentLevel = LEVELS.find(l => CURRENT_POINTS >= l.minPoints && CURRENT_POINTS <= l.maxPoints) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  const progress = nextLevel 
    ? ((CURRENT_POINTS - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  return (
    <section id="rewards" className="relative py-32 bg-[#0A0A0A] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#D4AF37]/5 to-transparent rounded-full" />
      </div>

      {/* Animated stars */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D4AF37] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-semibold uppercase tracking-wider mb-4">
            <Trophy className="w-4 h-4" />
            Gamified Giving
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Level Up Your
            <span className="text-[#D4AF37]"> Impact</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Every donation, quiz, and share earns you points. Level up to unlock exclusive perks, bonuses, and recognition.
          </p>
        </motion.div>

        {/* Current Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="bg-gradient-to-br from-[#111111] to-[#0A0A0A] rounded-3xl p-8 border border-white/5 relative overflow-hidden">
            {/* Glow effect */}
            <div 
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: currentLevel.color }}
            />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                {/* Level Badge */}
                <motion.div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl"
                  style={{ backgroundColor: `${currentLevel.color}20` }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {currentLevel.icon}
                </motion.div>

                <div className="text-center sm:text-left flex-1">
                  <p className="text-white/50 text-sm mb-1">Your Current Level</p>
                  <h3 className="text-3xl font-bold text-white mb-2" style={{ color: currentLevel.color }}>
                    {currentLevel.name}
                  </h3>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Star className="w-4 h-4 text-[#D4AF37]" fill="#D4AF37" />
                    <span className="text-white font-semibold">{CURRENT_POINTS.toLocaleString()}</span>
                    <span className="text-white/50">points</span>
                  </div>
                </div>

                {nextLevel && (
                  <div className="text-center">
                    <p className="text-white/50 text-sm mb-1">Next Level</p>
                    <div className="flex items-center gap-2 text-white/70">
                      <span className="text-2xl">{nextLevel.icon}</span>
                      <span className="font-semibold">{nextLevel.name}</span>
                    </div>
                    <p className="text-xs text-white/40 mt-1">
                      {nextLevel.minPoints - CURRENT_POINTS} points to go
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {nextLevel && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/50">Progress to {nextLevel.name}</span>
                    <span className="text-[#D4AF37] font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: currentLevel.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )}

              {/* Current Perks */}
              <div className="grid sm:grid-cols-2 gap-4">
                {currentLevel.perks.map((perk, i) => (
                  <motion.div
                    key={perk}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-white/70"
                  >
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${currentLevel.color}30` }}
                    >
                      <Check className="w-3 h-3" style={{ color: currentLevel.color }} />
                    </div>
                    <span className="text-sm">{perk}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Level Progression */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-white text-center mb-8">All Levels</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {LEVELS.map((level, index) => {
              const isUnlocked = CURRENT_POINTS >= level.minPoints;
              const isNext = nextLevel?.level === level.level;

              return (
                <motion.div
                  key={level.level}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredLevel(level.level)}
                  onMouseLeave={() => setHoveredLevel(null)}
                  className={`relative rounded-2xl p-4 border transition-all cursor-pointer ${
                    isUnlocked
                      ? 'bg-[#111111] border-white/10'
                      : 'bg-[#0A0A0A] border-white/5 opacity-60'
                  } ${isNext ? 'ring-2 ring-[#D4AF37]/50' : ''}`}
                >
                  {/* Locked indicator */}
                  {!isUnlocked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-4 h-4 text-white/30" />
                    </div>
                  )}

                  {/* Level Icon */}
                  <div className="text-center mb-3">
                    <motion.div
                      className={`w-16 h-16 rounded-xl mx-auto flex items-center justify-center text-3xl mb-2 ${
                        isUnlocked ? '' : 'grayscale'
                      }`}
                      style={{ backgroundColor: isUnlocked ? `${level.color}20` : 'rgba(255,255,255,0.05)' }}
                      animate={hoveredLevel === level.level ? { scale: 1.1 } : {}}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {level.icon}
                    </motion.div>
                    <p 
                      className="font-bold"
                      style={{ color: isUnlocked ? level.color : 'rgba(255,255,255,0.4)' }}
                    >
                      {level.name}
                    </p>
                    <p className="text-xs text-white/40">
                      {level.minPoints.toLocaleString()}+ pts
                    </p>
                  </div>

                  {/* Perks Preview */}
                  <div className="space-y-1">
                    {level.perks.slice(0, 2).map((perk, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs text-white/50">
                        <Sparkles className="w-3 h-3" />
                        <span className="truncate">{perk}</span>
                      </div>
                    ))}
                    {level.perks.length > 2 && (
                      <p className="text-xs text-white/30">
                        +{level.perks.length - 2} more
                      </p>
                    )}
                  </div>

                  {/* Hover tooltip */}
                  <AnimatePresence>
                    {hoveredLevel === level.level && level.perks.length > 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-[#1A1A1A] rounded-xl border border-white/10 z-30"
                      >
                        <p className="text-white font-semibold text-sm mb-2">All Perks:</p>
                        {level.perks.map((perk, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-white/60 mb-1">
                            <Zap className="w-3 h-3 text-[#D4AF37]" />
                            {perk}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Check({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg 
      className={className} 
      style={style}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
