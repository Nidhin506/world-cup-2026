'use client';

import React from 'react';
import Link from 'next/link';
import { Match } from '../data/matches';
import { formatToIST } from '../utils/timezone';
import { useFavoriteStore } from '../store/favoriteStore';
import { Heart, Tv, ArrowRight, Play } from 'lucide-react';
import TeamFlag from './TeamFlag';

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 0);
  }, []);

  const homeFav = match.homeTeam ? isFavorite(match.homeTeam.id) : false;
  const awayFav = match.awayTeam ? isFavorite(match.awayTeam.id) : false;

  const isLive = match.status === 'LIVE';
  const isCompleted = match.status === 'COMPLETED';
  const isUpcoming = match.status === 'UPCOMING';

  const isFavoritedMatch = isMounted && (homeFav || awayFav);

  return (
    <div
      className={`relative p-4 sm:p-5 glass-card transition-all duration-300 hover:scale-[1.01] ${
        isLive
          ? 'border-secondary bg-secondary/5 neon-pulse shadow-[0_0_10px_rgba(76,215,246,0.15)]'
          : isFavoritedMatch
          ? 'border-primary bg-primary/5 shadow-[0_0_10px_rgba(208,188,255,0.15)]'
          : 'hover:border-primary/30'
      }`}
    >
      {/* Header Info */}
      <div className="flex items-center justify-between mb-3 text-[10px] sm:text-xs">
        <span className="font-bold text-on-surface-variant tracking-wide font-sans">
          MATCH #{match.number} • {match.stage} {match.group ? `• GROUP ${match.group}` : ''}
        </span>
        {isLive && (
          <span className="flex items-center gap-1.5 font-extrabold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full border border-secondary/20 uppercase tracking-wider font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            LIVE {match.minute}&apos;
          </span>
        )}
        {isCompleted && (
          <span className="font-bold text-on-surface-variant bg-white/5 px-2.5 py-0.5 rounded-full font-sans uppercase">
            FT
          </span>
        )}
        {isUpcoming && (
          <span className="font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/15 font-sans">
            {formatToIST(match.date, 'time')}
          </span>
        )}
      </div>

      {/* Score / Teams Grid */}
      <div className="grid grid-cols-7 items-center justify-between gap-2 my-2 sm:my-3">
        {/* Home Team */}
        <div className="col-span-3 flex flex-col items-center text-center gap-1">
          {match.homeTeam ? (
            <>
              <TeamFlag code={match.homeTeam.code} name={match.homeTeam.name} className="w-9 h-6 sm:w-10 sm:h-7 rounded" />
              <span className="font-bold text-sm sm:text-base line-clamp-1">{match.homeTeam.name}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(match.homeTeam!.id);
                }}
                className={`p-1 rounded-full transition-all ${
                  homeFav && isMounted ? 'text-yellow-500 hover:text-yellow-600' : 'text-foreground/20 hover:text-yellow-500/60'
                }`}
                title="Follow Team"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
              </button>
            </>
          ) : (
            <>
              <span className="text-xl sm:text-2xl text-muted-foreground font-mono">?</span>
              <span className="font-semibold text-xs sm:text-sm text-muted-foreground line-clamp-1">
                {match.homeTeamPlaceholder}
              </span>
            </>
          )}
        </div>

        {/* Score display */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          {isUpcoming ? (
            <span className="text-xs sm:text-sm font-extrabold text-muted-foreground text-center tracking-tight">
              VS
            </span>
          ) : (
            <div className="flex items-center gap-1 text-lg sm:text-2xl font-black font-display">
              <span className={match.homeScore! > match.awayScore! ? 'text-primary' : 'text-on-surface/80'}>
                {match.homeScore}
              </span>
              <span className="text-on-surface-variant/30">-</span>
              <span className={match.awayScore! > match.homeScore! ? 'text-primary' : 'text-on-surface/80'}>
                {match.awayScore}
              </span>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="col-span-3 flex flex-col items-center text-center gap-1">
          {match.awayTeam ? (
            <>
              <TeamFlag code={match.awayTeam.code} name={match.awayTeam.name} className="w-9 h-6 sm:w-10 sm:h-7 rounded" />
              <span className="font-bold text-sm sm:text-base line-clamp-1">{match.awayTeam.name}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(match.awayTeam!.id);
                }}
                className={`p-1 rounded-full transition-all ${
                  awayFav && isMounted ? 'text-primary hover:text-primary-fixed' : 'text-foreground/20 hover:text-primary/60'
                }`}
                title="Follow Team"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
              </button>
            </>
          ) : (
            <>
              <span className="text-xl sm:text-2xl text-muted-foreground font-mono">?</span>
              <span className="font-semibold text-xs sm:text-sm text-muted-foreground line-clamp-1">
                {match.awayTeamPlaceholder}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Footer Details */}
      <div className="flex items-center justify-between border-t border-border/30 pt-3 mt-3 text-[10px] sm:text-xs">
        {/* Location */}
        <span className="text-on-surface-variant line-clamp-1 w-1/2 flex items-center gap-1 font-sans">
          <span>📍</span> {match.city}
        </span>
        {/* Watch Information */}
        <div className="flex items-center gap-2">
          {match.homeTeam && (
            <span className="text-on-surface-variant flex items-center gap-1 text-[10px] font-sans">
              <Tv className="w-3 h-3 text-secondary" />
              ZEE5
            </span>
          )}
          <Link
            href={`/matches/${match.id}`}
            className="flex items-center gap-1 text-primary font-extrabold hover:text-secondary transition-colors uppercase tracking-wider text-[10px] font-display"
          >
            Match Center <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
