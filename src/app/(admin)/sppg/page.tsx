import { getBahanPangan, getRapidTest } from "@/app/actions/sppg";
import SPPGClient from "./client";

export default async function SPPGPage() {
  const bahanPangan = await getBahanPangan();
  const rapidTest = await getRapidTest();

  return (
    <SPPGClient bahanPangan={bahanPangan} rapidTest={rapidTest} />
  );
}
