'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

export async function uploadFile(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = session?.user?.role as string;
  if (role !== 'admin' && role !== 'admin_dinas' && role !== 'super_admin') {
    throw new Error('Forbidden');
  }

  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Buat nama file unik
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.name) || '.png';
  const filename = `upload-${uniqueSuffix}${ext}`;
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

  await fs.writeFile(filepath, buffer);
  
  return { url: `/uploads/${filename}` };
}
