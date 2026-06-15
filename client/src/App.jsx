import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RoutePlanner from './components/RoutePlanner';
import LiveTelemetryBanner from './components/LiveTelemetryBanner';
import GuardianMode from './components/GuardianMode';
import StaticSections from './components/StaticSections';
import OfflineUSSD from './components/OfflineUSSD';
import RecentJourneys from './components/RecentJourneys';
import SmartCityDashboard from './components/SmartCityDashboard';
import UserProfile from './components/UserProfile';
import VoiceAssistant from './components/VoiceAssistant';
import { useRaahiStore } from './store/useRaahiStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Activity, Sparkles, X, AlertTriangle, ShieldCheck, PhoneCall, PhoneOff, Phone } from 'lucide-react';

export default function App() {
  const { 
    activeTab,
    setUssdOpen, 
    offlineMode, 
    aiAlerts, 
    addAiAlert, 
    walkCompanionMode,
    setWalkCompanionMode
  } = useRaahiStore();

  const [toasts, setToasts] = useState([]);

  // Sync latest AI alerts with toast notifications
  useEffect(() => {
    if (aiAlerts.length > 0) {
      const latest = aiAlerts[0];
      if (!toasts.find(t => t.id === latest.id)) {
        setToasts(prev => [latest, ...prev].slice(0, 3));
        
        // Auto fadeout after 6 seconds
        const timer = setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== latest.id));
        }, 6000);
        return () => clearTimeout(timer);
      }
    }
  }, [aiAlerts, toasts]);

  const closeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleSimulateAlert = () => {
    const alertsList = [
      "AI Warn: Surge Bottleneck at Chennai Central Gate 3. Adjusting walk routes...",
      "Signal check: GSM satellite signal drop. Switched to secure SMS mesh tunnel.",
      "RPF Security Desk: Crowd surge at Dadar Local platform 1. Recommendation: safest train path.",
      "AI Intel: Kempegowda airport transit bus lane cleared. ETA reduced by 4 mins.",
      "Alert: Corporate Safe corridor active near DLF Cyber City Hub. All cams operational."
    ];
    const selectedText = alertsList[Math.floor(Math.random() * alertsList.length)];
    addAiAlert({
      id: Date.now().toString(),
      text: selectedText,
      type: Math.random() > 0.4 ? 'warning' : 'info'
    });
  };

  return (
    <div className="relative min-h-screen bg-matte-black text-slate-100 selection:bg-neon-teal selection:text-matte-black overflow-x-hidden">
      
      {/* Header Navigation */}
      <Navbar />

      {/* Toast Notifications Container */}
      <div className="fixed top-24 right-6 z-[1050] flex flex-col gap-3 w-full max-w-sm pointer-events-none select-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ x: 100, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 100, opacity: 0, scale: 0.9 }}
              className={`pointer-events-auto p-4 rounded-xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
                toast.type === 'warning'
                  ? 'bg-soft-red/10 border-soft-red/30 text-soft-red'
                  : 'bg-neon-teal/10 border-neon-teal/30 text-neon-teal'
              }`}
            >
              {toast.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
              ) : (
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">Co-Pilot Telemetry Alert</p>
                <p className="text-xs text-white mt-1 leading-normal font-sans font-medium">{toast.text}</p>
              </div>
              <button 
                onClick={() => closeToast(toast.id)} 
                className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Pages Dashboard Switcher */}
      <main className="space-y-0 pt-16">
        
        {activeTab === 'nav' && (
          <>
            {/* Hero Landing */}
            <Hero />

            {/* Route Commute Planner & Map View */}
            <RoutePlanner />

            {/* Double-card Dashboard: Recent History & AI Alert Center */}
            <section className="py-10 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Card 1: Commute Logbook */}
              <RecentJourneys />

              {/* Card 2: AI Co-Pilot Alert Center */}
              <div className="bg-deep-indigo border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-neon-teal animate-pulse" />
                        <span>AI Co-Pilot Center</span>
                      </h3>
                      <p className="text-xs text-slate-400 font-light">Real-time commute telemetry and route optimization feed</p>
                    </div>
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-teal opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-teal"></span>
                    </span>
                  </div>

                  {/* Feed ticker list */}
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                    {aiAlerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className={`p-3 rounded-xl border flex gap-3 text-xs ${
                          alert.type === 'warning'
                            ? 'bg-soft-red/5 border-soft-red/15 text-slate-300'
                            : 'bg-white/5 border-white/5 text-slate-300'
                        }`}
                      >
                        {alert.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-soft-red shrink-0 mt-0.5" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-neon-teal shrink-0 mt-0.5" />
                        )}
                        <p className="font-sans font-medium">{alert.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex items-center justify-between gap-4">
                  <p className="text-[10px] text-slate-500 font-medium">Click to inject test telemetry pings live during presentation</p>
                  <button
                    onClick={handleSimulateAlert}
                    className="px-4 py-2.5 bg-neon-teal hover:bg-neon-teal/90 text-matte-black font-extrabold rounded-lg text-xs transition-transform active:scale-95 flex items-center gap-1.5 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Simulate Ping</span>
                  </button>
                </div>
              </div>

            </section>

            {/* Live Diagnostics Banner */}
            <LiveTelemetryBanner />

            {/* Active Emergency Guardian Mode */}
            <GuardianMode />
          </>
        )}

        {/* Tab 2: Smart City Government Dashboard */}
        {activeTab === 'smart-city' && <SmartCityDashboard />}

        {/* Tab 3: User Profile */}
        {activeTab === 'profile' && <UserProfile />}

        {/* Tab 4: AI Voice Assistant */}
        {activeTab === 'voice' && <VoiceAssistant />}

        {/* Supporting static sections (Solution, Tech Stack, Impact, Team) */}
        <StaticSections />

      </main>

      {/* Interactive USSD Offline phone Drawer Modal */}
      <OfflineUSSD />

      {/* Simulated incoming fake-call overlay escape protocol */}
      <AnimatePresence>
        {walkCompanionMode.fakeCallTriggered && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-matte-black/95 backdrop-blur-xl p-4">
            <motion.div
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 150, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-[40px] p-8 flex flex-col justify-between items-center h-[550px] shadow-2xl text-center"
            >
              <div className="space-y-2 pt-12">
                <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-4xl text-zinc-400 mx-auto border border-zinc-700 animate-pulse">
                  👤
                </div>
                <h3 className="font-display font-extrabold text-2xl text-white mt-4">Safe Commute Officer</h3>
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest animate-pulse mt-1">Incoming Safety Call</p>
                <p className="text-[10px] text-zinc-500 font-sans">RAAHI Escape Protocol Verification</p>
              </div>

              {/* Action grid dialer triggers */}
              <div className="w-full flex items-center justify-around pb-8">
                {/* Accept Call */}
                <button
                  onClick={() => setWalkCompanionMode({ fakeCallTriggered: false })}
                  className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
                >
                  <Phone className="w-6 h-6" />
                </button>
                
                {/* Decline Call */}
                <button
                  onClick={() => setWalkCompanionMode({ fakeCallTriggered: false })}
                  className="w-16 h-16 rounded-full bg-soft-red hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-soft-red/20 active:scale-95 transition-transform"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Phone USSD Dialer launcher Button */}
      <div className="fixed bottom-6 right-6 z-[900]">
        <button
          onClick={() => setUssdOpen(true)}
          className={`p-4 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 border ${
            offlineMode 
              ? 'bg-amber border-amber/20 text-matte-black animate-pulse shadow-lg shadow-amber/20'
              : 'bg-neon-teal border-neon-teal/20 text-matte-black hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]'
          }`}
          title="Dial *143# Offline Mode"
        >
          <Smartphone className="w-6 h-6" />
          {offlineMode && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-soft-red rounded-full border border-matte-black animate-ping" />
          )}
        </button>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-slate-600 border-t border-white/5 bg-matte-black mt-20">
        <p>© 2026 RAAHI · Built for OneJourney Mobility Hackathon</p>
        <p className="mt-2 text-[10px] text-slate-700">Team Ctrl Alt Defeat · SRM IST KTR</p>
      </footer>

    </div>
  );
}
