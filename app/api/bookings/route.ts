import { NextResponse } from 'next/server';
import { createBooking, getUserBookings, cancelBooking } from '../../../utils/services/booking.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const booking = await createBooking(body);
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la réservation' }, { status: 500 });
  }
}

export async function GET() {
  // Simulate get bookings for logged in user
  const userId = "user-123";
  const bookings = await getUserBookings(userId);
  return NextResponse.json(bookings);
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    
    await cancelBooking(id);
    return NextResponse.json({ success: true });
  } catch (error) {
     return NextResponse.json({ error: 'Erreur lors de l\'annulation' }, { status: 500 });
  }
}