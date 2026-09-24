import { getSppgById, getAssignedSekolah } from "@/app/actions/sppg";
import { getSekolah } from "@/app/(admin)/admin/master-data/sekolah/actions";
import SppgDetailClientUI from "./SppgDetailClientUI";
import { redirect } from "next/navigation";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function SppgDetailPage({ params }: any) {
  const resolvedParams = await params;
  const sppgId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(sppgId)) {
    redirect('/admin/sppg');
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  const userRole = session?.user?.role || 'publik';
  const isAdmin = userRole === 'admin_dinas' || userRole === 'super_admin' || userRole === 'admin';
  const userSppgId = session?.user?.sppgId ? Number(session.user.sppgId) : undefined;

  // Security Check: Operator can only access their own SPPG
  if (!isAdmin && (userRole === 'sppg' || userRole === 'operator_sppg')) {
    if (userSppgId !== sppgId) {
      redirect('/admin?error=unauthorized_sppg');
    }
  }

  const sppgData = await getSppgById(sppgId);
  
  if (!sppgData) {
    redirect('/admin/sppg');
  }

  const assignedSekolah = await getAssignedSekolah(sppgId);
  const allSekolah = await getSekolah();

  // Import Posyandu Actions and active assignments
  const { getAssignedPosyandu, getAllActiveAssignedSekolah, getAllActiveAssignedPosyandu } = await import("@/app/actions/sppg");
  const { db } = await import("@/db");
  const { posyandu } = await import("@/db/schema");
  const { desc } = await import("drizzle-orm");

  const allPosyandu = await db.query.posyandu.findMany({
    orderBy: [desc(posyandu.createdAt)],
  });
  const assignedPosyandu = await getAssignedPosyandu(sppgId);
  
  const allActiveSekolahAssignments = await getAllActiveAssignedSekolah();
  const allActivePosyanduAssignments = await getAllActiveAssignedPosyandu();

  return (
    <main className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Detail SPPG: {sppgData.namaSppg}</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Kelola penerima manfaat (sekolah & posyandu) untuk dapur ini.</p>
        </div>
      </div>

      <SppgDetailClientUI 
        sppg={sppgData} 
        assignedSekolah={assignedSekolah} 
        allSekolah={allSekolah}
        assignedPosyandu={assignedPosyandu}
        allPosyandu={allPosyandu}
        allActiveSekolahAssignments={allActiveSekolahAssignments}
        allActivePosyanduAssignments={allActivePosyanduAssignments}
        isAdmin={isAdmin}
      />
    </main>
  );
}
