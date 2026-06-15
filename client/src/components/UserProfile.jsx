import React from 'react';
import { useRaahiStore } from '../store/useRaahiStore';
import { Award, ShieldCheck, Leaf, Compass, Bookmark, TrendingUp, Sparkles, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserProfile() {
  const { userProfile, resetStore } = useRaahiStore();

  const handleSavedRouteClick = (route) => {
    // Go to route planner tab
    const element = document.getElementById('planner');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="user-profile" className="py-12 px-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Profile Header Block */}
      <div className="bg-deep-indigo border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Glossy radial background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.12),transparent_60%)] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            {/* Styled Avatar */}
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/15 text-2xl font-bold text-white shadow-inner">
              AS
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-neon-teal text-matte-black text-[10px] font-black flex items-center justify-center border-2 border-deep-indigo">
                {userProfile.level}
              </div>
            </div>
            
            <div className="space-y-1">
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
                <span>{userProfile.name}</span>
                <span className="px-2 py-0.5 rounded-md bg-neon-teal/10 border border-neon-teal/20 text-[10px] font-bold text-neon-teal uppercase tracking-widest font-mono">
                  PRO MEMBER
                </span>
              </h2>
              <p className="text-slate-400 text-xs font-medium">Safe Commuter reputation score: <span className="text-neon-teal font-extrabold font-mono">{userProfile.reputation}% Excellent</span></p>
            </div>
          </div>

          {/* Quick stats items */}
          <div className="flex gap-4 items-center">
            <div className="px-4 py-3 bg-matte-black/40 border border-white/5 rounded-2xl text-center min-w-[90px]">
              <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Eco Balance</p>
              <p className="text-xl font-extrabold text-white mt-1 font-mono">{userProfile.ecoPoints} Pts</p>
            </div>
            <div className="px-4 py-3 bg-matte-black/40 border border-white/5 rounded-2xl text-center min-w-[90px]">
              <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Reputation</p>
              <p className="text-xl font-extrabold text-neon-teal mt-1 font-mono">#{userProfile.reputation} G</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main split grid: Analytics & Saved / Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Analytics Charts (CSS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-deep-indigo border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-neon-teal" />
                <span>Commute Analytics</span>
              </h3>
              <p className="text-xs text-slate-400 font-light font-sans">Visual metrics of safety index trends over your past commutes</p>
            </div>

            {/* CSS Weekly Graph */}
            <div className="space-y-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Safety Index History (Weekly)</p>
              <div className="h-40 flex items-end justify-between px-2 pt-6 select-none bg-matte-black/30 border border-white/5 rounded-xl p-4">
                {[
                  { day: "Mon", val: 8.8, h: "88%" },
                  { day: "Tue", val: 9.2, h: "92%" },
                  { day: "Wed", val: 8.5, h: "85%" },
                  { day: "Thu", val: 7.9, h: "79%" },
                  { day: "Fri", val: 9.4, h: "94%" },
                  { day: "Sat", val: 9.0, h: "90%" },
                  { day: "Sun", val: 9.5, h: "95%" }
                ].map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[9px] text-slate-400 font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity">{bar.val}</span>
                    <div 
                      className="w-7 bg-gradient-to-t from-neon-teal/70 to-neon-teal rounded-t-sm group-hover:to-electric-cyan transition-all duration-500 cursor-pointer shadow-md"
                      style={{ height: bar.h }}
                    />
                    <span className="text-[9px] text-slate-500 font-semibold">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Mode Shares CSS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-matte-black/30 border border-white/5 rounded-xl space-y-3">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Transport Mode Distribution</p>
                <div className="space-y-2 text-xs font-semibold">
                  {[
                    { mode: "Local Train", val: "55%", color: "bg-[#22D3EE]" },
                    { mode: "Metro Rail", val: "20%", color: "bg-[#06B6D4]" },
                    { mode: "Walk Path", val: "15%", color: "bg-[#0D9488]" },
                    { mode: "Auto Link", val: "10%", color: "bg-[#14B8A6]" }
                  ].map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-300">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className={`w-2 h-2 rounded-full ${m.color} shrink-0`} />
                        <span className="truncate">{m.mode}</span>
                      </div>
                      <span className="font-mono text-white pl-2">{m.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-matte-black/30 border border-white/5 rounded-xl flex flex-col justify-between">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Carbon Offset Impact</p>
                <div className="py-2">
                  <h4 className="text-4xl font-display font-black text-amber flex items-center gap-1">
                    <Leaf className="w-6 h-6 shrink-0" />
                    <span>18.4 kg</span>
                  </h4>
                  <p className="text-[9px] text-slate-400 font-medium leading-normal mt-1.5">Equivalent to planting 1 young tree. Carbon offset verified on decentralized ledgers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Achievements & Saved Routes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Achievements Card */}
          <div className="bg-deep-indigo border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-neon-teal" />
                <span>Achievements</span>
              </h3>
              <p className="text-xs text-slate-400 font-light">Badges earned through secure and eco commutes</p>
            </div>

            <div className="space-y-3">
              {userProfile.achievements.map((ach) => (
                <div key={ach.id} className="p-3 bg-matte-black/30 border border-white/5 rounded-xl flex items-center gap-3">
                  <span className="text-2xl shrink-0 select-none">{ach.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{ach.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Routes Card */}
          <div className="bg-deep-indigo border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-neon-teal" />
                <span>Saved Routes</span>
              </h3>
            </div>

            <div className="space-y-3">
              {userProfile.savedRoutes.map((route) => (
                <div 
                  key={route.id} 
                  onClick={() => handleSavedRouteClick(route)}
                  className="p-3 bg-matte-black/30 border border-white/5 rounded-xl flex items-center justify-between cursor-pointer hover:border-white/20 transition-all hover:scale-[1.01] select-none"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">{route.title}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5 truncate">{route.src} ➔ {route.dest}</p>
                  </div>
                  <Compass className="w-4 h-4 text-neon-teal shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
