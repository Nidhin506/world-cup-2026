import { TEAMS, Team } from './teams';
import { STADIUMS, Stadium } from './stadiums';

export type MatchStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED';

export interface MatchEvent {
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION';
  minute: number;
  teamId: string;
  playerName: string;
  detail?: string; // e.g. Assist player or second yellow card
}

export interface Match {
  id: string; // e.g., 'M1', 'R32-1', 'F'
  number: number;
  stage: 'Group Stage' | 'Round of 32' | 'Round of 16' | 'Quarterfinals' | 'Semifinals' | 'Third Place' | 'Final';
  group?: string; // A-L (if group stage)
  homeTeam: Team | null; // Null means TBD (to be decided) for knockouts
  awayTeam: Team | null;
  homeTeamPlaceholder?: string; // e.g., '1A' or 'Winner R32-1'
  awayTeamPlaceholder?: string;
  homeScore?: number;
  awayScore?: number;
  status: MatchStatus;
  date: string; // ISO date string, UTC timezone
  stadiumId: string;
  stadiumName: string;
  city: string;
  minute?: number; // Current live minute
  events?: MatchEvent[];
  possession?: [number, number]; // [home, away]
  shots?: [number, number];
  shotsOnTarget?: [number, number];
  passes?: [number, number];
  fouls?: [number, number];
  corners?: [number, number];
  formations?: [string, string]; // e.g. ['4-3-3', '4-2-3-1']
  lineups?: {
    home: string[];
    away: string[];
  };
  commentary?: {
    minute: number;
    text: string;
  }[];
}

// Generate the 72 group stage matches
const generateGroupMatches = (): Match[] => {
  const matches: Match[] = [];
  let matchNumber = 1;

  // Let's define the start date: June 11, 2026, at 16:00 UTC (12:00 PM Local / 9:30 PM IST)
  // We will schedule 3 matches per day, at 14:00, 17:00, and 20:00 UTC.
  const baseDate = new Date('2026-06-11T16:00:00Z');

  // Group letters A through L
  const groupLetters = Array.from({ length: 12 }, (_, i) => String.fromCharCode(65 + i));

  groupLetters.forEach((groupLetter) => {
    const groupTeams = TEAMS.filter((t) => t.group === groupLetter);
    if (groupTeams.length < 4) return;

    // A group of 4 teams [T1, T2, T3, T4] plays 6 matches:
    // Match 1: T1 vs T2
    // Match 2: T3 vs T4
    // Match 3: T1 vs T3
    // Match 4: T2 vs T4
    // Match 5: T4 vs T1
    // Match 6: T2 vs T3
    const fixtures = [
      [0, 1],
      [2, 3],
      [0, 2],
      [1, 3],
      [3, 0],
      [1, 2]
    ];

    fixtures.forEach(([homeIdx, awayIdx], idx) => {
      const homeTeam = groupTeams[homeIdx];
      const awayTeam = groupTeams[awayIdx];

      // Distribute matches over the group stage duration (June 11 - June 27)
      // We space them out. E.g. dayOffset based on group index and fixture index
      // Group A starts day 0, Group B starts day 1, etc.
      const groupIndex = groupLetter.charCodeAt(0) - 65;
      const dayOffset = Math.floor(groupIndex / 2) * 2 + Math.floor(idx / 2) * 3;
      const hourOffset = (groupIndex % 2) * 3 + (idx % 2) * 3; // spread hours

      const matchDate = new Date(baseDate.getTime());
      matchDate.setDate(baseDate.getDate() + dayOffset);
      matchDate.setHours(baseDate.getHours() + hourOffset);

      // Select stadium cycling through the 16 venues
      const stadiumIndex = (matchNumber - 1) % STADIUMS.length;
      const stadium = STADIUMS[stadiumIndex];

      // To make the app look dynamic, let's pre-populate some completed matches,
      // some live matches, and keep the rest upcoming.
      // Current date is June 4, 2026. The World Cup starts June 11, 2026.
      // So all matches are technically in the future relative to local time (June 4, 2026).
      // Wait, let's make the FIRST few matches (e.g. M1 and M2) "UPCOMING" but close, or let's simulate
      // that we are currently on June 12, 2026 (so M1 and M2 are completed, M3 is live, and others are upcoming).
      // This is a great trick for a demo platform to feel "live"!
      // We will define a virtual current date or state that simulates tournament progress.
      // Let's assume we can simulate matches being in different states.
      
      matches.push({
        id: `M${matchNumber}`,
        number: matchNumber,
        stage: 'Group Stage',
        group: groupLetter,
        homeTeam,
        awayTeam,
        status: 'UPCOMING',
        date: matchDate.toISOString(),
        stadiumId: stadium.id,
        stadiumName: stadium.name,
        city: stadium.city
      });

      matchNumber++;
    });
  });

  // Let's sort group matches by date
  matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Re-number matches based on chronological order
  matches.forEach((m, idx) => {
    m.number = idx + 1;
    m.id = `M${idx + 1}`;
  });

  return matches;
};

// Generate Knockout Stage placeholder matches
const generateKnockoutMatches = (): Match[] => {
  const knockouts: Match[] = [];
  let num = 73; // Starts after 72 group stage matches

  // 1. Round of 32: 16 matches (June 28 - July 3)
  const r32Dates = [
    '2026-06-28T16:00:00Z', '2026-06-28T20:00:00Z',
    '2026-06-29T16:00:00Z', '2026-06-29T20:00:00Z',
    '2026-06-30T16:00:00Z', '2026-06-30T20:00:00Z',
    '2026-07-01T16:00:00Z', '2026-07-01T20:00:00Z',
    '2026-07-02T16:00:00Z', '2026-07-02T20:00:00Z',
    '2026-07-03T16:00:00Z', '2026-07-03T20:00:00Z',
    '2026-07-04T16:00:00Z', '2026-07-04T20:00:00Z',
    '2026-07-05T16:00:00Z', '2026-07-05T20:00:00Z',
  ];

  for (let i = 1; i <= 16; i++) {
    const d = r32Dates[i - 1];
    const std = STADIUMS[i % STADIUMS.length];
    knockouts.push({
      id: `R32-${i}`,
      number: num++,
      stage: 'Round of 32',
      homeTeam: null,
      awayTeam: null,
      homeTeamPlaceholder: `Winner Group ${String.fromCharCode(65 + ((i - 1) % 12))}`,
      awayTeamPlaceholder: `Runner-up Group ${String.fromCharCode(65 + ((i + 1) % 12))}`,
      status: 'UPCOMING',
      date: d,
      stadiumId: std.id,
      stadiumName: std.name,
      city: std.city
    });
  }

  // 2. Round of 16: 8 matches (July 4 - July 7)
  const r16Dates = [
    '2026-07-06T16:00:00Z', '2026-07-06T20:00:00Z',
    '2026-07-07T16:00:00Z', '2026-07-07T20:00:00Z',
    '2026-07-08T16:00:00Z', '2026-07-08T20:00:00Z',
    '2026-07-09T16:00:00Z', '2026-07-09T20:00:00Z',
  ];
  for (let i = 1; i <= 8; i++) {
    const d = r16Dates[i - 1];
    const std = STADIUMS[(i + 4) % STADIUMS.length];
    knockouts.push({
      id: `R16-${i}`,
      number: num++,
      stage: 'Round of 16',
      homeTeam: null,
      awayTeam: null,
      homeTeamPlaceholder: `Winner R32-${(i * 2) - 1}`,
      awayTeamPlaceholder: `Winner R32-${i * 2}`,
      status: 'UPCOMING',
      date: d,
      stadiumId: std.id,
      stadiumName: std.name,
      city: std.city
    });
  }

  // 3. Quarterfinals: 4 matches (July 10 - July 11)
  const qfDates = [
    '2026-07-10T19:00:00Z', '2026-07-10T23:00:00Z',
    '2026-07-11T19:00:00Z', '2026-07-11T23:00:00Z'
  ];
  const qfStadiums = ['sofi', 'gillette', 'hardrock', 'arrowhead'];
  for (let i = 1; i <= 4; i++) {
    const std = STADIUMS.find(s => s.id === qfStadiums[i - 1]) || STADIUMS[i];
    knockouts.push({
      id: `QF-${i}`,
      number: num++,
      stage: 'Quarterfinals',
      homeTeam: null,
      awayTeam: null,
      homeTeamPlaceholder: `Winner R16-${(i * 2) - 1}`,
      awayTeamPlaceholder: `Winner R16-${i * 2}`,
      status: 'UPCOMING',
      date: qfDates[i - 1],
      stadiumId: std.id,
      stadiumName: std.name,
      city: std.city
    });
  }

  // 4. Semifinals: 2 matches (July 14 - July 15)
  const sfStadiums = ['att', 'mercedes'];
  knockouts.push({
    id: `SF-1`,
    number: num++,
    stage: 'Semifinals',
    homeTeam: null,
    awayTeam: null,
    homeTeamPlaceholder: 'Winner QF-1',
    awayTeamPlaceholder: 'Winner QF-2',
    status: 'UPCOMING',
    date: '2026-07-14T23:00:00Z',
    stadiumId: sfStadiums[0],
    stadiumName: 'AT&T Stadium',
    city: 'Arlington'
  });
  knockouts.push({
    id: `SF-2`,
    number: num++,
    stage: 'Semifinals',
    homeTeam: null,
    awayTeam: null,
    homeTeamPlaceholder: 'Winner QF-3',
    awayTeamPlaceholder: 'Winner QF-4',
    status: 'UPCOMING',
    date: '2026-07-15T23:00:00Z',
    stadiumId: sfStadiums[1],
    stadiumName: 'Mercedes-Benz Stadium',
    city: 'Atlanta'
  });

  // 5. Third Place Playoff (July 18)
  knockouts.push({
    id: `3RD`,
    number: num++,
    stage: 'Third Place',
    homeTeam: null,
    awayTeam: null,
    homeTeamPlaceholder: 'Loser SF-1',
    awayTeamPlaceholder: 'Loser SF-2',
    status: 'UPCOMING',
    date: '2026-07-18T20:00:00Z',
    stadiumId: 'hardrock',
    stadiumName: 'Hard Rock Stadium',
    city: 'Miami Gardens'
  });

  // 6. Final (July 19)
  knockouts.push({
    id: `FINAL`,
    number: num,
    stage: 'Final',
    homeTeam: null,
    awayTeam: null,
    homeTeamPlaceholder: 'Winner SF-1',
    awayTeamPlaceholder: 'Winner SF-2',
    status: 'UPCOMING',
    date: '2026-07-19T20:00:00Z',
    stadiumId: 'metlife',
    stadiumName: 'MetLife Stadium',
    city: 'East Rutherford'
  });

  return knockouts;
};

export const INITIAL_MATCHES: Match[] = [
  ...generateGroupMatches(),
  ...generateKnockoutMatches()
];
