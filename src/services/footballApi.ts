import { Match, MatchEvent, MatchStatus, INITIAL_MATCHES } from '../data/matches';
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

// Helper to dynamically adjust static match statuses and score simulation based on current system time
export function getDynamicFallbackMatches(staticMatches: Match[]): Match[] {
  const now = new Date();
  
  return staticMatches.map((m) => {
    const matchTime = new Date(m.date);
    const timeDiffMs = now.getTime() - matchTime.getTime();
    
    // Check if match is in the future
    if (timeDiffMs < 0) {
      return {
        ...m,
        status: 'UPCOMING',
        homeScore: undefined,
        awayScore: undefined,
        minute: undefined
      };
    }
    
    // Check if match is currently live (started less than 2 hours / 120 minutes ago)
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    if (timeDiffMs >= 0 && timeDiffMs < twoHoursInMs) {
      const elapsedMinutes = Math.floor(timeDiffMs / (60 * 1000));
      
      // Generate a deterministic but realistic live score based on match ID number
      const seed = m.number;
      const homeScore = Math.floor((seed * 3) % 3);
      const awayScore = Math.floor((seed * 7) % 3);
      
      return {
        ...m,
        status: 'LIVE',
        homeScore,
        awayScore,
        minute: elapsedMinutes,
        possession: [52, 48],
        shots: [8, 6],
        shotsOnTarget: [3, 2],
        passes: [250, 220],
        fouls: [6, 8],
        corners: [3, 2],
        formations: ['4-3-3', '4-4-2'],
        lineups: {
          home: ['Player H1', 'Player H2', 'Player H3', 'Player H4', 'Player H5'],
          away: ['Player A1', 'Player A2', 'Player A3', 'Player A4', 'Player A5']
        },
        events: [
          { type: 'GOAL', minute: Math.max(1, Math.floor(elapsedMinutes / 2)), teamId: m.homeTeam?.id || 'home', playerName: m.homeTeam?.keyPlayers?.[0] || 'Striker' }
        ],
        commentary: [
          { minute: Math.max(1, Math.floor(elapsedMinutes / 2)), text: `Goal! ${m.homeTeam?.keyPlayers?.[0] || 'Striker'} scores for ${m.homeTeam?.name || 'Home Team'}!` }
        ]
      };
    }
    
    // Otherwise, match is completed (started more than 2 hours ago)
    // Generate a deterministic score so it stays consistent between requests
    const seed = m.number;
    const homeScore = Math.floor((seed * 3) % 4); // 0, 1, 2, 3
    const awayScore = Math.floor((seed * 7) % 4); // 0, 1, 2, 3
    
    return {
      ...m,
      status: 'COMPLETED',
      homeScore,
      awayScore,
      minute: undefined,
      possession: [50, 50],
      shots: [12, 10],
      shotsOnTarget: [5, 4],
      passes: [412, 320],
      fouls: [10, 12],
      corners: [6, 4],
      formations: ['4-3-3', '4-4-2'],
      lineups: {
        home: ['Player H1', 'Player H2', 'Player H3', 'Player H4', 'Player H5'],
        away: ['Player A1', 'Player A2', 'Player A3', 'Player A4', 'Player A5']
      },
      events: [
        { type: 'GOAL', minute: 23, teamId: m.homeTeam?.id || 'home', playerName: m.homeTeam?.keyPlayers?.[0] || 'Striker' },
        { type: 'GOAL', minute: 67, teamId: m.awayTeam?.id || 'away', playerName: m.awayTeam?.keyPlayers?.[0] || 'Forward' }
      ],
      commentary: [
        { minute: 23, text: `Goal! ${m.homeTeam?.keyPlayers?.[0] || 'Striker'} scores for ${m.homeTeam?.name || 'Home'}!` },
        { minute: 67, text: `Goal! ${m.awayTeam?.keyPlayers?.[0] || 'Forward'} scores for ${m.awayTeam?.name || 'Away'}!` }
      ]
    };
  });
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

  const dynamicFallbackMatches = getDynamicFallbackMatches(INITIAL_MATCHES);

  const mappedMatches: Match[] = dynamicFallbackMatches.map((m) => {
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

const API_STADIUM_MAP: Record<string, string> = {
  "1": "azteca",
  "2": "akron",
  "3": "bbva",
  "4": "att",
  "5": "nrg",
  "6": "arrowhead",
  "7": "mercedes",
  "8": "hardrock",
  "9": "gillette",
  "10": "lincoln",
  "11": "metlife",
  "12": "bmo",
  "13": "bcplace",
  "14": "lumen",
  "15": "levis",
  "16": "sofi"
};

function parseLocalDateToUtcIso(localDateStr: string, stadiumId: string): string {
  const match = localDateStr.match(/(\d+)\/(\d+)\/(\d+)\s+(\d+):(\d+)/);
  if (!match) return new Date(localDateStr).toISOString();
  
  const month = parseInt(match[1]) - 1;
  const day = parseInt(match[2]);
  const year = parseInt(match[3]);
  const hours = parseInt(match[4]);
  const minutes = parseInt(match[5]);
  
  const utcDate = new Date(Date.UTC(year, month, day, hours, minutes));
  
  let offsetHours = 0;
  const sIdNum = parseInt(stadiumId);
  if ([1, 2, 3].includes(sIdNum)) {
    offsetHours = -6; // Mexico CST
  } else if ([4, 5, 6].includes(sIdNum)) {
    offsetHours = -5; // US Central CDT
  } else if ([7, 8, 9, 10, 11, 12].includes(sIdNum)) {
    offsetHours = -4; // Eastern EDT
  } else if ([13, 14, 15, 16].includes(sIdNum)) {
    offsetHours = -7; // Pacific PDT
  }
  
  utcDate.setUTCHours(utcDate.getUTCHours() - offsetHours);
  return utcDate.toISOString();
}

function parseScorers(scorersStr: string | null, teamId: string): MatchEvent[] {
  if (!scorersStr || scorersStr === 'null') return [];
  const events: MatchEvent[] = [];
  
  const cleanStr = scorersStr.replace(/[{}]/g, '');
  const parts = cleanStr.split(/,+/);
  
  parts.forEach((part) => {
    const trimmed = part.replace(/["'“”]/g, '').trim();
    if (!trimmed) return;
    
    const match = trimmed.match(/(.+?)\s+(\d+)'?/);
    if (match) {
      const name = match[1].trim();
      const minute = parseInt(match[2]);
      events.push({
        type: 'GOAL',
        minute,
        teamId,
        playerName: name
      });
    } else {
      events.push({
        type: 'GOAL',
        minute: 45,
        teamId,
        playerName: trimmed
      });
    }
  });
  
  return events;
}

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

  private static async fetchWorldCup26<T>(endpoint: string): Promise<T> {
    const url = `https://worldcup26.ir/${endpoint}`;
    requestsTodayCount++;
    requestsThisMonthCount++;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        next: { revalidate: 15 } // cache for 15 seconds
      });

      if (!response.ok) {
        const errorMsg = `worldcup26.ir request failed: ${response.status} ${response.statusText}`;
        apiErrors.push({ timestamp: Date.now(), endpoint, error: errorMsg });
        if (apiErrors.length > 5) apiErrors.shift();
        throw new Error(errorMsg);
      }

      return await response.json() as T;
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
    return true; // worldcup26.ir is public and requires no key
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
   * Fetch all World Cup matches from worldcup26.ir
   */
  public static async getMatches(forceRefresh = false): Promise<Match[]> {
    if (API_KEY === 'simulated_live_key') {
      return getSimulatedMatches(forceRefresh);
    }

    const cacheKey = 'matches_list';
    if (!forceRefresh) {
      const cached = getCached<Match[]>(cacheKey);
      if (cached) return cached;
    }

    const url = 'https://worldcup26.ir/get/games';

    try {
      console.log(`[DIAGNOSTIC] API request URL: ${url}`);
      console.log(`[DIAGNOSTIC] league ID: N/A (worldcup26.ir)`);
      console.log(`[DIAGNOSTIC] season: 2026`);

      // Fetch games, teams, and stadiums from worldcup26.ir concurrently
      const [gamesJson, teamsJson, stadiumsJson] = await Promise.all([
        this.fetchWorldCup26<{ games: any[] }>('get/games'),
        this.fetchWorldCup26<{ teams: any[] }>('get/teams'),
        this.fetchWorldCup26<{ stadiums: any[] }>('get/stadiums')
      ]);

      const apiFixtures = gamesJson.games || [];
      console.log(`[DIAGNOSTIC] number of fixtures returned: ${apiFixtures.length}`);

      if (apiFixtures.length > 0) {
        const firstFixture = apiFixtures[0];
        console.log(`[DIAGNOSTIC] first fixture status: ${firstFixture.finished === 'TRUE' ? 'finished' : 'notstarted'}`);
        console.log(`[DIAGNOSTIC] first fixture score: Home: ${firstFixture.home_score}, Away: ${firstFixture.away_score}`);
      } else {
        console.log(`[DIAGNOSTIC] first fixture status: N/A`);
        console.log(`[DIAGNOSTIC] first fixture score: N/A`);
      }

      // Build mapping tables
      const teamsMap: Record<string, Team> = {};
      (teamsJson.teams || []).forEach((t: any) => {
        const localTeam = findLocalTeam(t.name_en);
        if (localTeam) {
          teamsMap[t.id] = {
            ...localTeam,
            code: t.fifa_code || localTeam.code,
          };
        } else {
          // Mock missing team dynamically
          teamsMap[t.id] = {
            id: t.name_en.toLowerCase().replace(/\s+/g, '-'),
            name: t.name_en,
            code: t.fifa_code || t.name_en.slice(0, 3).toUpperCase(),
            flag: '⚽',
            group: t.groups || 'A',
            fifaRanking: 50,
            coach: 'Unknown Coach',
            keyPlayers: [],
            squad: [],
            history: { appearances: 0, bestFinish: 'N/A', titles: 0 },
            journey: 'Qualified for the FIFA World Cup 2026.'
          };
        }
      });

      const stadiumsMap: Record<string, { name: string; city: string }> = {};
      (stadiumsJson.stadiums || []).forEach((s: any) => {
        stadiumsMap[s.id] = {
          name: s.name_en,
          city: s.city_en
        };
      });

      const mappedMatches: Match[] = apiFixtures.map((g: any, idx: number) => {
        const homeTeam = teamsMap[g.home_team_id] || null;
        const awayTeam = teamsMap[g.away_team_id] || null;

        const isFinished = g.finished === 'TRUE';
        const isLive = g.time_elapsed && g.time_elapsed !== 'notstarted' && g.time_elapsed !== 'finished';
        const status: MatchStatus = isFinished ? 'COMPLETED' : (isLive ? 'LIVE' : 'UPCOMING');

        const homeScore = g.home_score !== null && g.home_score !== undefined && g.home_score !== '' ? parseInt(g.home_score) : undefined;
        const awayScore = g.away_score !== null && g.away_score !== undefined && g.away_score !== '' ? parseInt(g.away_score) : undefined;

        let stage: Match['stage'] = 'Group Stage';
        if (g.type === 'r32') stage = 'Round of 32';
        else if (g.type === 'r16') stage = 'Round of 16';
        else if (g.type === 'qf') stage = 'Quarterfinals';
        else if (g.type === 'sf') stage = 'Semifinals';
        else if (g.type === 'third') stage = 'Third Place';
        else if (g.type === 'final') stage = 'Final';

        const dateIso = parseLocalDateToUtcIso(g.local_date, g.stadium_id);
        const mappedStadiumId = API_STADIUM_MAP[g.stadium_id] || `venue-${g.stadium_id}`;
        const stadiumInfo = stadiumsMap[g.stadium_id] || { name: 'Stadium TBD', city: 'City TBD' };

        const events: MatchEvent[] = [];
        if (status !== 'UPCOMING') {
          events.push(...parseScorers(g.home_scorers, homeTeam?.id || 'home'));
          events.push(...parseScorers(g.away_scorers, awayTeam?.id || 'away'));
        }

        const commentary = events.map((e) => {
          const teamName = e.teamId === homeTeam?.id ? homeTeam.name : awayTeam?.name || 'Opponent';
          return {
            minute: e.minute,
            text: `Goal! ${e.playerName} scores for ${teamName}!`
          };
        }).sort((a, b) => a.minute - b.minute);

        let possession: [number, number] | undefined;
        let shots: [number, number] | undefined;
        let shotsOnTarget: [number, number] | undefined;
        let passes: [number, number] | undefined;
        let fouls: [number, number] | undefined;
        let corners: [number, number] | undefined;
        let formations: [string, string] | undefined;
        let lineups: Match['lineups'] | undefined;

        if (status !== 'UPCOMING') {
          possession = [50, 50];
          shots = [12, 10];
          shotsOnTarget = [5, 4];
          passes = [412, 320];
          fouls = [10, 12];
          corners = [6, 4];
          formations = ['4-3-3', '4-4-2'];
          lineups = {
            home: ['Player H1', 'Player H2', 'Player H3', 'Player H4', 'Player H5'],
            away: ['Player A1', 'Player A2', 'Player A3', 'Player A4', 'Player A5']
          };
        }

        return {
          id: g.id.toString(),
          number: parseInt(g.id) || idx + 1,
          stage,
          group: g.group,
          homeTeam,
          awayTeam,
          homeTeamPlaceholder: g.home_team_label || undefined,
          awayTeamPlaceholder: g.away_team_label || undefined,
          homeScore,
          awayScore,
          status,
          date: dateIso,
          stadiumId: mappedStadiumId,
          stadiumName: stadiumInfo.name,
          city: stadiumInfo.city,
          minute: status === 'LIVE' ? (parseInt(g.time_elapsed) || 45) : undefined,
          events,
          commentary,
          possession,
          shots,
          shotsOnTarget,
          passes,
          fouls,
          corners,
          formations,
          lineups
        };
      });

      // Sort chronologically
      mappedMatches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Update numbers
      mappedMatches.forEach((m, idx) => {
        m.number = idx + 1;
      });

      const hasLiveMatch = mappedMatches.some(m => m.status === 'LIVE');
      setCached(cacheKey, mappedMatches, hasLiveMatch ? 30000 : 600000);

      return mappedMatches;
    } catch (e: any) {
      console.error('Error fetching matches from worldcup26.ir, returning fallback schedule:', e);
      console.log(`[DIAGNOSTIC] API request URL: ${url}`);
      console.log(`[DIAGNOSTIC] league ID: N/A (worldcup26.ir)`);
      console.log(`[DIAGNOSTIC] season: 2026`);
      console.log(`[DIAGNOSTIC] number of fixtures returned: 0`);
      console.log(`[DIAGNOSTIC] first fixture status: N/A (API error: ${e.message || e})`);
      console.log(`[DIAGNOSTIC] first fixture score: N/A`);

      const dynamicMatches = getDynamicFallbackMatches(INITIAL_MATCHES);
      setCached(cacheKey, dynamicMatches, 60000); // 60 seconds
      return dynamicMatches;
    }
  }

  /**
   * Fetch single match details
   */
  public static async getMatchById(id: string, forceRefresh = false): Promise<Match | null> {
    if (API_KEY === 'simulated_live_key') {
      return getSimulatedMatchById(id, forceRefresh);
    }

    try {
      const matches = await this.getMatches(forceRefresh);
      const match = matches.find(m => m.id === id);
      if (match) return match;
    } catch (e) {
      console.error(`Error fetching match detail for ${id}:`, e);
    }

    return getSimulatedMatchById(id, forceRefresh);
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
