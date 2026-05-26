import { NextResponse } from 'next/server';
import { getDestinations } from '../../../utils/services/destination.service';

export async function GET() {
  const destinations = await getDestinations();
  return NextResponse.json(destinations);
}
