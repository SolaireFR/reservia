import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readDB, writeDB } from '../../../../../../utils/services/db.service';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get('reservia_session')?.value;
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const db = await readDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 401 });

    // Autorisation: admin ou manager-<destinationId>
    if (user.role !== 'admin' && user.role !== `manager-${id}`) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const body = await req.json();
    // body: { addDates?: string[], removeDates?: string[] }
    const dest = db.destinations.find(d => d.id === id);
    if (!dest) return NextResponse.json({ error: 'Destination introuvable' }, { status: 404 });

    const addDates: string[] = Array.isArray(body.addDates) ? body.addDates : [];
    const removeDates: string[] = Array.isArray(body.removeDates) ? body.removeDates : [];

    // Ensure availableDates exists
    dest.availableDates = dest.availableDates || [];

    // Add unique dates
    for (const date of addDates) {
      if (!dest.availableDates.includes(date)) dest.availableDates.push(date);
    }

    // Remove dates
    dest.availableDates = dest.availableDates.filter(d => !removeDates.includes(d));

    await writeDB(db);

    return NextResponse.json(dest);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
