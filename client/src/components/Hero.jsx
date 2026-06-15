import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldAlert, Sparkles, Navigation, Shield, Clock, CircleDot } from 'lucide-react';

export default function Hero() {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden bg-matte-black px-6">
      
      {/* 1. Cinematic Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-bg.jpg" 
          alt="Dusk cityscape background" 
          className="w-full h-full object-cover opacity-25 filter brightness-75 contrast-125"
        />
        {/* Dark radial and linear gradient overlays to guarantee copy readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-matte-black/60 via-matte-black/85 to-matte-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(11,15,25,0.95)_100%)]" />
      </div>

      {/* Decorative Blur Glows (behind content) */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-teal/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-electric-cyan/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* 2. Animated Glowing Route SVG Line (background decorative) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none">
        <svg className="w-full max-w-5xl h-[400px] opacity-15" viewBox="0 0 1000 400" fill="none">
          <motion.path 
            d="M 50,300 C 250,50 750,50 950,300" 
            stroke="url(#hero-route-grad)" 
            strokeWidth="3" 
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="hero-route-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 3. Floating Telemetry Cards (Glassmorphism, staggered) */}
      {/* Card 1: Safety Score */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: -20 }}
        animate={{ 
          opacity: 0.9, 
          x: 0,
          y: [-10, 2, -10]
        }}
        transition={{ 
          x: { duration: 0.8 },
          opacity: { duration: 0.8 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="hidden md:flex absolute top-36 left-[8%] z-10 items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-2xl shadow-neon-teal/5"
      >
        <div className="p-2 bg-neon-teal/10 rounded-lg text-neon-teal">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Safety Rating</p>
          <p className="text-sm font-bold text-white">9.2 / 10 (Safest)</p>
        </div>
      </motion.div>

      {/* Card 2: Commute ETA */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: -10 }}
        animate={{ 
          opacity: 0.9, 
          x: 0,
          y: [0, -10, 0]
        }}
        transition={{ 
          x: { duration: 0.8 },
          opacity: { duration: 0.8 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
        }}
        className="hidden md:flex absolute top-56 right-[10%] z-10 items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-2xl shadow-electric-cyan/5"
      >
        <div className="p-2 bg-electric-cyan/10 rounded-lg text-electric-cyan">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Predictive ETA</p>
          <p className="text-sm font-bold text-white">45 min (Optimized)</p>
        </div>
      </motion.div>

      {/* Card 3: Guardian Shield Standby + Dashed HUD ring */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ 
          opacity: 0.9, 
          y: [15, 5, 15]
        }}
        transition={{ 
          opacity: { duration: 0.8 },
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.0 }
        }}
        className="hidden md:flex absolute bottom-36 left-[12%] z-10 items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-2xl shadow-soft-red/5"
      >
        <div className="relative flex items-center justify-center">
          <CircleDot className="w-4 h-4 text-neon-teal" />
          <span className="absolute w-2 h-2 bg-neon-teal rounded-full animate-ping opacity-75"></span>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Guardian Shield</p>
          <p className="text-sm font-bold text-white">Coverage active</p>
        </div>
      </motion.div>

      {/* Dashed Rotating HUD Ring behind bottom card */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="hidden md:block absolute bottom-28 left-[10%] opacity-10 pointer-events-none z-0"
      >
        <svg className="w-32 h-32 text-neon-teal" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="3, 3" fill="none" />
        </svg>
      </motion.div>

      {/* 4. Main Hero Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center z-10 flex flex-col items-center relative"
      >
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-deep-indigo/80 backdrop-blur border border-white/10 text-xs md:text-sm font-semibold text-neon-teal mb-8 shadow-inner">
          <Sparkles className="w-4 h-4" />
          <span>OneJourney Mobility Hackathon 2026</span>
          <span className="text-white/20">|</span>
          <span className="text-slate-300">Women Safety & Secure Commute</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight mb-6 max-w-3xl">
          RAAHI — India's AI Co-Pilot for <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-teal to-electric-cyan">Safe, Predictive & Sustainable</span> Commutes
        </h1>

        {/* Tagline */}
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 font-light leading-relaxed">
          Because the safest route should also be the smartest.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full justify-center px-4 max-w-md z-10">
          <button
            onClick={() => handleScroll('planner')}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-neon-teal text-matte-black font-bold hover:bg-neon-teal/95 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] shadow-lg shadow-neon-teal/10"
          >
            <Navigation className="w-5 h-5" />
            <span>Plan a Route</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleScroll('guardian')}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-deep-indigo/90 backdrop-blur border border-white/10 text-white font-semibold hover:border-soft-red/40 hover:bg-soft-red/5 hover:text-soft-red hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShieldAlert className="w-5 h-5 text-soft-red" />
            <span>Activate Guardian Mode</span>
          </button>
        </div>

        {/* Mobile-only stacked telemetry chips to avoid cluttering */}
        <div className="flex md:hidden flex-wrap gap-3 mb-10 w-full justify-center">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs">
            <Shield className="w-3.5 h-3.5 text-neon-teal" />
            <span className="font-semibold text-slate-300">Safety Index: 9.2</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs">
            <Clock className="w-3.5 h-3.5 text-electric-cyan" />
            <span className="font-semibold text-slate-300">Predictive ETA</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs">
            <span className="w-1.5 h-1.5 bg-neon-teal rounded-full animate-pulse"></span>
            <span className="font-semibold text-slate-300">Shield Standby</span>
          </div>
        </div>

        {/* Informational Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl text-left">
          <div className="bg-deep-indigo/80 backdrop-blur border border-white/10 rounded-xl p-5 hover:border-neon-teal/30 transition-all hover:scale-[1.01]">
            <h3 className="font-display font-bold text-2xl text-neon-teal mb-1">70%+</h3>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mb-1">Women Feel Safer</p>
            <p className="text-sm text-slate-300">Through live predictive safety scoring and active guardian support.</p>
          </div>

          <div className="bg-deep-indigo/80 backdrop-blur border border-white/10 rounded-xl p-5 hover:border-electric-cyan/30 transition-all hover:scale-[1.01]">
            <h3 className="font-display font-bold text-2xl text-electric-cyan mb-1">30-45 Min</h3>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mb-1">Saved Daily</p>
            <p className="text-sm text-slate-300">By dynamically navigating away from high-crowd bottleneck nodes.</p>
          </div>

          <div className="bg-deep-indigo/80 backdrop-blur border border-white/10 rounded-xl p-5 hover:border-amber/30 transition-all hover:scale-[1.01]">
            <h3 className="font-display font-bold text-2xl text-amber mb-1">15-25%</h3>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mb-1">Lower CO₂ footprint</p>
            <p className="text-sm text-slate-300">Optimizing multimodal public transit routes for sustainable commutes.</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
