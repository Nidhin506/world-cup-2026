'use client';

import React, { useState, useEffect } from 'react';
import { BROADCASTERS, getBroadcastersForCountry, RegionBroadcasters } from '../../data/broadcasters';
import { 
  Play, Tv, Globe, ExternalLink, MapPin, Info, CheckCircle2, 
  ShieldCheck, ShieldAlert, AlertCircle 
} from 'lucide-react';

export default function WatchPage() {
  const [selectedCountryCode, setSelectedCountryCode] = useState('IN');
  const [detectedCountry, setDetectedCountry] = useState<string>('');

  // Auto-detect country based on browser timezone/locale on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
        let code = 'IN'; // Default fallback
        let countryName = 'India';

        if (timeZone.includes('kolkata') || timeZone.includes('calcutta') || timeZone.includes('asia/dacca')) {
          code = 'IN';
          countryName = 'India';
        } else if (timeZone.includes('america/new_york') || timeZone.includes('america/chicago') || timeZone.includes('america/los_angeles') || timeZone.includes('us/')) {
          code = 'US';
          countryName = 'United States';
        } else if (timeZone.includes('london') || timeZone.includes('gb') || timeZone.includes('europe/london')) {
          code = 'GB';
          countryName = 'United Kingdom';
        } else if (timeZone.includes('toronto') || timeZone.includes('vancouver') || timeZone.includes('canada')) {
          code = 'CA';
          countryName = 'Canada';
        } else if (timeZone.includes('mexico') || timeZone.includes('monterrey')) {
          code = 'MX';
          countryName = 'Mexico';
        } else if (timeZone.includes('berlin') || timeZone.includes('germany')) {
          code = 'DE';
          countryName = 'Germany';
        } else if (timeZone.includes('paris') || timeZone.includes('france')) {
          code = 'FR';
          countryName = 'France';
        } else if (timeZone.includes('sao_paulo') || timeZone.includes('brazil')) {
          code = 'BR';
          countryName = 'Brazil';
        } else if (timeZone.includes('buenos_aires') || timeZone.includes('argentina')) {
          code = 'AR';
          countryName = 'Argentina';
        } else if (timeZone.includes('sydney') || timeZone.includes('australia')) {
          code = 'AU';
          countryName = 'Australia';
        } else if (timeZone.includes('tokyo') || timeZone.includes('japan')) {
          code = 'JP';
          countryName = 'Japan';
        }

        setTimeout(() => {
          setSelectedCountryCode(code);
          setDetectedCountry(countryName);
        }, 0);
      } catch (e) {
        console.error('Failed to auto-detect timezone:', e);
      }
    }
  }, []);

  const currentRegion = BROADCASTERS.find(b => b.countryCode === selectedCountryCode) || BROADCASTERS[0];

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountryCode(e.target.value);
    setDetectedCountry(''); // Clear auto-detected banner once manual changes are made
  };

  const getSubscriptionColor = (sub: string) => {
    if (sub === 'Free') return 'bg-secondary/10 text-secondary border-secondary/20';
    if (sub === 'Paid') return 'bg-primary/10 text-primary border-primary/20';
    return 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-24">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          📺 Where to Watch & Live Streams
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Official broadcasting channels and authorized streaming links for the FIFA World Cup 2026.
        </p>
      </div>

      {/* Geolocation Detection Banner */}
      {detectedCountry && (
        <div className="flex items-center gap-3 bg-secondary/10 border border-secondary/20 p-4 rounded-2xl text-xs sm:text-sm text-secondary relative">
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          <span>
            <b>Location Auto-Detected</b>: We detected you are visiting from <b>{detectedCountry}</b>. Showing local broadcast guides.
          </span>
        </div>
      )}

      {/* Selector Console */}
      <section className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-secondary" />
          <span className="font-extrabold text-sm">Select Broadcasting Region:</span>
        </div>
        <select
          value={selectedCountryCode}
          onChange={handleCountryChange}
          className="w-full sm:w-64 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary cursor-pointer"
        >
          {BROADCASTERS.map((b) => (
            <option key={b.countryCode} value={b.countryCode}>
              {b.countryName} ({b.countryCode})
            </option>
          ))}
        </select>
      </section>

      {/* Channel Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-1.5 font-display">
          <Tv className="w-5 h-5 text-secondary" /> Authorized Broadcasters for {currentRegion.countryName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentRegion.channels.map((ch, idx) => (
            <div 
              key={idx}
              className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4 hover:border-secondary/30 transition-all shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary border border-secondary/20 flex items-center justify-center font-black text-xs font-mono select-none">
                      {ch.logo}
                    </span>
                    <span className="font-black text-base">{ch.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-bold uppercase">
                    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                      {ch.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border ${getSubscriptionColor(ch.subscription)}`}>
                      {ch.subscription}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ch.notes}
                </p>
                <div className="flex flex-wrap gap-1 text-[10px] text-muted-foreground">
                  <span className="font-bold">Languages:</span>
                  <span>{ch.languages.join(', ')}</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={ch.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1 bg-primary hover:bg-primary/80 text-primary-foreground font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-primary/20 text-center uppercase tracking-wider"
                >
                  Launch Official Stream <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Legal disclaimer banner */}
      <section className="bg-muted/40 border border-border/80 rounded-2xl p-5 space-y-3 flex items-start gap-4">
        <div className="p-2.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary mt-1">
          <ShieldCheck className="w-6 h-6 flex-shrink-0" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-extrabold text-foreground uppercase tracking-widest text-[10px] font-display">
            Official and Legal Streams Only
          </h4>
          <p className="text-muted-foreground leading-relaxed font-sans">
            This directory maintains listings of officially authorized broadcaster rights-holders. We do not index or link to illegal pirated streams, protecting your device security and supporting the official broadcast rights holders.
          </p>
          <div className="pt-2 text-secondary font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> 100% Secure, Authorized Links
          </div>
        </div>
      </section>

    </div>
  );
}
