import { NextResponse } from 'next/server';
import { readDB } from '../../../../utils/services/db.service';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('reservia_session')?.value;

  if (!sessionId) {
    return NextResponse.json({ user: null }, { status: 200 }); // Not an error, just not logged in
  }

  const db = await readDB();
  const user = db.users.find(u => u.id === sessionId);

  if (!user) {
    cookieStore.delete('reservia_session');
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const { password: _, ...safeUser } = user;
  return NextResponse.json({ user: safeUser }, { status: 200 });
}