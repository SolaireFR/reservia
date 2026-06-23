import { NextResponse } from 'next/server';
import { createBooking, getUserBookings, cancelBooking } from '../../../utils/services/booking.service';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const userId = cookieStore.get('reservia_session')?.value;
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const booking = await createBooking(body, userId);
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la réservation' }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('reservia_session')?.value;
  if (!userId) return NextResponse.json([], { status: 200 });

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