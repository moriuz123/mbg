'use server';

import { db } from "@/db";
import { 
  masterDistributor, 
  masterJenisPangan, 
  masterParameterUji, 
  masterSumberGabah, 
  masterLokusSppg 
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const tableMap = {
  'sumber-gabah': masterSumberGabah,
  'lokus-sppg': masterLokusSppg,
  'jenis-pangan': masterJenisPangan,
  'distributor': masterDistributor,
  'parameter-uji': masterParameterUji,
};

export async function getMasterData(tabId: string) {
  const table = tableMap[tabId as keyof typeof tableMap];
  if (!table) return [];

  return await db.query[tableMap[tabId as keyof typeof tableMap]._schema.table].findMany({
    orderBy: [desc(table.createdAt)]
  });
}

// Since dynamic query properties might not be strongly typed in this version of drizzle-orm, 
// a safer approach is to query explicitly using select():
export async function getMasterDataSafe(tabId: keyof typeof tableMap) {
  const table = tableMap[tabId];
  if (!table) return [];
  return await db.select().from(table).orderBy(desc(table.createdAt));
}

export async function addMasterData(tabId: keyof typeof tableMap, name: string) {
  const table = tableMap[tabId];
  if (!table) throw new Error("Invalid tab");
  
  await db.insert(table).values({
    id: crypto.randomUUID(),
    name
  });
  
  revalidatePath('/master-data');
}

export async function updateMasterData(tabId: keyof typeof tableMap, id: string, name: string) {
  const table = tableMap[tabId];
  if (!table) throw new Error("Invalid tab");
  
  await db.update(table).set({ name }).where(eq(table.id, id));
  
  revalidatePath('/master-data');
}

export async function deleteMasterData(tabId: keyof typeof tableMap, id: string) {
  const table = tableMap[tabId];
  if (!table) throw new Error("Invalid tab");
  
  await db.delete(table).where(eq(table.id, id));
  
  revalidatePath('/master-data');
}
