import { NextResponse, type NextRequest } from 'next/server';
import { FootballApiService } from '../../../services/footballApi';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const players = await FootballApiService.getPlayers(query);
    return NextResponse.json(players);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch players' },
      { status: 500 }
    );
  }
}
