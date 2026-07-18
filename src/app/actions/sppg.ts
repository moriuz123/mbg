'use server';

import { db } from "@/db";
import { sppgBahan, sppgRapidTest } from "@/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getBahanPangan() {
  return await db.query.sppgBahan.findMany({
    orderBy: [desc(sppgBahan.createdAt)],
  });
}

export async function addBahanPangan(data: { jenis: string; volumeBeli: string; volumePakai: string; sumber: string; cp: string }) {
  await db.insert(sppgBahan).values({
    id: crypto.randomUUID(),
    jenis: data.jenis,
    volumeBeli: data.volumeBeli,
    volumePakai: data.volumePakai,
    sumber: data.sumber,
    cp: data.cp,
  });
  revalidatePath('/sppg');
  revalidatePath('/admin');
}

export async function getRapidTest() {
  return await db.query.sppgRapidTest.findMany({
    orderBy: [desc(sppgRapidTest.createdAt)],
  });
}

export async function addRapidTest(data: { tanggal: string; bahan: string; parameter: string; hasil: string }) {
  await db.insert(sppgRapidTest).values({
    id: crypto.randomUUID(),
    tanggal: data.tanggal,
    bahan: data.bahan,
    parameter: data.parameter,
    hasil: data.hasil,
  });
  revalidatePath('/sppg');
  revalidatePath('/admin');
}
