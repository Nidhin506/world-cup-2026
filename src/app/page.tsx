'use client';

import React from 'react';
import { useMatchSimulatorStore } from '../store/matchSimulator';
import { useFavoriteStore } from '../store/favoriteStore';
import { TEAMS } from '../data/teams';
import { NEWS_ARTICLES } from '../data/news';
import Countdown from '../components/Countdown';
import MatchCard from '../components/MatchCard';
import KnockoutBracket from '../components/KnockoutBracket';
import TeamFlag from '../components/TeamFlag';
import { 
  Play, Pause, RotateCcw, Zap, Heart, Flame, ShieldAlert, 
  MapPin, HelpCircle, ArrowRight, Tv, Compass, Star, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { formatToIST } from '../utils/timezone';

function getRelativeTimeString(time: number | null): string {
  if (!time) return 'Never updated';
  const diff = Date.now() - time;
  if (diff < 10000) return 'Updated just now';
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `Updated ${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Updated ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours} hour${hours > 1 ? 's' : ''} ago`;
  return new Date(time).toLocaleDateString('en-IN');
}

export default function Home() {
  const { 
    matches, 
    isLoading,
    error,
    lastUpdated,
    isLiveConnected,
    syncAll,
    syncMode,
    nextCheckTime,
    refreshFrequency,
    dataSource,
    apiConnectionStatus
  } = useMatchSimulatorStore();

  const { favorites } = useFavoriteStore();
  const [relativeTime, setRelativeTime] = React.useState<string>('Never updated');
  const [countdownText, setCountdownText] = React.useState<string>('N/A');

  // Client-side relative timestamp updates
  React.useEffect(() => {
    if (!lastUpdated) {
      setRelativeTime('Never updated');
      return;
    }
    const updateRelative = () => {
      setRelativeTime(getRelativeTimeString(lastUpdated));
    };
    updateRelative();
    const interval = setInterval(updateRelative, 10000); // refresh every 10 seconds
    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Client-side real-time countdown calculation
  React.useEffect(() => {
    if (!nextCheckTime || syncMode === 'PRE_TOURNAMENT' || syncMode === 'COMPLETED') {
      setCountdownText('N/A');
      return;
    }

    const updateCountdown = () => {
      const diff = nextCheckTime - Date.now();
      if (diff <= 0) {
        setCountdownText('Syncing...');
        return;
      }
      
      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setCountdownText(`in ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextCheckTime, syncMode]);

  // Filter matches
  const liveMatches = matches.filter((m) => m.status === 'LIVE');
  const upcomingMatches = matches.filter((m) => m.status === 'UPCOMING').slice(0, 4);
  const completedMatches = matches.filter((m) => m.status === 'COMPLETED');

  // Favorite teams filter
  const favoriteTeams = TEAMS.filter((t) => favorites.includes(t.id));
  const favoriteTeamMatches = matches.filter(
    (m) => 
      m.homeTeam && m.awayTeam && 
      (favorites.includes(m.homeTeam.id) || favorites.includes(m.awayTeam.id))
  ).slice(0, 3);

  // Tournament progress
  const completedCount = matches.filter(m => m.status === 'COMPLETED').length;
  const totalCount = matches.length || 104;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Sync mode styles and labels configuration
  let badgeText = 'Pre-Tournament';
  let badgeClass = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  let pulseClass = 'bg-blue-400';
  let syncModeTitle = 'Pre-Tournament Mode';
  let titleText = 'FIFA World Cup 2026 Companion';
  let descText = 'Live score monitoring will automatically activate before the tournament begins.';

  if (syncMode === 'MONITORING') {
    badgeText = 'Monitoring';
    badgeClass = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    pulseClass = 'bg-cyan-400 animate-pulse';
    syncModeTitle = 'Monitoring Tournament';
    titleText = 'Fixture Monitoring Active';
    descText = 'Low-frequency checking active. Checking match fixture statuses every 10 minutes to detect live score transitions.';
  } else if (syncMode === 'LIVE_MATCH') {
    badgeText = 'Live Match Active';
    badgeClass = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    pulseClass = 'bg-rose-500 animate-ping';
    syncModeTitle = 'Live Match Active';
    titleText = 'Real-Time Match Streaming';
    descText = 'Vibrant live scores, match events, substitutions, cards, statistics, and standings are syncing automatically every 30 seconds.';
  } else if (syncMode === 'TAB_HIDDEN') {
    badgeText = 'Updates Paused';
    badgeClass = 'text-muted-foreground bg-white/5 border-border';
    pulseClass = 'bg-muted-foreground';
    syncModeTitle = 'Updates Paused (Tab Hidden)';
    titleText = 'API Requests Throttled';
    descText = 'Active polling paused because the application is running in the background. Return focus to this tab to resume sync loops.';
  } else if (syncMode === 'NON_MATCH_PAGE') {
    badgeText = 'Updates Paused';
    badgeClass = 'text-muted-foreground bg-white/5 border-border';
    pulseClass = 'bg-muted-foreground';
    syncModeTitle = 'Updates Paused (Non-Match)';
    titleText = 'Polling Suspended';
    descText = 'API polling paused while browsing pages that do not display match details. Polling will resume when you browse to matches or brackets.';
  } else if (syncMode === 'COMPLETED') {
    badgeText = 'Completed';
    badgeClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    pulseClass = 'bg-amber-400';
    syncModeTitle = 'Tournament Completed';
    titleText = 'FIFA World Cup 2026 Completed';
    descText = 'The tournament is complete. Background sync services have terminated and historical tournament data is being displayed.';
  }

  return (
    <div className="space-y-12 pb-16 font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden w-full h-[650px] sm:h-[819px] min-h-[500px] flex items-center justify-center bg-grid-pattern border-b border-border text-foreground hero-clip">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity" 
            alt="A cinematic, wide-angle shot of a massive soccer stadium at night" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjTS8D8sZ0QqLl_NFDXH0fPL26vvX3pSsQk-lo2YYVshHArlqqt2LNgbU91pZB9aIW7DmzWKZk_LdYzh3Qz-KaSVdMxaIpXbCo767Vb7hdVvfQhe4AICFqw2Ijffz9IR53Ne7uaTCjlZ_xS-0cBXkfOwOSPiapHbycvG-FLOM-Ti9qgOq5KTOWaKGblhKULvZs7AftIVfYN8fXPTAYwD3xTzWv50kVtjYz_RztnwGH0_jP-QVL_Ak3L17YHIj3BaUgTF_GyvUDRyd-"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center gap-xs bg-secondary/10 border border-secondary/30 rounded-full px-sm py-xs mb-2 neon-glow-secondary animate-pulse">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Mexico City Kickoff</span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-none">
            THE WORLD'S STAGE <br/>
            <span className="text-gradient">AWAKENS</span>
          </h1>
          
          <p className="max-w-2xl text-sm sm:text-base text-on-surface-variant leading-relaxed font-semibold">
            Experience the historic 48-team tournament hosted across the USA, Canada, and Mexico. Keep track of 104 matches, live standings, personalized alerts, and official streams.
          </p>

          {/* Countdown component */}
          <div className="pt-4">
            <Countdown />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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

        {/* 2. FIFA World Cup 2026 Operating Status Dashboard */}
        <section className="glass-card p-6 relative overflow-hidden group border border-orange-500/10 hover:border-orange-500/30 hover:neon-glow-primary transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-black tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  World Cup Hub
                </span>
                <span className="text-[10px] text-muted-foreground font-mono font-bold">
                  {dataSource}
                </span>
              </div>
              <h2 className="text-xl font-black font-display uppercase text-on-surface tracking-tight">
                Tournament Center
              </h2>
            </div>
            
            <div className="flex flex-row items-center gap-4 shrink-0 justify-between md:justify-end">
              <span className="text-xs text-muted-foreground font-semibold font-mono text-right">
                {relativeTime}
              </span>
              <button
                onClick={syncAll}
                disabled={isLoading || syncMode === 'COMPLETED'}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-orange-500/10 transition-all cursor-pointer disabled:opacity-50 font-display uppercase tracking-wider relative overflow-hidden active:scale-95 duration-200"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          </div>

          {/* User-Friendly Information Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 text-sm">
            {/* Section 1: Tournament Status */}
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block font-mono">Tournament Status</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border ${
                syncMode === 'PRE_TOURNAMENT' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                syncMode === 'COMPLETED' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                'text-secondary bg-secondary/10 border-secondary/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  syncMode === 'PRE_TOURNAMENT' ? 'bg-blue-400' :
                  syncMode === 'COMPLETED' ? 'bg-amber-400' :
                  'bg-secondary animate-pulse'
                }`}></span>
                {syncMode === 'PRE_TOURNAMENT' ? 'Pre-Tournament' :
                 syncMode === 'COMPLETED' ? 'Tournament Completed' :
                 'Tournament Active'}
              </span>
            </div>

            {/* Section 2: Tournament Begins */}
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block font-mono">Tournament Begins</span>
              <span className="font-extrabold text-foreground text-base">June 11, 2026</span>
            </div>

            {/* Section 3: Matches Played */}
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block font-mono">Matches Played</span>
              <span className="font-extrabold text-foreground text-base">
                {completedCount} / {totalCount} Matches Played
              </span>
            </div>

            {/* Section 6: Data Source */}
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block font-mono">Data Source</span>
              <span className="font-extrabold text-secondary text-base">
                {apiConnectionStatus === 'Connected' ? 'Live Match Feed' : 'Official Tournament Data'}
              </span>
            </div>
          </div>

          {/* Section 4: Tournament Progress Bar */}
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span className="font-display uppercase tracking-wider text-[10px]">Tournament Progress</span>
              <span className="font-mono text-secondary">{progressPercent}% Completed</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-foreground/5 overflow-hidden border border-border">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(249,115,22,0.3)] bg-gradient-to-r from-orange-500 to-amber-500" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-muted-foreground font-semibold font-mono text-right">
              {completedCount} of {totalCount} Matches Completed
            </div>
          </div>
        </section>

        {/* 3. Live Matches & Featured Grid */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight flex items-center gap-2 text-on-surface">
            ⚽ Matches Right Now
          </h2>
          {isLoading && matches.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
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
          ) : liveMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveMatches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-6 text-center text-muted-foreground text-sm font-sans">
              No matches currently live. Real-time scores and statistics will stream here once tournament fixtures kickoff.
            </div>
          )}
        </section>

        {/* 4. Favorites Dashboard & Match schedule side-by-side */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Favorites Feed (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight flex items-center gap-2 text-on-surface">
              <Heart className="w-6 h-6 text-primary fill-primary" /> Personalized Feed
            </h2>
            
            {favorites.length === 0 ? (
              <div className="glass-card p-6 space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                  <Star className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm font-display text-foreground">Follow Favorite Teams</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Go to the <b>Teams</b> section and click the heart icon on any nation. You will see their fixtures and custom alerts here!
                  </p>
                </div>
                <Link
                  href="/teams"
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:text-secondary hover:underline uppercase tracking-wider font-display"
                >
                  Explore Teams <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="glass-card p-5 space-y-5">
                {/* Fav Teams list */}
                <div className="flex flex-wrap gap-2">
                  {favoriteTeams.map((t) => (
                    <Link
                      key={t.id}
                      href={`/teams#${t.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground/5 hover:bg-primary/10 hover:text-primary border border-border text-xs font-bold transition-all text-foreground"
                    >
                      <TeamFlag code={t.code} name={t.name} className="w-4 h-3" />
                      <span>{t.name}</span>
                    </Link>
                  ))}
                </div>

                {/* Fav team matches */}
                <div className="space-y-3 font-sans">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-display">
                    Upcoming Favorites Fixtures
                  </h4>
                  {favoriteTeamMatches.length > 0 ? (
                    <div className="space-y-3">
                      {favoriteTeamMatches.map((m) => (
                        <div 
                          key={m.id} 
                          className="flex items-center justify-between p-3 rounded-[var(--radius-base)] bg-foreground/5 border border-border text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-bold flex items-center gap-1">
                              <TeamFlag code={m.homeTeam?.code} name={m.homeTeam?.name} className="w-4.5 h-3 rounded-[1px]" />
                              {m.homeTeam?.code}
                            </span>
                            <span className="text-muted-foreground/30">vs</span>
                            <span className="font-bold flex items-center gap-1">
                              <TeamFlag code={m.awayTeam?.code} name={m.awayTeam?.name} className="w-4.5 h-3 rounded-[1px]" />
                              {m.awayTeam?.code}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">{formatToIST(m.date, 'time')}</div>
                            <div className="text-[9px] text-muted-foreground">{formatToIST(m.date, 'short-date')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-on-surface-variant italic">No upcoming fixtures for followed teams in this stage.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Schedule list (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-on-surface">
              📅 Fixture Highlights (IST)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {upcomingMatches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
            <div className="text-right">
              <Link 
                href="/matches" 
                className="inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:text-secondary transition-colors uppercase tracking-widest font-display"
              >
                View Full Match Schedule <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </section>

        {/* 5. Knockout Bracket Section */}
        <section id="bracket-section" className="pt-6">
          <KnockoutBracket />
        </section>

        {/* 6. Breaking News section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-on-surface">
              📰 Breaking World Cup News
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {NEWS_ARTICLES.slice(0, 3).map((article) => (
              <div 
                key={article.id} 
                className="glass-card overflow-hidden flex flex-col group hover:shadow-xl hover:border-primary/55 hover:neon-glow-primary transition-all duration-300"
              >
                {/* News Header color block */}
                <div className="h-40 relative bg-foreground/5 flex items-center justify-center p-6 text-center select-none text-muted-foreground border-b border-border">
                  <Compass className="w-12 h-12 text-primary/10 absolute top-4 right-4 animate-spin-slow" />
                  <span className="text-xs uppercase tracking-widest font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                    {article.category}
                  </span>
                </div>
                {/* News Content */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-sm sm:text-base leading-snug group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {article.summary}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                    <span>{article.readTime}</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
