import { NextResponse, type NextRequest } from 'next/server';
import { FootballApiService } from '../../../services/footballApi';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const matchId = searchParams.get('matchId');
    if (!matchId) {
      return NextResponse.json({ error: 'Missing matchId parameter' }, { status: 400 });
    }
    const match = await FootballApiService.getMatchById(matchId);
    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }
    return NextResponse.json(match.events || []);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch live events' },
      { status: 500 }
    );
  }
}
