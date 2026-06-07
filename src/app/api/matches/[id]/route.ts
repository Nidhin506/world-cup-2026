import { NextResponse, type NextRequest } from 'next/server';
import { FootballApiService } from '../../../../services/footballApi';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const forceRefresh = request.nextUrl.searchParams.get('refresh') === 'true';
    const match = await FootballApiService.getMatchById(id, forceRefresh);
    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }
    
    const metrics = FootballApiService.getApiUsageMetrics();
    const response = NextResponse.json(match);
    
    response.headers.set('x-quota-used-today', metrics.usedToday.toString());
    response.headers.set('x-quota-remaining', metrics.remaining.toString());
    response.headers.set('x-quota-warning', metrics.warningTriggered.toString());
    response.headers.set('x-quota-safety-active', metrics.safetyTriggered.toString());
    
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch match details' },
      { status: 500 }
    );
  }
}
