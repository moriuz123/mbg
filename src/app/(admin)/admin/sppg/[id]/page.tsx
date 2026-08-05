import { getSppgById, getAssignedSekolah } from "@/app/actions/sppg";
import { getSekolah } from "@/app/(admin)/admin/sekolah/actions";
import SppgDetailClientUI from "./SppgDetailClientUI";
import { redirect } from "next/navigation";

export default async function SppgDetailPage({ params }: { params: { id: string } }) {
  const sppgId = parseInt(params.id, 10);
  
  if (isNaN(sppgId)) {
    redirect('/admin/sppg');
  }

  const sppgData = await getSppgById(sppgId);
  
  if (!sppgData) {
    redirect('/admin/sppg');
  }

  const assignedSekolah = await getAssignedSekolah(sppgId);
  const allSekolah = await getSekolah();

  return (
    <main className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Detail SPPG: {sppgData.namaSppg}</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Kelola penerima manfaat (sekolah) untuk dapur ini.</p>
        </div>
      </div>

      <SppgDetailClientUI 
        sppg={sppgData} 
        assignedSekolah={assignedSekolah} 
        allSekolah={allSekolah} 
      />
    </main>
  );
}
