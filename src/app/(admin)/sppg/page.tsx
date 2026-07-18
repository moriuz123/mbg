import { getBahanPangan, getRapidTest } from "@/app/actions/sppg";
import { getMasterDataSafe } from "@/app/actions/master";
import SPPGClient from "./client";

export default async function SPPGPage() {
  const bahanPangan = await getBahanPangan();
  const rapidTest = await getRapidTest();
  
  const jenisPanganOptions = await getMasterDataSafe('jenis-pangan');
  const distributorOptions = await getMasterDataSafe('distributor');
  const parameterUjiOptions = await getMasterDataSafe('parameter-uji');

  return (
    <SPPGClient 
      bahanPangan={bahanPangan} 
      rapidTest={rapidTest} 
      jenisPanganOptions={jenisPanganOptions}
      distributorOptions={distributorOptions}
      parameterUjiOptions={parameterUjiOptions}
    />
  );
}
