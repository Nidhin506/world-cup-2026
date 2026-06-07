export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: 'USA' | 'Canada' | 'Mexico';
  capacity: number;
  opened: number;
  hostedMatches: string[];
  description: string;
  architecture: string;
  transport: string;
  imageUrl: string; // Placeholder or generated asset reference
}

export const STADIUMS: Stadium[] = [
  {
    id: 'metlife',
    name: 'MetLife Stadium',
    city: 'East Rutherford (New York/New Jersey)',
    country: 'USA',
    capacity: 82500,
    opened: 2010,
    hostedMatches: ['5 Group Stage Matches', 'Round of 32', 'Round of 16', 'FIFA World Cup 2026 Final'],
    description: 'Located just outside New York City, MetLife Stadium will host the crowning moment of the tournament: the Grand Final on July 19, 2026.',
    architecture: 'Designed to represent the steel and vigor of the metropolitan area, featuring outer louvers that light up in different colors.',
    transport: 'Access via NJ Transit rail from Penn Station, coach buses, and major highways.',
    imageUrl: '/stadiums/metlife.jpg'
  },
  {
    id: 'azteca',
    name: 'Estadio Azteca',
    city: 'Mexico City',
    country: 'Mexico',
    capacity: 87523,
    opened: 1966,
    hostedMatches: ['Opening Match (Group Stage)', '3 Group Stage Matches', 'Round of 32', 'Round of 16'],
    description: 'A legendary temple of global football, Estadio Azteca will become the first stadium to host matches in three separate World Cups (1970, 1986, 2026).',
    architecture: 'Massive concrete structure featuring an iconic roof that amplifies crowd noise, creating one of the most intimidating atmospheres in sports.',
    transport: 'Access via the Mexico City light rail (Tren Ligero) to Estadio Azteca station, and municipal taxi systems.',
    imageUrl: '/stadiums/azteca.jpg'
  },
  {
    id: 'sofi',
    name: 'SoFi Stadium',
    city: 'Inglewood (Los Angeles)',
    country: 'USA',
    capacity: 70240,
    opened: 2020,
    hostedMatches: ['5 Group Stage Matches (including USA Opening)', 'Round of 32', 'Quarterfinal'],
    description: 'The most expensive stadium ever built, SoFi is a state-of-the-art indoor-outdoor entertainment destination in Southern California.',
    architecture: 'Features a revolutionary translucent ETFE canopy, a double-sided 4K Oculus video board, and open-air concourses.',
    transport: 'Metro rail connections via K Line (Downtown Inglewood) or C Line (Hawthorne/Lennox) with dedicated event shuttle buses.',
    imageUrl: '/stadiums/sofi.jpg'
  },
  {
    id: 'att',
    name: 'AT&T Stadium',
    city: 'Arlington (Dallas)',
    country: 'USA',
    capacity: 80000,
    opened: 2009,
    hostedMatches: ['5 Group Stage Matches', 'Round of 32', 'Round of 16', 'Semifinal'],
    description: 'Popularly known as "Jerry World," AT&T Stadium is an engineering marvel that frequently hosts massive global events and features a retractable roof.',
    architecture: 'Span-free steel structure featuring a colossal center-hung HD video screen and massive sliding glass end-zone doors.',
    transport: 'Accessible via rideshare zones, prepaid event parking, and regional express bus services from Dallas and Fort Worth.',
    imageUrl: '/stadiums/att.jpg'
  },
  {
    id: 'mercedes',
    name: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    country: 'USA',
    capacity: 71000,
    opened: 2017,
    hostedMatches: ['5 Group Stage Matches', 'Round of 32', 'Round of 16', 'Semifinal'],
    description: 'A highly sustainable, award-winning stadium in the heart of Atlanta, featuring a unique retractable pinwheel roof.',
    architecture: 'Inspired by the wings of a falcon, the roof is made of eight translucent petals that slide open. Also includes a 360-degree halo video board.',
    transport: 'Directly linked to MARTA rail network via GWCC/CNN Center or Vine City stations.',
    imageUrl: '/stadiums/mercedes.jpg'
  },
  {
    id: 'lincoln',
    name: 'Lincoln Financial Field',
    city: 'Philadelphia',
    country: 'USA',
    capacity: 69796,
    opened: 2003,
    hostedMatches: ['5 Group Stage Matches', 'Round of 32', 'Round of 16'],
    description: 'Affectionately known as "The Linc," this venue is famous for its passionate sports fan base and eco-friendly operations, powered by wind and solar energy.',
    architecture: 'Features open corners allowing views of the Philadelphia skyline and wing-like structures canopying the east and west stands.',
    transport: 'Access via SEPTA Broad Street Line subway directly to NRG Station at the Sports Complex.',
    imageUrl: '/stadiums/lincoln.jpg'
  },
  {
    id: 'lumen',
    name: 'Lumen Field',
    city: 'Seattle',
    country: 'USA',
    capacity: 69000,
    opened: 2002,
    hostedMatches: ['4 Group Stage Matches (including Seattle/USA Match)', 'Round of 32', 'Round of 16'],
    description: 'Set against the backdrop of Puget Sound, Lumen Field is famous for its acoustics, holding the world record for loudest crowd roar at an outdoor venue.',
    architecture: 'Features two massive arching roof structures canopying the sides, leaving the end zones open to frame views of downtown Seattle.',
    transport: 'Steps away from King Street Station (Sounder train) and International District/Chinatown Light Rail station.',
    imageUrl: '/stadiums/lumen.jpg'
  },
  {
    id: 'levis',
    name: 'Levi\'s Stadium',
    city: 'Santa Clara (San Francisco)',
    country: 'USA',
    capacity: 68500,
    opened: 2014,
    hostedMatches: ['5 Group Stage Matches', 'Round of 32', 'Round of 16'],
    description: 'Located in Silicon Valley, Levi\'s Stadium is designed with smart technology, solar panels, and a focus on green energy.',
    architecture: 'Features a massive open-air design, a living green roof on the suite tower, and a structural layout focusing on local reclaimed materials.',
    transport: 'Connected to VTA Light Rail (Great America Station), Caltrain shuttles, and Capitol Corridor regional rail.',
    imageUrl: '/stadiums/levis.jpg'
  },
  {
    id: 'gillette',
    name: 'Gillette Stadium',
    city: 'Foxborough (Boston)',
    country: 'USA',
    capacity: 65878,
    opened: 2002,
    hostedMatches: ['5 Group Stage Matches', 'Round of 32', 'Quarterfinal'],
    description: 'Serving the New England region, Gillette Stadium features a newly renovated north end-zone lighthouse and one of the largest outdoor video boards in the country.',
    architecture: 'Distinguished by its signature lighthouse and replica bridge, framing a classic New England coastal harbor feel.',
    transport: 'Special MBTA Event Trains run from Boston South Station and Providence directly to the stadium station.',
    imageUrl: '/stadiums/gillette.jpg'
  },
  {
    id: 'hardrock',
    name: 'Hard Rock Stadium',
    city: 'Miami Gardens (Miami)',
    country: 'USA',
    capacity: 64767,
    opened: 1987,
    hostedMatches: ['4 Group Stage Matches', 'Round of 32', 'Quarterfinal', 'Third Place Play-off'],
    description: 'A global entertainment hub that has hosted multiple Super Bowls, Formula 1 races, and major concerts, featuring a tropical shade canopy.',
    architecture: 'Retrofitted with a massive steel open-air shade canopy and four iconic diagonal corner spiral ramps.',
    transport: 'Accessible via dedicated highway exits, express shuttle services, and the Brightline rail service connectable shuttles.',
    imageUrl: '/stadiums/hardrock.jpg'
  },
  {
    id: 'nrg',
    name: 'NRG Stadium',
    city: 'Houston',
    country: 'USA',
    capacity: 72220,
    opened: 2002,
    hostedMatches: ['5 Group Stage Matches', 'Round of 32', 'Round of 16'],
    description: 'The first stadium in the NFL to feature a retractable roof, NRG Stadium offers an air-conditioned climate ideal for summer matches.',
    architecture: 'Fabric-covered retractable roof supported by two main arching steel trusses, creating an expansive column-free indoor space.',
    transport: 'Direct access via METRORail Red Line directly to Stadium Park / Astrodome station.',
    imageUrl: '/stadiums/nrg.jpg'
  },
  {
    id: 'arrowhead',
    name: 'GEHA Field at Arrowhead Stadium',
    city: 'Kansas City',
    country: 'USA',
    capacity: 76416,
    opened: 1972,
    hostedMatches: ['4 Group Stage Matches', 'Round of 32', 'Quarterfinal'],
    description: 'Known for its electric atmosphere and deafening noise levels, Arrowhead is a classic American stadium that underwent a massive modern renovation.',
    architecture: 'Symmetrical double-deck bowl design without posts, ensuring unobstructed lines of sight from every seat.',
    transport: 'Access via KCATA public transit buses, dedicated highway exits, and shuttle hubs.',
    imageUrl: '/stadiums/arrowhead.jpg'
  },
  {
    id: 'bcplace',
    name: 'BC Place',
    city: 'Vancouver',
    country: 'Canada',
    capacity: 54500,
    opened: 1983,
    hostedMatches: ['5 Group Stage Matches (including Canada matches)', 'Round of 32', 'Round of 16'],
    description: 'Located in the heart of downtown Vancouver, BC Place features a state-of-the-art cable-supported retractable roof and a massive center-hung screen.',
    architecture: 'Features the world\'s largest cable-supported retractable roof system, supported by 36 steel masts around the stadium rim.',
    transport: 'Directly served by TransLink SkyTrain at Stadium-Chinatown and Yaletown-Roundhouse stations.',
    imageUrl: '/stadiums/bcplace.jpg'
  },
  {
    id: 'bmo',
    name: 'BMO Field',
    city: 'Toronto',
    country: 'Canada',
    capacity: 45000,
    opened: 2007,
    hostedMatches: ['5 Group Stage Matches (including Canada Opening)', 'Round of 32'],
    description: 'Canada\'s national soccer stadium, located on Exhibition Place, is being expanded to 45,000 seats specifically for the 2026 World Cup.',
    architecture: 'Classic open-air stadium layout with a newly built cantilevered roof canopy shading the east, west, and south stands.',
    transport: 'Direct transit access via GO Transit rail (Exhibition Station) and TTC streetcars (509 Harbourfront / 511 Bathurst).',
    imageUrl: '/stadiums/bmo.jpg'
  },
  {
    id: 'bbva',
    name: 'Estadio BBVA',
    city: 'Guadalupe (Monterrey)',
    country: 'Mexico',
    capacity: 53500,
    opened: 2015,
    hostedMatches: ['3 Group Stage Matches', 'Round of 32'],
    description: 'Often called "El Gigante de Acero" (The Steel Giant), this venue is framed by the breathtaking Sierra Madre mountains, offering one of the most scenic views in soccer.',
    architecture: 'Futuristic design resembling a metallic cloud, clad in aluminum sheets with a large opening framing a view of the Cerro de la Silla mountain.',
    transport: 'Access via Metrorrey Metro Line 1 to Exposición station, followed by local shuttle buses or walking paths.',
    imageUrl: '/stadiums/bbva.jpg'
  },
  {
    id: 'akron',
    name: 'Estadio Akron',
    city: 'Zapopan (Guadalajara)',
    country: 'Mexico',
    capacity: 48070,
    opened: 2010,
    hostedMatches: ['4 Group Stage Matches', 'Round of 32'],
    description: 'An architectural masterpiece located in the Guadalajara metropolitan area, famous for its grass-sloped outer hill mimicking a volcano.',
    architecture: 'Resembles a volcanic cone clad in green grass, topped by a circular roof structure that floats over the stadium bowl like a cloud.',
    transport: 'Accessible via Macrobus BRT system (Estadio Akron Station) and dedicated perimeter shuttle routes.',
    imageUrl: '/stadiums/akron.jpg'
  }
];
