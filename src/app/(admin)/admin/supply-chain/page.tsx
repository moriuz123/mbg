import { getSupplyChain } from "@/app/actions/supplyChain";
import { getSppg } from "@/app/actions/sppg";
import { getJenisPangan, getPemasok } from "@/app/actions/masterData";
import SupplyChainClientUI from "./SupplyChainClientUI";

export default async function SupplyChainPage() {
  const supplyChainList = await getSupplyChain();
  const sppgList = await getSppg();
  const jenisPanganList = await getJenisPangan();
  const pemasokList = await getPemasok();

  return (
    <main className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Rantai Pasok</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manajemen rantai pasok dan kebutuhan bahan baku dapur SPPG.</p>
        </div>
      </div>

      <SupplyChainClientUI 
        initialData={supplyChainList} 
        sppgList={sppgList}
        jenisPanganList={jenisPanganList}
        pemasokList={pemasokList}
      />
    </main>
  );
}
