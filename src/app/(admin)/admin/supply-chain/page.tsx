import { getSupplyChain, getSppgInventorySummary, getActiveSuppliersForSppg } from "@/app/actions/supplyChain";
import { getSppg } from "@/app/actions/sppg";
import { getJenisPangan, getPemasok } from "@/app/actions/masterData";
import { getPembelianBahan } from "@/app/actions/sppgPengawasan";
import SupplyChainClientUI from "./SupplyChainClientUI";

export default async function SupplyChainPage() {
  const supplyChainList = await getSupplyChain();
  const sppgList = await getSppg();
  const jenisPanganList = await getJenisPangan();
  const pemasokList = await getPemasok();
  const inventorySummary = await getSppgInventorySummary();
  const pembelianList = await getPembelianBahan();
  const activeSuppliers = await getActiveSuppliersForSppg();
  
  const { auth } = await import('@/lib/auth');
  const { headers } = await import('next/headers');
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (
    session?.user?.role !== 'sppg' && 
    session?.user?.role !== 'operator_sppg' && 
    session?.user?.role !== 'admin' && 
    session?.user?.role !== 'super_admin' && 
    session?.user?.role !== 'admin_dinas'
  ) {
    const { redirect } = await import('next/navigation');
    redirect('/admin');
  }

  return (
    <main className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Modul Rantai Pasok & Stok Gudang SPPG</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Monitor kebutuhan bahan baku, posisi stok gudang real-time, status alert stok kritis, transaksi pasokan, dan direktori vendor/pemasok aktif.
          </p>
        </div>
      </div>

      <SupplyChainClientUI 
        initialData={supplyChainList} 
        sppgList={sppgList}
        jenisPanganList={jenisPanganList}
        pemasokList={pemasokList}
        inventorySummary={inventorySummary}
        pembelianList={pembelianList}
        activeSuppliers={activeSuppliers}
      />
    </main>
  );
}
