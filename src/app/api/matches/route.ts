import { NextResponse, type NextRequest } from 'next/server';
import { FootballApiService } from '../../../services/footballApi';

export async function GET(request: NextRequest) {
  try {
    const forceRefresh = request.nextUrl.searchParams.get('refresh') === 'true';
    const matches = await FootballApiService.getMatches(forceRefresh);
    
    const metrics = FootballApiService.getApiUsageMetrics();
    const response = NextResponse.json(matches);
    
    response.headers.set('x-quota-used-today', metrics.usedToday.toString());
    response.headers.set('x-quota-remaining', metrics.remaining.toString());
    response.headers.set('x-quota-warning', metrics.warningTriggered.toString());
    response.headers.set('x-quota-safety-active', metrics.safetyTriggered.toString());
    
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}
