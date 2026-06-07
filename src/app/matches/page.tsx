'use client';

import React, { useState, useEffect } from 'react';
import { useMatchSimulatorStore } from '../../store/matchSimulator';
import { useFavoriteStore } from '../../store/favoriteStore';
import { STADIUMS } from '../../data/stadiums';
import { formatToIST, formatToLocalVenueTime, getCountdown, CountdownTime } from '../../utils/timezone';
import MatchCard from '../../components/MatchCard';
import TeamFlag from '../../components/TeamFlag';
import { 
  Calendar, Clock, Globe, Heart, Search, SlidersHorizontal, 
  MapPin, HelpCircle, X, ChevronRight, Play, ShieldAlert 
} from 'lucide-react';
import Link from 'next/link';

// Simple inner countdown clock for upcoming match items
function MatchCountdown({ dateString }: { dateString: string }) {
  const [timeLeft, setTimeLeft] = useState<CountdownTime | null>(null);

  useEffect(() => {
    setTimeLeft(getCountdown(dateString));
    const timer = setInterval(() => {
      setTimeLeft(getCountdown(dateString));
    }, 1000);
    return () => clearInterval(timer);
  }, [dateString]);

  if (!timeLeft || timeLeft.isOver) return null;

  return (
    <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
      ⏳ {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </span>
  );
}

export default function MatchesPage() {
  const { matches, isLoading, error, syncAll } = useMatchSimulatorStore();
  const { favorites } = useFavoriteStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [timezone, setTimezone] = useState<'IST' | 'LOCAL'>('IST');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedStadium, setSelectedStadium] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

  // Grouping matches by date
  // Filter matches based on conditions
  const filteredMatches = matches.filter((m) => {
    const homeName = m.homeTeam?.name.toLowerCase() ?? '';
    const awayName = m.awayTeam?.name.toLowerCase() ?? '';
    const homeCode = m.homeTeam?.code.toLowerCase() ?? '';
    const awayCode = m.awayTeam?.code.toLowerCase() ?? '';
    const search = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      homeName.includes(search) || 
      awayName.includes(search) ||
      homeCode.includes(search) ||
      awayCode.includes(search) ||
      m.stadiumName.toLowerCase().includes(search) ||
      m.city.toLowerCase().includes(search);

    const matchesStage = selectedStage === 'All' || m.stage === selectedStage;
    const matchesGroup = selectedGroup === 'All' || m.group === selectedGroup;
    const matchesStadium = selectedStadium === 'All' || m.stadiumId === selectedStadium;
    const matchesStatus = selectedStatus === 'All' || m.status === selectedStatus;
    
    const matchesFavorites = !onlyFavorites || (
      m.homeTeam && favorites.includes(m.homeTeam.id) || 
      m.awayTeam && favorites.includes(m.awayTeam.id)
    );

    return matchesSearch && matchesStage && matchesGroup && matchesStadium && matchesStatus && matchesFavorites;
  });

  // Group fixtures by formatted date (IST date)
  const groupedMatches: Record<string, typeof filteredMatches> = {};
  filteredMatches.forEach((m) => {
    const istDate = formatToIST(m.date, 'date'); // returns e.g. "Thursday, 11 June, 2026"
    if (!groupedMatches[istDate]) {
      groupedMatches[istDate] = [];
    }
    groupedMatches[istDate].push(m);
  });

  const stagesList = [
    'All',
    'Group Stage',
    'Round of 32',
    'Round of 16',
    'Quarterfinals',
    'Semifinals',
    'Third Place',
    'Final'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-24 font-sans">
      
      {/* Header & Timezone Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black font-display uppercase tracking-tight text-on-surface">Match Center & Fixtures</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Complete schedule of the 104 matches of the FIFA World Cup 2026.
          </p>
        </div>

        {/* Timezone Toggle Switch */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl self-start md:self-center border border-white/10">
          <button
            onClick={() => setTimezone('IST')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-display uppercase ${
              timezone === 'IST'
                ? 'bg-primary text-white shadow shadow-primary/10'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Indian Time (IST)
          </button>
          <button
            onClick={() => setTimezone('LOCAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-display uppercase ${
              timezone === 'LOCAL'
                ? 'bg-primary text-white shadow shadow-primary/10'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Stadium Local Time
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <section className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <span className="font-extrabold text-sm flex items-center gap-1.5 font-display text-on-surface uppercase">
            <SlidersHorizontal className="w-4 h-4 text-secondary" /> Filter Fixtures
          </span>
          {/* Reset Filters */}
          {(searchQuery || selectedStage !== 'All' || selectedGroup !== 'All' || selectedStadium !== 'All' || selectedStatus !== 'All' || onlyFavorites) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStage('All');
                setSelectedGroup('All');
                setSelectedStadium('All');
                setSelectedStatus('All');
                setOnlyFavorites(false);
              }}
              className="text-xs font-bold text-tertiary hover:text-on-surface flex items-center gap-1 cursor-pointer font-display uppercase"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 text-xs">
          
          {/* Search query */}
          <div className="relative col-span-1 sm:col-span-2">
            <input
              type="text"
              placeholder="Search match by team or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Filter Stage */}
          <div>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-on-surface outline-none focus:border-primary cursor-pointer font-semibold"
            >
              <option value="All" className="bg-surface-container">All Stages</option>
              {stagesList.slice(1).map((s) => (
                <option key={s} value={s} className="bg-surface-container">{s}</option>
              ))}
            </select>
          </div>

          {/* Filter Group */}
          <div>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-on-surface outline-none focus:border-primary cursor-pointer font-semibold"
            >
              <option value="All" className="bg-surface-container">All Groups (A-L)</option>
              {Array.from({ length: 12 }, (_, i) => String.fromCharCode(65 + i)).map((g) => (
                <option key={g} value={g} className="bg-surface-container">Group {g}</option>
              ))}
            </select>
          </div>

          {/* Filter Stadium */}
          <div>
            <select
              value={selectedStadium}
              onChange={(e) => setSelectedStadium(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-on-surface outline-none focus:border-primary cursor-pointer font-semibold"
            >
              <option value="All" className="bg-surface-container">All Stadiums</option>
              {STADIUMS.map((s) => (
                <option key={s.id} value={s.id} className="bg-surface-container">{s.name} ({s.city})</option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-on-surface outline-none focus:border-primary cursor-pointer font-semibold"
            >
              <option value="All" className="bg-surface-container">All Statuses</option>
              <option value="UPCOMING" className="bg-surface-container">Upcoming</option>
              <option value="LIVE" className="bg-surface-container">Live Matches</option>
              <option value="COMPLETED" className="bg-surface-container">Completed</option>
            </select>
          </div>

          {/* Followed Only */}
          <div className="flex items-center gap-2 col-span-1">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-on-surface-variant hover:text-on-surface">
              <input
                type="checkbox"
                checked={onlyFavorites}
                onChange={(e) => setOnlyFavorites(e.target.checked)}
                className="w-4 h-4 text-primary bg-white/5 border-white/10 rounded focus:ring-primary cursor-pointer accent-primary"
              />
              <Heart className="w-3.5 h-3.5 text-primary fill-current" /> Followed Teams Only
            </label>
          </div>

        </div>
      </section>

      {/* Fixtures List */}
      <section className="space-y-10">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="p-5 glass-card rounded-2xl border border-white/5 animate-pulse space-y-4">
                <div className="h-4 w-1/3 bg-white/5 rounded"></div>
                <div className="flex justify-between items-center py-2">
                  <div className="h-8 w-8 bg-white/5 rounded-full"></div>
                  <div className="h-6 w-16 bg-white/5 rounded"></div>
                  <div className="h-8 w-8 bg-white/5 rounded-full"></div>
                </div>
                <div className="h-4 w-2/3 bg-white/5 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        ) : Object.keys(groupedMatches).length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center text-on-surface-variant border border-white/10">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-primary/30 animate-pulse" />
            <h3 className="font-extrabold text-base text-on-surface mb-1 font-display uppercase">No Matches Found</h3>
            <p className="text-xs max-w-xs mx-auto">
              We couldn&apos;t find any matches matching your selected search query or filter tags. Try resetting filters.
            </p>
          </div>
        ) : (
          Object.keys(groupedMatches).map((dateKey) => (
            <div key={dateKey} className="space-y-4">
              {/* Date Header */}
              <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-md py-2.5 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-black text-sm uppercase tracking-wider text-primary flex items-center gap-2 font-display">
                  <Calendar className="w-4 h-4" /> {dateKey}
                </h3>
                <span className="text-[10px] sm:text-xs font-bold text-on-surface-variant bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 font-sans">
                  {groupedMatches[dateKey].length} Match(es)
                </span>
              </div>

              {/* Match Cards Day Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedMatches[dateKey].map((m) => {
                  const isLive = m.status === 'LIVE';
                  const isUpcoming = m.status === 'UPCOMING';

                  return (
                    <div
                      key={m.id}
                      className={`group relative rounded-2xl border p-5 glass-card flex flex-col justify-between space-y-4 transition-all duration-300 hover:scale-[1.01] ${
                        isLive 
                          ? 'border-secondary/50 bg-secondary/5 shadow-md shadow-secondary/5 neon-pulse' 
                          : 'border-white/10 hover:border-primary/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                      }`}
                    >
                      {/* Item Header */}
                      <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-bold font-sans">
                        <span>MATCH #{m.number} • {m.stage.toUpperCase()} {m.group ? `• GROUP ${m.group}` : ''}</span>
                        {isLive && (
                          <span className="text-secondary animate-pulse bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20 flex items-center gap-1 font-sans">
                            <span className="w-1 h-1 bg-secondary rounded-full"></span> LIVE {m.minute}&apos;
                          </span>
                        )}
                        {m.status === 'COMPLETED' && (
                          <span className="bg-white/5 px-2 py-0.5 rounded text-on-surface-variant font-sans">FT</span>
                        )}
                        {isUpcoming && <MatchCountdown dateString={m.date} />}
                      </div>

                      {/* Display timezone details */}
                      <div className="grid grid-cols-7 items-center justify-between text-center gap-2 py-2 font-sans">
                        {/* Home */}
                        <div className="col-span-3 space-y-1">
                          {m.homeTeam ? (
                            <TeamFlag code={m.homeTeam.code} name={m.homeTeam.name} className="w-8 h-5.5 rounded-[2px]" />
                          ) : (
                            <span className="text-xl sm:text-2xl">❓</span>
                          )}
                          <div className="font-extrabold text-xs sm:text-sm line-clamp-1 text-on-surface">{m.homeTeam ? m.homeTeam.name : m.homeTeamPlaceholder}</div>
                        </div>

                        {/* Mid/Score */}
                        <div className="col-span-1 flex flex-col items-center justify-center">
                          {isUpcoming ? (
                            <span className="text-xs font-black text-on-surface-variant/50 uppercase font-display">VS</span>
                          ) : (
                            <span className="text-base sm:text-xl font-black font-display text-primary">
                              {m.homeScore} - {m.awayScore}
                            </span>
                          )}
                        </div>

                        {/* Away */}
                        <div className="col-span-3 space-y-1">
                          {m.awayTeam ? (
                            <TeamFlag code={m.awayTeam.code} name={m.awayTeam.name} className="w-8 h-5.5 rounded-[2px]" />
                          ) : (
                            <span className="text-xl sm:text-2xl">❓</span>
                          )}
                          <div className="font-extrabold text-xs sm:text-sm line-clamp-1 text-on-surface">{m.awayTeam ? m.awayTeam.name : m.awayTeamPlaceholder}</div>
                        </div>
                      </div>

                      {/* Details & Actions Footer */}
                      <div className="border-t border-white/5 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] text-on-surface-variant gap-2.5 font-sans">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-secondary" />
                            <span className="font-semibold line-clamp-1 max-w-[150px]">{m.stadiumName} ({m.city})</span>
                          </div>
                          {/* Time display based on toggle */}
                          <div className="flex items-center gap-1 font-bold text-on-surface">
                            <Clock className="w-3 h-3 text-secondary" />
                            {timezone === 'IST' ? (
                              <span>IST: {formatToIST(m.date, 'time')}</span>
                            ) : (
                              <span className="text-[9px] line-clamp-1">{formatToLocalVenueTime(m.date, m.stadiumId)}</span>
                            )}
                          </div>
                        </div>

                        {/* Link */}
                        {m.homeTeam && m.awayTeam ? (
                          <Link
                            href={`/matches/${m.id}`}
                            className="bg-primary/20 hover:bg-primary text-primary hover:text-white font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all uppercase tracking-wider text-[9px] sm:text-[10px] self-stretch sm:self-auto text-center justify-center cursor-pointer font-display"
                          >
                            Match Center <ChevronRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="italic self-end">TBD</span>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          ))
        )}
      </section>

    </div>
  );
}
