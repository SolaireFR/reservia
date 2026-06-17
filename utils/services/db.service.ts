import { MongoClient, Db } from 'mongodb';
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

const mongoUri = process.env.MONGODB_URI || 'mongodb://db_reservia:IVT7148dta@localhost:27017/?authSource=admin';
const dbName = process.env.MONGODB_DB || 'reservia';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getDb(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}

export async function closeDbConnection(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}

export async function readDB(): Promise<DatabaseSchema> {
  const db = await getDb();
  const users = await db.collection<User>('users').find().toArray();
  const destinations = await db.collection<Destination>('destinations').find().toArray();
  const bookings = await db.collection<Booking>('bookings').find().toArray();

  return { users, destinations, bookings };
}

export async function writeDB(data: DatabaseSchema): Promise<void> {
  const db = await getDb();
  await db.collection<User>('users').deleteMany({});
  await db.collection<Destination>('destinations').deleteMany({});
  await db.collection<Booking>('bookings').deleteMany({});

  if (data.users.length) {
    await db.collection<User>('users').insertMany(data.users);
  }
  if (data.destinations.length) {
    await db.collection<Destination>('destinations').insertMany(data.destinations);
  }
  if (data.bookings.length) {
    await db.collection<Booking>('bookings').insertMany(data.bookings);
  }
}
