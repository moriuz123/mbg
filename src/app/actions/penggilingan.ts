'use server';

import { db } from "@/db";
import { penggilinganGabah, penggilinganDistribusi } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getGabah() {
  return await db.query.penggilinganGabah.findMany({
    orderBy: [desc(penggilinganGabah.createdAt)],
  });
}

export async function addGabah(data: { sumber: string; volume: string; periode: string }) {
  await db.insert(penggilinganGabah).values({
    id: crypto.randomUUID(),
    sumber: data.sumber,
    volume: data.volume,
    periode: data.periode,
    status: 'Selesai',
  });
  revalidatePath('/penggilingan');
  revalidatePath('/admin');
}

export async function getDistribusi() {
  return await db.query.penggilinganDistribusi.findMany({
    orderBy: [desc(penggilinganDistribusi.createdAt)],
  });
}

export async function addDistribusi(data: { tujuan: string; volume: string; tanggal: string }) {
  await db.insert(penggilinganDistribusi).values({
    id: crypto.randomUUID(),
    tujuan: data.tujuan,
    volume: data.volume,
    tanggal: data.tanggal,
  });
  revalidatePath('/penggilingan');
  revalidatePath('/admin');
}
