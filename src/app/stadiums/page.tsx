'use client';

import React, { useState, useEffect } from 'react';
import { STADIUMS, Stadium } from '../../data/stadiums';
import { 
  MapPin, Users, Calendar, Bus, Info, Building, Compass, Landmark,
  ArrowRight, ShieldCheck, CheckCircle2 
} from 'lucide-react';

export default function StadiumsPage() {
  const [activeStadiumId, setActiveStadiumId] = useState<string>(STADIUMS[0].id);

  // Read hash on mount for deep linking (e.g. from search)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleHashChange = () => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
          const found = STADIUMS.find((s) => s.id === hash);
          if (found) setActiveStadiumId(found.id);
        }
      };
      // Check immediately
      handleHashChange();
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);

  const activeStadium = STADIUMS.find((s) => s.id === activeStadiumId) || STADIUMS[0];

  const handleSelectStadium = (id: string) => {
    setActiveStadiumId(id);
    if (typeof window !== 'undefined') {
      window.location.hash = id;
    }
  };

  const getCountryEmoji = (country: Stadium['country']) => {
    if (country === 'USA') return '🇺🇸';
    if (country === 'Canada') return '🇨🇦';
    return '🇲🇽';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-24 font-sans text-on-surface">
      
      {/* Page Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black font-display uppercase tracking-tight">Host Venues & Stadiums</h1>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          Profiles of the 16 legendary stadiums hosting the FIFA World Cup 2026 across North America.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Venues Directory list (4 Cols) */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-5 border border-white/10 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary pb-2 border-b border-white/5 font-display">
            Stadium Directory
          </h2>

          <div className="space-y-1.5 max-h-[65vh] overflow-y-auto pr-2 scrollbar-thin">
            {STADIUMS.map((s) => {
              const isActive = s.id === activeStadiumId;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectStadium(s.id)}
                  className={`w-full flex items-center justify-between text-left p-3 rounded-xl border transition-all cursor-pointer font-sans ${
                    isActive
                      ? 'bg-primary/10 text-primary border-primary/30 font-bold shadow-[0_0_8px_rgba(139,92,246,0.15)]'
                      : 'border-white/5 hover:border-secondary/20 bg-white/5 hover:bg-white/10 text-on-surface'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs sm:text-sm font-extrabold truncate">{s.name}</div>
                    <div className="text-[10px] text-on-surface-variant truncate">
                      {getCountryEmoji(s.country)} {s.city}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-on-surface-variant shrink-0 border border-white/10">
                    {s.capacity.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Venue Profile Card (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-xl space-y-6">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
            
            {/* Header Title inside card */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/5 pb-6 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-3xl leading-none">{getCountryEmoji(activeStadium.country)}</span>
                  <h2 className="text-2xl font-black font-display text-on-surface">{activeStadium.name}</h2>
                </div>
                <p className="text-xs text-on-surface-variant font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-secondary" /> {activeStadium.city}, {activeStadium.country}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 font-sans">
                <div className="text-center px-3">
                  <div className="text-[9px] font-bold text-on-surface-variant uppercase">Capacity</div>
                  <div className="text-sm font-black font-mono mt-0.5 text-secondary">{activeStadium.capacity.toLocaleString()}</div>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="text-center px-3">
                  <div className="text-[9px] font-bold text-on-surface-variant uppercase">Opened</div>
                  <div className="text-sm font-black font-mono mt-0.5 text-on-surface">{activeStadium.opened}</div>
                </div>
              </div>
            </div>

            {/* Stadium Visual Placeholder */}
            <div className="h-60 rounded-2xl bg-surface-container relative overflow-hidden border border-white/10 flex flex-col items-center justify-center p-6 text-center select-none text-on-surface/40 space-y-2">
              <Compass className="w-16 h-16 text-primary/10 absolute top-4 right-4 animate-spin-slow" />
              <Building className="w-16 h-16 text-primary/10" />
              <div className="space-y-1 relative z-10">
                <div className="font-extrabold text-sm text-primary uppercase tracking-widest font-display">{activeStadium.name}</div>
                <div className="text-xs text-on-surface-variant">Architectural Venue Profile & Map Guide</div>
              </div>
            </div>

            {/* General Info block */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-1 font-display">
                <Info className="w-4 h-4 text-secondary" /> Overview & Highlights
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {activeStadium.description}
              </p>
            </div>

            {/* Sub details columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              
              {/* Architecture details */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1 font-display">
                  <Building className="w-4 h-4 text-secondary" /> Architectural Design
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {activeStadium.architecture}
                </p>
              </div>

              {/* Transit details */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1 font-display">
                  <Bus className="w-4 h-4 text-secondary" /> Travel & Transit Guidelines
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {activeStadium.transport}
                </p>
              </div>

            </div>

            {/* Hosted matches checklist */}
            <div className="p-5 rounded-2xl bg-white/2 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1 font-display">
                📅 Match Allocations
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-on-surface">
                {activeStadium.hostedMatches.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
