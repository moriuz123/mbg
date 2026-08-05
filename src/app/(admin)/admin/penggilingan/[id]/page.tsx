import { getPenggilinganById, getSumberGabah, getProduksi, getDistribusi } from "@/app/actions/penggilingan";
import { getSppg } from "@/app/actions/sppg";
import PenggilinganDetailClientUI from "./PenggilinganDetailClientUI";
import { redirect } from "next/navigation";

export default async function PenggilinganDetailPage({ params }: { params: { id: string } }) {
  const penggilinganId = parseInt(params.id, 10);
  
  if (isNaN(penggilinganId)) {
    redirect('/admin/penggilingan');
  }

  const data = await getPenggilinganById(penggilinganId);
  if (!data) {
    redirect('/admin/penggilingan');
  }

  const sumberGabahList = await getSumberGabah(penggilinganId);
  const produksiList = await getProduksi(penggilinganId);
  const distribusiList = await getDistribusi(penggilinganId);
  const sppgList = await getSppg();

  return (
    <main className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Detail Penggilingan: {data.namaPenggilingan}</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Kelola sumber gabah, produksi, dan distribusi beras.</p>
        </div>
      </div>

      <PenggilinganDetailClientUI 
        penggilingan={data} 
        sumberGabahList={sumberGabahList}
        produksiList={produksiList}
        distribusiList={distribusiList}
        sppgList={sppgList}
      />
    </main>
  );
}
