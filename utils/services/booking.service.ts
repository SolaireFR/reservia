import { readDB, writeDB } from "./db.service";

export interface Booking {
  id: string;
  userId: string;
  destinationId: string;
  date: string;
  guests: number;
  totalPrice: number;
}

export async function createBooking(data: Omit<Booking, "id" | "userId">, userId: string): Promise<Booking> {
  const db = await readDB();

  const newBooking: Booking = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    userId
  };

  db.bookings.push(newBooking);
  await writeDB(db);

  return newBooking;
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const db = await readDB();
  return db.bookings.filter(b => b.userId === userId);
}

export async function getAllBookings(): Promise<Booking[]> {
  const db = await readDB();
  return db.bookings;
}

export async function cancelBooking(id: string): Promise<boolean> {
  const db = await readDB();
  const initialLength = db.bookings.length;
  
  db.bookings = db.bookings.filter(b => b.id !== id);
  
  if (db.bookings.length !== initialLength) {
    await writeDB(db);
    return true;
  }
  
  return false;
}