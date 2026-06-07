export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  category: 'Tournament News' | 'Team Update' | 'Match Review' | 'Host City Guide';
  imageUrl: string;
  readTime: string;
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Mauricio Pochettino Announces Final USMNT 26-Man Squad',
    summary: 'Christian Pulisic and Weston McKennie lead the co-hosts roster with a blend of youthful European prospects and MLS standouts.',
    content: 'USMNT head coach Mauricio Pochettino has officially revealed his 26-man roster for the FIFA World Cup 2026. The roster is headlined by AC Milan winger Christian Pulisic and Juventus midfielder Weston McKennie. Exciting additions include young talents from top European academies. "We have a squad that can dream big and compete at the highest level," Pochettino said during the press conference in New York.',
    publishedAt: '2026-06-03T14:30:00Z',
    category: 'Team Update',
    imageUrl: '/news/usmnt_squad.jpg',
    readTime: '4 min read'
  },
  {
    id: 'news-2',
    title: 'MetLife Stadium Prepares for World Cup Final Visual Spectacle',
    summary: 'Organizers reveal new stadium upgrades, including a revolutionary pitch installation and enhanced transit infrastructure.',
    content: 'MetLife Stadium in East Rutherford is undergoing final modifications to host the FIFA World Cup 2026 Final on July 19. Upgrades include a state-of-the-art natural grass surface grown specifically for the venue, brand new LED video boards, and expanded train shuttles from Manhattan to ensure seamless fan flow. Over 80,000 fans are expected to fill the stadium for the largest sporting event in American history.',
    publishedAt: '2026-06-02T10:15:00Z',
    category: 'Tournament News',
    imageUrl: '/news/metlife_prep.jpg',
    readTime: '3 min read'
  },
  {
    id: 'news-3',
    title: 'Lionel Messi Confirms 2026 Tournament Will Be His Final Dance',
    summary: 'The reigning world champion discusses Argentina\'s title defense and his physical preparation for the historic 48-team tournament.',
    content: 'Argentina superstar Lionel Messi has confirmed that the 2026 World Cup will be his final major international tournament. Speaking from the team\'s training camp in Miami, the 38-year-old expressed his excitement for the tournament\'s unique triple-host structure. "We are here to defend our crown and give our fans another unforgettable experience," Messi stated.',
    publishedAt: '2026-06-01T18:00:00Z',
    category: 'Team Update',
    imageUrl: '/news/messi_interview.jpg',
    readTime: '5 min read'
  },
  {
    id: 'news-4',
    title: 'ZEE5 Announces Live 4K Streaming for World Cup in India',
    summary: 'Zee Entertainment confirms complete digital rights coverage in multiple languages, with dedicated premium packs for fans.',
    content: 'Football fans in India have received a massive boost as Zee Entertainment announced that the entire FIFA World Cup 2026 will be streamed live in stunning 4K resolution on the ZEE5 app. Matches will be available through the premium Z5 FIFA WC\'26 + All Access subscription pack. Broadcasters will offer commentary feeds in English, Hindi, Bengali, Tamil, and Malayalam. Television viewers can catch all action on the Zee TV networks.',
    publishedAt: '2026-05-30T08:00:00Z',
    category: 'Tournament News',
    imageUrl: '/news/zee5_4k.jpg',
    readTime: '2 min read'
  },
  {
    id: 'news-5',
    title: 'A Tourist Guide to the Historic Estadio Azteca and Mexico City',
    summary: 'Everything you need to know about navigating the giant volcanic city, tasting local street food, and experiencing a match at the Azteca.',
    content: 'Estadio Azteca is the crown jewel of Mexican football. For fans traveling to Mexico City, visiting this stadium is a pilgrimage. This guide covers how to take the Tren Ligero, what local tacos to eat around the Santa Úrsula neighborhood, and details on security and entry guidelines for the opening match on June 11, 2026.',
    publishedAt: '2026-05-28T12:00:00Z',
    category: 'Host City Guide',
    imageUrl: '/news/azteca_guide.jpg',
    readTime: '6 min read'
  }
];
