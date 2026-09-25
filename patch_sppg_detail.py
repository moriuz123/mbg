with open('src/app/(public)/sppg/[id]/page.tsx', 'r') as f:
    text = f.read()

import re

# Fix grid col span for the left col
text = text.replace('lg:col-span-3 max-w-2xl mx-auto', 'lg:col-span-1')

# Now add the imports
if "sppgPenerimaManfaat" not in text:
    text = text.replace("import { sppg } from '@/db/schema';", "import { sppg, sppgPenerimaManfaat, sppgPosyanduManfaat } from '@/db/schema';")
if "GraduationCap" not in text:
    text = text.replace("import { MapPin", "import { MapPin, GraduationCap, HeartPulse")

# Add the queries
query_str = """
  if (!data) notFound();

  const sekolahList = await db.query.sppgPenerimaManfaat.findMany({
    where: eq(sppgPenerimaManfaat.sppgId, sppgId),
    with: {
      sekolah: true
    }
  });

  const posyanduList = await db.query.sppgPosyanduManfaat.findMany({
    where: eq(sppgPosyanduManfaat.sppgId, sppgId),
    with: {
      posyandu: true
    }
  });
"""
text = re.sub(r'  if \(\!data\) notFound\(\);\n\n  // Ambil riwayat pengiriman terbaru dari SPPG ini\n  const recentActivities: any\[\] = \[\];', query_str, text, flags=re.DOTALL)
# if my regex doesn't match perfectly, fallback:
text = text.replace('  if (!data) notFound();\n\n  // Ambil riwayat pengiriman terbaru dari SPPG ini\n  const recentActivities: any[] = [];', query_str)

# Now, we need to append the Right Col right after Left Col closes.
right_col_jsx = """
        {/* Right Col: Data Penerima */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 h-full">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Users className="text-primary-600" /> Daftar Penerima Layanan MBG
            </h2>
            
            {sekolahList.length === 0 && posyanduList.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <Users size={48} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-700">Belum Ada Data</h3>
                <p className="text-slate-500 text-sm mt-1">SPPG ini belum memiliki daftar penerima manfaat.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sekolahList.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <GraduationCap size={16} /> Data Sekolah
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sekolahList.map((item) => (
                        <Link href={`/sekolah/${item.sekolahId}`} key={`sek-${item.id}`} className="block">
                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:shadow-md transition-shadow h-full">
                            <h4 className="font-bold text-slate-800 mb-1">{item.sekolah?.namaSekolah}</h4>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>Total: {item.jumlahTotal || (item.jumlahLaki + item.jumlahPerempuan)} Siswa</span>
                              <span className={`px-2 py-0.5 rounded-full ${item.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{item.status}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {posyanduList.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <HeartPulse size={16} /> Data Posyandu
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {posyanduList.map((item) => (
                        <Link href={`/posyandu/${item.posyanduId}`} key={`pos-${item.id}`} className="block">
                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:shadow-md transition-shadow h-full">
                            <h4 className="font-bold text-slate-800 mb-1">{item.posyandu?.namaPosyandu}</h4>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>Balita: {item.posyandu?.jumlahBalita || 0}</span>
                              <span>Bumil: {item.posyandu?.jumlahBumil || 0}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
"""

text = re.sub(
    r'        </div>\s*</div>\s*</div>\s*\);\s*}',
    f'        </div>\n{right_col_jsx}\n      </div>\n    </div>\n  );\n}}',
    text
)

# Replace <Users with actual import if missing
if "Users" not in text:
    text = text.replace("import { MapPin", "import { MapPin, Users")

with open('src/app/(public)/sppg/[id]/page.tsx', 'w') as f:
    f.write(text)
