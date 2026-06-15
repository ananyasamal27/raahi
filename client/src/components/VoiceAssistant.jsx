import React, { useState } from 'react';
import { useRaahiStore } from '../store/useRaahiStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, HelpCircle, CornerDownLeft, Sparkles } from 'lucide-react';

export default function VoiceAssistant() {
  const { voiceState, setVoiceState, setSource, setDestination, setUssdOpen, setGuardianActive } = useRaahiStore();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: voiceState.assistantResponse }
  ]);

  const presetCommands = [
    { label: "Find safest route home", text: "Find safest route from SRM to T. Nagar" },
    { label: "Activate Guardian SOS", text: "Activate Guardian Mode SOS shield" },
    { label: "Check Dadar Platform crowd", text: "Check crowd surge at Dadar Platform 3" },
    { label: "Locate nearest Safe Haven", text: "Find nearest safe checkpoint shelter" }
  ];

  const handleCommandSubmit = (commandText) => {
    if (!commandText.trim()) return;

    // Add User Message
    const userMsg = { sender: 'user', text: commandText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Trigger Pulse Visualizer
    setVoiceState({ waveActive: true, textQuery: commandText });

    // Simulate AI response delay
    setTimeout(() => {
      let responseText = "I'm processing that safe routing request. Let me check the latest city telemetry...";
      const normalized = commandText.toLowerCase();

      if (normalized.includes("srm") || normalized.includes("t. nagar")) {
        responseText = "Analyzing Chennai transport links... Found optimal Safe route via Local Rail & Bus. Safety index is 8.9. Loaded on your Route Planner.";
        // Mock set locations in store to Chennai Central -> Bangalore or SRM -> T Nagar
        setSource({ name: "SRM Kattankulathur", lat: 12.8230, lng: 80.0444 });
        setDestination({ name: "T. Nagar (Chennai)", lat: 13.0418, lng: 80.2341 });
      } else if (normalized.includes("guardian") || normalized.includes("sos")) {
        responseText = "Activating Guardian Mode SOS. Security feeds alert, broadcasting coordinates. Signal mesh verified.";
        // Trigger SOS pings
        setGuardianActive(true);
      } else if (normalized.includes("dadar") || normalized.includes("crowd")) {
        responseText = "Telemetry warning check: Dadar Platform 3 is experiencing a heavy crowd bottleneck (92% density). Recommending alternative safest routes.";
      } else if (normalized.includes("safe") || normalized.includes("haven") || normalized.includes("shelter")) {
        responseText = "Nearest verified Safe Haven is the Apollo Pharmacy Kiosk (80m East), equipped with CCTV and direct security hotline. Marked on your map.";
      } else {
        responseText = "I've scanned the smart city network. All links are stable. You can ask me to activate Guardian or find safest route coordinates.";
      }

      setMessages(prev => [...prev, { sender: 'assistant', text: responseText }]);
      setVoiceState({ waveActive: false, assistantResponse: responseText });
    }, 1500);
  };

  return (
    <section id="voice-assistant" className="py-12 px-6 max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-[10px] font-black text-neon-teal uppercase tracking-widest animate-pulse">
          <Sparkles className="w-3 h-3" />
          <span>RAAHI Voice Beta</span>
        </div>
        <h2 className="font-display text-3xl font-extrabold text-white">Safe Mobility AI Voice Assistant</h2>
        <p className="text-slate-400 text-xs font-light">Speak or type safety commands to coordinate navigation, trigger emergency protocols, and review smart-city telemetry.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Left column: Animated Visualizer and Presets */}
        <div className="md:col-span-5 bg-deep-indigo border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between items-center text-center space-y-6">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold">RAAHI Soundwave Telemetry</p>
          
          {/* Animated soundwave circle */}
          <div className="relative flex items-center justify-center w-40 h-40">
            <AnimatePresence>
              {voiceState.waveActive && (
                <>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    className="absolute w-28 h-28 rounded-full bg-neon-teal/20 border border-neon-teal/30 z-0"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                    className="absolute w-28 h-28 rounded-full bg-electric-cyan/20 border border-electric-cyan/30 z-0"
                  />
                </>
              )}
            </AnimatePresence>

            <button
              onClick={() => handleCommandSubmit("Voice check")}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all border shadow-lg ${
                voiceState.waveActive 
                  ? 'bg-neon-teal border-neon-teal/20 text-matte-black scale-105 shadow-neon-teal/20'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {voiceState.waveActive ? (
                <Mic className="w-8 h-8 animate-pulse" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Quick Click Commands */}
          <div className="w-full space-y-2">
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold text-left mb-1 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Recommended Queries</span>
            </p>
            <div className="grid grid-cols-1 gap-2">
              {presetCommands.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCommandSubmit(preset.text)}
                  className="w-full text-left px-3 py-2 bg-matte-black/30 hover:bg-matte-black/60 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white rounded-lg text-[10px] font-semibold transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Conversational Log */}
        <div className="md:col-span-7 bg-deep-indigo border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between h-[450px]">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-display font-bold text-base text-slate-200">Conversation Ledger</h3>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-3 custom-scrollbar text-xs">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-neon-teal text-matte-black font-semibold rounded-tr-none'
                    : 'bg-matte-black/40 border border-white/5 text-slate-300 rounded-tl-none font-sans font-medium'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Send Input Bar */}
          <div className="border-t border-white/5 pt-4 flex gap-2">
            <input
              type="text"
              placeholder="Ask RAAHI Voice: 'Activate SOS' or 'Find route SRM'..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCommandSubmit(inputText); }}
              className="flex-1 bg-matte-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-neon-teal transition-colors"
            />
            <button
              onClick={() => handleCommandSubmit(inputText)}
              className="p-3 bg-neon-teal hover:bg-neon-teal/90 text-matte-black rounded-xl active:scale-95 transition-transform shrink-0 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
