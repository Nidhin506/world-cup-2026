'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useMatchSimulatorStore } from '../../../store/matchSimulator';
import { formatToIST } from '../../../utils/timezone';
import { 
  Tv, MapPin, Clock, ArrowLeft, Users, FileText, BarChart3, 
  HelpCircle, AlertCircle, RefreshCw, Send 
} from 'lucide-react';
import TeamFlag from '../../../components/TeamFlag';

interface MatchCenterClientProps {
  id: string;
}

export default function MatchCenterClient({ id }: MatchCenterClientProps) {
  const { matches, activeMatchId, selectMatch, activeMatchDetail, isLoading } = useMatchSimulatorStore();
  const [activeTab, setActiveTab] = useState<'feed' | 'lineups' | 'stats'>('feed');
  const [lineupTeam, setLineupTeam] = useState<'home' | 'away'>('home');
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Sync active match id with store
  useEffect(() => {
    selectMatch(id);
    return () => selectMatch(null);
  }, [id, selectMatch]);

  const match = activeMatchDetail && (activeMatchDetail.id === id)
    ? activeMatchDetail
    : matches.find((m) => m.id === id);

  // Autoscroll to bottom of commentary feed when new text arrives
  useEffect(() => {
    if (activeTab === 'feed' && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [match?.commentary, activeTab]);

  if (isLoading && !match) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground text-sm font-semibold">Loading live match center data...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-black">Match Not Found</h1>
        <p className="text-muted-foreground text-sm">We couldn&apos;t find a fixture matching code &ldquo;{id}&rdquo;.</p>
        <Link href="/matches" className="inline-flex text-secondary font-extrabold uppercase text-xs hover:underline">
          Return to Schedule
        </Link>
      </div>
    );
  }

  // TBD match placeholder
  if (!match.homeTeam || !match.awayTeam) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Link href="/matches" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-secondary font-bold uppercase transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Schedule
        </Link>
        
        <div className="glass-card rounded-3xl p-8 border border-white/5 text-center space-y-4">
          <HelpCircle className="w-16 h-16 text-muted-foreground/30 mx-auto animate-pulse" />
          <h1 className="text-2xl font-black">Match Details TBD</h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            This is a <b>{match.stage}</b> match (Match #{match.number}). Teams will be decided once the previous rounds conclude.
          </p>
          <div className="text-xs bg-muted/50 p-4 rounded-xl max-w-xs mx-auto border border-border">
            🏟️ Stadium: <b>{match.stadiumName}</b>
            <br />
            📍 Location: <b>{match.city}</b>
            <br />
            📅 Kickoff (IST): <b>{formatToIST(match.date)}</b>
          </div>
        </div>
      </div>
    );
  }

  const isLive = match.status === 'LIVE';
  const isCompleted = match.status === 'COMPLETED';

  // Stats comparison progress bars
  const renderStatRow = (label: string, homeVal?: number, awayVal?: number) => {
    if (homeVal === undefined || awayVal === undefined) return null;
    const total = homeVal + awayVal || 1;
    const homePercent = (homeVal / total) * 100;

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="font-mono text-sm">{homeVal}</span>
          <span className="text-muted-foreground uppercase tracking-widest text-[10px]">{label}</span>
          <span className="font-mono text-sm">{awayVal}</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: `${homePercent}%` }}
          ></div>
          <div 
            className="h-full bg-secondary transition-all duration-500" 
            style={{ width: `${100 - homePercent}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Lineup positions coordinate layout for standard 4-3-3 formation on a half-pitch (facing up)
  const pitchCoords = [
    { left: '50%', bottom: '5%' },   // GK
    { left: '15%', bottom: '28%' },  // LB
    { left: '38%', bottom: '25%' },  // LCB
    { left: '62%', bottom: '25%' },  // RCB
    { left: '85%', bottom: '28%' },  // RB
    { left: '25%', bottom: '52%' },  // LCM
    { left: '50%', bottom: '48%' },  // CM
    { left: '75%', bottom: '52%' },  // RCM
    { left: '20%', bottom: '78%' },  // LW
    { left: '50%', bottom: '82%' },  // CF
    { left: '80%', bottom: '78%' }   // RW
  ];

  const currentSquad = lineupTeam === 'home' ? match.homeTeam.squad : match.awayTeam.squad;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 pb-24">
      
      {/* 1. Breadcrumbs */}
      <Link 
        href="/matches" 
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-secondary font-bold uppercase transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Back to matches
      </Link>

      {/* 2. Scoreboard Banner */}
      <section className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden text-center shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="absolute top-4 left-4 text-[10px] text-muted-foreground font-bold bg-muted px-3 py-1 rounded-full uppercase tracking-wider">
          Match #{match.number} • {match.stage}
        </div>

        {/* Live Minute Tag */}
        {isLive && (
          <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-black text-red-500 animate-pulse bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> LIVE {match.minute}&apos;
          </div>
        )}

        <div className="grid grid-cols-7 items-center justify-between gap-2 sm:gap-4 mt-6">
          {/* Home Team */}
          <div className="col-span-3 flex flex-col items-center space-y-2">
            <TeamFlag code={match.homeTeam.code} name={match.homeTeam.name} className="w-16 h-11 sm:w-20 sm:h-14 rounded-md shadow-md" />
            <span className="font-black text-sm sm:text-lg">{match.homeTeam.name}</span>
            <span className="text-xs text-muted-foreground font-semibold">Group {match.homeTeam.group}</span>
          </div>

          {/* Scores or Kickoff */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            {match.status === 'UPCOMING' ? (
              <div className="space-y-1">
                <span className="text-xs font-black text-muted-foreground tracking-widest uppercase">VS</span>
                <div className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/15 font-mono">
                  {formatToIST(match.date, 'time')}
                </div>
              </div>
            ) : (
              <div className="text-3xl sm:text-5xl font-black font-mono tracking-tight flex items-center justify-center gap-2">
                <span>{match.homeScore}</span>
                <span className="text-muted-foreground/30">-</span>
                <span>{match.awayScore}</span>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="col-span-3 flex flex-col items-center space-y-2">
            <TeamFlag code={match.awayTeam.code} name={match.awayTeam.name} className="w-16 h-11 sm:w-20 sm:h-14 rounded-md shadow-md" />
            <span className="font-black text-sm sm:text-lg">{match.awayTeam.name}</span>
            <span className="text-xs text-muted-foreground font-semibold">Group {match.awayTeam.group}</span>
          </div>
        </div>

        {/* Stadium Info Footer */}
        <div className="mt-8 pt-4 border-t border-border/30 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 font-semibold">
            <MapPin className="w-4 h-4 text-secondary" /> {match.stadiumName}, {match.city}
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <Clock className="w-4 h-4 text-secondary" /> IST: {formatToIST(match.date)}
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <Tv className="w-4 h-4 text-secondary" /> ZEE5 (Zee Entertainment)
          </span>
        </div>
      </section>

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-border text-xs sm:text-sm font-bold bg-card rounded-2xl p-1 shadow-md border border-white/5">
        {[
          { id: 'feed', name: 'Commentary & Events', icon: FileText },
          { id: 'lineups', name: 'Lineups & Pitch', icon: Users },
          { id: 'stats', name: 'Match Statistics', icon: BarChart3 }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-grow py-3 flex items-center justify-center gap-1.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-foreground/70 hover:text-secondary'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.name}</span>
              <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content */}
      <div className="min-h-[50vh]">
        
        {/* TAB A: MATCH FEED (COMMENTARY & TIMELINE) */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {/* Timeline Events */}
            <div className="glass-card rounded-3xl p-5 border border-white/5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                Key Match Events
              </h3>
              
              {match.events && match.events.length > 0 ? (
                <div className="relative border-l border-border pl-6 space-y-4">
                  {match.events.map((e, idx) => {
                    const isHome = e.teamId === match.homeTeam?.id;
                    const eventTeam = isHome ? match.homeTeam : match.awayTeam;

                    return (
                      <div key={idx} className="relative text-xs">
                        {/* Event bullet indicator */}
                        <span className={`absolute -left-[31px] w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-black border text-white shadow ${
                          e.type === 'GOAL' 
                            ? 'bg-secondary border-secondary-400' 
                            : e.type === 'YELLOW_CARD'
                            ? 'bg-yellow-500 border-yellow-400'
                            : e.type === 'RED_CARD'
                            ? 'bg-red-500 border-red-400'
                            : 'bg-primary border-primary-container'
                        }`}>
                          {e.type === 'GOAL' ? '⚽' : e.type === 'YELLOW_CARD' ? '🟨' : e.type === 'RED_CARD' ? '🟥' : '🔄'}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <span className="font-black text-muted-foreground font-mono w-6">{e.minute}&apos;</span>
                          <span className="font-extrabold">{e.playerName}</span>
                          <span className="text-[10px] text-muted-foreground font-semibold">({e.type.replace('_', ' ')})</span>
                          <span className="text-xs flex items-center gap-1"><TeamFlag code={eventTeam?.code} name={eventTeam?.name} className="w-4 h-2.5 rounded-[1px]" /> {eventTeam?.code}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No events recorded yet. Waiting for action...</p>
              )}
            </div>

            {/* Commentary Feed */}
            <div className="glass-card rounded-3xl p-5 border border-white/5 space-y-4 flex flex-col justify-between max-h-[500px]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                Text Commentary Feed
              </h3>

              <div className="space-y-3 overflow-y-auto flex-grow pr-2 scrollbar-thin text-xs max-h-[380px]">
                {match.commentary && match.commentary.length > 0 ? (
                  match.commentary.map((c, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl border border-border/40 ${
                        idx === match.commentary!.length - 1 
                          ? 'bg-secondary/5 border-secondary/20' 
                          : 'bg-muted/10'
                      }`}
                    >
                      <span className="font-black text-secondary font-mono inline-block w-8">{c.minute}&apos;</span>
                      <span className="text-foreground/80 leading-relaxed font-semibold">{c.text}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic text-center p-4">Waiting for kickoff commentary...</p>
                )}
                <div ref={bottomRef} />
              </div>
            </div>
          </div>
        )}

        {/* TAB B: LINEUPS & SOCCER PITCH */}
        {activeTab === 'lineups' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left list panel (4 Cols) */}
            <div className="md:col-span-4 glass-card rounded-3xl p-5 border border-white/5 space-y-4">
              {/* Selector */}
              <div className="flex border border-border p-0.5 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setLineupTeam('home')}
                  className={`flex-grow py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    lineupTeam === 'home' ? 'bg-primary text-primary-foreground shadow' : 'text-foreground/80 hover:text-secondary'
                  }`}
                >
                  <TeamFlag code={match.homeTeam.code} name={match.homeTeam.name} className="w-4.5 h-3 rounded-[1px]" /> {match.homeTeam.code} (Home)
                </button>
                <button
                  onClick={() => setLineupTeam('away')}
                  className={`flex-grow py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    lineupTeam === 'away' ? 'bg-primary text-primary-foreground shadow' : 'text-foreground/80 hover:text-secondary'
                  }`}
                >
                  <TeamFlag code={match.awayTeam.code} name={match.awayTeam.name} className="w-4.5 h-3 rounded-[1px]" /> {match.awayTeam.code} (Away)
                </button>
              </div>

              {/* Player list */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-wider pb-1 border-b border-border/40">
                  Starting XI (Formation: 4-3-3)
                </h4>
                <div className="space-y-2 text-xs">
                  {currentSquad.slice(0, 11).map((p, idx) => (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border/40">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-muted-foreground w-4">#{p.shirtNumber}</span>
                        <span className="font-extrabold">{p.name}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{p.position}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right tactical half-pitch visualizer (8 Cols) */}
            <div className="md:col-span-8 space-y-2">
              <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden pitch-bg border border-secondary/20 shadow-2xl">
                
                {/* Visual lines overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 border-t border-white/20"></div>
                <div className="absolute bottom-0 left-[25%] right-[25%] h-[20%] border-t border-x border-white/20"></div>
                <div className="absolute bottom-0 left-[35%] right-[35%] h-[7%] border-t border-x border-white/20"></div>
 
                {/* Team metadata block inside pitch */}
                <div className="absolute top-4 inset-x-0 text-center select-none">
                  <span className="text-[10px] uppercase font-black tracking-widest text-secondary bg-slate-950/80 px-4 py-1.5 rounded-full border border-secondary/20 backdrop-blur">
                    {lineupTeam === 'home' ? match.homeTeam.name : match.awayTeam.name} Lineup
                  </span>
                </div>

                {/* Map players */}
                {currentSquad.slice(0, 11).map((p, idx) => {
                  const coord = pitchCoords[idx] || { left: '50%', bottom: '50%' };
                  
                  return (
                    <div
                      key={p.id}
                      className="absolute transform -translate-x-1/2 translate-y-1/2 flex flex-col items-center text-center cursor-help group z-10"
                      style={{ left: coord.left, bottom: coord.bottom }}
                    >
                      {/* Player circle node */}
                      <span className="w-8 h-8 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-xs font-black text-white shadow-lg group-hover:scale-110 group-hover:bg-primary transition-all">
                        {p.shirtNumber}
                      </span>
                      {/* Player label text */}
                      <span className="mt-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] sm:text-[10px] font-extrabold text-white max-w-[80px] truncate shadow border border-white/10 select-none">
                        {p.name.split(' ').pop()}
                      </span>
                    </div>
                  );
                })}

              </div>
            </div>

          </div>
        )}

        {/* TAB C: MATCH STATS */}
        {activeTab === 'stats' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary pb-2 border-b border-border/40">
              Live Team Comparison Metrics
            </h3>

            {match.status === 'UPCOMING' ? (
              <div className="py-12 text-center text-muted-foreground text-xs italic">
                Match has not started. Statistics will accumulate once the simulator starts running.
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. Possession */}
                {renderStatRow('Possession (%)', match.possession?.[0], match.possession?.[1])}
                
                {/* 2. Total Shots */}
                {renderStatRow('Total Shots', match.shots?.[0], match.shots?.[1])}
                
                {/* 3. Shots on Target */}
                {renderStatRow('Shots on Target', match.shotsOnTarget?.[0], match.shotsOnTarget?.[1])}
                
                {/* 4. Passes Completed */}
                {renderStatRow('Passes Completed', match.passes?.[0], match.passes?.[1])}
                
                {/* 5. Fouls Committed */}
                {renderStatRow('Fouls Committed', match.fouls?.[0], match.fouls?.[1])}
                
                {/* 6. Corner Kicks */}
                {renderStatRow('Corner Kicks', match.corners?.[0], match.corners?.[1])}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
