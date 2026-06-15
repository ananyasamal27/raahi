import React, { useState } from 'react';
import { Shield, Menu, X, Smartphone } from 'lucide-react';
import { useRaahiStore } from '../store/useRaahiStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { setUssdOpen, offlineMode, activeTab, setActiveTab } = useRaahiStore();

  const handleLogoClick = () => {
    setActiveTab('nav');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
          <Shield className="w-7 h-7 text-neon-teal" />
          <span className="font-display text-xl font-bold tracking-wider text-white">
            RAAHI<span className="text-neon-teal">.</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 font-medium text-slate-300">
          <button 
            onClick={() => setActiveTab('nav')} 
            className={`hover:text-neon-teal transition-all text-sm py-1 font-semibold ${
              activeTab === 'nav' ? 'text-neon-teal border-b-2 border-neon-teal' : ''
            }`}
          >
            Navigation
          </button>
          
          <button 
            onClick={() => setActiveTab('smart-city')} 
            className={`hover:text-neon-teal transition-all text-sm py-1 font-semibold ${
              activeTab === 'smart-city' ? 'text-neon-teal border-b-2 border-neon-teal' : ''
            }`}
          >
            Smart City
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`hover:text-neon-teal transition-all text-sm py-1 font-semibold ${
              activeTab === 'profile' ? 'text-neon-teal border-b-2 border-neon-teal' : ''
            }`}
          >
            Profile
          </button>

          <button 
            onClick={() => setActiveTab('voice')} 
            className={`hover:text-neon-teal transition-all text-sm py-1 font-semibold ${
              activeTab === 'voice' ? 'text-neon-teal border-b-2 border-neon-teal' : ''
            }`}
          >
            RAAHI Voice
          </button>
          
          <button 
            onClick={() => setUssdOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-all text-xs font-semibold ${
              offlineMode 
                ? 'bg-amber/10 border-amber/30 text-amber animate-pulse'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>USSD Dialer (*143#)</span>
          </button>
        </div>

        {/* CTA SOS Button */}
        <div className="hidden md:block">
          <button 
            onClick={() => {
              setActiveTab('nav');
              setTimeout(() => {
                const element = document.getElementById('guardian');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="px-4 py-2 rounded-lg bg-soft-red/20 text-soft-red border border-soft-red/30 font-semibold hover:bg-soft-red/30 transition-all hover:scale-[1.02]"
          >
            SOS Center
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-300" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-[73px] left-0 w-full bg-deep-indigo border-b border-white/10 flex flex-col gap-4 p-6 shadow-2xl">
          <button 
            onClick={() => { setIsOpen(false); setActiveTab('nav'); }} 
            className={`text-left py-2 border-b border-white/5 hover:text-neon-teal transition-colors font-semibold text-sm ${
              activeTab === 'nav' ? 'text-neon-teal' : 'text-slate-300'
            }`}
          >
            Navigation
          </button>
          <button 
            onClick={() => { setIsOpen(false); setActiveTab('smart-city'); }} 
            className={`text-left py-2 border-b border-white/5 hover:text-neon-teal transition-colors font-semibold text-sm ${
              activeTab === 'smart-city' ? 'text-neon-teal' : 'text-slate-300'
            }`}
          >
            Smart City
          </button>
          <button 
            onClick={() => { setIsOpen(false); setActiveTab('profile'); }} 
            className={`text-left py-2 border-b border-white/5 hover:text-neon-teal transition-colors font-semibold text-sm ${
              activeTab === 'profile' ? 'text-neon-teal' : 'text-slate-300'
            }`}
          >
            Profile
          </button>
          <button 
            onClick={() => { setIsOpen(false); setActiveTab('voice'); }} 
            className={`text-left py-2 border-b border-white/5 hover:text-neon-teal transition-colors font-semibold text-sm ${
              activeTab === 'voice' ? 'text-neon-teal' : 'text-slate-300'
            }`}
          >
            RAAHI Voice
          </button>
          
          <button 
            onClick={() => { setIsOpen(false); setUssdOpen(true); }}
            className="text-left py-2 border-b border-white/5 text-amber hover:text-amber/80 flex items-center gap-1.5 font-semibold text-sm"
          >
            <Smartphone className="w-4 h-4" />
            <span>Dial USSD (*143#)</span>
          </button>
          
          <button 
            onClick={() => {
              setIsOpen(false);
              setActiveTab('nav');
              setTimeout(() => {
                const element = document.getElementById('guardian');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-full mt-2 py-3 rounded-lg bg-soft-red text-white font-bold text-center shadow-lg shadow-soft-red/20 hover:bg-soft-red/90 transition-all"
          >
            🔴 SOS CENTER
          </button>
        </div>
      )}
    </nav>
  );
}
