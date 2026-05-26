import { NextResponse } from 'next/server';
import { readDB } from '../../../../utils/services/db.service';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const db = await readDB();
    
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const { password: _, ...safeUser } = user;
    
    // Set a simple cookie containing user ID (In a real app, use JWT!)
    const cookieStore = await cookies();
    cookieStore.set('reservia_session', user.id, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}