export interface Player {
  id: string;
  name: string;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  age: number;
  club: string;
  shirtNumber: number;
  isKeyPlayer?: boolean;
}

export interface Team {
  id: string; // e.g., 'usa'
  name: string; // e.g., 'United States'
  code: string; // e.g., 'USA'
  flag: string; // Emoji flag
  group: string; // A-L
  fifaRanking: number;
  coach: string;
  keyPlayers: string[];
  squad: Player[];
  history: {
    appearances: number;
    bestFinish: string;
    titles: number;
  };
  journey: string; // Path to qualification
}

export const TEAMS: Team[] = [
  // GROUP A
  {
    id: 'usa',
    name: 'United States',
    code: 'USA',
    flag: '🇺🇸',
    group: 'A',
    fifaRanking: 16,
    coach: 'Mauricio Pochettino',
    keyPlayers: ['Christian Pulisic', 'Weston McKennie'],
    history: { appearances: 12, bestFinish: 'Third Place (1930)', titles: 0 },
    journey: 'Qualified automatically as co-host of the 2026 FIFA World Cup.',
    squad: [
      { id: 'usa-1', name: 'Matt Turner', position: 'Goalkeeper', age: 31, club: 'Crystal Palace', shirtNumber: 1 },
      { id: 'usa-2', name: 'Antonee Robinson', position: 'Defender', age: 28, club: 'Fulham', shirtNumber: 5 },
      { id: 'usa-3', name: 'Weston McKennie', position: 'Midfielder', age: 27, club: 'Juventus', shirtNumber: 8 },
      { id: 'usa-4', name: 'Christian Pulisic', position: 'Forward', age: 27, club: 'AC Milan', shirtNumber: 10, isKeyPlayer: true },
      { id: 'usa-5', name: 'Folarin Balogun', position: 'Forward', age: 24, club: 'Monaco', shirtNumber: 20 }
    ]
  },
  {
    id: 'mexico',
    name: 'Mexico',
    code: 'MEX',
    flag: '🇲🇽',
    group: 'A',
    fifaRanking: 15,
    coach: 'Javier Aguirre',
    keyPlayers: ['Santiago Giménez', 'Edson Álvarez'],
    history: { appearances: 18, bestFinish: 'Quarterfinals (1970, 1986)', titles: 0 },
    journey: 'Qualified automatically as co-host of the 2026 FIFA World Cup.',
    squad: [
      { id: 'mex-1', name: 'Luis Malagón', position: 'Goalkeeper', age: 29, club: 'Club América', shirtNumber: 1 },
      { id: 'mex-2', name: 'Johan Vásquez', position: 'Defender', age: 27, club: 'Genoa', shirtNumber: 5 },
      { id: 'mex-3', name: 'Edson Álvarez', position: 'Midfielder', age: 28, club: 'West Ham', shirtNumber: 4, isKeyPlayer: true },
      { id: 'mex-4', name: 'Luis Chávez', position: 'Midfielder', age: 30, club: 'Dynamo Moscow', shirtNumber: 18 },
      { id: 'mex-5', name: 'Santiago Giménez', position: 'Forward', age: 25, club: 'Feyenoord', shirtNumber: 9, isKeyPlayer: true }
    ]
  },
  {
    id: 'ecuador',
    name: 'Ecuador',
    code: 'ECU',
    flag: '🇪🇨',
    group: 'A',
    fifaRanking: 27,
    coach: 'Sebastián Beccacece',
    keyPlayers: ['Piero Hincapié', 'Moisés Caicedo'],
    history: { appearances: 5, bestFinish: 'Round of 16 (2006)', titles: 0 },
    journey: 'Finished in the top 6 of CONMEBOL qualification standings.',
    squad: [
      { id: 'ecu-1', name: 'Hernán Galíndez', position: 'Goalkeeper', age: 39, club: 'Aucas', shirtNumber: 1 },
      { id: 'ecu-2', name: 'Piero Hincapié', position: 'Defender', age: 24, club: 'Bayer Leverkusen', shirtNumber: 3 },
      { id: 'ecu-3', name: 'Willian Pacho', position: 'Defender', age: 24, club: 'Paris Saint-Germain', shirtNumber: 6 },
      { id: 'ecu-4', name: 'Moisés Caicedo', position: 'Midfielder', age: 24, club: 'Chelsea', shirtNumber: 23, isKeyPlayer: true },
      { id: 'ecu-5', name: 'Enner Valencia', position: 'Forward', age: 36, club: 'Internacional', shirtNumber: 13 }
    ]
  },
  {
    id: 'new-zealand',
    name: 'New Zealand',
    code: 'NZL',
    flag: '🇳🇿',
    group: 'A',
    fifaRanking: 94,
    coach: 'Darren Bazeley',
    keyPlayers: ['Chris Wood', 'Liberato Cacace'],
    history: { appearances: 3, bestFinish: 'Group Stage (1982, 2010)', titles: 0 },
    journey: 'Won the OFC qualifying tournament, securing direct oceania slot.',
    squad: [
      { id: 'nzl-1', name: 'Alex Paulsen', position: 'Goalkeeper', age: 23, club: 'Auckland FC', shirtNumber: 1 },
      { id: 'nzl-2', name: 'Liberato Cacace', position: 'Defender', age: 25, club: 'Empoli', shirtNumber: 3 },
      { id: 'nzl-3', name: 'Marko Stamenic', position: 'Midfielder', age: 24, club: 'Olympiacos', shirtNumber: 8 },
      { id: 'nzl-4', name: 'Chris Wood', position: 'Forward', age: 34, club: 'Nottingham Forest', shirtNumber: 9, isKeyPlayer: true },
      { id: 'nzl-5', name: 'Matthew Garbett', position: 'Midfielder', age: 24, club: 'NAC Breda', shirtNumber: 10 }
    ]
  },

  // GROUP B
  {
    id: 'england',
    name: 'England',
    code: 'ENG',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    group: 'B',
    fifaRanking: 4,
    coach: 'Thomas Tuchel',
    keyPlayers: ['Harry Kane', 'Jude Bellingham', 'Bukayo Saka'],
    history: { appearances: 17, bestFinish: 'Champions (1966)', titles: 1 },
    journey: 'Won UEFA Qualifying Group C with an unbeaten record.',
    squad: [
      { id: 'eng-1', name: 'Jordan Pickford', position: 'Goalkeeper', age: 32, club: 'Everton', shirtNumber: 1 },
      { id: 'eng-2', name: 'John Stones', position: 'Defender', age: 32, club: 'Manchester City', shirtNumber: 5 },
      { id: 'eng-3', name: 'Declan Rice', position: 'Midfielder', age: 27, club: 'Arsenal', shirtNumber: 4 },
      { id: 'eng-4', name: 'Jude Bellingham', position: 'Midfielder', age: 22, club: 'Real Madrid', shirtNumber: 10, isKeyPlayer: true },
      { id: 'eng-5', name: 'Harry Kane', position: 'Forward', age: 32, club: 'Bayern Munich', shirtNumber: 9, isKeyPlayer: true },
      { id: 'eng-6', name: 'Bukayo Saka', position: 'Forward', age: 24, club: 'Arsenal', shirtNumber: 7 }
    ]
  },
  {
    id: 'japan',
    name: 'Japan',
    code: 'JPN',
    flag: '🇯🇵',
    group: 'B',
    fifaRanking: 15,
    coach: 'Hajime Moriyasu',
    keyPlayers: ['Kaoru Mitoma', 'Wataru Endo', 'Takefusa Kubo'],
    history: { appearances: 8, bestFinish: 'Round of 16 (2002, 2010, 2018, 2022)', titles: 0 },
    journey: 'Finished top of AFC Third Round Group C.',
    squad: [
      { id: 'jpn-1', name: 'Zion Suzuki', position: 'Goalkeeper', age: 23, club: 'Parma', shirtNumber: 1 },
      { id: 'jpn-2', name: 'Ko Itakura', position: 'Defender', age: 29, club: 'Mönchengladbach', shirtNumber: 4 },
      { id: 'jpn-3', name: 'Wataru Endo', position: 'Midfielder', age: 33, club: 'Liverpool', shirtNumber: 6 },
      { id: 'jpn-4', name: 'Takefusa Kubo', position: 'Midfielder', age: 25, club: 'Real Sociedad', shirtNumber: 20 },
      { id: 'jpn-5', name: 'Kaoru Mitoma', position: 'Forward', age: 29, club: 'Brighton', shirtNumber: 7, isKeyPlayer: true }
    ]
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    code: 'NGA',
    flag: '🇳🇬',
    group: 'B',
    fifaRanking: 36,
    coach: 'Augustine Eguavoen',
    keyPlayers: ['Victor Osimhen', 'Ademola Lookman'],
    history: { appearances: 7, bestFinish: 'Round of 16 (1994, 1998, 2014)', titles: 0 },
    journey: 'Won CAF Group Stage to secure direct ticket.',
    squad: [
      { id: 'nga-1', name: 'Stanley Nwabali', position: 'Goalkeeper', age: 29, club: 'Chippa United', shirtNumber: 1 },
      { id: 'nga-2', name: 'William Troost-Ekong', position: 'Defender', age: 32, club: 'Al-Kholood', shirtNumber: 5 },
      { id: 'nga-3', name: 'Alex Iwobi', position: 'Midfielder', age: 30, club: 'Fulham', shirtNumber: 17 },
      { id: 'nga-4', name: 'Ademola Lookman', position: 'Forward', age: 28, club: 'Atalanta', shirtNumber: 11 },
      { id: 'nga-5', name: 'Victor Osimhen', position: 'Forward', age: 27, club: 'Galatasaray', shirtNumber: 9, isKeyPlayer: true }
    ]
  },
  {
    id: 'switzerland',
    name: 'Switzerland',
    code: 'SUI',
    flag: '🇨🇭',
    group: 'B',
    fifaRanking: 18,
    coach: 'Murat Yakin',
    keyPlayers: ['Granit Xhaka', 'Manuel Akanji'],
    history: { appearances: 13, bestFinish: 'Quarterfinals (1934, 1938, 1954)', titles: 0 },
    journey: 'Finished runner-up in UEFA Group F and won the playoffs.',
    squad: [
      { id: 'sui-1', name: 'Yann Sommer', position: 'Goalkeeper', age: 37, club: 'Inter Milan', shirtNumber: 1 },
      { id: 'sui-2', name: 'Manuel Akanji', position: 'Defender', age: 30, club: 'Manchester City', shirtNumber: 5 },
      { id: 'sui-3', name: 'Granit Xhaka', position: 'Midfielder', age: 33, club: 'Bayer Leverkusen', shirtNumber: 10, isKeyPlayer: true },
      { id: 'sui-4', name: 'Remo Freuler', position: 'Midfielder', age: 34, club: 'Bologna', shirtNumber: 8 },
      { id: 'sui-5', name: 'Breel Embolo', position: 'Forward', age: 29, club: 'Monaco', shirtNumber: 7 }
    ]
  },

  // GROUP C
  {
    id: 'argentina',
    name: 'Argentina',
    code: 'ARG',
    flag: '🇦🇷',
    group: 'C',
    fifaRanking: 1,
    coach: 'Lionel Scaloni',
    keyPlayers: ['Lionel Messi', 'Lautaro Martínez', 'Alexis Mac Allister'],
    history: { appearances: 19, bestFinish: 'Champions (1978, 1986, 2022)', titles: 3 },
    journey: 'Finished top of CONMEBOL Qualification table.',
    squad: [
      { id: 'arg-1', name: 'Emiliano Martínez', position: 'Goalkeeper', age: 33, club: 'Aston Villa', shirtNumber: 23, isKeyPlayer: true },
      { id: 'arg-2', name: 'Cristian Romero', position: 'Defender', age: 28, club: 'Tottenham Hotspur', shirtNumber: 13 },
      { id: 'arg-3', name: 'Alexis Mac Allister', position: 'Midfielder', age: 27, club: 'Liverpool', shirtNumber: 20 },
      { id: 'arg-4', name: 'Lionel Messi', position: 'Forward', age: 38, club: 'Inter Miami', shirtNumber: 10, isKeyPlayer: true },
      { id: 'arg-5', name: 'Lautaro Martínez', position: 'Forward', age: 28, club: 'Inter Milan', shirtNumber: 22 }
    ]
  },
  {
    id: 'south-korea',
    name: 'South Korea',
    code: 'KOR',
    flag: '🇰🇷',
    group: 'C',
    fifaRanking: 22,
    coach: 'Hong Myung-bo',
    keyPlayers: ['Son Heung-min', 'Kim Min-jae'],
    history: { appearances: 12, bestFinish: 'Fourth Place (2002)', titles: 0 },
    journey: 'Won AFC Third Round Group B.',
    squad: [
      { id: 'kor-1', name: 'Jo Hyeon-woo', position: 'Goalkeeper', age: 34, club: 'Ulsan HD', shirtNumber: 21 },
      { id: 'kor-2', name: 'Kim Min-jae', position: 'Defender', age: 29, club: 'Bayern Munich', shirtNumber: 4, isKeyPlayer: true },
      { id: 'kor-3', name: 'Hwang In-beom', position: 'Midfielder', age: 29, club: 'Feyenoord', shirtNumber: 6 },
      { id: 'kor-4', name: 'Lee Kang-in', position: 'Midfielder', age: 25, club: 'Paris Saint-Germain', shirtNumber: 18 },
      { id: 'kor-5', name: 'Son Heung-min', position: 'Forward', age: 33, club: 'Tottenham Hotspur', shirtNumber: 7, isKeyPlayer: true }
    ]
  },
  {
    id: 'cameroon',
    name: 'Cameroon',
    code: 'CMR',
    flag: '🇨🇲',
    group: 'C',
    fifaRanking: 49,
    coach: 'Marc Brys',
    keyPlayers: ['André Onana', 'Bryan Mbeumo'],
    history: { appearances: 9, bestFinish: 'Quarterfinals (1990)', titles: 0 },
    journey: 'Finished top of CAF Qualifying Group D.',
    squad: [
      { id: 'cmr-1', name: 'André Onana', position: 'Goalkeeper', age: 30, club: 'Manchester United', shirtNumber: 1, isKeyPlayer: true },
      { id: 'cmr-2', name: 'Christopher Wooh', position: 'Defender', age: 24, club: 'Rennes', shirtNumber: 4 },
      { id: 'cmr-3', name: 'André-Frank Zambo Anguissa', position: 'Midfielder', age: 30, club: 'Napoli', shirtNumber: 8 },
      { id: 'cmr-4', name: 'Bryan Mbeumo', position: 'Forward', age: 26, club: 'Brentford', shirtNumber: 19, isKeyPlayer: true },
      { id: 'cmr-5', name: 'Vincent Aboubakar', position: 'Forward', age: 34, club: 'Hatayspor', shirtNumber: 10 }
    ]
  },
  {
    id: 'sweden',
    name: 'Sweden',
    code: 'SWE',
    flag: '🇸🇪',
    group: 'C',
    fifaRanking: 28,
    coach: 'Jon Dahl Tomasson',
    keyPlayers: ['Viktor Gyökeres', 'Alexander Isak'],
    history: { appearances: 13, bestFinish: 'Runners-up (1958)', titles: 0 },
    journey: 'Secured entry via UEFA Playoffs.',
    squad: [
      { id: 'swe-1', name: 'Robin Olsen', position: 'Goalkeeper', age: 36, club: 'Aston Villa', shirtNumber: 1 },
      { id: 'swe-2', name: 'Victor Lindelöf', position: 'Defender', age: 31, club: 'Manchester United', shirtNumber: 3 },
      { id: 'swe-3', name: 'Dejan Kulusevski', position: 'Midfielder', age: 26, club: 'Tottenham Hotspur', shirtNumber: 21 },
      { id: 'swe-4', name: 'Alexander Isak', position: 'Forward', age: 26, club: 'Newcastle United', shirtNumber: 9 },
      { id: 'swe-5', name: 'Viktor Gyökeres', position: 'Forward', age: 28, club: 'Sporting CP', shirtNumber: 17, isKeyPlayer: true }
    ]
  },

  // GROUP D
  {
    id: 'france',
    name: 'France',
    code: 'FRA',
    flag: '🇫🇷',
    group: 'D',
    fifaRanking: 2,
    coach: 'Didier Deschamps',
    keyPlayers: ['Kylian Mbappé', 'Antoine Griezmann', 'William Saliba'],
    history: { appearances: 17, bestFinish: 'Champions (1998, 2018)', titles: 2 },
    journey: 'Won UEFA Qualifying Group B comfortably.',
    squad: [
      { id: 'fra-1', name: 'Mike Maignan', position: 'Goalkeeper', age: 30, club: 'AC Milan', shirtNumber: 16 },
      { id: 'fra-2', name: 'William Saliba', position: 'Defender', age: 25, club: 'Arsenal', shirtNumber: 4 },
      { id: 'fra-3', name: 'Aurélien Tchouaméni', position: 'Midfielder', age: 26, club: 'Real Madrid', shirtNumber: 8 },
      { id: 'fra-4', name: 'Antoine Griezmann', position: 'Forward', age: 35, club: 'Atlético Madrid', shirtNumber: 7 },
      { id: 'fra-5', name: 'Kylian Mbappé', position: 'Forward', age: 27, club: 'Real Madrid', shirtNumber: 10, isKeyPlayer: true }
    ]
  },
  {
    id: 'australia',
    name: 'Australia',
    code: 'AUS',
    flag: '🇦🇺',
    group: 'D',
    fifaRanking: 24,
    coach: 'Tony Popovic',
    keyPlayers: ['Jackson Irvine', 'Harry Souttar'],
    history: { appearances: 7, bestFinish: 'Round of 16 (2006, 2022)', titles: 0 },
    journey: 'Finished runner-up in AFC Third Round Group C.',
    squad: [
      { id: 'aus-1', name: 'Mathew Ryan', position: 'Goalkeeper', age: 34, club: 'Roma', shirtNumber: 1 },
      { id: 'aus-2', name: 'Harry Souttar', position: 'Defender', age: 27, club: 'Sheffield United', shirtNumber: 19, isKeyPlayer: true },
      { id: 'aus-3', name: 'Jackson Irvine', position: 'Midfielder', age: 33, club: 'St. Pauli', shirtNumber: 22 },
      { id: 'aus-4', name: 'Craig Goodwin', position: 'Midfielder', age: 34, club: 'Al-Wehda', shirtNumber: 23 },
      { id: 'aus-5', name: 'Nestory Irankunda', position: 'Forward', age: 20, club: 'Bayern Munich', shirtNumber: 17 }
    ]
  },
  {
    id: 'egypt',
    name: 'Egypt',
    code: 'EGY',
    flag: '🇪🇬',
    group: 'D',
    fifaRanking: 30,
    coach: 'Hossam Hassan',
    keyPlayers: ['Mohamed Salah', 'Omar Marmoush'],
    history: { appearances: 4, bestFinish: 'Group Stage (1934, 1990, 2018)', titles: 0 },
    journey: 'Won CAF Group Stage to secure a spot.',
    squad: [
      { id: 'egy-1', name: 'Mohamed El Shenawy', position: 'Goalkeeper', age: 37, club: 'Al Ahly', shirtNumber: 1 },
      { id: 'egy-2', name: 'Mohamed Abdelmonem', position: 'Defender', age: 27, club: 'Nice', shirtNumber: 24 },
      { id: 'egy-3', name: 'Hamdi Fathi', position: 'Midfielder', age: 31, club: 'Al-Wakrah', shirtNumber: 5 },
      { id: 'egy-4', name: 'Omar Marmoush', position: 'Forward', age: 27, club: 'Eintracht Frankfurt', shirtNumber: 22 },
      { id: 'egy-5', name: 'Mohamed Salah', position: 'Forward', age: 33, club: 'Liverpool', shirtNumber: 10, isKeyPlayer: true }
    ]
  },
  {
    id: 'austria',
    name: 'Austria',
    code: 'AUT',
    flag: '🇦🇹',
    group: 'D',
    fifaRanking: 23,
    coach: 'Ralf Rangnick',
    keyPlayers: ['David Alaba', 'Marcel Sabitzer'],
    history: { appearances: 8, bestFinish: 'Third Place (1954)', titles: 0 },
    journey: 'Qualified through UEFA Playoff Route B.',
    squad: [
      { id: 'aut-1', name: 'Patrick Pentz', position: 'Goalkeeper', age: 29, club: 'Brøndby', shirtNumber: 1 },
      { id: 'aut-2', name: 'David Alaba', position: 'Defender', age: 33, club: 'Real Madrid', shirtNumber: 8, isKeyPlayer: true },
      { id: 'aut-3', name: 'Konrad Laimer', position: 'Midfielder', age: 29, club: 'Bayern Munich', shirtNumber: 24 },
      { id: 'aut-4', name: 'Marcel Sabitzer', position: 'Midfielder', age: 32, club: 'Borussia Dortmund', shirtNumber: 9, isKeyPlayer: true },
      { id: 'aut-5', name: 'Christoph Baumgartner', position: 'Midfielder', age: 26, club: 'RB Leipzig', shirtNumber: 19 }
    ]
  },

  // GROUP E
  {
    id: 'brazil',
    name: 'Brazil',
    code: 'BRA',
    flag: '🇧🇷',
    group: 'E',
    fifaRanking: 5,
    coach: 'Dorival Júnior',
    keyPlayers: ['Vinícius Júnior', 'Rodrygo', 'Bruno Guimarães'],
    history: { appearances: 23, bestFinish: 'Champions (1958, 1962, 1970, 1994, 2002)', titles: 5 },
    journey: 'Finished top 3 in CONMEBOL qualification standings.',
    squad: [
      { id: 'bra-1', name: 'Alisson Becker', position: 'Goalkeeper', age: 33, club: 'Liverpool', shirtNumber: 1 },
      { id: 'bra-2', name: 'Gabriel Magalhães', position: 'Defender', age: 28, club: 'Arsenal', shirtNumber: 4 },
      { id: 'bra-3', name: 'Bruno Guimarães', position: 'Midfielder', age: 28, club: 'Newcastle United', shirtNumber: 5 },
      { id: 'bra-4', name: 'Rodrygo Goes', position: 'Forward', age: 25, club: 'Real Madrid', shirtNumber: 11 },
      { id: 'bra-5', name: 'Vinícius Júnior', position: 'Forward', age: 25, club: 'Real Madrid', shirtNumber: 7, isKeyPlayer: true }
    ]
  },
  {
    id: 'saudi-arabia',
    name: 'Saudi Arabia',
    code: 'KSA',
    flag: '🇸🇦',
    group: 'E',
    fifaRanking: 56,
    coach: 'Hervé Renard',
    keyPlayers: ['Salem Al-Dawsari', 'Firas Al-Buraikan'],
    history: { appearances: 7, bestFinish: 'Round of 16 (1994)', titles: 0 },
    journey: 'Finished second in AFC Third Round Group A.',
    squad: [
      { id: 'ksa-1', name: 'Mohammed Al-Owais', position: 'Goalkeeper', age: 34, club: 'Al-Hilal', shirtNumber: 21 },
      { id: 'ksa-2', name: 'Ali Lajami', position: 'Defender', age: 30, club: 'Al-Nassr', shirtNumber: 5 },
      { id: 'ksa-3', name: 'Faisal Al-Ghamdi', position: 'Midfielder', age: 24, club: 'Beerschot', shirtNumber: 8 },
      { id: 'ksa-4', name: 'Salem Al-Dawsari', position: 'Midfielder', age: 34, club: 'Al-Hilal', shirtNumber: 10, isKeyPlayer: true },
      { id: 'ksa-5', name: 'Firas Al-Buraikan', position: 'Forward', age: 26, club: 'Al-Ahli', shirtNumber: 9 }
    ]
  },
  {
    id: 'senegal',
    name: 'Senegal',
    code: 'SEN',
    flag: '🇸🇳',
    group: 'E',
    fifaRanking: 20,
    coach: 'Pape Thiaw',
    keyPlayers: ['Sadio Mané', 'Nicolas Jackson', 'Kalidou Koulibaly'],
    history: { appearances: 4, bestFinish: 'Quarterfinals (2002)', titles: 0 },
    journey: 'Won CAF Group Stage to secure qualification.',
    squad: [
      { id: 'sen-1', name: 'Édouard Mendy', position: 'Goalkeeper', age: 34, club: 'Al-Ahli', shirtNumber: 16 },
      { id: 'sen-2', name: 'Kalidou Koulibaly', position: 'Defender', age: 34, club: 'Al-Hilal', shirtNumber: 3 },
      { id: 'sen-3', name: 'Pape Matar Sarr', position: 'Midfielder', age: 23, club: 'Tottenham Hotspur', shirtNumber: 17 },
      { id: 'sen-4', name: 'Nicolas Jackson', position: 'Forward', age: 24, club: 'Chelsea', shirtNumber: 19 },
      { id: 'sen-5', name: 'Sadio Mané', position: 'Forward', age: 34, club: 'Al-Nassr', shirtNumber: 10, isKeyPlayer: true }
    ]
  },
  {
    id: 'turkey',
    name: 'Turkey',
    code: 'TUR',
    flag: '🇹🇷',
    group: 'E',
    fifaRanking: 26,
    coach: 'Vincenzo Montella',
    keyPlayers: ['Hakan Çalhanoğlu', 'Arda Güler'],
    history: { appearances: 3, bestFinish: 'Third Place (2002)', titles: 0 },
    journey: 'Won UEFA Qualifying Group D.',
    squad: [
      { id: 'tur-1', name: 'Mert Günok', position: 'Goalkeeper', age: 37, club: 'Beşiktaş', shirtNumber: 1 },
      { id: 'tur-2', name: 'Merih Demiral', position: 'Defender', age: 28, club: 'Al-Ahli', shirtNumber: 3 },
      { id: 'tur-3', name: 'Hakan Çalhanoğlu', position: 'Midfielder', age: 32, club: 'Inter Milan', shirtNumber: 10, isKeyPlayer: true },
      { id: 'tur-4', name: 'Arda Güler', position: 'Midfielder', age: 21, club: 'Real Madrid', shirtNumber: 8, isKeyPlayer: true },
      { id: 'tur-5', name: 'Kenan Yıldız', position: 'Forward', age: 21, club: 'Juventus', shirtNumber: 19 }
    ]
  },

  // GROUP F
  {
    id: 'belgium',
    name: 'Belgium',
    code: 'BEL',
    flag: '🇧🇪',
    group: 'F',
    fifaRanking: 6,
    coach: 'Domenico Tedesco',
    keyPlayers: ['Kevin De Bruyne', 'Romelu Lukaku', 'Jérémy Doku'],
    history: { appearances: 15, bestFinish: 'Third Place (2018)', titles: 0 },
    journey: 'Won UEFA Qualifying Group F.',
    squad: [
      { id: 'bel-1', name: 'Koen Casteels', position: 'Goalkeeper', age: 33, club: 'Al-Qadsiah', shirtNumber: 1 },
      { id: 'bel-2', name: 'Wout Faes', position: 'Defender', age: 28, club: 'Leicester City', shirtNumber: 4 },
      { id: 'bel-3', name: 'Amadou Onana', position: 'Midfielder', age: 24, club: 'Aston Villa', shirtNumber: 6 },
      { id: 'bel-4', name: 'Kevin De Bruyne', position: 'Midfielder', age: 34, club: 'Manchester City', shirtNumber: 7, isKeyPlayer: true },
      { id: 'bel-5', name: 'Jérémy Doku', position: 'Forward', age: 24, club: 'Manchester City', shirtNumber: 11 },
      { id: 'bel-6', name: 'Romelu Lukaku', position: 'Forward', age: 33, club: 'Napoli', shirtNumber: 9 }
    ]
  },
  {
    id: 'iran',
    name: 'Iran',
    code: 'IRN',
    flag: '🇮🇷',
    group: 'F',
    fifaRanking: 19,
    coach: 'Amir Ghalenoei',
    keyPlayers: ['Mehdi Taremi', 'Sardar Azmoun'],
    history: { appearances: 7, bestFinish: 'Group Stage', titles: 0 },
    journey: 'Won AFC Third Round Group A.',
    squad: [
      { id: 'irn-1', name: 'Alireza Beiranvand', position: 'Goalkeeper', age: 33, club: 'Tractor', shirtNumber: 1 },
      { id: 'irn-2', name: 'Shojae Khalilzadeh', position: 'Defender', age: 37, club: 'Tractor', shirtNumber: 4 },
      { id: 'irn-3', name: 'Saman Ghoddos', position: 'Midfielder', age: 32, club: 'Ittihad Kalba', shirtNumber: 7 },
      { id: 'irn-4', name: 'Sardar Azmoun', position: 'Forward', age: 31, club: 'Shabab Al-Ahli', shirtNumber: 20 },
      { id: 'irn-5', name: 'Mehdi Taremi', position: 'Forward', age: 33, club: 'Inter Milan', shirtNumber: 9, isKeyPlayer: true }
    ]
  },
  {
    id: 'morocco',
    name: 'Morocco',
    code: 'MAR',
    flag: '🇲🇦',
    group: 'F',
    fifaRanking: 13,
    coach: 'Walid Regragui',
    keyPlayers: ['Achraf Hakimi', 'Brahim Díaz', 'Yassine Bounou'],
    history: { appearances: 7, bestFinish: 'Fourth Place (2022)', titles: 0 },
    journey: 'Qualified by finishing top of CAF Qualifying Group E.',
    squad: [
      { id: 'mar-1', name: 'Yassine Bounou', position: 'Goalkeeper', age: 35, club: 'Al-Hilal', shirtNumber: 1 },
      { id: 'mar-2', name: 'Achraf Hakimi', position: 'Defender', age: 27, club: 'Paris Saint-Germain', shirtNumber: 2, isKeyPlayer: true },
      { id: 'mar-3', name: 'Sofyan Amrabat', position: 'Midfielder', age: 29, club: 'Fenerbahçe', shirtNumber: 4 },
      { id: 'mar-4', name: 'Brahim Díaz', position: 'Midfielder', age: 26, club: 'Real Madrid', shirtNumber: 10, isKeyPlayer: true },
      { id: 'mar-5', name: 'Youssef En-Nesyri', position: 'Forward', age: 29, club: 'Fenerbahçe', shirtNumber: 19 }
    ]
  },
  {
    id: 'panama',
    name: 'Panama',
    code: 'PAN',
    flag: '🇵🇦',
    group: 'F',
    fifaRanking: 39,
    coach: 'Thomas Christiansen',
    keyPlayers: ['Adalberto Carrasquilla', 'Michael Murillo'],
    history: { appearances: 2, bestFinish: 'Group Stage (2018)', titles: 0 },
    journey: 'Won the CONCACAF Final Round group/playoff stage.',
    squad: [
      { id: 'pan-1', name: 'Orlando Mosquera', position: 'Goalkeeper', age: 31, club: 'Al-Fayha', shirtNumber: 22 },
      { id: 'pan-2', name: 'Michael Murillo', position: 'Defender', age: 30, club: 'Marseille', shirtNumber: 2 },
      { id: 'pan-3', name: 'José Córdoba', position: 'Defender', age: 25, club: 'Norwich City', shirtNumber: 3 },
      { id: 'pan-4', name: 'Adalberto Carrasquilla', position: 'Midfielder', age: 27, club: 'Houston Dynamo', shirtNumber: 8, isKeyPlayer: true },
      { id: 'pan-5', name: 'José Fajardo', position: 'Forward', age: 32, club: 'Universidad Católica', shirtNumber: 17 }
    ]
  },

  // GROUP G
  {
    id: 'croatia',
    name: 'Croatia',
    code: 'CRO',
    flag: '🇭🇷',
    group: 'G',
    fifaRanking: 12,
    coach: 'Zlatko Dalić',
    keyPlayers: ['Luka Modrić', 'Joško Gvardiol', 'Mateo Kovačić'],
    history: { appearances: 7, bestFinish: 'Runners-up (2018)', titles: 0 },
    journey: 'Won UEFA Qualifying Group H.',
    squad: [
      { id: 'cro-1', name: 'Dominik Livaković', position: 'Goalkeeper', age: 31, club: 'Fenerbahçe', shirtNumber: 1 },
      { id: 'cro-2', name: 'Joško Gvardiol', position: 'Defender', age: 24, club: 'Manchester City', shirtNumber: 4, isKeyPlayer: true },
      { id: 'cro-3', name: 'Mateo Kovačić', position: 'Midfielder', age: 32, club: 'Manchester City', shirtNumber: 8 },
      { id: 'cro-4', name: 'Luka Modrić', position: 'Midfielder', age: 40, club: 'Real Madrid', shirtNumber: 10, isKeyPlayer: true },
      { id: 'cro-5', name: 'Andrej Kramarić', position: 'Forward', age: 34, club: 'Hoffenheim', shirtNumber: 9 }
    ]
  },
  {
    id: 'colombia',
    name: 'Colombia',
    code: 'COL',
    flag: '🇨🇴',
    group: 'G',
    fifaRanking: 10,
    coach: 'Néstor Lorenzo',
    keyPlayers: ['Luis Díaz', 'James Rodríguez'],
    history: { appearances: 7, bestFinish: 'Quarterfinals (2014)', titles: 0 },
    journey: 'Finished top 4 in CONMEBOL qualification.',
    squad: [
      { id: 'col-1', name: 'Camilo Vargas', position: 'Goalkeeper', age: 37, club: 'Atlas', shirtNumber: 12 },
      { id: 'col-2', name: 'Daniel Muñoz', position: 'Defender', age: 30, club: 'Crystal Palace', shirtNumber: 21 },
      { id: 'col-3', name: 'Richard Ríos', position: 'Midfielder', age: 26, club: 'Palmeiras', shirtNumber: 6 },
      { id: 'col-4', name: 'James Rodríguez', position: 'Midfielder', age: 34, club: 'Rayo Vallecano', shirtNumber: 10 },
      { id: 'col-5', name: 'Luis Díaz', position: 'Forward', age: 29, club: 'Liverpool', shirtNumber: 17, isKeyPlayer: true }
    ]
  },
  {
    id: 'ivory-coast',
    name: 'Ivory Coast',
    code: 'CIV',
    flag: '🇨🇮',
    group: 'G',
    fifaRanking: 33,
    coach: 'Emerse Faé',
    keyPlayers: ['Franck Kessié', 'Sébastien Haller'],
    history: { appearances: 4, bestFinish: 'Group Stage', titles: 0 },
    journey: 'Finished top of CAF Group F.',
    squad: [
      { id: 'civ-1', name: 'Yahia Fofana', position: 'Goalkeeper', age: 25, club: 'Angers', shirtNumber: 1 },
      { id: 'civ-2', name: 'Evan Ndicka', position: 'Defender', age: 26, club: 'Roma', shirtNumber: 21 },
      { id: 'civ-3', name: 'Franck Kessié', position: 'Midfielder', age: 29, club: 'Al-Ahli', shirtNumber: 8, isKeyPlayer: true },
      { id: 'civ-4', name: 'Simon Adingra', position: 'Forward', age: 24, club: 'Brighton', shirtNumber: 24 },
      { id: 'civ-5', name: 'Sébastien Haller', position: 'Forward', age: 31, club: 'Leganés', shirtNumber: 22 }
    ]
  },
  {
    id: 'ukraine',
    name: 'Ukraine',
    code: 'UKR',
    flag: '🇺🇦',
    group: 'G',
    fifaRanking: 25,
    coach: 'Serhiy Rebrov',
    keyPlayers: ['Artem Dovbyk', 'Oleksandr Zinchenko'],
    history: { appearances: 2, bestFinish: 'Quarterfinals (2006)', titles: 0 },
    journey: 'Qualified through the UEFA Playoff Route A.',
    squad: [
      { id: 'ukr-1', name: 'Andriy Lunin', position: 'Goalkeeper', age: 27, club: 'Real Madrid', shirtNumber: 1 },
      { id: 'ukr-2', name: 'Illia Zabarnyi', position: 'Defender', age: 23, club: 'Bournemouth', shirtNumber: 13 },
      { id: 'ukr-3', name: 'Oleksandr Zinchenko', position: 'Midfielder', age: 29, club: 'Arsenal', shirtNumber: 17, isKeyPlayer: true },
      { id: 'ukr-4', name: 'Viktor Tsyhankov', position: 'Midfielder', age: 28, club: 'Girona', shirtNumber: 15 },
      { id: 'ukr-5', name: 'Artem Dovbyk', position: 'Forward', age: 28, club: 'Roma', shirtNumber: 11, isKeyPlayer: true }
    ]
  },

  // GROUP H
  {
    id: 'spain',
    name: 'Spain',
    code: 'ESP',
    flag: '🇪🇸',
    group: 'H',
    fifaRanking: 3,
    coach: 'Luis de la Fuente',
    keyPlayers: ['Lamine Yamal', 'Rodri', 'Pedri'],
    history: { appearances: 17, bestFinish: 'Champions (2010)', titles: 1 },
    journey: 'Won UEFA Qualifying Group A.',
    squad: [
      { id: 'esp-1', name: 'David Raya', position: 'Goalkeeper', age: 30, club: 'Arsenal', shirtNumber: 1 },
      { id: 'esp-2', name: 'Dani Carvajal', position: 'Defender', age: 34, club: 'Real Madrid', shirtNumber: 2 },
      { id: 'esp-3', name: 'Rodri', position: 'Midfielder', age: 29, club: 'Manchester City', shirtNumber: 16, isKeyPlayer: true },
      { id: 'esp-4', name: 'Pedri González', position: 'Midfielder', age: 23, club: 'Barcelona', shirtNumber: 20 },
      { id: 'esp-5', name: 'Lamine Yamal', position: 'Forward', age: 18, club: 'Barcelona', shirtNumber: 19, isKeyPlayer: true },
      { id: 'esp-6', name: 'Nico Williams', position: 'Forward', age: 23, club: 'Athletic Bilbao', shirtNumber: 17 }
    ]
  },
  {
    id: 'iraq',
    name: 'Iraq',
    code: 'IRQ',
    flag: '🇮🇶',
    group: 'H',
    fifaRanking: 55,
    coach: 'Jesús Casas',
    keyPlayers: ['Aymen Hussein', 'Ali Jasim'],
    history: { appearances: 2, bestFinish: 'Group Stage (1886)', titles: 0 },
    journey: 'Finished top 2 in AFC Third Round Group B.',
    squad: [
      { id: 'irq-1', name: 'Jalal Hassan', position: 'Goalkeeper', age: 34, club: 'Al-Zawraa', shirtNumber: 12 },
      { id: 'irq-2', name: 'Rebin Sulaka', position: 'Defender', age: 34, club: 'FC Seoul', shirtNumber: 4 },
      { id: 'irq-3', name: 'Youssef Amyn', position: 'Midfielder', age: 22, club: 'Eintracht Braunschweig', shirtNumber: 7 },
      { id: 'irq-4', name: 'Ali Jasim', position: 'Midfielder', age: 22, club: 'Como', shirtNumber: 17 },
      { id: 'irq-5', name: 'Aymen Hussein', position: 'Forward', age: 30, club: 'Al-Khor', shirtNumber: 18, isKeyPlayer: true }
    ]
  },
  {
    id: 'algeria',
    name: 'Algeria',
    code: 'ALG',
    flag: '🇩🇿',
    group: 'H',
    fifaRanking: 37,
    coach: 'Vladimir Petković',
    keyPlayers: ['Riyad Mahrez', 'Amine Gouiri'],
    history: { appearances: 5, bestFinish: 'Round of 16 (2014)', titles: 0 },
    journey: 'Finished top of CAF Qualifying Group G.',
    squad: [
      { id: 'alg-1', name: 'Anthony Mandrea', position: 'Goalkeeper', age: 29, club: 'Caen', shirtNumber: 1 },
      { id: 'alg-2', name: 'Rayan Aït-Nouri', position: 'Defender', age: 24, club: 'Wolverhampton Wanderers', shirtNumber: 3 },
      { id: 'alg-3', name: 'Ismaël Bennacer', position: 'Midfielder', age: 28, club: 'AC Milan', shirtNumber: 4 },
      { id: 'alg-4', name: 'Amine Gouiri', position: 'Forward', age: 26, club: 'Rennes', shirtNumber: 11 },
      { id: 'alg-5', name: 'Riyad Mahrez', position: 'Forward', age: 35, club: 'Al-Ahli', shirtNumber: 7, isKeyPlayer: true }
    ]
  },
  {
    id: 'poland',
    name: 'Poland',
    code: 'POL',
    flag: '🇵🇱',
    group: 'H',
    fifaRanking: 31,
    coach: 'Michał Probierz',
    keyPlayers: ['Robert Lewandowski', 'Piotr Zieliński'],
    history: { appearances: 10, bestFinish: 'Third Place (1974, 1982)', titles: 0 },
    journey: 'Qualified via UEFA Playoff Route C.',
    squad: [
      { id: 'pol-1', name: 'Łukasz Skorupski', position: 'Goalkeeper', age: 35, club: 'Bologna', shirtNumber: 12 },
      { id: 'pol-2', name: 'Jan Bednarek', position: 'Defender', age: 30, club: 'Southampton', shirtNumber: 5 },
      { id: 'pol-3', name: 'Piotr Zieliński', position: 'Midfielder', age: 32, club: 'Inter Milan', shirtNumber: 10, isKeyPlayer: true },
      { id: 'pol-4', name: 'Sebastian Szymański', position: 'Midfielder', age: 27, club: 'Fenerbahçe', shirtNumber: 20 },
      { id: 'pol-5', name: 'Robert Lewandowski', position: 'Forward', age: 37, club: 'Barcelona', shirtNumber: 9, isKeyPlayer: true }
    ]
  },

  // GROUP I
  {
    id: 'germany',
    name: 'Germany',
    code: 'GER',
    flag: '🇩🇪',
    group: 'I',
    fifaRanking: 11,
    coach: 'Julian Nagelsmann',
    keyPlayers: ['Jamal Musiala', 'Florian Wirtz', 'Joshua Kimmich'],
    history: { appearances: 21, bestFinish: 'Champions (1954, 1974, 1990, 2014)', titles: 4 },
    journey: 'Won UEFA Qualifying Group E.',
    squad: [
      { id: 'ger-1', name: 'Marc-André ter Stegen', position: 'Goalkeeper', age: 34, club: 'Barcelona', shirtNumber: 1 },
      { id: 'ger-2', name: 'Antonio Rüdiger', position: 'Defender', age: 33, club: 'Real Madrid', shirtNumber: 2 },
      { id: 'ger-3', name: 'Joshua Kimmich', position: 'Midfielder', age: 31, club: 'Bayern Munich', shirtNumber: 6 },
      { id: 'ger-4', name: 'Florian Wirtz', position: 'Midfielder', age: 23, club: 'Bayer Leverkusen', shirtNumber: 17, isKeyPlayer: true },
      { id: 'ger-5', name: 'Jamal Musiala', position: 'Midfielder', age: 23, club: 'Bayern Munich', shirtNumber: 10, isKeyPlayer: true }
    ]
  },
  {
    id: 'uzbekistan',
    name: 'Uzbekistan',
    code: 'UZB',
    flag: '🇺🇿',
    group: 'I',
    fifaRanking: 58,
    coach: 'Srečko Katanec',
    keyPlayers: ['Eldor Shomurodov', 'Abbosbek Fayzullaev'],
    history: { appearances: 1, bestFinish: 'Debut', titles: 0 },
    journey: 'Finished top 2 in AFC Third Round Group A, qualifying for the first time.',
    squad: [
      { id: 'uzb-1', name: 'Utkir Yusupov', position: 'Goalkeeper', age: 35, club: 'Foolad', shirtNumber: 1 },
      { id: 'uzb-2', name: 'Rustam Ashurmatov', position: 'Defender', age: 29, club: 'Rubin Kazan', shirtNumber: 3 },
      { id: 'uzb-3', name: 'Otabek Shukurov', position: 'Midfielder', age: 29, club: 'Al-Fayha', shirtNumber: 9 },
      { id: 'uzb-4', name: 'Abbosbek Fayzullaev', position: 'Midfielder', age: 22, club: 'CSKA Moscow', shirtNumber: 14, isKeyPlayer: true },
      { id: 'uzb-5', name: 'Eldor Shomurodov', position: 'Forward', age: 30, club: 'Roma', shirtNumber: 14, isKeyPlayer: true }
    ]
  },
  {
    id: 'tunisia',
    name: 'Tunisia',
    code: 'TUN',
    flag: '🇹🇳',
    group: 'I',
    fifaRanking: 41,
    coach: 'Kais Yaâkoubi',
    keyPlayers: ['Ellyes Skhiri', 'Youssef Msakni'],
    history: { appearances: 7, bestFinish: 'Group Stage', titles: 0 },
    journey: 'Won CAF Qualifying Group H.',
    squad: [
      { id: 'tun-1', name: 'Aymen Dahmen', position: 'Goalkeeper', age: 29, club: 'Al-Hazem', shirtNumber: 16 },
      { id: 'tun-2', name: 'Montassar Talbi', position: 'Defender', age: 28, club: 'Lorient', shirtNumber: 3 },
      { id: 'tun-3', name: 'Ellyes Skhiri', position: 'Midfielder', age: 31, club: 'Eintracht Frankfurt', shirtNumber: 17, isKeyPlayer: true },
      { id: 'tun-4', name: 'Aïssa Laïdouni', position: 'Midfielder', age: 29, club: 'Al-Wakrah', shirtNumber: 14 },
      { id: 'tun-5', name: 'Youssef Msakni', position: 'Forward', age: 35, club: 'Al-Arabi', shirtNumber: 7 }
    ]
  },
  {
    id: 'denmark',
    name: 'Denmark',
    code: 'DEN',
    flag: '🇩🇰',
    group: 'I',
    fifaRanking: 21,
    coach: 'Brian Riemer',
    keyPlayers: ['Christian Eriksen', 'Pierre-Emile Højbjerg', 'Rasmus Højlund'],
    history: { appearances: 7, bestFinish: 'Quarterfinals (1998)', titles: 0 },
    journey: 'Won UEFA Qualifying Group I.',
    squad: [
      { id: 'den-1', name: 'Kasper Schmeichel', position: 'Goalkeeper', age: 39, club: 'Celtic', shirtNumber: 1 },
      { id: 'den-2', name: 'Andreas Christensen', position: 'Defender', age: 30, club: 'Barcelona', shirtNumber: 6 },
      { id: 'den-3', name: 'Pierre-Emile Højbjerg', position: 'Midfielder', age: 30, club: 'Marseille', shirtNumber: 23 },
      { id: 'den-4', name: 'Christian Eriksen', position: 'Midfielder', age: 34, club: 'Manchester United', shirtNumber: 10, isKeyPlayer: true },
      { id: 'den-5', name: 'Rasmus Højlund', position: 'Forward', age: 23, club: 'Manchester United', shirtNumber: 9 }
    ]
  },

  // GROUP J
  {
    id: 'portugal',
    name: 'Portugal',
    code: 'POR',
    flag: '🇵🇹',
    group: 'J',
    fifaRanking: 7,
    coach: 'Roberto Martínez',
    keyPlayers: ['Cristiano Ronaldo', 'Bruno Fernandes', 'Bernardo Silva'],
    history: { appearances: 9, bestFinish: 'Third Place (1966)', titles: 0 },
    journey: 'Won UEFA Qualifying Group J with a perfect record.',
    squad: [
      { id: 'por-1', name: 'Diogo Costa', position: 'Goalkeeper', age: 26, club: 'Porto', shirtNumber: 1 },
      { id: 'por-2', name: 'Rúben Dias', position: 'Defender', age: 29, club: 'Manchester City', shirtNumber: 4 },
      { id: 'por-3', name: 'Bruno Fernandes', position: 'Midfielder', age: 31, club: 'Manchester United', shirtNumber: 8, isKeyPlayer: true },
      { id: 'por-4', name: 'Bernardo Silva', position: 'Midfielder', age: 31, club: 'Manchester City', shirtNumber: 10 },
      { id: 'por-5', name: 'Cristiano Ronaldo', position: 'Forward', age: 41, club: 'Al-Nassr', shirtNumber: 7, isKeyPlayer: true }
    ]
  },
  {
    id: 'united-arab-emirates',
    name: 'United Arab Emirates',
    code: 'UAE',
    flag: '🇦🇪',
    group: 'J',
    fifaRanking: 68,
    coach: 'Paulo Bento',
    keyPlayers: ['Caio Canedo', 'Fabio Lima'],
    history: { appearances: 2, bestFinish: 'Group Stage (1990)', titles: 0 },
    journey: 'Secured qualification through AFC Playoff Phase.',
    squad: [
      { id: 'uae-1', name: 'Khalid Eisa', position: 'Goalkeeper', age: 36, club: 'Al-Ain', shirtNumber: 17 },
      { id: 'uae-2', name: 'Khalifa Al-Hammadi', position: 'Defender', age: 27, club: 'Al-Jazira', shirtNumber: 4 },
      { id: 'uae-3', name: 'Yahia Nader', position: 'Midfielder', age: 27, club: 'Al-Ain', shirtNumber: 5 },
      { id: 'uae-4', name: 'Fabio Lima', position: 'Midfielder', age: 32, club: 'Al-Wasl', shirtNumber: 10, isKeyPlayer: true },
      { id: 'uae-5', name: 'Caio Canedo', position: 'Forward', age: 35, club: 'Al-Wasl', shirtNumber: 11 }
    ]
  },
  {
    id: 'mali',
    name: 'Mali',
    code: 'MLI',
    flag: '🇲🇱',
    group: 'J',
    fifaRanking: 54,
    coach: 'Tom Saintfiet',
    keyPlayers: ['Yves Bissouma', 'Amadou Haidara'],
    history: { appearances: 1, bestFinish: 'Debut', titles: 0 },
    journey: 'Won CAF Group Stage to qualify for the first time.',
    squad: [
      { id: 'mli-1', name: 'Djego Diarra', position: 'Goalkeeper', age: 29, club: 'Young Boys', shirtNumber: 16 },
      { id: 'mli-2', name: 'Hamari Traoré', position: 'Defender', age: 34, club: 'Real Sociedad', shirtNumber: 2 },
      { id: 'mli-3', name: 'Amadou Haidara', position: 'Midfielder', age: 28, club: 'RB Leipzig', shirtNumber: 4 },
      { id: 'mli-4', name: 'Yves Bissouma', position: 'Midfielder', age: 29, club: 'Tottenham Hotspur', shirtNumber: 8, isKeyPlayer: true },
      { id: 'mli-5', name: 'El Bilal Touré', position: 'Forward', age: 24, club: 'VfB Stuttgart', shirtNumber: 9 }
    ]
  },
  {
    id: 'chile',
    name: 'Chile',
    code: 'CHI',
    flag: '🇨🇱',
    group: 'J',
    fifaRanking: 43,
    coach: 'Ricardo Gareca',
    keyPlayers: ['Alexis Sánchez', 'Eduardo Vargas'],
    history: { appearances: 10, bestFinish: 'Third Place (1962)', titles: 0 },
    journey: 'Finished 6th in CONMEBOL qualification, securing the final direct spot.',
    squad: [
      { id: 'chi-1', name: 'Brayan Cortés', position: 'Goalkeeper', age: 31, club: 'Colo-Colo', shirtNumber: 1 },
      { id: 'chi-2', name: 'Guillermo Maripán', position: 'Defender', age: 32, club: 'Torino', shirtNumber: 3 },
      { id: 'chi-3', name: 'Erick Pulgar', position: 'Midfielder', age: 32, club: 'Flamengo', shirtNumber: 17 },
      { id: 'chi-4', name: 'Alexis Sánchez', position: 'Forward', age: 37, club: 'Udinese', shirtNumber: 10, isKeyPlayer: true },
      { id: 'chi-5', name: 'Eduardo Vargas', position: 'Forward', age: 36, club: 'Atlético Mineiro', shirtNumber: 11 }
    ]
  },

  // GROUP K
  {
    id: 'netherlands',
    name: 'Netherlands',
    code: 'NED',
    flag: '🇳🇱',
    group: 'K',
    fifaRanking: 8,
    coach: 'Ronald Koeman',
    keyPlayers: ['Virgil van Dijk', 'Frenkie de Jong', 'Cody Gakpo'],
    history: { appearances: 12, bestFinish: 'Runners-up (1974, 1978, 2010)', titles: 0 },
    journey: 'Won UEFA Qualifying Group G.',
    squad: [
      { id: 'ned-1', name: 'Bart Verbruggen', position: 'Goalkeeper', age: 23, club: 'Brighton', shirtNumber: 1 },
      { id: 'ned-2', name: 'Virgil van Dijk', position: 'Defender', age: 34, club: 'Liverpool', shirtNumber: 4, isKeyPlayer: true },
      { id: 'ned-3', name: 'Frenkie de Jong', position: 'Midfielder', age: 29, club: 'Barcelona', shirtNumber: 21, isKeyPlayer: true },
      { id: 'ned-4', name: 'Tijjani Reijnders', position: 'Midfielder', age: 27, club: 'AC Milan', shirtNumber: 14 },
      { id: 'ned-5', name: 'Cody Gakpo', position: 'Forward', age: 27, club: 'Liverpool', shirtNumber: 11 }
    ]
  },
  {
    id: 'canada',
    name: 'Canada',
    code: 'CAN',
    flag: '🇨🇦',
    group: 'K',
    fifaRanking: 35,
    coach: 'Jesse Marsch',
    keyPlayers: ['Alphonso Davies', 'Jonathan David'],
    history: { appearances: 3, bestFinish: 'Group Stage (1986, 2022)', titles: 0 },
    journey: 'Qualified automatically as co-host of the 2026 FIFA World Cup.',
    squad: [
      { id: 'can-1', name: 'Maxime Crépeau', position: 'Goalkeeper', age: 32, club: 'Portland Timbers', shirtNumber: 1 },
      { id: 'can-2', name: 'Alistair Johnston', position: 'Defender', age: 27, club: 'Celtic', shirtNumber: 2 },
      { id: 'can-3', name: 'Stephen Eustáquio', position: 'Midfielder', age: 29, club: 'Porto', shirtNumber: 7 },
      { id: 'can-4', name: 'Alphonso Davies', position: 'Midfielder', age: 25, club: 'Bayern Munich', shirtNumber: 19, isKeyPlayer: true },
      { id: 'can-5', name: 'Jonathan David', position: 'Forward', age: 26, club: 'Lille', shirtNumber: 10, isKeyPlayer: true }
    ]
  },
  {
    id: 'south-africa',
    name: 'South Africa',
    code: 'RSA',
    flag: '🇿🇦',
    group: 'K',
    fifaRanking: 57,
    coach: 'Hugo Broos',
    keyPlayers: ['Teboho Mokoena', 'Ronwen Williams'],
    history: { appearances: 4, bestFinish: 'Group Stage (1998, 2002, 2010)', titles: 0 },
    journey: 'Won CAF Group Stage to qualify.',
    squad: [
      { id: 'rsa-1', name: 'Ronwen Williams', position: 'Goalkeeper', age: 34, club: 'Mamelodi Sundowns', shirtNumber: 1, isKeyPlayer: true },
      { id: 'rsa-2', name: 'Aubrey Modiba', position: 'Defender', age: 30, club: 'Mamelodi Sundowns', shirtNumber: 14 },
      { id: 'rsa-3', name: 'Teboho Mokoena', position: 'Midfielder', age: 29, club: 'Mamelodi Sundowns', shirtNumber: 4, isKeyPlayer: true },
      { id: 'rsa-4', name: 'Themba Zwane', position: 'Midfielder', age: 36, club: 'Mamelodi Sundowns', shirtNumber: 18 },
      { id: 'rsa-5', name: 'Percy Tau', position: 'Forward', age: 32, club: 'Al Ahly', shirtNumber: 10 }
    ]
  },
  {
    id: 'norway',
    name: 'Norway',
    code: 'NOR',
    flag: '🇳🇴',
    group: 'K',
    fifaRanking: 47,
    coach: 'Ståle Solbakken',
    keyPlayers: ['Erling Haaland', 'Martin Ødegaard'],
    history: { appearances: 4, bestFinish: 'Round of 16 (1998)', titles: 0 },
    journey: 'Secured spot via UEFA Playoff Route C.',
    squad: [
      { id: 'nor-1', name: 'Ørjan Nyland', position: 'Goalkeeper', age: 35, club: 'Sevilla', shirtNumber: 1 },
      { id: 'nor-2', name: 'Leo Østigård', position: 'Defender', age: 26, club: 'Rennes', shirtNumber: 4 },
      { id: 'nor-3', name: 'Martin Ødegaard', position: 'Midfielder', age: 27, club: 'Arsenal', shirtNumber: 10, isKeyPlayer: true },
      { id: 'nor-4', name: 'Antonio Nusa', position: 'Midfielder', age: 21, club: 'RB Leipzig', shirtNumber: 20 },
      { id: 'nor-5', name: 'Erling Haaland', position: 'Forward', age: 25, club: 'Manchester City', shirtNumber: 9, isKeyPlayer: true }
    ]
  },

  // GROUP L
  {
    id: 'italy',
    name: 'Italy',
    code: 'ITA',
    flag: '🇮🇹',
    group: 'L',
    fifaRanking: 9,
    coach: 'Luciano Spalletti',
    keyPlayers: ['Gianluigi Donnarumma', 'Nicolò Barella'],
    history: { appearances: 19, bestFinish: 'Champions (1934, 1938, 1982, 2006)', titles: 4 },
    journey: 'Won UEFA Qualifying Group J.',
    squad: [
      { id: 'ita-1', name: 'Gianluigi Donnarumma', position: 'Goalkeeper', age: 27, club: 'Paris Saint-Germain', shirtNumber: 1, isKeyPlayer: true },
      { id: 'ita-2', name: 'Alessandro Bastoni', position: 'Defender', age: 27, club: 'Inter Milan', shirtNumber: 23 },
      { id: 'ita-3', name: 'Nicolò Barella', position: 'Midfielder', age: 29, club: 'Inter Milan', shirtNumber: 18, isKeyPlayer: true },
      { id: 'ita-4', name: 'Federico Dimarco', position: 'Midfielder', age: 28, club: 'Inter Milan', shirtNumber: 3 },
      { id: 'ita-5', name: 'Mateo Retegui', position: 'Forward', age: 27, club: 'Atalanta', shirtNumber: 9 }
    ]
  },
  {
    id: 'qatar',
    name: 'Qatar',
    code: 'QAT',
    flag: '🇶🇦',
    group: 'L',
    fifaRanking: 46,
    coach: 'Tintín Márquez',
    keyPlayers: ['Akram Afif', 'Almoez Ali'],
    history: { appearances: 2, bestFinish: 'Group Stage (2022)', titles: 0 },
    journey: 'Finished runner-up in AFC Third Round Group A.',
    squad: [
      { id: 'qat-1', name: 'Meshaal Barsham', position: 'Goalkeeper', age: 28, club: 'Al-Sadd', shirtNumber: 22 },
      { id: 'qat-2', name: 'Lucas Mendes', position: 'Defender', age: 35, club: 'Al-Wakrah', shirtNumber: 3 },
      { id: 'qat-3', name: 'Jassem Gaber', position: 'Midfielder', age: 24, club: 'Al-Arabi', shirtNumber: 24 },
      { id: 'qat-4', name: 'Akram Afif', position: 'Forward', age: 29, club: 'Al-Sadd', shirtNumber: 10, isKeyPlayer: true },
      { id: 'qat-5', name: 'Almoez Ali', position: 'Forward', age: 29, club: 'Al-Duhail', shirtNumber: 19, isKeyPlayer: true }
    ]
  },
  {
    id: 'ghana',
    name: 'Ghana',
    code: 'GHA',
    flag: '🇬🇭',
    group: 'L',
    fifaRanking: 73,
    coach: 'Otto Addo',
    keyPlayers: ['Mohammed Kudus', 'Inaki Williams'],
    history: { appearances: 5, bestFinish: 'Quarterfinals (2010)', titles: 0 },
    journey: 'Won CAF Group Stage to qualify.',
    squad: [
      { id: 'gha-1', name: 'Lawrence Ati-Zigi', position: 'Goalkeeper', age: 29, club: 'St. Gallen', shirtNumber: 1 },
      { id: 'gha-2', name: 'Mohammed Salisu', position: 'Defender', age: 27, club: 'Monaco', shirtNumber: 6 },
      { id: 'gha-3', name: 'Thomas Partey', position: 'Midfielder', age: 32, club: 'Arsenal', shirtNumber: 5 },
      { id: 'gha-4', name: 'Mohammed Kudus', position: 'Midfielder', age: 25, club: 'West Ham United', shirtNumber: 10, isKeyPlayer: true },
      { id: 'gha-5', name: 'Iñaki Williams', position: 'Forward', age: 31, club: 'Athletic Bilbao', shirtNumber: 19 }
    ]
  },
  {
    id: 'uruguay',
    name: 'Uruguay',
    code: 'URU',
    flag: '🇺🇾',
    group: 'L',
    fifaRanking: 11,
    coach: 'Marcelo Bielsa',
    keyPlayers: ['Federico Valverde', 'Darwin Núñez'],
    history: { appearances: 15, bestFinish: 'Champions (1930, 1950)', titles: 2 },
    journey: 'Finished top 3 in CONMEBOL qualification.',
    squad: [
      { id: 'uru-1', name: 'Sergio Rochet', position: 'Goalkeeper', age: 33, club: 'Internacional', shirtNumber: 1 },
      { id: 'uru-2', name: 'José María Giménez', position: 'Defender', age: 31, club: 'Atlético Madrid', shirtNumber: 2 },
      { id: 'uru-3', name: 'Federico Valverde', position: 'Midfielder', age: 27, club: 'Real Madrid', shirtNumber: 15, isKeyPlayer: true },
      { id: 'uru-4', name: 'Facundo Pellistri', position: 'Midfielder', age: 24, club: 'Panathinaikos', shirtNumber: 11 },
      { id: 'uru-5', name: 'Darwin Núñez', position: 'Forward', age: 26, club: 'Liverpool', shirtNumber: 19, isKeyPlayer: true }
    ]
  }
];
