'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useThemeStore } from '../store/themeStore';
import { useNotificationStore } from '../store/notificationStore';
import { useMatchSimulatorStore } from '../store/matchSimulator';
import { TEAMS } from '../data/teams';
import { STADIUMS } from '../data/stadiums';
import { 
  Menu, X, Search, Sun, Moon, Bell, BellOff, Play, 
  MapPin, User, ShieldAlert, Zap, Calendar, Trophy, GitCommit
} from 'lucide-react';
import TeamFlag from './TeamFlag';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();
  const { permission, requestPermission } = useNotificationStore();
  const { matches } = useMatchSimulatorStore();

  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    type: 'team' | 'player' | 'stadium' | 'match';
    title: string;
    subtitle: string;
    url: string;
    teamCode?: string;
    homeTeamCode?: string;
    awayTeamCode?: string;
  }[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);

  // Sync theme class with body on mount
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'electric', 'trophy');
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.add('dark', theme);
    }
  }, [theme]);

  // Handle Ctrl+K / Cmd+K search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Run global search logic on query change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setTimeout(() => {
        setSearchResults([]);
      }, 0);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results: typeof searchResults = [];

    // Search Teams
    TEAMS.forEach((team) => {
      if (team.name.toLowerCase().includes(query) || team.code.toLowerCase().includes(query)) {
        results.push({
          type: 'team',
          title: team.name,
          subtitle: `Group ${team.group} • FIFA Rank: ${team.fifaRanking}`,
          url: `/teams#${team.id}`,
          teamCode: team.code
        });
      }

      // Search Players in Squad
      team.squad.forEach((player) => {
        if (player.name.toLowerCase().includes(query)) {
          results.push({
            type: 'player',
            title: player.name,
            subtitle: `${team.name} • ${player.position} (${player.club})`,
            url: `/teams#${team.id}`,
            teamCode: team.code
          });
        }
      });
    });

    // Search Stadiums
    STADIUMS.forEach((std) => {
      if (std.name.toLowerCase().includes(query) || std.city.toLowerCase().includes(query)) {
        results.push({
          type: 'stadium',
          title: `🏟️ ${std.name}`,
          subtitle: `${std.city}, ${std.country} • Capacity: ${std.capacity.toLocaleString()}`,
          url: `/stadiums#${std.id}`
        });
      }
    });

    // Search Matches
    matches.forEach((m) => {
      if (m.homeTeam && m.awayTeam) {
        if (
          m.homeTeam.name.toLowerCase().includes(query) ||
          m.awayTeam.name.toLowerCase().includes(query)
        ) {
          results.push({
            type: 'match',
            title: `${m.homeTeam.code} vs ${m.awayTeam.code}`,
            subtitle: `${m.stage} • ${m.stadiumName}`,
            url: `/matches/${m.id}`,
            homeTeamCode: m.homeTeam.code,
            awayTeamCode: m.awayTeam.code
          });
        }
      }
    });

    setTimeout(() => {
      setSearchResults(results.slice(0, 8)); // Limit to 8 results
    }, 0);
  }, [searchQuery, matches]);

  // Close search dialog when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Matches', href: '/matches', icon: Calendar },
    { name: 'Standings', href: '/standings', icon: Trophy },
    { name: 'Knockout', href: '/#bracket-section', icon: GitCommit },
    { name: 'Teams', href: '/teams', icon: User },
    { name: 'Stadiums', href: '/stadiums', icon: MapPin },
    { name: 'Where to Watch', href: '/watch', icon: Play },
    { name: 'Statistics', href: '/statistics', icon: Zap }
  ];

  const handleSearchItemClick = (url: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    router.push(url);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 glass-nav shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-lg sm:text-xl tracking-wider uppercase font-display">
                  FIFA 2026
                </span>
                <span className="hidden md:inline text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  COMPANION
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 font-display">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-primary bg-primary/10 shadow-[0_0_8px_rgba(139,92,246,0.2)]'
                        : 'text-on-surface-variant hover:text-secondary hover:bg-white/5 transition-all'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Navigation Actions (Search, Notifications, Theme, Mobile Hamburger) */}
            <div className="flex items-center gap-2">
              
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-white/5 transition-all"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Push Notifications Toggle */}
              <button
                onClick={requestPermission}
                className={`p-2 rounded-lg transition-all ${
                  permission === 'granted'
                    ? 'text-secondary hover:bg-secondary/10'
                    : 'text-on-surface-variant hover:text-primary hover:bg-white/5'
                }`}
                title={permission === 'granted' ? 'Notifications active' : 'Enable notifications'}
              >
                {permission === 'granted' ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
              </button>

              {/* Theme Cycle Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-white/5 transition-all flex items-center justify-center gap-1"
                title={`Theme: ${theme.toUpperCase()}`}
                aria-label="Toggle Theme"
              >
                {theme === 'electric' && <Zap className="w-4 h-4 text-secondary" />}
                {theme === 'trophy' && <Trophy className="w-4 h-4 text-primary" />}
                {theme === 'light' && <Sun className="w-4 h-4 text-primary" />}
                <span className="hidden xl:inline text-[10px] font-black tracking-widest font-display uppercase">
                  {theme}
                </span>
              </button>

              {/* Mobile Burger Menu */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-white/5 transition-all"
                >
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden border-t border-border glass-card py-2 px-4 shadow-xl transition-all duration-300">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                      isActive
                        ? 'text-primary bg-primary/10 shadow-[0_0_8px_rgba(139,92,246,0.2)]'
                        : 'text-on-surface-variant hover:text-secondary hover:bg-white/5'
                    }`}
                  >
                    <link.icon className="w-5 h-5 text-primary" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Global Search Omnibar Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-black/60 backdrop-blur-sm transition-all">
          <div
            ref={searchRef}
            className="w-full max-w-2xl glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                autoFocus
                placeholder="Search teams, players, or matches... (Esc to close)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground py-1 text-base"
              />
              <span className="hidden sm:inline text-xs font-semibold px-2 py-1 rounded bg-muted text-muted-foreground select-none">
                ESC
              </span>
            </div>

            {/* Results Grid */}
            <div className="max-h-[60vh] overflow-y-auto py-2">
              {searchQuery.trim() === '' ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  <Search className="w-12 h-12 mx-auto mb-2 text-muted-foreground/30" />
                  Search the 2026 World Cup Companion
                  <div className="mt-1 text-xs text-muted-foreground/60">
                    Type to search 48 teams, 16 stadiums, players, or match cards.
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No results found for &ldquo;<span className="font-semibold text-foreground">{searchQuery}</span>&rdquo;
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {(() => {
                    const groupedResults: Record<string, typeof searchResults> = {};
                    searchResults.forEach((item) => {
                      const category = item.type === 'team' ? 'Teams' : item.type === 'player' ? 'Players' : item.type === 'match' ? 'Matches' : 'Stadiums';
                      if (!groupedResults[category]) {
                        groupedResults[category] = [];
                      }
                      groupedResults[category].push(item);
                    });

                    return Object.keys(groupedResults).map((category) => (
                      <div key={category} className="py-2.5">
                        <div className="px-4 py-1 text-[10px] font-black uppercase tracking-wider text-secondary">
                          {category} ({groupedResults[category].length})
                        </div>
                        <div className="mt-1">
                          {groupedResults[category].map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSearchItemClick(item.url)}
                              className="w-full flex items-center justify-between text-left px-5 py-2.5 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer group"
                            >
                              <div className="flex items-center gap-3">
                                {item.teamCode && (
                                  <TeamFlag code={item.teamCode} className="w-5.5 h-3.5 shrink-0 rounded-[2px]" />
                                )}
                                {item.homeTeamCode && item.awayTeamCode && (
                                  <div className="flex items-center gap-1 shrink-0">
                                    <TeamFlag code={item.homeTeamCode} className="w-4.5 h-3 rounded-[2px]" />
                                    <span className="text-[9px] text-muted-foreground font-bold">vs</span>
                                    <TeamFlag code={item.awayTeamCode} className="w-4.5 h-3 rounded-[2px]" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                                    {item.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground group-hover:text-primary/70">
                                    {item.subtitle}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[9px] font-black text-muted-foreground group-hover:text-primary bg-white/5 group-hover:bg-primary/20 px-2 py-0.5 rounded border border-white/5">
                                {item.type.toUpperCase()}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>

            {/* Footer tips */}
            <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-t border-border text-xs text-muted-foreground select-none">
              <span>Use <b>↑↓</b> to navigate, <b>Enter</b> to select</span>
              <span>Search index: 48 Teams • 104 Matches • 16 Cities</span>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
