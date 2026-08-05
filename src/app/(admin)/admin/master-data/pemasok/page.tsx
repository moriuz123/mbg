import { getPemasok } from "@/app/actions/masterData";
import PemasokClientUI from "./PemasokClientUI";

export default async function PemasokPage() {
  const data = await getPemasok();

  return (
    <main className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Master Pemasok</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Kelola data vendor, suplier, atau penyedia bahan baku.</p>
        </div>
      </div>

      <PemasokClientUI initialData={data} />
    </main>
  );
}
