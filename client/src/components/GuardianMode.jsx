import React, { useState, useEffect, useRef } from 'react';
import { useRaahiStore } from '../store/useRaahiStore';
import { io } from 'socket.io-client';
import { Shield, ShieldAlert, ShieldOff, PhoneCall, MapPin, Radio, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Connect to the socket server relatively to support single-port deployment
const socket = io(window.location.origin, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 15,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ['websocket', 'polling']
});

export default function GuardianMode() {
  const {
    selectedRoute,
    safeZones,
    guardianActive,
    liveTracking,
    setGuardianActive,
    setLiveTracking,
    offlineMode
  } = useRaahiStore();

  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const holdIntervalRef = useRef(null);
  const holdTimeoutRef = useRef(null);

  // Connect socket on mount, disconnect on unmount, track link states
  useEffect(() => {
    socket.connect();
    
    socket.on('connect', () => {
      console.log('Socket.IO connected to backend server');
      setConnectionStatus('connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err);
      setConnectionStatus('error');
    });

    socket.on('reconnect_attempt', (attempt) => {
      console.log(`Socket.IO reconnect attempt #${attempt}`);
      setConnectionStatus('connecting');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('reconnect_attempt');
      socket.off('guardian-tick');
      socket.disconnect();
    };
  }, []);

  // Handle Socket events when guardianMode is active (only if online)
  useEffect(() => {
    if (guardianActive && !offlineMode) {
      socket.on('guardian-tick', (data) => {
        setLiveTracking({
          lat: data.lat,
          lng: data.lng,
          elapsedSeconds: data.elapsedSeconds,
          signal: data.signal
        });
      });
    } else {
      socket.off('guardian-tick');
    }

    return () => {
      socket.off('guardian-tick');
    };
  }, [guardianActive, offlineMode, setLiveTracking]);

  // Local coordinate simulation for offline guardian mode
  useEffect(() => {
    let interval = null;
    if (guardianActive && offlineMode) {
      let currentLat = 12.8230;
      let currentLng = 80.0444;
      let safeZoneLat = 12.8238;
      let safeZoneLng = 80.0434;
      let elapsedSeconds = 0;

      if (selectedRoute && selectedRoute.waypoints && selectedRoute.waypoints.length > 0) {
        currentLat = selectedRoute.waypoints[0][0];
        currentLng = selectedRoute.waypoints[0][1];
      }
      if (safeZones && safeZones.length > 0) {
        safeZoneLat = safeZones[0].lat;
        safeZoneLng = safeZones[0].lng;
      }

      setLiveTracking({
        lat: currentLat,
        lng: currentLng,
        elapsedSeconds: 0,
        signal: 5
      });

      interval = setInterval(() => {
        elapsedSeconds++;
        const dLat = safeZoneLat - currentLat;
        const dLng = safeZoneLng - currentLng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);
        const step = 0.0006;
        
        if (dist <= step) {
          currentLat = safeZoneLat;
          currentLng = safeZoneLng;
          clearInterval(interval);
        } else {
          currentLat += (dLat / dist) * step;
          currentLng += (dLng / dist) * step;
        }

        setLiveTracking({
          elapsedSeconds,
          lat: currentLat,
          lng: currentLng,
          signal: 5
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [guardianActive, offlineMode, selectedRoute, safeZones, setLiveTracking]);

  // SOS Hold-to-activate logic
  const handleHoldStart = (e) => {
    e.preventDefault();
    if (guardianActive) return; // already active

    setIsHolding(true);
    setHoldProgress(0);

    const duration = 1500; // 1.5 seconds
    const intervalTime = 30; // update bar every 30ms
    const step = (intervalTime / duration) * 100;

    holdIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(holdIntervalRef.current);
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    holdTimeoutRef.current = setTimeout(() => {
      activateGuardian();
      setIsHolding(false);
      setHoldProgress(0);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    }, duration);
  };

  const handleHoldEnd = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
  };

  const activateGuardian = () => {
    let currentLat = 12.8230; // Default SRM
    let currentLng = 80.0444;
    let safeZoneLat = 12.8238;
    let safeZoneLng = 80.0434;

    if (selectedRoute && selectedRoute.waypoints && selectedRoute.waypoints.length > 0) {
      currentLat = selectedRoute.waypoints[0][0];
      currentLng = selectedRoute.waypoints[0][1];
    }
    if (safeZones && safeZones.length > 0) {
      safeZoneLat = safeZones[0].lat;
      safeZoneLng = safeZones[0].lng;
    }

    setLiveTracking({
      lat: currentLat,
      lng: currentLng,
      elapsedSeconds: 0,
      signal: 5
    });

    setGuardianActive(true);

    if (!offlineMode) {
      socket.emit('start-guardian', {
        currentLat,
        currentLng,
        safeZoneLat,
        safeZoneLng
      });
    }
  };

  const deactivateGuardian = () => {
    if (!offlineMode) {
      socket.emit('stop-guardian');
    }
    setGuardianActive(false);
    setLiveTracking({
      lat: null,
      lng: null,
      elapsedSeconds: 0,
      signal: 4
    });
  };

  return (
    <section 
      id="guardian" 
      className="py-20 px-6 transition-all duration-700 relative border-t border-white/5 bg-matte-black overflow-hidden"
    >
      
      {/* Radial soft-red active overlay */}
      <AnimatePresence>
        {guardianActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15),transparent_70%)] pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      {guardianActive && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-soft-red via-red-500 to-soft-red animate-pulse z-10" />
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft-red/10 border border-soft-red/20 text-xs font-bold text-soft-red uppercase tracking-wider mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Active Guardian Shield</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Guardian Mode
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-light">
            Press and hold the SOS button to instantly start live location sharing, dispatch emergency contacts, and navigate safely to the nearest well-lit shelter point.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Column 1: SOS Button trigger panel */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-xl min-h-[350px]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/2 to-transparent pointer-events-none" />

            {!guardianActive ? (
              <div className="text-center flex flex-col items-center justify-center w-full relative z-10">
                <p className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-6">
                  {isHolding ? 'Hold tight...' : 'Instant Activation'}
                </p>

                {/* Circle Button trigger */}
                <div 
                  onMouseDown={handleHoldStart}
                  onMouseUp={handleHoldEnd}
                  onMouseLeave={handleHoldEnd}
                  onTouchStart={handleHoldStart}
                  onTouchEnd={handleHoldEnd}
                  className="relative cursor-pointer w-40 h-40 rounded-full flex items-center justify-center select-none bg-slate-900 border border-white/10 active:scale-[0.98] transition-all"
                  style={{
                    boxShadow: isHolding 
                      ? 'inset 0 0 20px rgba(20, 184, 166, 0.2), 0 0 30px rgba(20, 184, 166, 0.1)' 
                      : 'none'
                  }}
                >
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="76"
                      stroke="rgba(255, 255, 255, 0.04)"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="76"
                      stroke="#14B8A6"
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 76}
                      strokeDashoffset={2 * Math.PI * 76 * (1 - holdProgress / 100)}
                      className="transition-all"
                    />
                  </svg>

                  <div className="flex flex-col items-center justify-center">
                    <Shield className="w-12 h-12 text-slate-400" />
                    <span className="text-xs font-black text-white uppercase tracking-wider mt-3">HOLD FOR SOS</span>
                    <span className="text-[9px] text-slate-500 mt-1 font-bold">1.5 Seconds</span>
                  </div>
                </div>

                <div className="mt-8 h-1.5 w-full max-w-[180px] bg-slate-800 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-neon-teal transition-all duration-75" 
                    style={{ width: `${holdProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center flex flex-col items-center justify-center relative z-10">
                {/* Active SOS state with continuous scale/shadow pulse */}
                <motion.div 
                  onClick={deactivateGuardian}
                  animate={{ 
                    scale: [1, 1.06, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(239, 68, 68, 0.5)",
                      "0 0 0 20px rgba(239, 68, 68, 0)",
                      "0 0 0 0 rgba(239, 68, 68, 0)"
                    ]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.6,
                    ease: "easeInOut"
                  }}
                  className="w-40 h-40 rounded-full flex items-center justify-center bg-soft-red text-white cursor-pointer select-none shadow-lg shadow-soft-red/40"
                >
                  <div className="flex flex-col items-center justify-center">
                    <ShieldAlert className="w-14 h-14" />
                    <span className="text-xs font-black uppercase tracking-wider mt-2.5">TAP TO STOP</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-soft-red text-xs font-black tracking-wider mt-8 flex items-center gap-2 justify-center"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-soft-red opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-soft-red"></span>
                  </span>
                  <span>AUTOMATED SECURITY DISPATCHED</span>
                </motion.div>
              </div>
            )}
          </div>

          {/* Column 2: Emergency live statistics status panel */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl min-h-[350px]">
            <AnimatePresence mode="wait">
              {!guardianActive ? (
                <motion.div 
                  key="idle-panel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-display font-bold text-lg text-white mb-2">Guardian Shield Offline</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      RAAHI's safety tracking is currently in standby. Activating the emergency protocol will initiate the following automated routines:
                    </p>
                    <ul className="space-y-3 mt-6 text-xs text-slate-300">
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-teal shrink-0 mt-1.5" />
                        <span>Instant broadcast of live coordinate stream via WebSockets.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-teal shrink-0 mt-1.5" />
                        <span>Automated SMS ping alerts to emergency contacts (Mom, Priya).</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-teal shrink-0 mt-1.5" />
                        <span>Interactive guide route mapping pathing to nearest well-lit emergency safe point.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-white/5 pt-4 flex items-center gap-3 text-xs text-slate-500">
                    <ShieldOff className="w-5 h-5 shrink-0" />
                    <span>Security status: Guard coverage not initiated.</span>
                  </div>
                </motion.div>
              ) : (connectionStatus !== 'connected' && !offlineMode) ? (
                connectionStatus === 'error' ? (
                  <motion.div 
                    key="error-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4"
                  >
                    <AlertTriangle className="w-10 h-10 text-amber animate-bounce" />
                    <div>
                      <h3 className="font-display font-bold text-base text-amber">Guardian Network Delay</h3>
                      <p className="text-[10px] text-slate-300 mt-2 font-light max-w-[200px] mx-auto leading-relaxed">
                        Establishing backup signal links. The server might be waking from cold-start.
                      </p>
                    </div>
                    <button 
                      onClick={() => { socket.disconnect(); socket.connect(); }}
                      className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-bold transition-all text-slate-200"
                    >
                      Force Reconnect
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="connecting-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4"
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-4 border-neon-teal/20 border-t-neon-teal animate-spin" />
                      <Shield className="w-5 h-5 text-neon-teal absolute" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-white animate-pulse">Connecting to Guardian Network...</h3>
                      <p className="text-[10px] text-slate-400 mt-2 font-light max-w-[200px] mx-auto leading-relaxed">
                        Initializing secure WebSockets link & broadcasting coordinates fallback logs.
                      </p>
                    </div>
                  </motion.div>
                )
              ) : (
                <motion.div 
                  key="active-panel"
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="h-full flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Active Status header */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-xs font-extrabold text-soft-red flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-soft-red animate-ping" />
                        {offlineMode ? "⚠️ OFFLINE MONITORING ACTIVE" : "🔴 LIVE MONITORING: ACTIVE"}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold font-mono">
                        ID: {offlineMode ? "GSM-MESH-99" : (socket.id ? socket.id.slice(0, 6) : "SYS-X")}
                      </span>
                    </div>

                    {/* Timer and Signal indicators */}
                    <div className="grid grid-cols-2 gap-4 bg-matte-black/40 border border-white/5 rounded-xl p-4">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Elapsed Time</p>
                        <div className="flex items-center gap-1 mt-1 font-mono text-3xl font-bold tracking-wider">
                          <span className="text-white">{Math.floor(liveTracking.elapsedSeconds / 60).toString().padStart(2, '0')}</span>
                          <span className="text-amber animate-pulse">:</span>
                          <span className="text-white">{(liveTracking.elapsedSeconds % 60).toString().padStart(2, '0')}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Network Link</p>
                        <div className="flex items-center gap-2 mt-2">
                          {/* Restyled Signal Bars */}
                          <div className="flex items-end gap-1 h-5 w-8">
                            {[1, 2, 3, 4, 5].map((bar) => {
                              const isActive = bar <= liveTracking.signal;
                              return (
                                <div
                                  key={bar}
                                  className={`w-1 rounded-full transition-all duration-300 ${
                                    isActive ? 'bg-electric-cyan' : 'bg-white/10'
                                  }`}
                                  style={{ height: `${bar * 20}%` }}
                                />
                              );
                            })}
                          </div>
                          <span className="text-[10px] font-bold text-slate-300 font-mono">
                            {offlineMode ? "GSM FALLBACK" : (liveTracking.signal >= 4 ? 'EXCELLENT' : 'STABLE')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contacts */}
                    <div className="flex items-start gap-3 text-xs border-b border-white/5 pb-3">
                      <PhoneCall className="w-4 h-4 text-neon-teal shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-300">
                          {offlineMode ? "GSM SMS Link active" : "Broadcast Feeds Active"}
                        </p>
                        <p className="text-slate-400 mt-0.5 font-light">
                          {offlineMode 
                            ? "Periodic coordinates dispatched to Mom, Priya via GSM-Mesh SMS" 
                            : "Contacts alerted: Priya, Mom (Police notified on standby)"}
                        </p>
                      </div>
                    </div>

                    {/* Nearest Safe Zone info */}
                    <div className="flex items-start gap-3 text-xs">
                      <MapPin className="w-4 h-4 text-neon-teal shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-300">Destination Safe Haven</p>
                        <p className="text-slate-400 mt-0.5 font-light">
                          {safeZones && safeZones.length > 0 
                            ? `${safeZones[0].name}` 
                            : "Police Booth (Default Chennai Central)"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Deactivate CTA Button */}
                  <button
                    onClick={deactivateGuardian}
                    className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 font-bold rounded-lg text-[10px] tracking-wider uppercase transition-colors"
                  >
                    Deactivate Guardian Shield
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
