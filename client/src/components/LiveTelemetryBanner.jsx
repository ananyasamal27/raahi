import React from 'react';
import { motion } from 'framer-motion';
import { Train, ShieldCheck, Users, CloudSun, Leaf } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 12 } }
};

export default function LiveTelemetryBanner() {
  const chips = [
    {
      icon: Train,
      color: 'text-electric-cyan border-electric-cyan/20 bg-electric-cyan/5',
      label: 'Metro Transit Node',
      value: 'Arriving in 4m (Plat 2)'
    },
    {
      icon: ShieldCheck,
      color: 'text-neon-teal border-neon-teal/20 bg-neon-teal/5',
      label: 'Live Safety Index',
      value: '8.7/10 (Area: High Coverage)'
    },
    {
      icon: Users,
      color: 'text-amber border-amber/20 bg-amber/5',
      label: 'Crowd Forecast',
      value: 'Low until 6:00 PM'
    },
    {
      icon: CloudSun,
      color: 'text-indigo-400 border-indigo-400/20 bg-indigo-400/5',
      label: 'Commute Weather',
      value: 'Clear, 28°C · Ideal walk'
    },
    {
      icon: Leaf,
      color: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
      label: 'Eco Carbon Saved',
      value: '4.6 kg saved this week'
    }
  ];

  return (
    <section className="py-6 px-6 max-w-7xl mx-auto border-t border-white/5 overflow-hidden">
      <div className="mb-4">
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-500 block mb-1">Real-Time Transit Diagnostics</span>
        <h3 className="font-display font-bold text-sm text-slate-300">Live Commute Telemetry</h3>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 md:grid-cols-5 gap-3.5"
      >
        {chips.map((chip, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className={`border rounded-xl p-3 flex flex-col justify-between bg-white/[0.02] backdrop-blur-sm shadow-md transition-all hover:border-white/20 ${chip.color}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">{chip.label}</span>
              <chip.icon className="w-3.5 h-3.5 shrink-0" />
            </div>
            <p className="text-xs font-bold text-slate-200 tracking-wide truncate">{chip.value}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
