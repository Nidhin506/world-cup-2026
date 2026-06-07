import { NextResponse } from 'next/server';
import { FootballApiService } from '../../../services/footballApi';

export async function GET() {
  try {
    const teams = await FootballApiService.getTeams();
    return NextResponse.json(teams);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}
