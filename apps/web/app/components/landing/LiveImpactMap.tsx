'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Heart } from 'lucide-react';

// Mock donation data
const LOCATIONS = [
  { city: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, amount: 250, cause: 'Education' },
  { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, amount: 100, cause: 'Climate' },
  { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, amount: 500, cause: 'Health' },
  { city: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, amount: 50, cause: 'Water' },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, amount: 150, cause: 'Education' },
  { city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, amount: 200, cause: 'Climate' },
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, amount: 300, cause: 'Health' },
  { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, amount: 75, cause: 'Water' },
  { city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, amount: 180, cause: 'Education' },
  { city: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, amount: 120, cause: 'Health' },
];

const CAUSE_COLORS: Record<string, string> = {
  Education: '#3B82F6',
  Health: '#EF4444',
  Climate: '#22C55E',
  Water: '#06B6D4',
};

interface Donation {
  id: number;
  location: typeof LOCATIONS[0];
  timestamp: number;
}

function Dot({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute w-3 h-3 rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        backgroundColor: color,
        boxShadow: `0 0 20px ${color}, 0 0 40px ${color}50`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1.5, 1],
        opacity: [0, 1, 0.8],
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut',
      }}
    />
  );
}

function PulseRing({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-8 h-8 rounded-full border-2 border-[#D4AF37]/50"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0.5, opacity: 1 }}
      animate={{
        scale: [0.5, 2, 2.5],
        opacity: [1, 0.5, 0],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  );
}

export function LiveImpactMap() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const idCounter = useRef(0);

  // Convert lat/lng to x/y percentages (simplified projection)
  const latLngToXY = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  useEffect(() => {
    // Add initial donations
    const initial = LOCATIONS.slice(0, 5).map((loc, i) => ({
      id: idCounter.current++,
      location: loc,
      timestamp: Date.now() - i * 1000,
    }));
    setDonations(initial);
    setRecentDonations(initial);

    // Add new donations periodically
    const interval = setInterval(() => {
      const randomLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const newDonation: Donation = {
        id: idCounter.current++,
        location: randomLoc,
        timestamp: Date.now(),
      };

      setDonations((prev) => [...prev.slice(-15), newDonation]);
      setRecentDonations((prev) => [newDonation, ...prev.slice(0, 4)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-32 bg-[#0A0A0A] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">
            Real-Time Impact
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4">
            Impact Happening
            <span className="text-[#D4AF37]"> Right Now</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-2 relative aspect-[16/10] bg-[#111111] rounded-3xl overflow-hidden border border-white/5"
          >
            {/* World map outline (simplified SVG) */}
            <svg
              viewBox="0 0 1000 500"
              className="absolute inset-0 w-full h-full opacity-20"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Simplified continent outlines */}
              <path
                d="M 150 150 Q 200 100 250 150 T 350 200 T 250 300 T 150 250 Z"
                fill="rgba(212, 175, 55, 0.1)"
                stroke="rgba(212, 175, 55, 0.3)"
              />
              <path
                d="M 400 100 Q 500 50 550 150 T 500 250 T 400 200 Z"
                fill="rgba(212, 175, 55, 0.1)"
                stroke="rgba(212, 175, 55, 0.3)"
              />
              <path
                d="M 600 150 Q 700 100 800 150 T 850 250 T 700 300 T 600 250 Z"
                fill="rgba(212, 175, 55, 0.1)"
                stroke="rgba(212, 175, 55, 0.3)"
              />
              <path
                d="M 750 350 Q 850 300 900 400 T 800 450 T 700 400 Z"
                fill="rgba(212, 175, 55, 0.1)"
                stroke="rgba(212, 175, 55, 0.3)"
              />
            </svg>

            {/* Donation dots */}
            <div className="absolute inset-0">
              <AnimatePresence>
                {donations.map((donation, i) => {
                  const { x, y } = latLngToXY(donation.location.lat, donation.location.lng);
                  const color = CAUSE_COLORS[donation.location.cause] || '#D4AF37';
                  return (
                    <div key={donation.id}>
                      <Dot x={x} y={y} color={color} delay={i * 0.1} />
                      <PulseRing x={x} y={y} delay={i * 0.1} />
                    </div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-50" />

            {/* Stats overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div>
                <p className="text-white/60 text-sm">Active right now</p>
                <motion.p
                  className="text-4xl font-bold text-white"
                  key={donations.length}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  {donations.length}
                  <span className="text-lg text-white/60 font-normal ml-2">donations</span>
                </motion.p>
              </div>
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D4AF37]"></span>
                </span>
                <span className="text-sm font-medium">Live</span>
              </div>
            </div>
          </motion.div>

          {/* Recent activity feed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#111111] rounded-3xl p-6 border border-white/5"
          >
            <div className="flex items-center gap-2 mb-6">
              <Heart className="h-5 w-5 text-[#D4AF37]" />
              <h3 className="text-white font-semibold">Recent Activity</h3>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {recentDonations.map((donation, i) => {
                  const color = CAUSE_COLORS[donation.location.cause] || '#D4AF37';
                  return (
                    <motion.div
                      key={donation.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <MapPin className="h-5 w-5" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">
                          {donation.location.city}
                        </p>
                        <p className="text-white/50 text-xs">
                          {donation.location.cause}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#D4AF37] font-semibold">
                          ${donation.location.amount}
                        </p>
                        <p className="text-white/40 text-xs">just now</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
