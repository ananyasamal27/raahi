import React, { useState } from 'react';
import { useRaahiStore } from '../store/useRaahiStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, WifiOff, PhoneCall, X, Shield, Send, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function OfflineUSSD() {
  const {
    ussdOpen,
    setUssdOpen,
    offlineMode,
    setOfflineMode,
    selectedRoute,
    safeZones
  } = useRaahiStore();

  const [dialString, setDialString] = useState('');
  const [screen, setScreen] = useState('dialer'); // dialer, menu, response, sms
  const [menuSelection, setMenuSelection] = useState(null);
  const [logs, setLogs] = useState([]);

  const handleKeyPress = (num) => {
    if (dialString.length < 10) {
      setDialString(prev => prev + num);
    }
  };

  const handleClear = () => {
    setDialString('');
  };

  const handleDial = () => {
    if (dialString === '*143#') {
      setScreen('menu');
    } else {
      alert("Invalid code. Try dialing *143# for RAAHI Offline Secure Portal.");
      setDialString('');
    }
  };

  const handleMenuSelect = (option) => {
    setMenuSelection(option);
    setScreen('response');
  };

  const handleBackToMenu = () => {
    setScreen('menu');
  };

  const handleReset = () => {
    setDialString('');
    setScreen('dialer');
    setMenuSelection(null);
  };

  const triggerOfflineRoute = () => {
    setOfflineMode(true);
    handleReset();
    setUssdOpen(false);
  };

  return (
    <AnimatePresence>
      {ussdOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-matte-black/80 backdrop-blur-md p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-deep-indigo border border-white/10 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl p-6 flex flex-col items-center h-[620px] justify-between"
          >
            {/* Phone Notch/Header */}
            <div className="w-full flex items-center justify-between px-3 text-slate-400 text-xs font-semibold">
              <span>9:41 AM</span>
              <div className="w-24 h-4 bg-matte-black rounded-full border border-white/5 flex items-center justify-center">
                <div className="w-8 h-1 bg-slate-700 rounded-full" />
              </div>
              <div className="flex items-center gap-1">
                <WifiOff className="w-3.5 h-3.5 text-soft-red animate-pulse" />
                <span className="text-[10px] text-soft-red font-bold font-mono">OFFLINE</span>
              </div>
            </div>

            {/* Main Phone Display Screen */}
            <div className="flex-1 w-full bg-matte-black border border-white/5 rounded-2xl my-4 overflow-hidden p-4 flex flex-col justify-between font-mono text-slate-200 text-sm">
              <AnimatePresence mode="wait">
                {/* 1. Dialer View */}
                {screen === 'dialer' && (
                  <motion.div
                    key="dialer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col justify-between"
                  >
                    <div className="text-center py-4">
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-sans font-bold">RAAHI SMS/USSD Dialer</p>
                      <div className="h-12 flex items-center justify-center text-3xl font-bold tracking-widest text-neon-teal font-sans mt-4">
                        {dialString || <span className="text-slate-600 animate-pulse">|</span>}
                      </div>
                      <p className="text-[9px] text-slate-500 mt-2 font-sans font-medium">Tip: Click buttons below to type <span className="text-neon-teal font-bold">*143#</span> and dial.</p>
                    </div>

                    {/* Numeric Keypad Grid */}
                    <div className="grid grid-cols-3 gap-3 px-4 mb-4 select-none">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((char) => (
                        <button
                          key={char}
                          onClick={() => handleKeyPress(char)}
                          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-sans text-lg font-semibold flex items-center justify-center mx-auto active:scale-90 transition-transform"
                        >
                          {char}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between items-center px-6 border-t border-white/5 pt-3">
                      <button
                        onClick={handleClear}
                        className="text-xs text-slate-400 font-sans hover:text-white"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleDial}
                        className="w-10 h-10 rounded-full bg-neon-teal hover:bg-neon-teal/90 text-matte-black flex items-center justify-center active:scale-95 transition-transform"
                      >
                        <PhoneCall className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => { setDialString('*143#') }}
                        className="text-xs text-neon-teal font-sans font-bold hover:underline"
                      >
                        Quick-Fill
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 2. USSD Menu View */}
                {screen === 'menu' && (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <p className="text-xs font-bold text-neon-teal flex items-center gap-1.5 font-sans">
                          <Smartphone className="w-3.5 h-3.5" />
                          RAAHI OFFLINE PORTAL
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                          Connection Link: GSM Satellite SMS Fallback Active. Select option:
                        </p>
                      </div>

                      <div className="space-y-2 mt-2 font-sans">
                        {[
                          { id: 1, label: "1. Get Safe Offline Route" },
                          { id: 2, label: "2. Dispatch SOS Coordinates" },
                          { id: 3, label: "3. Heartbeat Security Ping" },
                          { id: 4, label: "4. Cancel & Exit" }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => handleMenuSelect(opt.id)}
                            className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium border border-white/5 transition-colors text-slate-300"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 text-center">
                      <button
                        onClick={handleReset}
                        className="text-xs text-slate-400 hover:text-white font-sans"
                      >
                        Go Back
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 3. Action Response Screen */}
                {screen === 'response' && (
                  <motion.div
                    key="response"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col justify-between font-sans text-xs"
                  >
                    <div className="space-y-4">
                      {menuSelection === 1 && (
                        <div className="space-y-3">
                          <div className="bg-neon-teal/10 border border-neon-teal/20 p-3 rounded-lg text-neon-teal">
                            <h4 className="font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              Offline Route Coordinates Received
                            </h4>
                            <p className="text-[10px] text-slate-300 mt-1">
                              Encrypted SMS coordinates parsed.
                            </p>
                          </div>

                          <div className="bg-white/5 p-3 rounded-lg border border-white/5 space-y-2 text-slate-300">
                            <p className="font-bold text-[10px] uppercase text-slate-500 tracking-wider">SMS Route Data:</p>
                            <p className="font-semibold">{selectedRoute ? selectedRoute.segments[0].label : "Walk towards safe checkpoint"}</p>
                            <div className="text-[10px] text-slate-400 leading-relaxed bg-black/40 p-2 rounded">
                              Coords: {selectedRoute ? selectedRoute.waypoints.slice(0,3).map(w => w.map(c=>c.toFixed(4)).join(',')).join(' ➔ ') : "12.8230,80.0444 ➔ 12.8222,80.0416"}
                            </div>
                            <p className="text-[10px] text-slate-400">
                              Nearby Shelter: {safeZones && safeZones.length > 0 ? safeZones[0].name : "RPF Kiosk Gate 1"}
                            </p>
                          </div>

                          <button
                            onClick={triggerOfflineRoute}
                            className="w-full py-2.5 bg-neon-teal hover:bg-neon-teal/90 text-matte-black font-bold rounded-lg transition-transform hover:scale-[1.01] active:scale-95 text-center block"
                          >
                            Load Offline Maps Guide
                          </button>
                        </div>
                      )}

                      {menuSelection === 2 && (
                        <div className="space-y-3">
                          <div className="bg-soft-red/10 border border-soft-red/20 p-3 rounded-lg text-soft-red">
                            <h4 className="font-bold flex items-center gap-1">
                              <AlertTriangle className="w-4 h-4" />
                              SOS Dispatch Successful
                            </h4>
                            <p className="text-[10px] text-slate-300 mt-1">
                              Emergency contacts alerted via local GSM mesh networks.
                            </p>
                          </div>

                          <div className="bg-white/5 p-3 rounded-lg border border-white/5 space-y-2 text-slate-300">
                            <p className="font-bold text-[10px] uppercase text-slate-500 tracking-wider">Dispatched SMS:</p>
                            <div className="bg-black/40 p-2.5 rounded font-mono text-[10px] text-slate-300 leading-normal">
                              [RAAHI SOS ALERT] Commuter needs emergency assistance. Coords: {selectedRoute ? selectedRoute.waypoints[0].map(c => c.toFixed(5)).join(', ') : "12.8230, 80.0444"}. Heading to: {safeZones && safeZones.length > 0 ? safeZones[0].name : "RPF Police Desk"}.
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <Send className="w-3.5 h-3.5 text-soft-red shrink-0" />
                            <span>Encrypted backup sent to police monitoring grids.</span>
                          </div>
                        </div>
                      )}

                      {menuSelection === 3 && (
                        <div className="space-y-3">
                          <div className="bg-electric-cyan/10 border border-electric-cyan/20 p-3 rounded-lg text-electric-cyan">
                            <h4 className="font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              Heartbeat Signal Ping Sent
                            </h4>
                            <p className="text-[10px] text-slate-300 mt-1">
                              Telemetry updated via GSM.
                            </p>
                          </div>

                          <div className="bg-white/5 p-3 rounded-lg border border-white/5 space-y-2 text-slate-300">
                            <p className="text-xs leading-relaxed">
                              RAAHI has successfully dispatched a periodic heartbeat ping to the server. Your tracking dashboard will reflect your current location coordinates.
                            </p>
                          </div>
                        </div>
                      )}

                      {menuSelection === 4 && (
                        <div className="space-y-3 text-center py-6">
                          <p className="text-slate-400 text-xs">USSD Session closed. Tap exit below to close phone interface.</p>
                          <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-white/5 rounded border border-white/10 text-xs text-slate-300 hover:text-white"
                          >
                            Restart Dialer
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 border-t border-white/5 pt-3">
                      <button
                        onClick={handleBackToMenu}
                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-slate-300 text-center transition-colors"
                      >
                        Main Menu
                      </button>
                      <button
                        onClick={handleReset}
                        className="flex-1 py-2 bg-soft-red/10 hover:bg-soft-red/20 rounded-lg text-xs font-semibold text-soft-red text-center transition-colors border border-soft-red/15"
                      >
                        Disconnect
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Phone Home Indicator bar */}
            <div className="w-full flex justify-between items-center text-[10px] text-slate-500 border-t border-white/5 pt-4">
              <span>GSM Tunnel v2.8</span>
              <button
                onClick={() => setUssdOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
              <span>Ctrl-Alt-Defeat</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
