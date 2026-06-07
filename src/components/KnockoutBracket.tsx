'use client';

import React from 'react';
import Link from 'next/link';
import { Match } from '../data/matches';
import { useMatchSimulatorStore } from '../store/matchSimulator';
import { Calendar, HelpCircle, ArrowRight } from 'lucide-react';
import TeamFlag from './TeamFlag';

export default function KnockoutBracket() {
  const { matches } = useMatchSimulatorStore();

  // Filter matches for each stage
  const getStageMatches = (stage: Match['stage']) => {
    return matches.filter((m) => m.stage === stage);
  };

  const r32 = getStageMatches('Round of 32');
  const r16 = getStageMatches('Round of 16');
  const qf = getStageMatches('Quarterfinals');
  const sf = getStageMatches('Semifinals');
  const thirdPlace = getStageMatches('Third Place')[0];
  const final = getStageMatches('Final')[0];

  const renderBracketMatch = (m: Match) => {
    const isLive = m.status === 'LIVE';
    const isCompleted = m.status === 'COMPLETED';

    const getTeamStyle = (score1?: number, score2?: number) => {
      if (score1 === undefined || score2 === undefined) return 'text-on-surface-variant';
      return score1 > score2 ? 'text-primary font-black font-display' : 'text-on-surface-variant/70';
    };

    return (
      <div
        key={m.id}
        className={`bracket-card group relative w-52 sm:w-60 flex-shrink-0 p-3 sm:p-4 glass-card transition-all duration-300 ${
          isLive
            ? 'pulse-glow border-primary bg-primary/5'
            : 'hover:border-primary/50'
        }`}
      >
        <div className="bracket-line-right"></div>
        {/* Match Header */}
        <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-bold mb-2 font-sans">
          <span>MATCH #{m.number} • {m.stage === 'Round of 32' ? 'R32' : m.stage === 'Round of 16' ? 'R16' : m.stage === 'Quarterfinals' ? 'QF' : m.stage === 'Semifinals' ? 'SF' : m.stage}</span>
          {isLive && (
            <span className="text-secondary animate-pulse flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span> LIVE
            </span>
          )}
          {isCompleted && <span className="bg-white/5 px-1.5 py-0.5 rounded text-[9px]">FT</span>}
        </div>

        {/* Teams List */}
        <div className="space-y-2 text-xs sm:text-sm">
          {/* Home */}
          <div className="flex justify-between items-center bg-white/5 p-1 rounded border border-white/5">
            <div className="flex items-center gap-1.5 min-w-0">
              {m.homeTeam ? (
                <TeamFlag code={m.homeTeam.code} name={m.homeTeam.name} className="w-5 h-3.5 shrink-0" />
              ) : (
                <span className="text-sm shrink-0">❓</span>
              )}
              <span className={`truncate font-sans font-semibold ${getTeamStyle(m.homeScore, m.awayScore)}`}>
                {m.homeTeam ? m.homeTeam.name : m.homeTeamPlaceholder}
              </span>
            </div>
            {m.homeScore !== undefined && (
              <span className={`font-display font-black text-sm ${getTeamStyle(m.homeScore, m.awayScore)}`}>
                {m.homeScore}
              </span>
            )}
          </div>

          {/* Away */}
          <div className="flex justify-between items-center bg-white/5 p-1 rounded border border-white/5">
            <div className="flex items-center gap-1.5 min-w-0">
              {m.awayTeam ? (
                <TeamFlag code={m.awayTeam.code} name={m.awayTeam.name} className="w-5 h-3.5 shrink-0" />
              ) : (
                <span className="text-sm shrink-0">❓</span>
              )}
              <span className={`truncate font-sans font-semibold ${getTeamStyle(m.awayScore, m.homeScore)}`}>
                {m.awayTeam ? m.awayTeam.name : m.awayTeamPlaceholder}
              </span>
            </div>
            {m.awayScore !== undefined && (
              <span className={`font-display font-black text-sm ${getTeamStyle(m.awayScore, m.homeScore)}`}>
                {m.awayScore}
              </span>
            )}
          </div>
        </div>

        {/* Action Link */}
        <div className="border-t border-border/30 pt-2 mt-2 flex justify-between items-center text-[9px] sm:text-[10px] text-on-surface-variant font-sans">
          <span>📍 {m.city}</span>
          {m.homeTeam && m.awayTeam ? (
            <Link
              href={`/matches/${m.id}`}
              className="text-primary font-extrabold hover:text-secondary flex items-center gap-0.5 transition-colors uppercase tracking-wider font-display"
            >
              Center <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          ) : (
            <span className="italic">TBD</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-on-surface uppercase tracking-tight">Knockout</h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Swipe or scroll horizontally to track the progression from Round of 32 to the Final.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-on-surface-variant bg-white/5 p-2 rounded-lg border border-white/10">
          <HelpCircle className="w-4 h-4 text-secondary" />
          <span>Round of 32 features top 2 from each group + best 8 third-placed.</span>
        </div>
      </div>

      {/* Horizontal Scroll Wrapper */}
      <div className="w-full overflow-x-auto pb-6 scrollbar-thin">
        <div className="flex items-start gap-8 min-w-max px-4">
          
          {/* Column 1: Round of 32 (16 Matches) */}
          <div className="flex flex-col gap-6">
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2 border-b border-white/10 text-center font-black text-xs uppercase tracking-widest text-primary font-display">
              Round of 32
            </div>
            <div className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
              {r32.map((m) => renderBracketMatch(m))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center self-center h-48">
            <div className="w-2 h-2 rounded-full bg-primary/20"></div>
          </div>

          {/* Column 2: Round of 16 (8 Matches) */}
          <div className="flex flex-col gap-6">
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2 border-b border-white/10 text-center font-black text-xs uppercase tracking-widest text-primary font-display">
              Round of 16
            </div>
            <div className="flex flex-col gap-8 py-4 justify-around h-full">
              {r16.map((m) => renderBracketMatch(m))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center self-center h-48">
            <div className="w-2 h-2 rounded-full bg-primary/20"></div>
          </div>

          {/* Column 3: Quarterfinals (4 Matches) */}
          <div className="flex flex-col gap-6">
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2 border-b border-white/10 text-center font-black text-xs uppercase tracking-widest text-primary font-display">
              Quarterfinals
            </div>
            <div className="flex flex-col gap-16 py-8 justify-around h-full">
              {qf.map((m) => renderBracketMatch(m))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center self-center h-48">
            <div className="w-2 h-2 rounded-full bg-primary/20"></div>
          </div>

          {/* Column 4: Semifinals (2 Matches) */}
          <div className="flex flex-col gap-6">
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2 border-b border-white/10 text-center font-black text-xs uppercase tracking-widest text-primary font-display">
              Semifinals
            </div>
            <div className="flex flex-col gap-32 py-16 justify-around h-full">
              {sf.map((m) => renderBracketMatch(m))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center self-center h-48">
            <div className="w-2 h-2 rounded-full bg-primary/20"></div>
          </div>

          {/* Column 5: Final / Third Place (2 matches) */}
          <div className="flex flex-col gap-6">
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2 border-b border-white/10 text-center font-black text-xs uppercase tracking-widest text-primary font-display">
              The Finals
            </div>
            <div className="flex flex-col gap-12 justify-center h-full pt-10">
              {final && (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-center text-secondary uppercase tracking-widest font-sans">
                    🏆 The Grand Final
                  </div>
                  {renderBracketMatch(final)}
                </div>
              )}
              {thirdPlace && (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-center text-on-surface-variant/80 uppercase tracking-widest font-sans">
                    🥉 Third Place Match
                  </div>
                  {renderBracketMatch(thirdPlace)}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
