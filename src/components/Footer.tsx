'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Trophy, MapPin, Play, Heart, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 text-foreground transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🏆</span>
              <span className="text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-display uppercase">
                FIFA 2026
              </span>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              The ultimate companion platform for the FIFA World Cup 2026. Real-time scores, schedules, group stage analysis, and streaming guides.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-on-surface-variant">Co-Hosts:</span>
              <span className="text-lg" title="United States">🇺🇸</span>
              <span className="text-lg" title="Canada">🇨🇦</span>
              <span className="text-lg" title="Mexico">🇲🇽</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-primary font-display mb-4">
              Tournament
            </h3>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li>
                <Link href="/matches" className="hover:text-secondary transition-all hover:underline decoration-secondary/30 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" /> Matches & Fixtures
                </Link>
              </li>
              <li>
                <Link href="/standings" className="hover:text-secondary transition-all hover:underline decoration-secondary/30 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-primary" /> Group Standings
                </Link>
              </li>
              <li>
                <Link href="/teams" className="hover:text-secondary transition-all hover:underline decoration-secondary/30 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-primary" /> Team Profiles
                </Link>
              </li>
              <li>
                <Link href="/stadiums" className="hover:text-secondary transition-all hover:underline decoration-secondary/30 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" /> Stadium Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Local Information */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-primary font-display mb-4">
              Watch & Discover
            </h3>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li>
                <Link href="/watch" className="hover:text-secondary transition-all hover:underline decoration-secondary/30 flex items-center gap-1.5">
                  <Play className="w-4 h-4 text-primary" /> Where to Watch (IST)
                </Link>
              </li>
              <li>
                <Link href="/watch" className="hover:text-secondary transition-all hover:underline decoration-secondary/30">
                  ZEE5 Streaming India
                </Link>
              </li>
              <li>
                <Link href="/watch" className="hover:text-secondary transition-all hover:underline decoration-secondary/30">
                  FOX & Telemundo US Guide
                </Link>
              </li>
              <li>
                <Link href="/stadiums" className="hover:text-secondary transition-all hover:underline decoration-secondary/30">
                  16 Host Cities & Travel Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Dev details */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-primary font-display mb-4">
              Companion Platform
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              This platform is an independent companion website developed for football fans worldwide. All matches schedules are automatically converted to <b>Indian Standard Time (IST)</b>.
            </p>
            <div className="text-xs bg-foreground/5 p-3 rounded-[var(--radius-base)] border border-border text-foreground/70 font-mono">
              🏆 Start Date: <b>June 11, 2026</b>
              <br />
              🏁 End Date: <b>July 19, 2026</b>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-foreground/60 gap-4">
          <p>© 2026 FIFA World Cup Ultimate Companion. All rights reserved.</p>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('replay-fifa-intro'));
              }
            }}
            className="hover:text-primary hover:underline transition-all cursor-pointer font-bold uppercase tracking-wider text-[10px]"
          >
            🎬 Replay Welcome Intro
          </button>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-tertiary fill-tertiary" /> for Football Fans worldwide.
          </p>
        </div>

      </div>
    </footer>
  );
}
