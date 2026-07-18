import { getGabah, getDistribusi } from "@/app/actions/penggilingan";
import PenggilinganClient from "./client";

export default async function PenggilinganPage() {
  const gabahData = await getGabah();
  const distribusiData = await getDistribusi();

  return (
    <PenggilinganClient gabahData={gabahData} distribusiData={distribusiData} />
  );
}
