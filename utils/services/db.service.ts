import fs from 'fs/promises';
import path from 'path';
import { Booking } from './booking.service';
import { Destination } from './destination.service';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
}

export interface DatabaseSchema {
  users: User[];
  destinations: Destination[];
  bookings: Booking[];
}

// Emplacement du fichier JSON de base de données
const dbPath = path.join(process.cwd(), 'data', 'db.json');

export async function readDB(): Promise<DatabaseSchema> {
  try {
    const fileContents = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Erreur de lecture de la base de données:", error);
    return { users: [], destinations: [], bookings: [] };
  }
}

export async function writeDB(data: DatabaseSchema): Promise<void> {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Erreur d'écriture dans la base de données:", error);
  }
}
