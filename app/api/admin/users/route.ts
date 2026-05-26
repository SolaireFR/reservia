import { NextResponse } from 'next/server';
import { readDB } from '../../../../utils/services/db.service';

export async function GET() {
  const db = await readDB();
  // Don't send passwords to the client
  const safeUsers = db.users.map(({ password, ...user }) => user);
  return NextResponse.json(safeUsers);
}