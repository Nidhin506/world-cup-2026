import { create } from 'zustand';
import { Match, MatchEvent, INITIAL_MATCHES } from '../data/matches';
import { TEAMS, Team } from '../data/teams';

// Helper to calculate standings
export const calculateGroupStandings = (groupLetter: string, groupMatches: Match[]): GroupStanding[] => {
  const standings: Record<string, GroupStanding> = {};

  // 1. Initialize from local TEAMS for this group
  const groupTeams = TEAMS.filter((t) => t.group === groupLetter);
  groupTeams.forEach((t) => {
    standings[t.id] = {
      team: t,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      position: 1
    };
  });

  // 2. Initialize from matches (in case there are mock/API teams not in static TEAMS)
  groupMatches.forEach((m) => {
    if (m.homeTeam && !standings[m.homeTeam.id]) {
      standings[m.homeTeam.id] = {
        team: m.homeTeam,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        position: 1
      };
    }
    if (m.awayTeam && !standings[m.awayTeam.id]) {
      standings[m.awayTeam.id] = {
        team: m.awayTeam,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        position: 1
      };
    }
  });

  groupMatches.forEach((m) => {
    if ((m.status !== 'COMPLETED' && m.status !== 'LIVE') || !m.homeTeam || !m.awayTeam) return;
    const hId = m.homeTeam.id;
    const aId = m.awayTeam.id;

    const hs = m.homeScore ?? 0;
    const as = m.awayScore ?? 0;

    standings[hId].played++;
    standings[aId].played++;
    standings[hId].goalsFor += hs;
    standings[hId].goalsAgainst += as;
    standings[aId].goalsFor += as;
    standings[aId].goalsAgainst += hs;

    if (hs > as) {
      standings[hId].won++;
      standings[hId].points += 3;
      standings[aId].lost++;
    } else if (hs < as) {
      standings[aId].won++;
      standings[aId].points += 3;
      standings[hId].lost++;
    } else {
      standings[hId].drawn++;
      standings[hId].points += 1;
      standings[aId].drawn++;
      standings[aId].points += 1;
    }
  });

  // Calculate goal differences
  Object.values(standings).forEach((s) => {
    s.goalDifference = s.goalsFor - s.goalsAgainst;
  });

  // Sort: points -> GD -> GF -> FIFA ranking (lower number is better rank, so we sort asc on rank)
  const sorted = Object.values(standings).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.fifaRanking - b.team.fifaRanking;
  });

  // Assign positions
  sorted.forEach((s, idx) => {
    s.position = idx + 1;
  });

  return sorted;
};

export interface GroupStanding {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position: number;
}

// MatchState represents the global state for the match simulator and real-time synchronizer
interface MatchState {
  // Real-Time Match States
  matches: Match[];
  standings: Record<string, GroupStanding[]>;
  bestThirdPlaced: GroupStanding[];
  isLoading: boolean;
  error: string | null;
  activeMatchId: string | null;
  activeMatchDetail: Match | null;
  lastUpdated: number | null;
  isLiveConnected: boolean; // True if using real-time API, false if fallback

  // API Quota Safety System
  quotaUsedToday: number;
  quotaRemaining: number;
  quotaWarning: boolean;
  quotaSafetyActive: boolean;

  // FIFA WC 2026 Operating Status Fields
  syncMode: 'PRE_TOURNAMENT' | 'MONITORING' | 'LIVE_MATCH' | 'TAB_HIDDEN' | 'NON_MATCH_PAGE' | 'COMPLETED';
  nextCheckTime: number | null;
  refreshFrequency: string;
  dataSource: string;
  apiConnectionStatus: 'Connected' | 'Idle' | 'Disconnected' | 'Fallback';

  // Actions
  selectMatch: (matchId: string | null) => void;
  fetchMatches: (forceRefresh?: boolean, retryCount?: number) => Promise<void>;
  fetchStandings: (retryCount?: number) => Promise<void>;
  fetchMatchDetail: (matchId: string, forceRefresh?: boolean, retryCount?: number) => Promise<void>;
  syncAll: () => Promise<void>;
  setSyncStates: (states: Partial<Pick<MatchState, 'syncMode' | 'nextCheckTime' | 'refreshFrequency' | 'dataSource' | 'apiConnectionStatus'>>) => void;
}

// Helpers for automatic retry with exponential backoff
const MAX_RETRIES = 3;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useMatchSimulatorStore = create<MatchState>((set, get) => ({
  matches: INITIAL_MATCHES,
  standings: {},
  bestThirdPlaced: [],
  isLoading: false,
  error: null,
  activeMatchId: null,
  activeMatchDetail: null,
  lastUpdated: null,
  isLiveConnected: false,

  // Initial Sync Dashboard States
  syncMode: 'PRE_TOURNAMENT',
  nextCheckTime: null,
  refreshFrequency: 'None',
  dataSource: 'Official Tournament Data',
  apiConnectionStatus: 'Fallback',

  // Quota Metrics
  quotaUsedToday: 0,
  quotaRemaining: 100,
  quotaWarning: false,
  quotaSafetyActive: false,

  setSyncStates: (states) => set((state) => ({ ...state, ...states })),

  selectMatch: (matchId) => {
    set({ activeMatchId: matchId, activeMatchDetail: null });
    if (matchId) {
      get().fetchMatchDetail(matchId, false);
    }
  },

  fetchMatches: async (forceRefresh = false, retryCount = 0) => {
    // Only set loading on initial fetch or when there is an error to prevent polling flash
    const { matches } = get();
    if (matches.length === 0 || forceRefresh) {
      set({ isLoading: true, error: null });
    }

    try {
      const url = forceRefresh ? '/api/matches?refresh=true' : '/api/matches';
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const usedHeader = res.headers.get('x-quota-used-today');
      const remainingHeader = res.headers.get('x-quota-remaining');
      const warningHeader = res.headers.get('x-quota-warning') === 'true';
      const safetyHeader = res.headers.get('x-quota-safety-active') === 'true';

      const data: Match[] = await res.json();
      
      // Determine if live API is connected based on headers or format
      // If we are getting API IDs (which are numeric), it's live. If they are M1, M2 it's fallback.
      const isLive = data.length > 0 && !data[0].id.startsWith('M');

      // Compare matches to detect score/status changes
      data.forEach((newMatch) => {
        const oldMatch = matches.find(m => m.id === newMatch.id);
        if (oldMatch) {
          if (oldMatch.status !== newMatch.status) {
            console.log(`[DIAGNOSTIC] Store: Match ${newMatch.id} status transition detected: ${oldMatch.status} -> ${newMatch.status}`);
          }
          if (oldMatch.homeScore !== newMatch.homeScore || oldMatch.awayScore !== newMatch.awayScore) {
            console.log(`[DIAGNOSTIC] Store: Score changes detected for match ${newMatch.id} (${newMatch.homeTeam?.name || 'TBD'} vs ${newMatch.awayTeam?.name || 'TBD'}): ${oldMatch.homeScore ?? 0}-${oldMatch.awayScore ?? 0} -> ${newMatch.homeScore ?? 0}-${newMatch.awayScore ?? 0}`);
          }
        }
      });

      const prevMatchesStr = JSON.stringify(matches.map(m => ({ id: m.id, hs: m.homeScore, as: m.awayScore, st: m.status })));
      const nextMatchesStr = JSON.stringify(data.map(m => ({ id: m.id, hs: m.homeScore, as: m.awayScore, st: m.status })));
      
      set({
        matches: data,
        isLoading: false,
        error: null,
        lastUpdated: Date.now(),
        isLiveConnected: isLive,
        apiConnectionStatus: isLive ? 'Connected' : 'Fallback',
        dataSource: isLive ? 'Live Match Feed' : 'Official Tournament Data',
        quotaUsedToday: usedHeader ? parseInt(usedHeader) : 0,
        quotaRemaining: remainingHeader ? parseInt(remainingHeader) : 100,
        quotaWarning: warningHeader,
        quotaSafetyActive: safetyHeader
      });

      console.log(`[DIAGNOSTIC] Store: Updates applied (matches list loaded successfully).`);

      // If matches data changed, automatically refresh standings!
      if (prevMatchesStr !== nextMatchesStr) {
        console.log(`[DIAGNOSTIC] Store: Score or status change detected. Recalculating group standings...`);
        get().fetchStandings();
      }
    } catch (e: any) {
      console.error('Error fetching matches:', e);
      if (retryCount < MAX_RETRIES) {
        const backoffMs = Math.pow(2, retryCount) * 1000;
        await delay(backoffMs);
        return get().fetchMatches(forceRefresh, retryCount + 1);
      }
      set({ 
        isLoading: false, 
        error: `Failed to load match fixtures: ${e.message || e}. Retried ${MAX_RETRIES} times.`,
        apiConnectionStatus: 'Disconnected'
      });
    }
  },

  fetchStandings: async (retryCount = 0) => {
    try {
      const res = await fetch('/api/standings');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      set({
        standings: data.standings || {},
        bestThirdPlaced: data.bestThirdPlaced || []
      });
      console.log(`[DIAGNOSTIC] Store: Standings recalculated successfully. Live standings positions updated.`);
    } catch (e) {
      console.error('Error fetching standings:', e);
      if (retryCount < MAX_RETRIES) {
        const backoffMs = Math.pow(2, retryCount) * 1000;
        await delay(backoffMs);
        return get().fetchStandings(retryCount + 1);
      }
    }
  },

  fetchMatchDetail: async (matchId: string, forceRefresh = false, retryCount = 0) => {
    // Only show loading if we are fetching a new match detail or it is null
    const { activeMatchDetail } = get();
    const isNewMatch = !activeMatchDetail || activeMatchDetail.id !== matchId;
    
    if (isNewMatch || forceRefresh) {
      set({ isLoading: true, error: null });
    }

    try {
      const url = forceRefresh ? `/api/matches/${matchId}?refresh=true` : `/api/matches/${matchId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const usedHeader = res.headers.get('x-quota-used-today');
      const remainingHeader = res.headers.get('x-quota-remaining');
      const warningHeader = res.headers.get('x-quota-warning') === 'true';
      const safetyHeader = res.headers.get('x-quota-safety-active') === 'true';

      const data: Match = await res.json();
      set({
        activeMatchDetail: data,
        isLoading: false,
        error: null,
        quotaUsedToday: usedHeader ? parseInt(usedHeader) : 0,
        quotaRemaining: remainingHeader ? parseInt(remainingHeader) : 100,
        quotaWarning: warningHeader,
        quotaSafetyActive: safetyHeader
      });
      console.log(`[DIAGNOSTIC] Store: Updates applied (loaded detailed data for match ${matchId}).`);
    } catch (e: any) {
      console.error(`Error fetching match details for ${matchId}:`, e);
      if (retryCount < MAX_RETRIES) {
        const backoffMs = Math.pow(2, retryCount) * 1000;
        await delay(backoffMs);
        return get().fetchMatchDetail(matchId, forceRefresh, retryCount + 1);
      }
      set({ 
        isLoading: false, 
        error: `Failed to load match details: ${e.message || e}.` 
      });
    }
  },

  syncAll: async () => {
    set({ isLoading: true, error: null });
    await Promise.all([
      get().fetchMatches(true),
      get().fetchStandings()
    ]);
  }
}));
