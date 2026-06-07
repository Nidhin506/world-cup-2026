import { NextResponse } from 'next/server';
import { FootballApiService } from '../../../services/footballApi';
import { GroupStanding } from '../../../store/matchSimulator';

export async function GET() {
  try {
    const standings = await FootballApiService.getStandings();
    
    // Compute best third-placed teams
    const groupLetters = Array.from({ length: 12 }, (_, i) => String.fromCharCode(65 + i));
    const thirdPlaced: GroupStanding[] = [];

    groupLetters.forEach((letter) => {
      const groupStandings = standings[letter];
      if (groupStandings[2]) {
        thirdPlaced.push(groupStandings[2]); // Index 2 is the 3rd placed team in a sorted group
      }
    });

    const bestThirdPlaced = thirdPlaced
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return a.team.fifaRanking - b.team.fifaRanking;
      });

    return NextResponse.json({
      standings,
      bestThirdPlaced
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch standings' },
      { status: 500 }
    );
  }
}
