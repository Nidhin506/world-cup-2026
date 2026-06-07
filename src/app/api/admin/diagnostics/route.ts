import { NextResponse } from 'next/server';
import { FootballApiService } from '../../../../services/footballApi';

export async function GET() {
  try {
    const diagnostics = FootballApiService.getDiagnostics();
    return NextResponse.json(diagnostics);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch developer diagnostics' },
      { status: 500 }
    );
  }
}
