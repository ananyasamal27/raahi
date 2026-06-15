import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, Shield, Users, Cpu, Layers, Server, Map, 
  Heart, Zap, ShieldCheck, Mail, GraduationCap, Radio 
} from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function StaticSections() {
  return (
    <div className="space-y-0 overflow-hidden">
      
      {/* 1. Problem & Solution Section */}
      <motion.section 
        id="solution" 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 relative"
      >
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-neon-teal/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            The Problem & Our Solution
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-light">
            Commuting in Indian urban environments presents unique safety bottlenecks, crowd delays, and ecological costs. RAAHI redesigns this workflow with AI assistance.
          </p>
        </div>

        {/* Problem & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Problem Card */}
          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="bg-deep-indigo border border-white/10 rounded-2xl p-8 space-y-6 shadow-xl hover:border-soft-red/30"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-soft-red/10 text-soft-red rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">The Commute Bottlenecks</h3>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed font-light">
              Modern navigation maps focus exclusively on path latency (time), ignoring safety, illumination, and crowd crowding. Women and vulnerable groups are left to navigate dark underpasses, isolated alleys, or unsafe crowding hubs without real-time safeguards.
            </p>

            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-soft-red shrink-0" />
                <span>Isolated commute paths with poor light rating indexes.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-soft-red shrink-0" />
                <span>Unpredictable peak transit bottlenecks causing panic.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-soft-red shrink-0" />
                <span>No direct fallback security or coordinates tracking integration.</span>
              </li>
            </ul>
          </motion.div>

          {/* Solution Card */}
          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="bg-deep-indigo border border-white/10 rounded-2xl p-8 space-y-6 shadow-xl hover:border-neon-teal/30"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-neon-teal/10 text-neon-teal rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">The RAAHI Shield</h3>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed font-light">
              RAAHI computes three distinct routing options, calculating a predictive safety index based on crowd telemetry, active lighting, and nearby safe havens. It acts as an active digital shield that commuters can carry in their pockets.
            </p>

            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-teal shrink-0" />
                <span>AI route scoring balancing latency, safety, and CO₂ efficiency.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-teal shrink-0" />
                <span>Real-time location socket tracking with active Guardian checkpoints.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-teal shrink-0" />
                <span>SMS fallbacks (USSD protocol) for low signal offline areas.</span>
              </li>
            </ul>
          </motion.div>

        </div>

        {/* 5 Core Feature badges */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { title: "Predictive Crowd", desc: "Live node crowd metrics", icon: Users },
            { title: "AI Safety Score", desc: "Weighted safety analysis", icon: ShieldCheck },
            { title: "Multimodal Plan", desc: "Coordinating public transit", icon: Zap },
            { title: "Guardian Mode", desc: "Interactive SOS tracing", icon: Heart },
            { title: "Offline Pings", desc: "USSD messaging backup", icon: Radio }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              className="bg-matte-black border border-white/5 rounded-xl p-4 text-center hover:border-neon-teal/20 transition-all select-none"
            >
              <item.icon className="w-6 h-6 text-neon-teal mx-auto mb-2" />
              <h4 className="font-semibold text-slate-200 text-xs md:text-sm">{item.title}</h4>
              <p className="text-[10px] text-slate-500 mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 2. Tech Stack Section */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 relative"
      >
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            System Architecture
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-light">
            Modern, responsive engineering stack built for speed, real-time sync, and map coordinates telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Client */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-deep-indigo border border-white/10 rounded-xl p-6 flex flex-col justify-between shadow-xl hover:border-neon-teal/30 transition-all"
          >
            <div>
              <Layers className="w-8 h-8 text-neon-teal mb-4" />
              <h3 className="font-display font-bold text-lg text-white mb-2">Frontend Client</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                React application bundled with Vite for fast HMR. Styled with TailwindCSS and powered by Zustand global state.
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold text-neon-teal/80 tracking-widest mt-6">React · Tailwind · Zustand</span>
          </motion.div>

          {/* Backend */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-deep-indigo border border-white/10 rounded-xl p-6 flex flex-col justify-between shadow-xl hover:border-electric-cyan/30 transition-all"
          >
            <div>
              <Server className="w-8 h-8 text-electric-cyan mb-4" />
              <h3 className="font-display font-bold text-lg text-white mb-2">Real-time Backend</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Node.js server with Express router handling route analysis, and Socket.IO for real-time location streaming.
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold text-electric-cyan/80 tracking-widest mt-6">Node · Express · Socket.IO</span>
          </motion.div>

          {/* Maps */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-deep-indigo border border-white/10 rounded-xl p-6 flex flex-col justify-between shadow-xl hover:border-amber/30 transition-all"
          >
            <div>
              <Map className="w-8 h-8 text-amber mb-4" />
              <h3 className="font-display font-bold text-lg text-white mb-2">Map Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Leaflet.js mapping utilizing CARTO Dark Matter vector tile overlays, rendering safe points and crowd buffers.
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold text-amber/80 tracking-widest mt-6">Leaflet · CARTO Dark</span>
          </motion.div>

          {/* Predictive AI Roadmap */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-deep-indigo border border-white/10 rounded-xl p-6 flex flex-col justify-between shadow-xl hover:border-purple-400/30 transition-all"
          >
            <div>
              <Cpu className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="font-display font-bold text-lg text-white mb-2">AI Engine (Roadmap)</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Planned integration of XGBoost classifiers for safety indexing and LSTM networks for crowd flow forecasting.
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold text-purple-400/80 tracking-widest mt-6">XGBoost · LSTM · Prophet</span>
          </motion.div>

        </div>
      </motion.section>

      {/* 3. Impact Section */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 relative"
      >
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-electric-cyan/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Projected Commute Impact
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-light">
            Projected metrics based on commuter profiles and public transit optimizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-deep-indigo border border-white/10 rounded-2xl p-6 text-center shadow-xl hover:border-neon-teal/20 transition-all"
          >
            <span className="text-slate-450 text-xs font-bold uppercase tracking-wider block mb-2">Security index</span>
            <p className="font-display font-extrabold text-5xl text-neon-teal mb-4">70%+</p>
            <p className="text-slate-300 text-sm font-light">Increase in night-commuter confidence index using active Guardian tracking checkpoints.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-deep-indigo border border-white/10 rounded-2xl p-6 text-center shadow-xl hover:border-electric-cyan/20 transition-all"
          >
            <span className="text-slate-455 text-xs font-bold uppercase tracking-wider block mb-2">Time Optimization</span>
            <p className="font-display font-extrabold text-5xl text-electric-cyan mb-4">30m+</p>
            <p className="text-slate-300 text-sm font-light">Average daily time saved by rerouting away from predicted crowd bottlenecks.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-deep-indigo border border-white/10 rounded-2xl p-6 text-center shadow-xl hover:border-amber/20 transition-all"
          >
            <span className="text-slate-460 text-xs font-bold uppercase tracking-wider block mb-2">Ecological footprint</span>
            <p className="font-display font-extrabold text-5xl text-amber mb-4">20%</p>
            <p className="text-slate-300 text-sm font-light">Reduction in carbon footprint by preferring optimized sustainable multimodal transits.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* 4. Team Section */}
      <motion.section 
        id="team" 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5"
      >
        <div className="text-center mb-16">
          <span className="text-neon-teal text-xs font-bold tracking-widest uppercase block mb-3">Ctrl Alt Defeat</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Our Development Team
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm font-light">
            SRM Institute of Science and Technology, Kattankulathur, Chennai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Member 1: Ananya */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-deep-indigo border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-xl hover:border-neon-teal/20 transition-all"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-neon-teal to-electric-cyan flex items-center justify-center text-matte-black font-display font-extrabold text-3xl shrink-0 shadow-lg shadow-neon-teal/10">
              AS
            </div>
            <div className="text-center md:text-left space-y-2">
              <h3 className="font-display font-bold text-xl text-white">Ananya Samal</h3>
              <p className="text-xs text-neon-teal font-semibold flex items-center gap-1 justify-center md:justify-start">
                <GraduationCap className="w-4 h-4" /> SRM Institute of Science & Technology
              </p>
              <p className="text-slate-300 text-sm font-light">
                UI/UX Design, Presentation Strategy, and User Experience Flow design.
              </p>
              <div className="flex items-center gap-2 text-slate-500 text-xs pt-1 justify-center md:justify-start">
                <Mail className="w-3.5 h-3.5" />
                <span>ananyasamal@srm.edu</span>
              </div>
            </div>
          </motion.div>

          {/* Member 2: Kanishk */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-deep-indigo border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-xl hover:border-electric-cyan/20 transition-all"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-electric-cyan to-amber flex items-center justify-center text-matte-black font-display font-extrabold text-3xl shrink-0 shadow-lg shadow-electric-cyan/10">
              KS
            </div>
            <div className="text-center md:text-left space-y-2">
              <h3 className="font-display font-bold text-xl text-white">Kanishk Sadh</h3>
              <p className="text-xs text-electric-cyan font-semibold flex items-center gap-1 justify-center md:justify-start">
                <GraduationCap className="w-4 h-4" /> SRM Institute of Science & Technology
              </p>
              <p className="text-slate-300 text-sm font-light">
                AI Systems Architecture, Backend Development, and Predictive Mobility Logic.
              </p>
              <div className="flex items-center gap-2 text-slate-500 text-xs pt-1 justify-center md:justify-start">
                <Mail className="w-3.5 h-3.5" />
                <span>kanishksadh@srm.edu</span>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.section>

    </div>
  );
}
