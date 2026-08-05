import { getJenisPangan } from "@/app/actions/masterData";
import JenisPanganClientUI from "./JenisPanganClientUI";

export default async function JenisPanganPage() {
  const data = await getJenisPangan();

  return (
    <main className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Master Jenis Pangan</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Kelola data bahan baku untuk rantai pasok dapur SPPG.</p>
        </div>
      </div>

      <JenisPanganClientUI initialData={data} />
    </main>
  );
}
