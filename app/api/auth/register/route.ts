import { NextResponse } from 'next/server';
import { readDB, writeDB } from '../../../../utils/services/db.service';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const db = await readDB();
    
    if (db.users.find(u => u.email === email)) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      role: 'user'
    };

    db.users.push(newUser);
    await writeDB(db);

    const { password: _, ...safeUser } = newUser;

    // Auto-login after registration
    const cookieStore = await cookies();
    cookieStore.set('reservia_session', newUser.id, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}