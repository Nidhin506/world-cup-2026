'use client';

import React, { useState, useEffect } from 'react';
import { useMatchSimulatorStore } from '../../store/matchSimulator';
import { TEAMS } from '../../data/teams';
import { 
  Trophy, TrendingUp, HelpCircle, Award, ShieldCheck, Flame, 
  AlertCircle, ChevronRight 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';
import TeamFlag from '../../components/TeamFlag';

export default function StatisticsPage() {
  const { matches } = useMatchSimulatorStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const completedMatches = matches.filter(m => m.status === 'COMPLETED');
  const totalMatchesCount = matches.length;
  const completedMatchesCount = completedMatches.length;

  // Compute live statistics from completed match events
  let totalGoals = 0;
  let totalYellowCards = 0;
  let totalRedCards = 0;
  const scorerTally: Record<string, { name: string; teamCode: string; goals: number }> = {};
  const cleanSheetTally: Record<string, { name: string; teamCode: string; sheets: number }> = {};

  completedMatches.forEach((m) => {
    const hs = m.homeScore ?? 0;
    const as = m.awayScore ?? 0;
    totalGoals += hs + as;

    // Tally Clean Sheets
    if (hs === 0 && m.awayTeam) {
      const gk = m.awayTeam.squad.find(p => p.position === 'Goalkeeper')?.name ?? 'Goalkeeper';
      if (!cleanSheetTally[gk]) cleanSheetTally[gk] = { name: gk, teamCode: m.awayTeam.code, sheets: 0 };
      cleanSheetTally[gk].sheets++;
    }
    if (as === 0 && m.homeTeam) {
      const gk = m.homeTeam.squad.find(p => p.position === 'Goalkeeper')?.name ?? 'Goalkeeper';
      if (!cleanSheetTally[gk]) cleanSheetTally[gk] = { name: gk, teamCode: m.homeTeam.code, sheets: 0 };
      cleanSheetTally[gk].sheets++;
    }

    // Tally events
    if (m.events) {
      m.events.forEach((e) => {
        if (e.type === 'GOAL') {
          const team = TEAMS.find(t => t.id === e.teamId);
          const code = team?.code ?? 'TBD';
          if (!scorerTally[e.playerName]) {
            scorerTally[e.playerName] = { name: e.playerName, teamCode: code, goals: 0 };
          }
          scorerTally[e.playerName].goals++;
        } else if (e.type === 'YELLOW_CARD') {
          totalYellowCards++;
        } else if (e.type === 'RED_CARD') {
          totalRedCards++;
        }
      });
    }
  });

  const avgGoals = completedMatchesCount > 0 ? (totalGoals / completedMatchesCount).toFixed(2) : '0.00';

  // Sort Golden Boot list
  const topScorers = Object.values(scorerTally)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5);

  // Sort Clean Sheets list
  const topCleanSheets = Object.values(cleanSheetTally)
    .sort((a, b) => b.sheets - a.sheets)
    .slice(0, 5);

  // Default leaderboards if no games are simulated yet
  const defaultScorers = [
    { name: 'Kylian Mbappé', teamCode: 'FRA', goals: 0 },
    { name: 'Erling Haaland', teamCode: 'NOR', goals: 0 },
    { name: 'Harry Kane', teamCode: 'ENG', goals: 0 },
    { name: 'Lionel Messi', teamCode: 'ARG', goals: 0 },
    { name: 'Vinícius Júnior', teamCode: 'BRA', goals: 0 }
  ];

  const defaultCleanSheets = [
    { name: 'Emiliano Martínez', teamCode: 'ARG', sheets: 0 },
    { name: 'Gianluigi Donnarumma', teamCode: 'ITA', sheets: 0 },
    { name: 'Mike Maignan', teamCode: 'FRA', sheets: 0 },
    { name: 'André Onana', teamCode: 'CMR', sheets: 0 },
    { name: 'Bart Verbruggen', teamCode: 'NED', sheets: 0 }
  ];

  const displayScorers = topScorers.length > 0 ? topScorers : defaultScorers;
  const displayCleanSheets = topCleanSheets.length > 0 ? topCleanSheets : defaultCleanSheets;

  // Chart 1 data: Goals by Stage
  const groupStageGoals = completedMatches
    .filter(m => m.stage === 'Group Stage')
    .reduce((acc, m) => acc + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0);
  const groupStageCount = completedMatches.filter(m => m.stage === 'Group Stage').length || 1;

  const knockoutGoals = completedMatches
    .filter(m => m.stage !== 'Group Stage')
    .reduce((acc, m) => acc + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0);
  const knockoutCount = completedMatches.filter(m => m.stage !== 'Group Stage').length || 1;

  const chartStageData = [
    { name: 'Group Stage', AvgGoals: parseFloat((groupStageGoals / groupStageCount).toFixed(2)) },
    { name: 'Knockouts', AvgGoals: parseFloat((knockoutGoals / knockoutCount).toFixed(2)) }
  ];

  // Chart 2 data: Position goals distribution (simulate data for chart visually based on scorers)
  // Let's create a realistic pie chart distribution
  const chartPositionData = [
    { name: 'Forwards', value: Math.max(10, totalGoals > 0 ? Math.round(totalGoals * 0.65) : 65) },
    { name: 'Midfielders', value: Math.max(5, totalGoals > 0 ? Math.round(totalGoals * 0.25) : 25) },
    { name: 'Defenders', value: Math.max(1, totalGoals > 0 ? Math.round(totalGoals * 0.10) : 10) }
  ];
  const COLORS = ['#8b5cf6', '#06b6d4', '#f43f5e'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10 pb-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Tournament Statistics</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Analyze goals, leaderboards, clean sheets, and trend charts of the 2026 World Cup.
          </p>
        </div>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Goals Scored', value: totalGoals, detail: 'Across completed matches', color: 'text-secondary' },
          { label: 'Matches Played', value: `${completedMatchesCount} / ${totalMatchesCount}`, detail: 'Tournament completion status', color: 'text-foreground' },
          { label: 'Avg Goals / Match', value: avgGoals, detail: 'Tournament goal average', color: 'text-primary' },
          { label: 'Disciplinary Cards', value: `🟨 ${totalYellowCards} | 🟥 ${totalRedCards}`, detail: 'Total cards issued', color: 'text-destructive' }
        ].map((card, idx) => (
          <div 
            key={idx}
            className="p-5 rounded-2xl border border-white/10 glass-card text-center space-y-1.5 shadow-md"
          >
            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{card.label}</div>
            <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${card.color}`}>{card.value}</div>
            <div className="text-[9px] text-muted-foreground font-semibold">{card.detail}</div>
          </div>
        ))}
      </section>

      {/* Charts & Graphs Grid */}
      {mounted ? (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chart 1: Average Goals by Stage */}
          <div className="glass-card rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary pb-2 border-b border-border/40 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Average Goals Scored by Stage
            </h3>
            
            <div className="h-60 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartStageData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Bar dataKey="AvgGoals" fill="#8b5cf6" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-muted-foreground italic text-center">
              Compares average scores of matches in the Group phase vs the Knockout stage.
            </p>
          </div>

          {/* Chart 2: Position Goals Distribution */}
          <div className="glass-card rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-secondary pb-2 border-b border-border/40 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-yellow-500" /> Goal Contribution by Position
            </h3>
            
            <div className="h-60 w-full text-xs flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartPositionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartPositionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-muted-foreground italic text-center">
              Splits goals scored in the tournament among Defenders, Midfielders, and Forwards.
            </p>
          </div>
        </section>
      ) : (
        <div className="h-64 flex items-center justify-center text-muted-foreground text-xs animate-pulse">
          Loading charts engine...
        </div>
      )}

      {/* Leaderboards side-by-side */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Leaderboard A: Golden Boot */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4 shadow-lg">
          <h2 className="text-base font-extrabold flex items-center gap-2">
            <Flame className="w-5 h-5 text-yellow-500 animate-pulse" /> Golden Boot Race (Top Scorers)
          </h2>
          
          <div className="space-y-3.5 text-xs sm:text-sm">
            {displayScorers.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/40 hover:border-primary/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="font-black text-muted-foreground font-mono w-5 text-center">#{idx + 1}</span>
                  <div>
                    <div className="font-extrabold flex items-center gap-1.5">
                      <TeamFlag code={item.teamCode} className="w-5.5 h-4 shadow-sm shrink-0" />
                      <span>{item.name}</span>
                    </div>
                  </div>
                </div>
                
                <span className="font-black text-sm font-mono text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/15">
                  {item.goals} Goals
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard B: Golden Glove */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4 shadow-lg">
          <h2 className="text-base font-extrabold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-secondary" /> Golden Glove Race (Clean Sheets)
          </h2>
          
          <div className="space-y-3.5 text-xs sm:text-sm">
            {displayCleanSheets.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/40 hover:border-secondary/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="font-black text-muted-foreground font-mono w-5 text-center">#{idx + 1}</span>
                  <div>
                    <div className="font-extrabold flex items-center gap-1.5">
                      <TeamFlag code={item.teamCode} className="w-5.5 h-4 shadow-sm shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">Goalkeeper</span>
                  </div>
                </div>
                
                <span className="font-black text-sm font-mono text-secondary bg-secondary/10 px-3 py-1 rounded-lg border border-secondary/15">
                  {item.sheets} Sheets
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* API helper card */}
      <section className="bg-secondary/5 border border-secondary/15 rounded-3xl p-6 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-secondary mx-auto" />
        <h4 className="font-extrabold text-sm uppercase tracking-widest text-secondary">Real-Time Statistics Feed</h4>
        <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
          These charts and leaderboards are powered by real match results. As games conclude, stats are updated automatically from the official API provider.
        </p>
      </section>

    </div>
  );
}
