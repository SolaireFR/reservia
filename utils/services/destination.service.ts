import { readDB } from "./db.service";

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  price: number;
  description: string;
  longDescription: string;
  availableDates: string[];
}

export async function getDestinations(): Promise<Destination[]> {
  const db = await readDB();
  return db.destinations;
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  const db = await readDB();
  const dest = db.destinations.find((d: Destination) => d.id === id);
  return dest || null;
}