'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Play } from 'lucide-react';

const STORIES = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Teacher & Changemaker',
    location: 'Denver, CO',
    quote: "I never thought my $20 could matter. Through Altrue matching, I've funded 3 scholarships this year. Watching those students succeed is worth more than any return on investment.",
    stats: { donated: '$1,240', matched: '$4,960', lives: '3 students' },
    image: '/images/story-1.jpg',
    videoThumbnail: true,
    color: '#D4AF37',
  },
  {
    id: 2,
    name: 'James Chen',
    role: 'Executive Director',
    organization: 'Education Forward',
    quote: "We went from $50K to $340K in our first year. Altrue's corporate matching partnerships did what 10 grant applications couldn't. Our programs have tripled in size.",
    stats: { raised: '$340K', donors: '2,400+', programs: '12 new' },
    image: '/images/story-2.jpg',
    videoThumbnail: true,
    color: '#3B82F6',
  },
  {
    id: 3,
    name: 'Lisa Rodriguez',
    role: 'VP of People',
    organization: 'TechCorp Inc.',
    quote: "Employee engagement increased 40% after launching our CSR program. The automated matching saves us 20 hours a month, and our team actually looks forward to giving back.",
    stats: { participation: '87%', matched: '$125K', satisfaction: '4.9/5' },
    image: '/images/story-3.jpg',
    videoThumbnail: true,
    color: '#F59E0B',
  },
];

function StoryCard({ story, index }: { story: typeof STORIES[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={cardRef}
      className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[50vw] lg:w-[40vw] max-w-2xl"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      <div className="relative h-full bg-gradient-to-br from-[#111111] to-[#0A0A0A] rounded-3xl overflow-hidden border border-white/5 group">
        {/* Video/Image Background */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"
            style={{
              backgroundImage: `linear-gradient(135deg, ${story.color}20 0%, transparent 50%)`,
            }}
          />
          
          {/* Abstract Pattern */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id={`pattern-${story.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill={story.color} opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#pattern-${story.id})`} />
            </svg>
          </div>

          {/* Play Button */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center cursor-pointer group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/50 transition-all">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="white" />
            </div>
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Quote */}
          <div className="relative mb-6">
            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[#D4AF37]/20" />
            <p className="text-white/80 text-base sm:text-lg leading-relaxed italic pl-6">
              "{story.quote}"
            </p>
          </div>

          {/* Author */}
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: `${story.color}30` }}
            >
              {story.name.charAt(0)}
            </div>
            <div>
              <p className="text-white font-semibold">{story.name}</p>
              <p className="text-white/50 text-sm">
                {story.role}{story.organization ? `, ${story.organization}` : ''}
                {story.location ? ` • ${story.location}` : ''}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
            {Object.entries(story.stats).map(([key, value], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-center"
              >
                <p className="text-[#D4AF37] font-bold text-lg sm:text-xl">{value}</p>
                <p className="text-white/40 text-xs uppercase tracking-wider">{key}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ImpactStories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.children[0]?.clientWidth || 600;
    const gap = 32;
    const scrollAmount = cardWidth + gap;
    const newIndex = direction === 'left' 
      ? Math.max(0, activeIndex - 1)
      : Math.min(STORIES.length - 1, activeIndex + 1);
    
    scrollRef.current.scrollTo({
      left: newIndex * scrollAmount,
      behavior: 'smooth',
    });
    setActiveIndex(newIndex);
  };

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section id="stories" ref={containerRef} className="relative py-32 bg-[#0A0A0A] overflow-hidden">
      {/* Background Elements */}
      <motion.div 
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20"
        style={{ 
          y,
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
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
          <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">
            Real Stories, Real Impact
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
            See What Others Are
            <span className="text-[#D4AF37]"> Achieving</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            From individual donors to global nonprofits, discover how Altrue is multiplying impact across the world.
          </p>
        </motion.div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20">
            <motion.button
              onClick={() => handleScroll('left')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-[#111111] border border-white/10 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          </div>
          <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20">
            <motion.button
              onClick={() => handleScroll('right')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-[#111111] border border-white/10 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Cards Container */}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide pb-8 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {STORIES.map((story, index) => (
              <div key={story.id} className="snap-center">
                <StoryCard story={story} index={index} />
              </div>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden justify-center gap-4 mt-6">
            <motion.button
              onClick={() => handleScroll('left')}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-[#111111] border border-white/10 flex items-center justify-center text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              onClick={() => handleScroll('right')}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-[#111111] border border-white/10 flex items-center justify-center text-white"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {STORIES.map((_, index) => (
              <motion.div
                key={index}
                className="h-1 rounded-full transition-all duration-300"
                animate={{
                  width: index === activeIndex ? 40 : 8,
                  backgroundColor: index === activeIndex ? '#D4AF37' : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
