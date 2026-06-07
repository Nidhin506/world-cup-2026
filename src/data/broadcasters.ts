export interface Broadcaster {
  name: string;
  logo: string; // Text logo or icon identifier
  type: 'Television' | 'Streaming' | 'Both';
  subscription: 'Free' | 'Paid' | 'Subscription Required' | 'Both';
  languages: string[];
  link: string;
  notes?: string;
}

export interface RegionBroadcasters {
  countryCode: string;
  countryName: string;
  channels: Broadcaster[];
}

export const BROADCASTERS: RegionBroadcasters[] = [
  {
    countryCode: 'IN',
    countryName: 'India',
    channels: [
      {
        name: 'ZEE5 (Zee Entertainment)',
        logo: 'ZEE',
        type: 'Streaming',
        subscription: 'Paid',
        languages: ['English', 'Hindi', 'Bengali', 'Tamil', 'Malayalam'],
        link: 'https://www.zee5.com',
        notes: 'Official digital streaming partner for India. Premium subscription required to watch live matches (Z5 FIFA WC\'26 + All Access pack).'
      },
      {
        name: 'Zee TV Network',
        logo: 'ZEE',
        type: 'Television',
        subscription: 'Subscription Required',
        languages: ['English', 'Hindi'],
        link: 'https://www.zee.com',
        notes: 'Official television broadcaster, available on standard DTH and cable providers across Zee Network channels (Zee Café, Zee TV).'
      }
    ]
  },
  {
    countryCode: 'US',
    countryName: 'United States',
    channels: [
      {
        name: 'FOX Sports',
        logo: 'FOX',
        type: 'Both',
        subscription: 'Subscription Required',
        languages: ['English'],
        link: 'https://www.foxsports.com',
        notes: 'Broadcasting matches live on FOX, FS1, and the FOX Sports App (requires TV provider login).'
      },
      {
        name: 'Telemundo Deportes',
        logo: 'TEL',
        type: 'Both',
        subscription: 'Subscription Required',
        languages: ['Spanish'],
        link: 'https://www.telemundo.com',
        notes: 'Official Spanish-language broadcast partner in the US.'
      },
      {
        name: 'Peacock',
        logo: 'PEA',
        type: 'Streaming',
        subscription: 'Paid',
        languages: ['Spanish'],
        link: 'https://www.peacocktv.com',
        notes: 'Simulcasting all Spanish-language Telemundo matches digitally.'
      }
    ]
  },
  {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    channels: [
      {
        name: 'BBC Sport',
        logo: 'BBC',
        type: 'Both',
        subscription: 'Free',
        languages: ['English'],
        link: 'https://www.bbc.co.uk/iplayer',
        notes: 'Sharing broadcast rights with ITV. Free live streaming on BBC iPlayer for users with a valid TV licence.'
      },
      {
        name: 'ITV Sport',
        logo: 'ITV',
        type: 'Both',
        subscription: 'Free',
        languages: ['English'],
        link: 'https://www.itv.com/itvx',
        notes: 'Sharing broadcast rights with BBC. Free live streaming on ITVX.'
      }
    ]
  },
  {
    countryCode: 'CA',
    countryName: 'Canada',
    channels: [
      {
        name: 'CTV',
        logo: 'CTV',
        type: 'Television',
        subscription: 'Subscription Required',
        languages: ['English'],
        link: 'https://www.ctv.ca',
        notes: 'English-language terrestrial television broadcaster.'
      },
      {
        name: 'TSN',
        logo: 'TSN',
        type: 'Both',
        subscription: 'Paid',
        languages: ['English'],
        link: 'https://www.tsn.ca',
        notes: 'Comprehensive English coverage on TV and the TSN+ digital app.'
      },
      {
        name: 'RDS',
        logo: 'RDS',
        type: 'Both',
        subscription: 'Paid',
        languages: ['French'],
        link: 'https://www.rds.ca',
        notes: 'French-language television and streaming broadcaster for Canada.'
      }
    ]
  },
  {
    countryCode: 'MX',
    countryName: 'Mexico',
    channels: [
      {
        name: 'Televisa (Canal 5 / Las Estrellas)',
        logo: 'TELV',
        type: 'Television',
        subscription: 'Free',
        languages: ['Spanish'],
        link: 'https://www.televisa.com',
        notes: 'Terrestrial TV coverage of select key matches, including all Mexican National Team fixtures.'
      },
      {
        name: 'TV Azteca (Azteca 7)',
        logo: 'AZT',
        type: 'Television',
        subscription: 'Free',
        languages: ['Spanish'],
        link: 'https://www.tvazteca.com',
        notes: 'Terrestrial TV coverage of select key matches.'
      },
      {
        name: 'ViX',
        logo: 'VIX',
        type: 'Streaming',
        subscription: 'Both',
        languages: ['Spanish'],
        link: 'https://vix.com',
        notes: 'Streaming platform broadcasting matches in Mexico, both free-tier and premium tiers.'
      }
    ]
  },
  {
    countryCode: 'DE',
    countryName: 'Germany',
    channels: [
      {
        name: 'ARD (Das Erste)',
        logo: 'ARD',
        type: 'Both',
        subscription: 'Free',
        languages: ['German'],
        link: 'https://www.ardmediathek.de',
        notes: 'Public free-to-air broadcaster, sharing matches with ZDF.'
      },
      {
        name: 'ZDF',
        logo: 'ZDF',
        type: 'Both',
        subscription: 'Free',
        languages: ['German'],
        link: 'https://www.zdf.de',
        notes: 'Public free-to-air broadcaster, sharing matches with ARD.'
      },
      {
        name: 'MagentaTV',
        logo: 'MAG',
        type: 'Both',
        subscription: 'Paid',
        languages: ['German'],
        link: 'https://www.magentatv.de',
        notes: 'Telekom paid platform broadcasting all 104 matches live.'
      }
    ]
  },
  {
    countryCode: 'FR',
    countryName: 'France',
    channels: [
      {
        name: 'TF1',
        logo: 'TF1',
        type: 'Both',
        subscription: 'Free',
        languages: ['French'],
        link: 'https://www.tf1.fr',
        notes: 'Free-to-air coverage of 28 key matches, including France matches and final stages.'
      },
      {
        name: 'beIN Sports',
        logo: 'BEIN',
        type: 'Both',
        subscription: 'Paid',
        languages: ['French'],
        link: 'https://www.beinsports.com',
        notes: 'Pay-TV channel broadcasting all matches of the tournament.'
      }
    ]
  },
  {
    countryCode: 'BR',
    countryName: 'Brazil',
    channels: [
      {
        name: 'TV Globo',
        logo: 'GLO',
        type: 'Television',
        subscription: 'Free',
        languages: ['Portuguese'],
        link: 'https://redeglobo.globo.com',
        notes: 'Free-to-air national TV coverage.'
      },
      {
        name: 'CazéTV',
        logo: 'CAZ',
        type: 'Streaming',
        subscription: 'Free',
        languages: ['Portuguese'],
        link: 'https://www.youtube.com/@CazeTV',
        notes: 'Free digital broadcast of matches on YouTube and Twitch.'
      },
      {
        name: 'Globoplay / SporTV',
        logo: 'PLAY',
        type: 'Both',
        subscription: 'Paid',
        languages: ['Portuguese'],
        link: 'https://globoplay.globo.com',
        notes: 'Paid subscription streaming/cable broadcasting all matches.'
      }
    ]
  },
  {
    countryCode: 'AR',
    countryName: 'Argentina',
    channels: [
      {
        name: 'TV Pública',
        logo: 'TVP',
        type: 'Television',
        subscription: 'Free',
        languages: ['Spanish'],
        link: 'https://www.tvpublica.com.ar',
        notes: 'Free public broadcasting of Argentina matches and selected fixtures.'
      },
      {
        name: 'TyC Sports',
        logo: 'TYC',
        type: 'Both',
        subscription: 'Subscription Required',
        languages: ['Spanish'],
        link: 'https://play.tycsports.com',
        notes: 'Paid cable channel and app broadcasting matches live.'
      },
      {
        name: 'Telefe',
        logo: 'TLF',
        type: 'Television',
        subscription: 'Free',
        languages: ['Spanish'],
        link: 'https://telefe.com',
        notes: 'Terrestrial TV channel broadcasting key tournament matches.'
      }
    ]
  },
  {
    countryCode: 'AU',
    countryName: 'Australia',
    channels: [
      {
        name: 'SBS',
        logo: 'SBS',
        type: 'Both',
        subscription: 'Free',
        languages: ['English'],
        link: 'https://www.sbs.com.au/ondemand',
        notes: 'Official free-to-air broadcaster in Australia. Every match is available live and free on SBS and SBS On Demand.'
      }
    ]
  },
  {
    countryCode: 'JP',
    countryName: 'Japan',
    channels: [
      {
        name: 'NHK',
        logo: 'NHK',
        type: 'Both',
        subscription: 'Free',
        languages: ['Japanese'],
        link: 'https://www.nhk.or.jp',
        notes: 'Public broadcaster offering television and online coverage of key fixtures.'
      },
      {
        name: 'AbemaTV',
        logo: 'ABE',
        type: 'Streaming',
        subscription: 'Free',
        languages: ['Japanese'],
        link: 'https://abema.tv',
        notes: 'Free streaming service broadcasting tournament matches in Japan.'
      }
    ]
  }
];

export function getBroadcastersForCountry(countryCode: string): RegionBroadcasters {
  const normalizedCode = countryCode.toUpperCase();
  const found = BROADCASTERS.find(b => b.countryCode === normalizedCode);
  if (found) return found;
  // Default to India or USA if not found
  return BROADCASTERS.find(b => b.countryCode === 'IN') || BROADCASTERS[0];
}
