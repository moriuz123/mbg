import { getPenggilingan } from "@/app/actions/penggilingan";
import { getKecamatan } from "@/app/actions/wilayah";
import PenggilinganClientUI from "./PenggilinganClientUI";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PenggilinganPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user?.role;
  const isAdmin = role === 'admin_dinas' || role === 'super_admin' || role === 'admin';

  // Security & UX: Operator Penggilingan gets redirected directly to their own milling unit detail page
  if (!isAdmin && role === 'operator_penggilingan') {
    const penggilinganId = session?.user?.penggilinganId;
    if (penggilinganId) {
      redirect(`/admin/penggilingan/${penggilinganId}`);
    }
  }

  const initialData = await getPenggilingan();
  const kecamatanList = await getKecamatan();
  const { getDesa } = await import('@/app/actions/wilayah');
  const desaList = await getDesa();

  return (
    <main className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Penggilingan Gabah</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manajemen data mitra penggilingan gabah di Kabupaten Lebak.</p>
        </div>
      </div>

      <PenggilinganClientUI initialData={initialData} kecamatanList={kecamatanList} desaList={desaList} isAdmin={isAdmin} />
    </main>
  );
}
