import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: Request, { params }: { params: Promise<{ filename: string }> }) {
  // Fix for Next.js 15: params is resolving, wait for it:
  const { filename } = await params;
  const filePath = path.join(process.cwd(), 'data', 'medias', filename);
  
  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filename).toLowerCase();
    
    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.gif') mimeType = 'image/gif';
    else if (ext === '.webp') mimeType = 'image/webp';

    return new NextResponse(file, {
      headers: { 'Content-Type': mimeType }
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}