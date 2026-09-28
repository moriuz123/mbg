"use client";
import React, { useState } from 'react';
import { Users, GraduationCap, HeartPulse } from 'lucide-react';
import Link from 'next/link';

export default function SppgPenerimaClient({ sekolahList, posyanduList }: { sekolahList: any[], posyanduList: any[] }) {
  const [currentPageSekolah, setCurrentPageSekolah] = useState(1);
  const [currentPagePosyandu, setCurrentPagePosyandu] = useState(1);
  const itemsPerPage = 8;

  const paginatedSekolah = sekolahList.slice((currentPageSekolah - 1) * itemsPerPage, currentPageSekolah * itemsPerPage);
  const totalPagesSekolah = Math.ceil(sekolahList.length / itemsPerPage);

  const paginatedPosyandu = posyanduList.slice((currentPagePosyandu - 1) * itemsPerPage, currentPagePosyandu * itemsPerPage);
  const totalPagesPosyandu = Math.ceil(posyanduList.length / itemsPerPage);

  return (
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
        <div className="space-y-10">
          {sekolahList.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2"><GraduationCap size={16} /> Data Sekolah</span>
                <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded-full text-slate-500">{sekolahList.length} Total</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedSekolah.map((item) => (
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
              
              {/* Pagination Sekolah */}
              {totalPagesSekolah > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button 
                    onClick={() => setCurrentPageSekolah(p => Math.max(1, p - 1))}
                    disabled={currentPageSekolah === 1}
                    className="px-3 py-1 rounded-md text-sm border border-slate-200 disabled:opacity-50 hover:bg-slate-50 font-medium"
                  >
                    Prev
                  </button>
                  <span className="text-sm font-semibold text-slate-600">
                    {currentPageSekolah} / {totalPagesSekolah}
                  </span>
                  <button 
                    onClick={() => setCurrentPageSekolah(p => Math.min(totalPagesSekolah, p + 1))}
                    disabled={currentPageSekolah === totalPagesSekolah}
                    className="px-3 py-1 rounded-md text-sm border border-slate-200 disabled:opacity-50 hover:bg-slate-50 font-medium"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {posyanduList.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2"><HeartPulse size={16} /> Data Posyandu</span>
                <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded-full text-slate-500">{posyanduList.length} Total</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedPosyandu.map((item) => (
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

              {/* Pagination Posyandu */}
              {totalPagesPosyandu > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button 
                    onClick={() => setCurrentPagePosyandu(p => Math.max(1, p - 1))}
                    disabled={currentPagePosyandu === 1}
                    className="px-3 py-1 rounded-md text-sm border border-slate-200 disabled:opacity-50 hover:bg-slate-50 font-medium"
                  >
                    Prev
                  </button>
                  <span className="text-sm font-semibold text-slate-600">
                    {currentPagePosyandu} / {totalPagesPosyandu}
                  </span>
                  <button 
                    onClick={() => setCurrentPagePosyandu(p => Math.min(totalPagesPosyandu, p + 1))}
                    disabled={currentPagePosyandu === totalPagesPosyandu}
                    className="px-3 py-1 rounded-md text-sm border border-slate-200 disabled:opacity-50 hover:bg-slate-50 font-medium"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
