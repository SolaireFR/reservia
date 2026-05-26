import { NextResponse } from 'next/server';
import { readDB, writeDB } from '../../../../../utils/services/db.service';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDB();
  const initialLength = db.destinations.length;
  
  db.destinations = db.destinations.filter(d => d.id !== id);
  
  if (db.destinations.length === initialLength) {
    return NextResponse.json({ error: "Destination not found" }, { status: 404 });
  }

  // Also remove bookings associated with this destination
  db.bookings = db.bookings.filter(b => b.destinationId !== id);

  await writeDB(db);
  return NextResponse.json({ success: true });
}