const fs = require('fs');
let code = fs.readFileSync('src/components/PengawasanClient.tsx', 'utf8');

// Update props to include analyticsData
code = code.replace(
  /userSppgId\n\}: any\)/,
  `userSppgId,\n  analyticsData\n}: any)`
);

// Update activeTab type and default state if isAdmin
code = code.replace(
  /const \[activeTab, setActiveTab\] = useState\<'stok' \| 'pembelian' \| 'pemakaian' \| 'uji'\>\('stok'\);/,
  `const [activeTab, setActiveTab] = useState<'stok' | 'pembelian' | 'pemakaian' | 'uji' | 'analitik'>(isAdmin ? 'analitik' : 'stok');`
);

// Add Analitik Tab button
const buttonPattern = `<div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex-wrap sm:flex-nowrap gap-1">`;
const analitikButton = `
        {isAdmin && (
          <button
            onClick={() => setActiveTab('analitik')}
            className={\`px-4 py-3 text-sm font-bold transition-all border-b-2 \${activeTab === 'analitik' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}\`}
          >
            Laporan Analitik SPPG
          </button>
        )}
`;
code = code.replace(buttonPattern, buttonPattern + analitikButton);

// Add Analitik rendering
const contentPattern = `{activeTab === 'stok' && (`;
const analitikContent = `
      {activeTab === 'analitik' && isAdmin && analyticsData && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="p-2 bg-primary-100 text-primary-600 rounded-xl">📊</span>
              Analitik Kapasitas & Pemetaan Sumber Pangan
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-sm font-bold text-slate-500 mb-1">Total Volume Pembelian</div>
                <div className="text-3xl font-black text-emerald-700">{analyticsData.totalPembelianVolume?.toLocaleString('id-ID')} <span className="text-sm font-medium">Kg</span></div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-sm font-bold text-slate-500 mb-1">Total Realisasi Pemakaian</div>
                <div className="text-3xl font-black text-amber-600">{analyticsData.totalPemakaianVolume?.toLocaleString('id-ID')} <span className="text-sm font-medium">Kg</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">📍 Serapan Pemasok Dalam Lebak</h3>
                <div className="text-4xl font-black text-primary-600 mb-2">{analyticsData.volumeDalamLebak?.toLocaleString('id-ID')} <span className="text-lg font-medium text-slate-500">Kg</span></div>
                <div className="text-sm font-bold text-slate-500 mb-3">{analyticsData.persentaseLokal}% dari total pembelian</div>
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
                  <div className="font-bold mb-2">Daftar Pemasok Lokal:</div>
                  <ul className="list-disc pl-4 space-y-1">
                    {analyticsData.pemasokDalamLebak?.map((p: string, i: number) => <li key={i}>{p}</li>)}
                    {(!analyticsData.pemasokDalamLebak || analyticsData.pemasokDalamLebak.length === 0) && <li>Belum ada data</li>}
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">🚛 Pasokan Luar Lebak</h3>
                <div className="text-4xl font-black text-slate-700 mb-2">{analyticsData.volumeLuarLebak?.toLocaleString('id-ID')} <span className="text-lg font-medium text-slate-500">Kg</span></div>
                <div className="text-sm font-bold text-slate-500 mb-3">{100 - Number(analyticsData.persentaseLokal)}% dari total pembelian</div>
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
                  <div className="font-bold mb-2">Daftar Pemasok Luar Daerah:</div>
                  <ul className="list-disc pl-4 space-y-1">
                    {analyticsData.pemasokLuarLebak?.map((p: string, i: number) => <li key={i}>{p}</li>)}
                    {(!analyticsData.pemasokLuarLebak || analyticsData.pemasokLuarLebak.length === 0) && <li>Belum ada data</li>}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-700 mb-4 border-b pb-2 flex items-center gap-2">
                <span className="p-1.5 bg-red-100 text-red-600 rounded-lg">🚨</span>
                Tracking Hasil Uji Rapid Bermasalah
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <th className="p-3">Tanggal Uji</th>
                      <th className="p-3">Dapur SPPG</th>
                      <th className="p-3">Bahan / Pemasok</th>
                      <th className="p-3">Parameter / Hasil</th>
                      <th className="p-3 text-red-600">Tindakan Lanjut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.ujiBermasalah?.map((uji: any) => (
                      <tr key={uji.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3 font-medium">{new Date(uji.tanggalUji).toLocaleDateString('id-ID')}</td>
                        <td className="p-3">{uji.sppgNama}</td>
                        <td className="p-3">
                          <div className="font-bold">{uji.bahan}</div>
                          <div className="text-xs text-slate-500">{uji.pemasok}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-slate-700">{uji.parameter}</div>
                          <div className="text-xs font-bold text-red-500 bg-red-50 inline-block px-2 py-0.5 rounded">{uji.hasil}</div>
                        </td>
                        <td className="p-3 font-bold text-red-700">{uji.tindakan}</td>
                      </tr>
                    ))}
                    {(!analyticsData.ujiBermasalah || analyticsData.ujiBermasalah.length === 0) && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-500 font-medium bg-emerald-50/30">
                          🎉 Luar biasa! Tidak ada laporan bahan berbahaya atau diretur. Semua hasil uji aman.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'stok' && (
`;
code = code.replace(contentPattern, analitikContent);

fs.writeFileSync('src/components/PengawasanClient.tsx', code);
