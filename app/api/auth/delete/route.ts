import { NextResponse } from 'next/server';
import { readDB, writeDB } from '../../../../utils/services/db.service';
import { cookies } from 'next/headers';

export async function DELETE() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('reservia_session')?.value;

  if (!sessionId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const db = await readDB();
  db.users = db.users.filter(u => u.id !== sessionId);
  
  // Supprimer toutes les réservations associées
  db.bookings = db.bookings.filter(b => b.userId !== sessionId);
  
  await writeDB(db);
  cookieStore.delete('reservia_session');
  
  return NextResponse.json({ success: true });
}