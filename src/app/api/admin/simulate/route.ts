import { NextResponse, type NextRequest } from 'next/server';
import { getSimState, updateSimState, setRequestsTodayCount } from '../../../../services/footballApi';

export async function GET() {
  try {
    const state = getSimState();
    return NextResponse.json(state);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch simulation state' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (typeof body.requestsToday === 'number') {
      setRequestsTodayCount(body.requestsToday);
    }
    const updated = updateSimState(body);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update simulation state' },
      { status: 500 }
    );
  }
}
