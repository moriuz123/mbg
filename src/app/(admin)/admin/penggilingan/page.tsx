import { getPenggilingan } from "@/app/actions/penggilingan";
import { getKecamatan } from "@/app/actions/wilayah";
import PenggilinganClientUI from "./PenggilinganClientUI";

export default async function PenggilinganPage() {
  const initialData = await getPenggilingan();
  const kecamatanList = await getKecamatan();

  return (
    <main className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Penggilingan Gabah</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manajemen data mitra penggilingan gabah di Kabupaten Lebak.</p>
        </div>
      </div>

      <PenggilinganClientUI initialData={initialData} kecamatanList={kecamatanList} />
    </main>
  );
}
