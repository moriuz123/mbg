import { getGabah, getDistribusi } from "@/app/actions/penggilingan";
import { getMasterDataSafe } from "@/app/actions/master";
import PenggilinganClient from "./client";

export default async function PenggilinganPage() {
  const gabahData = await getGabah();
  const distribusiData = await getDistribusi();
  
  const sumberGabahOptions = await getMasterDataSafe('sumber-gabah');
  const lokusSppgOptions = await getMasterDataSafe('lokus-sppg');

  return (
    <PenggilinganClient 
      gabahData={gabahData} 
      distribusiData={distribusiData} 
      sumberGabahOptions={sumberGabahOptions}
      lokusSppgOptions={lokusSppgOptions}
    />
  );
}
