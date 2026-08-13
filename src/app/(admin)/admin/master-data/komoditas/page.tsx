import { getKomoditas } from "@/app/actions/masterData";
import KomoditasClientUI from "./KomoditasClientUI";

export default async function KomoditasPage() {
  const data = await getKomoditas();

  return (
    <main className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Master Komoditas</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Kelola data komoditas bahan baku untuk rantai pasok dapur SPPG.</p>
        </div>
      </div>

      <KomoditasClientUI initialData={data} />
    </main>
  );
}
