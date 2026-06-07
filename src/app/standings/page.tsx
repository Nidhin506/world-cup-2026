'use client';

import React from 'react';
import { useMatchSimulatorStore } from '../../store/matchSimulator';
import { Trophy, HelpCircle, AlertCircle, CheckCircle, ShieldAlert, Award } from 'lucide-react';
import Link from 'next/link';
import TeamFlag from '../../components/TeamFlag';

export default function StandingsPage() {
  const { standings, bestThirdPlaced, isLoading, error, syncAll, matches } = useMatchSimulatorStore();

  const bestThird = bestThirdPlaced || [];
  const groupLetters = Object.keys(standings || {});

  // Find if a 3rd placed team is in the top 8 of the best third placed tracker
  const isTopEightThirdPlaced = (teamId: string) => {
    return bestThird.slice(0, 8).some((standing) => standing.team.id === teamId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10 pb-24 font-sans text-on-surface">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black font-display uppercase tracking-tight">Group Standings</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Real-time standings for the 48 teams competing across Groups A to L.
          </p>
        </div>
        
        {/* Quick rules alert */}
        <div className="flex items-center gap-2 text-xs bg-secondary/10 border border-secondary/20 p-3 rounded-xl max-w-sm text-secondary font-sans font-semibold">
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          <span>
            <b>Rule</b>: The top 2 teams from each group plus the 8 best 3rd-placed teams qualify for the <b>Round of 32</b>.
          </span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 animate-bounce" />
          <div className="flex-grow">
            <span>{error}</span>
          </div>
          <button 
            onClick={syncAll}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg transition-all text-[10px] uppercase font-display cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {isLoading && matches.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-card rounded-3xl p-5 border border-white/5 animate-pulse space-y-4">
              <div className="h-4 w-1/4 bg-white/5 rounded"></div>
              <div className="space-y-2.5">
                {[1, 2, 3, 4].map((p) => (
                  <div key={p} className="flex justify-between items-center py-1">
                    <div className="h-4 w-1/3 bg-white/5 rounded"></div>
                    <div className="h-4 w-12 bg-white/5 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* --- SECTION 1: BEST 3RD-PLACED TRACKER --- */}
          <section className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-black font-display uppercase tracking-tight flex items-center gap-1.5 text-on-surface">
              <Award className="w-5 h-5 text-secondary" /> Best 3rd-Placed Teams Tracker
            </h2>
            <p className="text-xs text-on-surface-variant">
              Live ranking of 3rd place teams across all 12 groups. The top 8 qualify for the Round of 32.
            </p>
          </div>
          <span className="text-[10px] uppercase font-black tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 font-display">
            48-Team Format Special
          </span>
        </div>

        {/* 3rd place table */}
        <div className="overflow-x-auto border border-white/10 rounded-2xl">
          <table className="w-full border-collapse text-xs text-left">
            <thead>
              <tr className="bg-white/2 text-on-surface-variant uppercase font-black text-[10px] tracking-wider border-b border-white/10">
                <th className="p-3 text-center w-12 font-display">Pos</th>
                <th className="p-3 font-display">Team</th>
                <th className="p-3 text-center font-display">Group</th>
                <th className="p-3 text-center font-display">P</th>
                <th className="p-3 text-center font-display">W</th>
                <th className="p-3 text-center font-display">D</th>
                <th className="p-3 text-center font-display">L</th>
                <th className="p-3 text-center font-display">GD</th>
                <th className="p-3 text-center font-bold font-display">Pts</th>
                <th className="p-3 text-center w-36 font-display">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {bestThird.map((s, idx) => {
                const isQualified = idx < 8;

                return (
                  <tr 
                    key={s.team.id} 
                    className={`hover:bg-white/5 transition-colors font-sans ${
                      isQualified ? 'bg-secondary/5' : 'bg-destructive/5'
                    }`}
                  >
                    <td className="p-3 text-center font-mono font-bold text-on-surface">{idx + 1}</td>
                    <td className="p-3 font-extrabold flex items-center gap-2">
                      <TeamFlag code={s.team.code} name={s.team.name} className="w-5 h-3.5" />
                      <Link href={`/teams#${s.team.id}`} className="hover:text-primary transition-colors text-on-surface">
                        {s.team.name}
                      </Link>
                    </td>
                    <td className="p-3 text-center font-bold font-sans">Group {s.team.group}</td>
                    <td className="p-3 text-center font-mono text-on-surface-variant">{s.played}</td>
                    <td className="p-3 text-center font-mono text-on-surface-variant">{s.won}</td>
                    <td className="p-3 text-center font-mono text-on-surface-variant">{s.drawn}</td>
                    <td className="p-3 text-center font-mono text-on-surface-variant">{s.lost}</td>
                    <td className="p-3 text-center font-mono font-bold text-on-surface">{s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}</td>
                    <td className="p-3 text-center font-mono font-black text-sm text-primary">{s.points}</td>
                    <td className="p-3 text-center font-sans">
                      {isQualified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full border border-secondary/20 uppercase tracking-wider">
                          <CheckCircle className="w-3 h-3" /> Qualifies (Q)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-destructive bg-destructive/10 px-2.5 py-0.5 rounded-full border border-destructive/20 uppercase tracking-wider">
                          <ShieldAlert className="w-3 h-3" /> Eliminated
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- SECTION 2: INDIVIDUAL GROUPS GRID --- */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight flex items-center gap-2 text-on-surface">
          <Trophy className="w-6 h-6 text-primary" /> Group Stage Tables
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {groupLetters.map((groupLetter) => {
            const groupStandings = standings[groupLetter];

            return (
              <div 
                key={groupLetter} 
                className="glass-card rounded-3xl p-5 border border-white/10 space-y-4 hover:border-primary/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.1)] transition-all shadow-md"
              >
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-base font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary uppercase">
                    Group {groupLetter}
                  </h3>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-sans">
                    Round of 32 race
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="text-on-surface-variant font-black text-[9px] uppercase tracking-wider border-b border-white/5 font-display">
                        <th className="pb-2 w-8 text-center">Pos</th>
                        <th className="pb-2">Team</th>
                        <th className="pb-2 text-center w-8">P</th>
                        <th className="pb-2 text-center w-8">W</th>
                        <th className="pb-2 text-center w-8">D</th>
                        <th className="pb-2 text-center w-8">L</th>
                        <th className="pb-2 text-center w-10">GD</th>
                        <th className="pb-2 text-center w-10 font-bold">Pts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {groupStandings.map((s, idx) => {
                        const isTopTwo = idx < 2;
                        const isThird = idx === 2;
                        const isThirdQualified = isThird && isTopEightThirdPlaced(s.team.id);

                        let rowClass = 'hover:bg-white/5 font-sans';
                        if (isTopTwo) rowClass += ' bg-secondary/[0.02]';
                        else if (isThirdQualified) rowClass += ' bg-primary/[0.02]';

                        return (
                          <tr key={s.team.id} className={`${rowClass} transition-colors`}>
                            <td className="py-2.5 text-center font-mono font-bold">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                                isTopTwo 
                                  ? 'bg-secondary/10 text-secondary border border-secondary/20' 
                                  : isThirdQualified
                                  ? 'bg-primary/10 text-primary border border-primary/20'
                                  : 'text-on-surface-variant'
                              }`}>
                                {s.position}
                              </span>
                            </td>
                            <td className="py-2.5 font-extrabold flex items-center gap-1.5 min-w-[120px]">
                              <TeamFlag code={s.team.code} name={s.team.name} className="w-5.5 h-4" />
                              <Link href={`/teams#${s.team.id}`} className="hover:text-primary transition-all truncate text-on-surface">
                                {s.team.name}
                              </Link>
                            </td>
                            <td className="py-2.5 text-center font-mono text-on-surface-variant">{s.played}</td>
                            <td className="py-2.5 text-center font-mono text-on-surface-variant">{s.won}</td>
                            <td className="py-2.5 text-center font-mono text-on-surface-variant">{s.drawn}</td>
                            <td className="py-2.5 text-center font-mono text-on-surface-variant">{s.lost}</td>
                            <td className={`py-2.5 text-center font-mono font-semibold ${
                              s.goalDifference > 0 
                                ? 'text-secondary' 
                                : s.goalDifference < 0 
                                ? 'text-destructive/80' 
                                : 'text-on-surface-variant'
                            }`}>
                              {s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
                            </td>
                            <td className="py-2.5 text-center font-mono font-black text-sm text-on-surface">{s.points}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Footer notes */}
                <div className="flex justify-between items-center text-[9px] text-on-surface-variant/60 font-sans font-semibold">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Top 2: Direct Q
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> 3rd: Go to tracker
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </section>
        </>
      )}
    </div>
  );
}
