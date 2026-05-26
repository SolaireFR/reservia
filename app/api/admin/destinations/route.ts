import { NextResponse } from 'next/server';
import { readDB, writeDB } from '../../../../utils/services/db.service';
import { Destination } from '../../../../utils/services/destination.service';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Parse form fields (alignés sur l'interface Destination)
    const name = formData.get('name') as string;
    const country = formData.get('country') as string;
    const price = parseInt(formData.get('price') as string) || 0;
    const description = formData.get('description') as string || '';
    const longDescription = formData.get('longDescription') as string || '';
    
    // Handle image upload
    const image = formData.get('image') as File | null;
    let imageUrl = '';

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const ext = path.extname(image.name) || '.jpg';
      const filename = `dest_${Date.now()}${ext}`;
      const uploadPath = path.join(process.cwd(), 'data', 'medias', filename);
      
      // S'assurer que le dossier existe
      await fs.mkdir(path.dirname(uploadPath), { recursive: true });
      await fs.writeFile(uploadPath, buffer);
      imageUrl = `/api/medias/${filename}`;
    }

    const db = await readDB();
    
    const newDestination: Destination = {
      id: `dest${Date.now()}`,
      name,
      country,
      price,
      image: imageUrl,
      description,
      longDescription,
      availableDates: [] // Initialisé vide par défaut
    };

    // Initialise le tableau si la BDD est vide
    if (!db.destinations) {
      db.destinations = [];
    }

    db.destinations.push(newDestination);
    await writeDB(db);

    return NextResponse.json(newDestination, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la destination:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}