import { NextResponse } from 'next/server';
import { readDB, writeDB } from '../../../../../utils/services/db.service';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDB();
  const initialLength = db.users.length;
  
  db.users = db.users.filter(u => u.id !== id);
  
  if (db.users.length === initialLength) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Delete associated bookings
  db.bookings = db.bookings.filter(b => b.userId !== id);

  await writeDB(db);
  return NextResponse.json({ success: true });
}