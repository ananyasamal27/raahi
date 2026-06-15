import React from 'react';
import { Shield, Users, Timer, Leaf, AlertTriangle, TrendingDown, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SmartCityDashboard() {
  const incidentReports = [
    { location: "Tambaram Local Platform 1", type: "Heavy Crowding", reports: 84, trend: "+12% this week", severity: "medium" },
    { location: "Hebbal Flyover Junction", type: "Poor lighting", reports: 42, trend: "-24% (fixed)", severity: "low" },
    { location: "Majestic Majestic Circle", type: "Harassment report", reports: 18, trend: "Police dispatched", severity: "high" },
    { location: "Dadar Platform 3 Corridor", type: "Crowd Surge", reports: 92, trend: "+18% peak hours", severity: "high" }
  ];

  return (
    <section id="smart-city" className="py-12 px-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-xs font-bold text-neon-teal uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Govt Infrastructure Dashboard</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">Urban Intelligence Center</h2>
          <p className="text-slate-400 text-sm mt-1">Real-time municipal safety telemetry, incident metrics, and smart-city safety scores.</p>
        </div>
        
        {/* Live indicator */}
        <div className="flex items-center gap-2 mt-4 md:mt-0 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-teal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-teal"></span>
          </span>
          <span className="text-xs text-slate-300 font-mono font-bold uppercase tracking-wider">LIVE TELEMETRY: SYNCED</span>
        </div>
      </div>

      {/* Grid of Key Telemetry Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Avg Emergency Dispatch", val: "4m 12s", desc: "-18% due to RAAHI safe Corridors", icon: <Timer className="w-5 h-5 text-neon-teal" />, color: "border-neon-teal/20 bg-neon-teal/5" },
          { title: "Guardians Active Now", val: "1,480", desc: "+320 peer escorts patrolling", icon: <Users className="w-5 h-5 text-electric-cyan" />, color: "border-electric-cyan/20 bg-electric-cyan/5" },
          { title: "CO₂ Emissions Saved", val: "14,820 kg", desc: "Decentralized carbon offset logs", icon: <Leaf className="w-5 h-5 text-amber" />, color: "border-amber/20 bg-amber/5" },
          { title: "Reported Incidents Resolved", val: "94.2%", desc: "Smart city grid action dispatch", icon: <CheckCircle2 className="w-5 h-5 text-teal-400" />, color: "border-teal-500/20 bg-teal-500/5" }
        ].map((item, idx) => (
          <div key={idx} className={`p-6 border rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden ${item.color}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">{item.title}</span>
              <div className="p-2 rounded-xl bg-matte-black/40 border border-white/5">{item.icon}</div>
            </div>
            <div className="mt-4">
              <h4 className="text-3xl font-display font-extrabold text-white tracking-tight">{item.val}</h4>
              <p className="text-[10px] text-slate-400 font-medium mt-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-neon-teal shrink-0" />
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid: Heatmap incidents list & Safety chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Incident Reports and Hotspot List */}
        <div className="lg:col-span-7 bg-deep-indigo border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Urban Hotspot Registry</h3>
              <p className="text-xs text-slate-400 font-light">Community reported and IoT sensor flagged alert nodes</p>
            </div>
            <span className="text-[10px] bg-soft-red/10 border border-soft-red/20 text-soft-red px-2 py-0.5 rounded font-mono font-bold">4 HIGH ALERTS</span>
          </div>

          <div className="space-y-4">
            {incidentReports.map((report, idx) => (
              <div key={idx} className="p-4 bg-matte-black/30 border border-white/5 rounded-xl flex items-center justify-between transition-all hover:border-white/10">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    report.severity === 'high' ? 'bg-soft-red/10 border border-soft-red/20 text-soft-red' : 
                    report.severity === 'medium' ? 'bg-amber/10 border border-amber/20 text-amber' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">{report.location}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{report.type} · {report.reports} citizens flagged</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-mono font-bold ${
                    report.severity === 'high' ? 'text-soft-red' : 'text-slate-400'
                  }`}>{report.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: City Safety Index Chart (CSS Graph) */}
        <div className="lg:col-span-5 bg-deep-indigo border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="font-display font-bold text-lg text-white">Safety Index Distribution</h3>
            <p className="text-xs text-slate-400 font-light">Average safety confidence index across major Indian cities</p>
          </div>

          {/* Sleek CSS Chart */}
          <div className="space-y-4 py-2">
            {[
              { city: "Mumbai Metro", score: 8.6, pct: "86%", color: "bg-neon-teal" },
              { city: "Chennai Central", score: 9.1, pct: "91%", color: "bg-electric-cyan" },
              { city: "Delhi NCR", score: 7.4, pct: "74%", color: "bg-amber" },
              { city: "Bengaluru Hub", score: 8.8, pct: "88%", color: "bg-neon-teal" }
            ].map((cityData, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>{cityData.city}</span>
                  <span className="font-mono text-white">{cityData.score}/10</span>
                </div>
                <div className="w-full h-2.5 bg-matte-black rounded-full overflow-hidden relative">
                  <div 
                    className={`h-full rounded-full ${cityData.color} transition-all duration-1000`}
                    style={{ width: cityData.pct }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl text-[10px] text-slate-400 leading-normal flex items-start gap-2 font-medium">
            <ArrowUpRight className="w-4 h-4 text-neon-teal shrink-0" />
            <span>Smart City safety index has risen by 12.4% city-wide in corridors integrated with continuous RAAHI telemetry beacons.</span>
          </div>
        </div>

      </div>
    </section>
  );
}
