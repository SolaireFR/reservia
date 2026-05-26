import { NextResponse } from 'next/server';
import { getAllBookings } from '../../../../utils/services/booking.service';

export async function GET() {
  const bookings = await getAllBookings();
  return NextResponse.json(bookings);
}
