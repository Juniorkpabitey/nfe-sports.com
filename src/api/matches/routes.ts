import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get('league');
  
  // Implement your match fetching logic here
  // Use the football API with server-side API keys
  
  return NextResponse.json({ response: [] }); // Return your match data
}