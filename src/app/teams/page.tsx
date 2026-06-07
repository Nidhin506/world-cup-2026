'use client';

import React, { useState, useEffect } from 'react';
import { TEAMS, Team, Player } from '../../data/teams';
import { useFavoriteStore } from '../../store/favoriteStore';
import { 
  Search, SlidersHorizontal, Heart, Shield, Info, ArrowRightLeft, 
  X, CheckCircle, Award, Compass, Users 
} from 'lucide-react';
import TeamFlag from '../../components/TeamFlag';

export default function TeamsPage() {
  const { toggleFavorite, isFavorite } = useFavoriteStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'rank' | 'group'>('name');

  // Selected team for detailed modal
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);

  // Comparison State
  const [compareA, setCompareA] = useState<Team | null>(null);
  const [compareB, setCompareB] = useState<Team | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Read hash on mount for deep linking (e.g. from search)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleHashChange = () => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
          const team = TEAMS.find((t) => t.id === hash);
          if (team) setActiveTeam(team);
        }
      };
      // Check immediately
      handleHashChange();
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);

  // Filter & Sort Teams
  const filteredTeams = TEAMS.filter((t) => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.squad.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGroup = selectedGroup === 'All' || t.group === selectedGroup;

    return matchesSearch && matchesGroup;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'rank') return a.fifaRanking - b.fifaRanking;
    return a.group.localeCompare(b.group);
  });

  const handleOpenTeamModal = (team: Team) => {
    setActiveTeam(team);
    if (typeof window !== 'undefined') {
      window.location.hash = team.id;
    }
  };

  const handleCloseTeamModal = () => {
    setActiveTeam(null);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Compare Logic
  const handleSelectCompare = (team: Team) => {
    if (compareA?.id === team.id) {
      setCompareA(null);
    } else if (compareB?.id === team.id) {
      setCompareB(null);
    } else if (!compareA) {
      setCompareA(team);
    } else if (!compareB) {
      setCompareB(team);
    } else {
      // Overwrite first slot
      setCompareA(team);
    }
  };

  const getAverageAge = (squad: Player[]) => {
    if (squad.length === 0) return 0;
    const total = squad.reduce((acc, p) => acc + p.age, 0);
    return (total / squad.length).toFixed(1);
  };

  const getPositionCount = (squad: Player[], pos: Player['position']) => {
    return squad.filter(p => p.position === pos).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-24">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Participating Teams</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Explore all 48 qualifying nations, squads, coaches, history, or compare teams side-by-side.
          </p>
        </div>

        {/* Compare quick board status */}
        {(compareA || compareB) && (
          <div className="flex items-center gap-3 bg-secondary/10 border border-secondary/20 px-4 py-2 rounded-xl text-xs">
            <span className="font-bold text-secondary flex items-center gap-1">
              <ArrowRightLeft className="w-3.5 h-3.5" /> Comparison Board
            </span>
            <div className="flex items-center gap-2">
              {compareA ? (
                <span className="font-semibold flex items-center gap-1">
                  <TeamFlag code={compareA.code} name={compareA.name} className="w-5 h-3.5" /> {compareA.code}
                </span>
              ) : (
                <span className="font-semibold text-muted-foreground/60">Select Team 1</span>
              )}
              <span className="text-muted-foreground">vs</span>
              {compareB ? (
                <span className="font-semibold flex items-center gap-1">
                  <TeamFlag code={compareB.code} name={compareB.name} className="w-5 h-3.5" /> {compareB.code}
                </span>
              ) : (
                <span className="font-semibold text-muted-foreground/60">Select Team 2</span>
              )}
            </div>
            {compareA && compareB && (
              <button
                onClick={() => setShowComparison(true)}
                className="bg-primary hover:bg-primary/80 font-bold px-3 py-1 rounded-lg text-primary-foreground transition-all cursor-pointer"
              >
                Compare Now
              </button>
            )}
            <button 
              onClick={() => { setCompareA(null); setCompareB(null); }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Filter and search controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search teams, players, or matches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Group Filter */}
        <div>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm outline-none focus:border-primary cursor-pointer"
          >
            <option value="All">All Groups (A-L)</option>
            {Array.from({ length: 12 }, (_, i) => String.fromCharCode(65 + i)).map((g) => (
              <option key={g} value={g}>
                Group {g}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting option */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm outline-none focus:border-primary cursor-pointer"
          >
            <option value="name">Sort by: Name (A-Z)</option>
            <option value="rank">Sort by: FIFA Ranking</option>
            <option value="group">Sort by: Group Letter</option>
          </select>
        </div>

      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTeams.map((team) => {
          const isFav = isFavorite(team.id);
          const isSelectedForCompare = compareA?.id === team.id || compareB?.id === team.id;

          return (
            <div
              key={team.id}
              className={`p-5 rounded-2xl border glass-card flex flex-col justify-between space-y-4 hover:border-primary/30 transition-all ${
                isSelectedForCompare ? 'ring-2 ring-secondary border-transparent' : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <TeamFlag code={team.code} name={team.name} className="w-7 h-5 rounded-[2px]" />
                    <span className="font-extrabold text-base">{team.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-bold">
                    Group {team.group} • Code: {team.code}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Heart button */}
                  <button
                    onClick={() => toggleFavorite(team.id)}
                    className={`p-1.5 rounded-full transition-all ${
                      isFav ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-500/10' : 'text-foreground/30 hover:text-yellow-500 hover:bg-muted'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>

              {/* Stats highlights */}
              <div className="grid grid-cols-3 gap-2 bg-muted/30 p-2.5 rounded-xl text-center border border-border/40">
                <div>
                  <div className="text-[10px] text-muted-foreground font-bold uppercase">FIFA Rank</div>
                  <div className="text-sm font-black font-mono mt-0.5">#{team.fifaRanking}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground font-bold uppercase">Titles</div>
                  <div className="text-sm font-black font-mono mt-0.5 text-amber-500">{team.history.titles}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground font-bold uppercase">Squad</div>
                  <div className="text-sm font-black font-mono mt-0.5">{team.squad.length}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenTeamModal(team)}
                  className="flex-grow bg-muted hover:bg-muted/80 text-foreground font-bold text-xs py-2 rounded-xl transition-all cursor-pointer text-center"
                >
                  View Squad
                </button>
                <button
                  onClick={() => handleSelectCompare(team)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSelectedForCompare
                      ? 'bg-secondary text-secondary-foreground border-transparent'
                      : 'border-border hover:bg-muted hover:text-secondary'
                  }`}
                  title="Compare Team"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- MODAL 1: TEAM DETAILS SHEET --- */}
      {activeTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl glass-card rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-border flex items-start justify-between bg-muted/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <TeamFlag code={activeTeam.code} name={activeTeam.name} className="w-10 h-7 rounded shadow-sm" />
                  <h2 className="text-2xl font-black">{activeTeam.name}</h2>
                  <span className="text-xs font-bold bg-secondary/10 text-secondary px-2.5 py-0.5 rounded-full border border-secondary/20">
                    Group {activeTeam.group}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                  Manager: <span className="text-foreground">{activeTeam.coach}</span> | FIFA Rank: <span className="text-foreground">#{activeTeam.fifaRanking}</span>
                </p>
              </div>
              <button
                onClick={handleCloseTeamModal}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow scrollbar-thin">
              
              {/* Historical card grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 text-center">
                  <div className="text-xs text-muted-foreground font-bold uppercase">World Cup Appearances</div>
                  <div className="text-xl font-black font-mono mt-1 text-secondary">{activeTeam.history.appearances}</div>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 text-center">
                  <div className="text-xs text-muted-foreground font-bold uppercase">Best Historical Finish</div>
                  <div className="text-sm font-black mt-1 line-clamp-1">{activeTeam.history.bestFinish}</div>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 text-center">
                  <div className="text-xs text-muted-foreground font-bold uppercase">Trophies Won</div>
                  <div className="text-xl font-black font-mono mt-1 text-yellow-500">{activeTeam.history.titles} 🏆</div>
                </div>
              </div>

              {/* Squad categorised */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-white/10 pb-1 flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> 26-Man Selection (Key Profiles)
                </h3>
                
                {['Goalkeeper', 'Defender', 'Midfielder', 'Forward'].map((pos) => {
                  const players = activeTeam.squad.filter(p => p.position === pos);
                  if (players.length === 0) return null;

                  return (
                    <div key={pos} className="space-y-2">
                      <h4 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">{pos}s</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {players.map((p) => (
                          <div 
                            key={p.id} 
                            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                              p.isKeyPlayer 
                                ? 'bg-yellow-500/5 border-yellow-500/20' 
                                : 'bg-muted/20 border-border/50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-black text-muted-foreground/60 w-5">#{p.shirtNumber}</span>
                              <div>
                                <div className="font-extrabold flex items-center gap-1">
                                  {p.name}
                                  {p.isKeyPlayer && (
                                    <span className="inline-flex px-1 text-[8px] bg-yellow-500/20 text-yellow-500 border border-yellow-500/25 rounded font-black">
                                      STAR
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-muted-foreground">{p.club}</div>
                              </div>
                            </div>
                            <span className="text-muted-foreground font-semibold">{p.age} yrs</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Journey details */}
              <div className="p-5 rounded-2xl bg-secondary/5 border border-secondary/15 space-y-2">
                <h4 className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-1">
                  <Compass className="w-4 h-4" /> Qualification Journey
                </h4>
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                  {activeTeam.journey}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: COMPARISON DASHBOARD BOARD --- */}
      {showComparison && compareA && compareB && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl glass-card rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-primary" /> Side-by-Side Comparison
              </h2>
              <button
                onClick={() => setShowComparison(false)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable comparison grid */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow scrollbar-thin">
              
              {/* Teams heads */}
              <div className="grid grid-cols-3 text-center items-center pb-4 border-b border-border/30">
                <div className="space-y-1.5 flex flex-col items-center">
                  <TeamFlag code={compareA.code} name={compareA.name} className="w-12 h-8 rounded-md shadow-sm" />
                  <div className="font-extrabold text-sm sm:text-base">{compareA.name}</div>
                  <span className="text-[10px] font-bold text-on-surface-variant bg-muted px-2 py-0.5 rounded-full">
                    Group {compareA.group}
                  </span>
                </div>
                <span className="text-xs font-black text-muted-foreground">VS</span>
                <div className="space-y-1.5 flex flex-col items-center">
                  <TeamFlag code={compareB.code} name={compareB.name} className="w-12 h-8 rounded-md shadow-sm" />
                  <div className="font-extrabold text-sm sm:text-base">{compareB.name}</div>
                  <span className="text-[10px] font-bold text-on-surface-variant bg-muted px-2 py-0.5 rounded-full">
                    Group {compareB.group}
                  </span>
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-4 text-xs sm:text-sm">
                
                {/* 1. FIFA Ranking */}
                <div className="grid grid-cols-3 text-center items-center py-2 border-b border-border/20">
                  <div className="font-mono font-bold text-base">#{compareA.fifaRanking}</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">FIFA Ranking</div>
                  <div className="font-mono font-bold text-base">#{compareB.fifaRanking}</div>
                </div>

                {/* 2. World Cup Titles */}
                <div className="grid grid-cols-3 text-center items-center py-2 border-b border-border/20">
                  <div className="font-mono font-bold text-base text-yellow-500">{compareA.history.titles} 🏆</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">World Cup Titles</div>
                  <div className="font-mono font-bold text-base text-yellow-500">{compareB.history.titles} 🏆</div>
                </div>

                {/* 3. Appearances */}
                <div className="grid grid-cols-3 text-center items-center py-2 border-b border-border/20">
                  <div className="font-mono font-bold text-base">{compareA.history.appearances}</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Appearances</div>
                  <div className="font-mono font-bold text-base">{compareB.history.appearances}</div>
                </div>

                {/* 4. Best Finish */}
                <div className="grid grid-cols-3 text-center items-center py-2 border-b border-border/20">
                  <div className="font-bold line-clamp-1">{compareA.history.bestFinish}</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Best Finish</div>
                  <div className="font-bold line-clamp-1">{compareB.history.bestFinish}</div>
                </div>

                {/* 5. Squad Average Age */}
                <div className="grid grid-cols-3 text-center items-center py-2 border-b border-border/20">
                  <div className="font-mono font-bold text-base">{getAverageAge(compareA.squad)} yrs</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Avg Squad Age</div>
                  <div className="font-mono font-bold text-base">{getAverageAge(compareB.squad)} yrs</div>
                </div>

                {/* 6. Key Star Players */}
                <div className="grid grid-cols-3 text-center items-center py-2 border-b border-border/20">
                  <div className="font-bold text-secondary">{compareA.keyPlayers.join(', ')}</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Key Stars</div>
                  <div className="font-bold text-secondary">{compareB.keyPlayers.join(', ')}</div>
                </div>

                {/* 7. Position distribution */}
                <div className="grid grid-cols-3 text-center items-center py-2 border-b border-border/20">
                  <div className="text-xs">
                    G: {getPositionCount(compareA.squad, 'Goalkeeper')} | D: {getPositionCount(compareA.squad, 'Defender')} | M: {getPositionCount(compareA.squad, 'Midfielder')} | F: {getPositionCount(compareA.squad, 'Forward')}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Squad Spread</div>
                  <div className="text-xs">
                    G: {getPositionCount(compareB.squad, 'Goalkeeper')} | D: {getPositionCount(compareB.squad, 'Defender')} | M: {getPositionCount(compareB.squad, 'Midfielder')} | F: {getPositionCount(compareB.squad, 'Forward')}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
