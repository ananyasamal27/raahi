import React from 'react';
import { useRaahiStore } from '../store/useRaahiStore';
import { Clock, ShieldCheck, Leaf, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecentJourneys() {
  const { journeyHistory, clearJourneyHistory } = useRaahiStore();

  if (journeyHistory.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-lg">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Commute Logbook</p>
        <p className="text-sm text-slate-500 font-light py-4">
          No tracked commutes in history yet. Your completed simulations will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-deep-indigo border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-white">Commute Logbook</h3>
          <p className="text-xs text-slate-400 font-light">Saved records of secure transit routes</p>
        </div>
        <button
          onClick={clearJourneyHistory}
          className="p-2 text-slate-500 hover:text-soft-red transition-colors rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
          title="Clear History"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {journeyHistory.map((trip, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-matte-black/40 border border-white/5 rounded-xl space-y-3 relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1 max-w-[70%]">
                <div className="flex items-center gap-1.5 text-slate-200 text-xs font-semibold truncate">
                  <span className="truncate">{trip.source}</span>
                  <ArrowRight className="w-3 h-3 text-neon-teal shrink-0" />
                  <span className="truncate">{trip.destination}</span>
                </div>
                <p className="text-[9px] text-slate-500 font-mono font-medium">{trip.timestamp || "Just now"}</p>
              </div>

              {/* Safety Index Tag */}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-neon-teal/10 border border-neon-teal/15 text-[10px] text-neon-teal font-extrabold font-mono">
                <ShieldCheck className="w-3 h-3" />
                <span>{trip.safetyScore} Index</span>
              </div>
            </div>

            {/* Quick stats row */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5 pt-2 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {trip.durationMins} mins
              </span>
              <span className="flex items-center gap-1 text-amber">
                <Leaf className="w-3.5 h-3.5" />
                -{trip.co2SavedKg}kg CO₂
              </span>
              <span className="text-neon-teal font-bold bg-neon-teal/10 px-1.5 py-0.2 rounded text-[9px]">
                +{trip.points || 25} Eco Pts
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
