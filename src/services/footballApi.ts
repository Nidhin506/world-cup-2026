import { Match, MatchEvent, INITIAL_MATCHES } from '../data/matches';
import { TEAMS, Team, Player } from '../data/teams';
import { calculateGroupStandings, GroupStanding } from '../store/matchSimulator';

const API_KEY = process.env.API_FOOTBALL_KEY || '';
const API_HOST = process.env.API_FOOTBALL_HOST || 'v3.football.api-sports.io';
const LEAGUE_ID = process.env.API_FOOTBALL_LEAGUE_ID || '1'; // Typically '1' for World Cup
const SEASON = process.env.API_FOOTBALL_SEASON || '2026';

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

// Global server-side cache to protect rate limits
const apiCache: Record<string, CacheEntry<any>> = {};

function getCached<T>(key: string): T | null {
  const entry = apiCache[key];
  if (entry && entry.expiry > Date.now()) {
    return entry.data as T;
  }
  return null;
}

function setCached<T>(key: string, data: T, ttlMs: number): void {
  apiCache[key] = {
    data,
    expiry: Date.now() + ttlMs,
  };
}

// Server-side simulation state
export interface SimState {
  matchId: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  homeScore: number;
  awayScore: number;
  elapsed: number;
  events: MatchEvent[];
}

let currentSimState: SimState = {
  matchId: 'M1',
  status: 'UPCOMING',
  homeScore: 0,
  awayScore: 0,
  elapsed: 0,
  events: []
};

export function getSimState(): SimState {
  return currentSimState;
}

export function updateSimState(newState: Partial<SimState>): SimState {
  console.log(`[DIAGNOSTIC] Server: Updating simulation state:`, newState);
  currentSimState = { ...currentSimState, ...newState };
  
  // Clear caches immediately upon manual simulation state change
  delete apiCache['matches_list'];
  delete apiCache[`match_detail_full_${currentSimState.matchId}`];
  delete apiCache[`events_${currentSimState.matchId}`];
  delete apiCache[`stats_${currentSimState.matchId}`];
  
  return currentSimState;
}

function getSimulatedMatches(forceRefresh = false): Match[] {
  const cacheKey = 'matches_list';
  if (!forceRefresh) {
    const cached = getCached<Match[]>(cacheKey);
    if (cached) {
      console.log(`[DIAGNOSTIC] Server Cache Hit: matches_list (Simulated)`);
      return cached;
    }
  }

  console.log(`[DIAGNOSTIC] Server API request: getMatches (Simulated, forceRefresh=${forceRefresh})`);
  requestsTodayCount++;
  requestsThisMonthCount++;

  const mappedMatches: Match[] = INITIAL_MATCHES.map((m) => {
    if (m.id === currentSimState.matchId) {
      return {
        ...m,
        status: currentSimState.status,
        homeScore: currentSimState.status !== 'UPCOMING' ? currentSimState.homeScore : undefined,
        awayScore: currentSimState.status !== 'UPCOMING' ? currentSimState.awayScore : undefined,
        minute: currentSimState.status === 'LIVE' ? currentSimState.elapsed : undefined
      };
    }
    return m;
  });

  const hasLiveMatch = mappedMatches.some(m => m.status === 'LIVE');
  const ttl = hasLiveMatch ? 30000 : 600000;
  console.log(`[DIAGNOSTIC] Server API response: getMatches. Status: 200 OK. Matches count: ${mappedMatches.length}. Caching with TTL ${ttl / 1000}s`);
  setCached(cacheKey, mappedMatches, ttl);

  return mappedMatches;
}

async function getSimulatedMatchById(id: string, forceRefresh = false): Promise<Match | null> {
  const matches = getSimulatedMatches(forceRefresh);
  const match = matches.find(m => m.id === id);
  if (!match) return null;

  if (id !== currentSimState.matchId) {
    return match;
  }

  const detailedCacheKey = `match_detail_full_${id}`;
  if (!forceRefresh && match.status !== 'LIVE') {
    const cachedDetailed = getCached<Match>(detailedCacheKey);
    if (cachedDetailed) return cachedDetailed;
  }

  console.log(`[DIAGNOSTIC] Server API request: getMatchById (Simulated, id=${id}, forceRefresh=${forceRefresh})`);

  const eventsCacheKey = `events_${id}`;
  const statsCacheKey = `stats_${id}`;
  const lineupsCacheKey = `lineups_${id}`;

  let events = !forceRefresh ? getCached<MatchEvent[]>(eventsCacheKey) : null;
  let stats = !forceRefresh ? getCached<any>(statsCacheKey) : null;
  let lineups = !forceRefresh ? getCached<any>(lineupsCacheKey) : null;

  if (!events) {
    events = currentSimState.events;
    setCached(eventsCacheKey, events, 30000); // 30 seconds
    console.log(`[DIAGNOSTIC] Server Cache Miss: events_${id}. Caching with TTL 30s.`);
  } else {
    console.log(`[DIAGNOSTIC] Server Cache Hit: events_${id}`);
  }

  if (!stats) {
    stats = {
      possession: [55, 45] as [number, number],
      shots: [12, 8] as [number, number],
      shotsOnTarget: [5, 3] as [number, number],
      passes: [412, 320] as [number, number],
      fouls: [10, 12] as [number, number],
      corners: [6, 4] as [number, number]
    };
    setCached(statsCacheKey, stats, 60000); // 60 seconds
    console.log(`[DIAGNOSTIC] Server Cache Miss: stats_${id}. Caching with TTL 60s.`);
  } else {
    console.log(`[DIAGNOSTIC] Server Cache Hit: stats_${id}`);
  }

  if (!lineups) {
    lineups = {
      formations: ['4-3-3', '4-4-2'] as [string, string],
      lineups: {
        home: ['Matt Turner', 'Antonee Robinson', 'Tim Ream', 'Chris Richards', 'Joe Scally', 'Tyler Adams', 'Weston McKennie', 'Yunus Musah', 'Christian Pulisic', 'Folarin Balogun', 'Timothy Weah'],
        away: ['Luis Malagón', 'Johan Vásquez', 'César Montes', 'Jorge Sánchez', 'Gerardo Arteaga', 'Edson Álvarez', 'Luis Chávez', 'Erick Sánchez', 'Uriel Antuna', 'Santiago Giménez', 'Julián Quiñones']
      }
    };
    setCached(lineupsCacheKey, lineups, 24 * 60 * 60 * 1000); // 24 hours
    console.log(`[DIAGNOSTIC] Server Cache Miss: lineups_${id}. Caching with TTL 24h.`);
  } else {
    console.log(`[DIAGNOSTIC] Server Cache Hit: lineups_${id}`);
  }

  const commentary = events.map((e) => {
    let text = '';
    const teamName = e.teamId === match.homeTeam?.id ? match.homeTeam.name : match.awayTeam?.name || 'Opponent';
    
    if (e.type === 'GOAL') {
      text = `Goal! ${e.playerName} scores for ${teamName}! ${e.detail ? `Assisted by ${e.detail}.` : ''}`;
    } else if (e.type === 'YELLOW_CARD') {
      text = `Yellow card shown to ${e.playerName} (${teamName}) for a booking offence.`;
    } else if (e.type === 'RED_CARD') {
      text = `Red card! ${e.playerName} (${teamName}) is sent off!`;
    } else if (e.type === 'SUBSTITUTION') {
      text = `Substitution for ${teamName}: ${e.playerName} replaced by ${e.detail || 'substitute'}.`;
    }

    return {
      minute: e.minute,
      text
    };
  }).sort((a, b) => a.minute - b.minute);

  const detailedMatch: Match = {
    ...match,
    events,
    possession: stats.possession,
    shots: stats.shots,
    shotsOnTarget: stats.shotsOnTarget,
    passes: stats.passes,
    fouls: stats.fouls,
    corners: stats.corners,
    formations: lineups.formations,
    lineups: lineups.lineups,
    commentary
  };

  console.log(`[DIAGNOSTIC] Server API response: getMatchById. Status: 200 OK. Match status: ${match.status}. Score: ${match.homeScore ?? 0}-${match.awayScore ?? 0}`);

  if (match.status !== 'LIVE') {
    setCached(detailedCacheKey, detailedMatch, 600000); // 10 minutes
  }

  return detailedMatch;
}

// Helper to map API-Football status to MatchStatus
function mapApiStatus(statusShort: string): 'UPCOMING' | 'LIVE' | 'COMPLETED' {
  switch (statusShort) {
    case 'NS': // Not Started
    case 'TBD': // To Be Decided
      return 'UPCOMING';
    case '1H':
    case '2H':
    case 'HT':
    case 'ET':
    case 'P':
    case 'BT':
    case 'LIVE':
      return 'LIVE';
    case 'FT':
    case 'AET':
    case 'PEN':
    case 'SUSP':
    case 'INT':
    case 'PST':
    case 'CANC':
    case 'ABD':
    case 'AWD':
    case 'WO':
      return 'COMPLETED';
    default:
      return 'UPCOMING';
  }
}

// Find team from local TEAMS data by name or code
function findLocalTeam(apiTeamName: string): Team | null {
  const cleanName = apiTeamName.toLowerCase().trim();
  
  // Direct name matching
  let found = TEAMS.find(t => t.name.toLowerCase() === cleanName);
  if (found) return found;

  // Custom mapping for common name differences
  const nameMappings: Record<string, string> = {
    'usa': 'united states',
    'united states of america': 'united states',
    'us': 'united states',
    'south korea': 'south korea',
    'korea Republic': 'south korea',
    'korea republic': 'south korea',
    'republic of korea': 'south korea',
    'saudi arabia': 'saudi arabia',
    'ivory coast': 'ivory coast',
    'cote d\'ivoire': 'ivory coast',
    'côte d\'ivoire': 'ivory coast',
    'united arab emirates': 'united arab emirates',
    'uae': 'united arab emirates',
  };

  const mappedName = nameMappings[cleanName];
  if (mappedName) {
    found = TEAMS.find(t => t.name.toLowerCase() === mappedName);
    if (found) return found;
  }

  // Substring match
  found = TEAMS.find(t => cleanName.includes(t.name.toLowerCase()) || t.name.toLowerCase().includes(cleanName));
  if (found) return found;

  return null;
}

let requestsTodayCount = 0;
let requestsThisMonthCount = 0;
const apiErrors: { timestamp: number; endpoint: string; error: string }[] = [];

export function setRequestsTodayCount(count: number) {
  FootballApiService.setRequestsTodayCount(count);
}

export class FootballApiService {
  private static async fetchApi<T>(endpoint: string): Promise<T> {
    const url = `https://${API_HOST}/${endpoint}`;
    
    requestsTodayCount++;
    requestsThisMonthCount++;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
          'x-apisports-key': API_KEY,
        },
        next: { revalidate: 15 } // Next.js native fetch cache fallback
      });

      if (!response.ok) {
        const errorMsg = `API-Football request failed: ${response.status} ${response.statusText}`;
        apiErrors.push({ timestamp: Date.now(), endpoint, error: errorMsg });
        if (apiErrors.length > 5) apiErrors.shift();
        throw new Error(errorMsg);
      }

      const json = await response.json();
      if (json.errors && Object.keys(json.errors).length > 0) {
        const errorMsg = JSON.stringify(json.errors);
        apiErrors.push({ timestamp: Date.now(), endpoint, error: `API error: ${errorMsg}` });
        if (apiErrors.length > 5) apiErrors.shift();
        throw new Error(`API-Football error: ${errorMsg}`);
      }

      return json as T;
    } catch (e: any) {
      const errorMsg = e.message || e;
      if (!apiErrors.some(x => x.error === errorMsg && Date.now() - x.timestamp < 1000)) {
        apiErrors.push({ timestamp: Date.now(), endpoint, error: errorMsg });
        if (apiErrors.length > 5) apiErrors.shift();
      }
      throw e;
    }
  }

  public static isConfigured(): boolean {
    return API_KEY.length > 0;
  }

  public static getApiUsageMetrics() {
    const dailyLimit = 100;
    const usedToday = requestsTodayCount;
    const remaining = Math.max(0, dailyLimit - usedToday);
    
    // Check if any match is currently LIVE
    const matchesEntry = apiCache['matches_list'];
    const hasLiveMatch = matchesEntry && Array.isArray(matchesEntry.data) && matchesEntry.data.some((m: any) => m.status === 'LIVE');
    
    const estimatedRequestsPerHour = hasLiveMatch ? 300 : 6;
    
    // Calculate remaining hours before quota exhaustion
    let hoursRemaining: number | string = 'Unlimited';
    if (estimatedRequestsPerHour > 0 && remaining > 0) {
      hoursRemaining = Number((remaining / estimatedRequestsPerHour).toFixed(2));
    } else if (remaining === 0) {
      hoursRemaining = 0;
    }
    
    return {
      dailyLimit,
      usedToday,
      remaining,
      estimatedRequestsPerHour,
      hoursRemaining,
      warningTriggered: usedToday >= dailyLimit * 0.8,
      safetyTriggered: usedToday >= dailyLimit * 0.9
    };
  }

  public static setRequestsTodayCount(count: number) {
    requestsTodayCount = count;
    console.log(`[DIAGNOSTIC] Server: Manual override of requestsTodayCount set to: ${count}`);
  }

  public static getDiagnostics() {
    return {
      isApiKeyConfigured: this.isConfigured(),
      apiHost: API_HOST,
      leagueId: LEAGUE_ID,
      season: SEASON,
      requestsToday: requestsTodayCount,
      requestsThisMonth: requestsThisMonthCount,
      errors: apiErrors,
      cacheKeys: Object.keys(apiCache).map(k => ({
        key: k,
        expiry: apiCache[k].expiry,
        ttlRemaining: Math.max(0, apiCache[k].expiry - Date.now())
      })),
      usage: this.getApiUsageMetrics()
    };
  }

  /**
   * Fetch all World Cup matches
   */
  public static async getMatches(forceRefresh = false): Promise<Match[]> {
    if (API_KEY === 'simulated_live_key') {
      return getSimulatedMatches(forceRefresh);
    }

    if (!this.isConfigured()) {
      // Fallback: static fixture list (simulate real API structure statically)
      return INITIAL_MATCHES;
    }

    const cacheKey = 'matches_list';
    if (!forceRefresh) {
      const cached = getCached<Match[]>(cacheKey);
      if (cached) return cached;
    }

    try {
      const endpoint = `fixtures?league=${LEAGUE_ID}&season=${SEASON}`;
      const json: any = await this.fetchApi(endpoint);
      const apiFixtures = json.response || [];

      const mappedMatches: Match[] = apiFixtures.map((item: any, idx: number) => {
        const fixture = item.fixture;
        const apiHome = item.teams.home;
        const apiAway = item.teams.away;
        const apiGoals = item.goals;

        const homeTeam = findLocalTeam(apiHome.name);
        const awayTeam = findLocalTeam(apiAway.name);

        const status = mapApiStatus(fixture.status.short);

        // Deduce stage based on round name
        let stage: Match['stage'] = 'Group Stage';
        const round = item.league.round || '';
        if (round.toLowerCase().includes('final')) {
          stage = 'Final';
        } else if (round.toLowerCase().includes('third')) {
          stage = 'Third Place';
        } else if (round.toLowerCase().includes('semi')) {
          stage = 'Semifinals';
        } else if (round.toLowerCase().includes('quarter')) {
          stage = 'Quarterfinals';
        } else if (round.toLowerCase().includes('round of 16')) {
          stage = 'Round of 16';
        } else if (round.toLowerCase().includes('round of 32')) {
          stage = 'Round of 32';
        }

        // Determine group letter if in group stage
        let group: string | undefined;
        if (stage === 'Group Stage') {
          // round might be e.g. "Group Stage - Group A"
          const match = round.match(/Group\s+([A-L])/i);
          if (match) {
            group = match[1].toUpperCase();
          } else {
            // fallback: get group from home team
            group = homeTeam?.group || awayTeam?.group;
          }
        }

        return {
          id: fixture.id.toString(),
          number: idx + 1,
          stage,
          group,
          homeTeam,
          awayTeam,
          homeTeamPlaceholder: !homeTeam ? apiHome.name : undefined,
          awayTeamPlaceholder: !awayTeam ? apiAway.name : undefined,
          homeScore: apiGoals.home !== null ? apiGoals.home : undefined,
          awayScore: apiGoals.away !== null ? apiGoals.away : undefined,
          status,
          date: fixture.date,
          stadiumId: fixture.venue.id?.toString() || `venue-${idx}`,
          stadiumName: fixture.venue.name || 'Stadium TBD',
          city: fixture.venue.city || 'City TBD',
          minute: fixture.status.elapsed !== null ? fixture.status.elapsed : undefined
        };
      });

      // Sort chronologically
      mappedMatches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Update numbers
      mappedMatches.forEach((m, idx) => {
        m.number = idx + 1;
      });

      // Cache: if any match is LIVE, cache for 30s. Otherwise cache for 10 minutes (600,000 ms).
      const hasLiveMatch = mappedMatches.some(m => m.status === 'LIVE');
      setCached(cacheKey, mappedMatches, hasLiveMatch ? 30000 : 600000);

      return mappedMatches;
    } catch (e) {
      console.error('Error fetching matches from API-Football, returning fallback schedule:', e);
      // Cache the fallback matches for a short duration to prevent immediate subsequent network requests
      setCached(cacheKey, INITIAL_MATCHES, 60000); // 60 seconds
      return INITIAL_MATCHES;
    }
  }

  /**
   * Fetch single match details with stats, events, lineups, and commentary
   */
  public static async getMatchById(id: string, forceRefresh = false): Promise<Match | null> {
    if (API_KEY === 'simulated_live_key') {
      return getSimulatedMatchById(id, forceRefresh);
    }

    // If local ID is used (e.g. M1, R32-1) or if API is not configured:
    if (!this.isConfigured() || id.startsWith('M') || !/^\d+$/.test(id)) {
      return getSimulatedMatchById(id, forceRefresh);
    }

    const detailedCacheKey = `match_detail_full_${id}`;

    try {
      // 1. Fetch main fixture
      const matches = await this.getMatches(forceRefresh);
      const match = matches.find(m => m.id === id); // handles local and API fixture ids
      if (!match) return null;

      // Make sure we have the API fixture ID
      const apiFixtureId = match.id;

      // For completed/upcoming matches, return cached complete details aggressively if available
      if (!forceRefresh && match.status !== 'LIVE') {
        const cachedDetailed = getCached<Match>(detailedCacheKey);
        if (cachedDetailed) return cachedDetailed;
      }

      // Fetch each sub-resource using its own cache key & TTL
      const eventsCacheKey = `events_${apiFixtureId}`;
      const statsCacheKey = `stats_${apiFixtureId}`;
      const lineupsCacheKey = `lineups_${apiFixtureId}`;

      let eventsJson = !forceRefresh ? getCached<any>(eventsCacheKey) : null;
      let statsJson = !forceRefresh ? getCached<any>(statsCacheKey) : null;
      let lineupsJson = !forceRefresh ? getCached<any>(lineupsCacheKey) : null;

      // Fetch missing resources concurrently
      const promises: Promise<any>[] = [];
      const fetchFlags: string[] = [];

      if (!eventsJson) {
        promises.push(this.fetchApi(`fixtures/events?fixture=${apiFixtureId}`).catch(() => ({ response: [] })));
        fetchFlags.push('events');
      }
      if (!statsJson) {
        promises.push(this.fetchApi(`fixtures/statistics?fixture=${apiFixtureId}`).catch(() => ({ response: [] })));
        fetchFlags.push('stats');
      }
      if (!lineupsJson) {
        promises.push(this.fetchApi(`fixtures/lineups?fixture=${apiFixtureId}`).catch(() => ({ response: [] })));
        fetchFlags.push('lineups');
      }

      if (promises.length > 0) {
        const results = await Promise.all(promises);
        results.forEach((res, idx) => {
          const type = fetchFlags[idx];
          if (type === 'events') {
            eventsJson = res;
            setCached(eventsCacheKey, res, 30000); // 30 seconds
          } else if (type === 'stats') {
            statsJson = res;
            setCached(statsCacheKey, res, 60000); // 60 seconds
          } else if (type === 'lineups') {
            lineupsJson = res;
            setCached(lineupsCacheKey, res, 24 * 60 * 60 * 1000); // 24 hours
          }
        });
      }

      // Process stats
      const statsResponse = statsJson.response || [];
      let possession: [number, number] | undefined;
      let shots: [number, number] | undefined;
      let shotsOnTarget: [number, number] | undefined;
      let passes: [number, number] | undefined;
      let fouls: [number, number] | undefined;
      let corners: [number, number] | undefined;

      const getStatVal = (teamStats: any, type: string): number => {
        const item = teamStats.statistics.find((s: any) => s.type === type);
        if (!item || item.value === null) return 0;
        if (typeof item.value === 'string' && item.value.includes('%')) {
          return parseInt(item.value.replace('%', ''));
        }
        return parseInt(item.value);
      };

      if (statsResponse.length === 2) {
        const homeStats = statsResponse[0];
        const awayStats = statsResponse[1];
        
        possession = [getStatVal(homeStats, 'Ball Possession'), getStatVal(awayStats, 'Ball Possession')];
        shots = [getStatVal(homeStats, 'Total Shots'), getStatVal(awayStats, 'Total Shots')];
        shotsOnTarget = [getStatVal(homeStats, 'Shots on Goal'), getStatVal(awayStats, 'Shots on Goal')];
        passes = [getStatVal(homeStats, 'Passes accurate'), getStatVal(awayStats, 'Passes accurate')];
        fouls = [getStatVal(homeStats, 'Fouls'), getStatVal(awayStats, 'Fouls')];
        corners = [getStatVal(homeStats, 'Corner Kicks'), getStatVal(awayStats, 'Corner Kicks')];
      }

      // Process events
      const eventsResponse = eventsJson.response || [];
      const events: MatchEvent[] = eventsResponse.map((item: any) => {
        let type: MatchEvent['type'] = 'GOAL';
        if (item.type === 'Goal') {
          type = 'GOAL';
        } else if (item.type === 'Card') {
          type = item.detail.toLowerCase().includes('yellow') ? 'YELLOW_CARD' : 'RED_CARD';
        } else if (item.type === 'subst') {
          type = 'SUBSTITUTION';
        }

        return {
          type,
          minute: item.time.elapsed,
          teamId: item.team.id.toString(),
          playerName: item.player.name,
          detail: item.assist?.name || item.detail || undefined
        };
      });

      // Process lineups
      const lineupsResponse = lineupsJson.response || [];
      let formations: [string, string] | undefined;
      let lineups: Match['lineups'] | undefined;

      if (lineupsResponse.length === 2) {
        formations = [lineupsResponse[0].formation || '4-3-3', lineupsResponse[1].formation || '4-3-3'];
        lineups = {
          home: (lineupsResponse[0].startXI || []).map((p: any) => p.player.name),
          away: (lineupsResponse[1].startXI || []).map((p: any) => p.player.name)
        };
      }

      // Build real-time commentary from events
      const commentary = events.map((e) => {
        let text = '';
        const teamName = e.teamId === match.homeTeam?.id.toString() ? match.homeTeam.name : match.awayTeam?.name || 'Opponent';
        
        if (e.type === 'GOAL') {
          text = `Goal! ${e.playerName} scores for ${teamName}! ${e.detail ? `Assisted by ${e.detail}.` : ''}`;
        } else if (e.type === 'YELLOW_CARD') {
          text = `Yellow card shown to ${e.playerName} (${teamName}) for a booking offence.`;
        } else if (e.type === 'RED_CARD') {
          text = `Red card! ${e.playerName} (${teamName}) is sent off!`;
        } else if (e.type === 'SUBSTITUTION') {
          text = `Substitution for ${teamName}: ${e.playerName} replaced by ${e.detail || 'substitute'}.`;
        }

        return {
          minute: e.minute,
          text
        };
      }).sort((a, b) => a.minute - b.minute);

      const detailedMatch: Match = {
        ...match,
        events,
        possession,
        shots,
        shotsOnTarget,
        passes,
        fouls,
        corners,
        formations,
        lineups,
        commentary
      };

      // Aggressive cache for non-live match details
      if (match.status !== 'LIVE') {
        setCached(detailedCacheKey, detailedMatch, 600000); // 10 minutes
      }

      return detailedMatch;
    } catch (e) {
      console.error(`Error fetching match details for ID ${id} from API-Football:`, e);
      // Fallback
      const fallbackMatch = INITIAL_MATCHES.find(m => m.id === id) || null;
      if (fallbackMatch) {
        setCached(detailedCacheKey, fallbackMatch, 60000); // 60 seconds
      }
      return fallbackMatch;
    }
  }

  /**
   * Get dynamic group standings computed directly from the cached matches list
   */
  public static async getStandings(): Promise<Record<string, GroupStanding[]>> {
    const matches = await this.getMatches();
    const standings: Record<string, GroupStanding[]> = {};
    const groupLetters = Array.from({ length: 12 }, (_, i) => String.fromCharCode(65 + i));

    groupLetters.forEach((letter) => {
      const groupMatches = matches.filter((m) => m.stage === 'Group Stage' && m.group === letter);
      standings[letter] = calculateGroupStandings(letter, groupMatches);
    });

    return standings;
  }

  /**
   * Get participating teams
   */
  public static async getTeams(): Promise<Team[]> {
    return TEAMS;
  }

  /**
   * Get all players or search within squads
   */
  public static async getPlayers(query: string = ''): Promise<{ player: Player; team: Team }[]> {
    const lowercaseQuery = query.toLowerCase().trim();
    const results: { player: Player; team: Team }[] = [];

    TEAMS.forEach((team) => {
      team.squad.forEach((player) => {
        if (!lowercaseQuery || player.name.toLowerCase().includes(lowercaseQuery) || player.club.toLowerCase().includes(lowercaseQuery)) {
          results.push({ player, team });
        }
      });
    });

    return results;
  }
}
