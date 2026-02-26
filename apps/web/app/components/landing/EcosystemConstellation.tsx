'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { Gamepad2, Users, BookOpen, Shirt, Wallet, Trophy } from 'lucide-react';

const ECOSYSTEM_NODES = [
  {
    id: 'gamification',
    icon: Gamepad2,
    title: 'Gamification',
    description: 'Turn giving into a game. Earn points, level up, unlock achievements, compete on leaderboards.',
    position: { x: 50, y: 10 },
  },
  {
    id: 'social',
    icon: Users,
    title: 'Social',
    description: 'Follow friends. Share your journey. Build a following around causes you love.',
    position: { x: 10, y: 50 },
  },
  {
    id: 'education',
    icon: BookOpen,
    title: 'Education',
    description: 'Learn while you give. Interactive quizzes teach you about causes. Get points for getting educated.',
    position: { x: 90, y: 50 },
  },
  {
    id: 'wear',
    icon: Shirt,
    title: 'Wear Impact',
    description: 'Turn apparel into advocacy. QR-coded shirts let anyone scan and donate.',
    position: { x: 30, y: 90 },
  },
  {
    id: 'matching',
    icon: Wallet,
    title: 'Smart Matching',
    description: 'Our AI finds the best company matches for your donations. $10 becomes $100.',
    position: { x: 70, y: 90 },
  },
  {
    id: 'rewards',
    icon: Trophy,
    title: 'Rewards That Matter',
    description: 'Unlock exclusive perks from partner brands. Your generosity comes back to you.',
    position: { x: 50, y: 50 },
  },
];

function ConnectionLine({ start, end, delay }: { start: { x: number; y: number }; end: { x: number; y: number }; delay: number }) {
  const ref = useRef<SVGPathElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.path
      ref={ref}
      d={`M ${start.x}% ${start.y}% Q ${(start.x + end.x) / 2}% ${Math.min(start.y, end.y) - 20}% ${end.x}% ${end.y}%`}
      fill="none"
      stroke="url(#lineGradient)"
      strokeWidth="1"
      strokeDasharray="5,5"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={isInView ? { pathLength: 1, opacity: 0.5 } : {}}
      transition={{ duration: 1.5, delay, ease: 'easeInOut' }}
    />
  );
}

function Node({ node, index }: { node: typeof ECOSYSTEM_NODES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);
  const Icon = node.icon;

  return (
    <motion.div
      ref={ref}
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ delay: index * 0.15, type: 'spring', stiffness: 200 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative"
        animate={{
          y: isHovered ? -10 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#D4AF37] blur-xl"
          animate={{
            opacity: isHovered ? 0.4 : 0.2,
            scale: isHovered ? 1.5 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Node circle */}
        <motion.div
          className="relative w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/30 flex items-center justify-center cursor-pointer"
          animate={{
            borderColor: isHovered ? 'rgba(212, 175, 55, 0.8)' : 'rgba(212, 175, 55, 0.3)',
            boxShadow: isHovered
              ? '0 0 30px rgba(212, 175, 55, 0.4)'
              : '0 0 20px rgba(212, 175, 55, 0.1)',
          }}
        >
          <Icon className="h-6 w-6 text-[#D4AF37]" />
        </motion.div>

        {/* Label */}
        <motion.div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap text-center"
          animate={{ opacity: isHovered ? 1 : 0.7 }}
        >
          <p className="text-white font-semibold text-sm">{node.title}</p>
        </motion.div>

        {/* Expanded info on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-12 w-64 p-4 bg-[#1A1A1A] rounded-xl border border-[#D4AF37]/20 z-20"
            >
              <p className="text-white/80 text-sm leading-relaxed">{node.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function EcosystemConstellation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.8, 1]);

  return (
    <section ref={containerRef} className="relative py-32 bg-[#0A0A0A] overflow-hidden min-h-[150vh]">
      {/* Background stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div style={{ opacity, scale }} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider"
          >
            The Altrue Ecosystem
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6"
          >
            Everything Connects to
            <br />
            <span className="text-[#D4AF37]">Impact</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 max-w-2xl mx-auto"
          >
            Explore our interconnected ecosystem of features designed to maximize your giving potential.
          </motion.p>
        </div>

        {/* Constellation diagram */}
        <div className="relative h-[600px] md:h-[700px]">
          {/* SVG connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Central hub connections */}
            {ECOSYSTEM_NODES.filter(n => n.id !== 'rewards').map((node, i) => (
              <ConnectionLine
                key={node.id}
                start={node.position}
                end={{ x: 50, y: 50 }}
                delay={i * 0.2}
              />
            ))}
          </svg>

          {/* Central hub */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          >
            <motion.div
              className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8962E] flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 40px rgba(212, 175, 55, 0.3)',
                  '0 0 60px rgba(212, 175, 55, 0.5)',
                  '0 0 40px rgba(212, 175, 55, 0.3)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-black font-bold text-lg text-center leading-tight">
                ALTRUE
              </span>
            </motion.div>
          </motion.div>

          {/* Orbiting nodes */}
          {ECOSYSTEM_NODES.map((node, index) => (
            <Node key={node.id} node={node} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
