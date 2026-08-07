'use client';

import React, { useState } from 'react';
import { Bell, Clock, X } from 'lucide-react';

export default function PengumumanBadgeClient({ pengumuman }: { pengumuman: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="group flex flex-col p-8 aspect-square rounded-2xl bg-red-600 hover:shadow-2xl hover:shadow-red-500/30 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden text-left border border-red-700">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[4rem] pointer-events-none"></div>
        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 blur-2xl rounded-full pointer-events-none"></div>

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 border border-white/20">
            <Bell size={24} strokeWidth={2} />
          </div>
          <div className="bg-white text-red-600 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            Pengumuman
          </div>
        </div>

        <div className="flex flex-col flex-1 relative z-10">
          {pengumuman ? (
            <>
              <div className="flex items-center gap-2 text-white/50 text-xs font-semibold mb-3">
                <Clock size={12} />
                <span>{new Date(pengumuman.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <h3 className="font-heading font-bold text-white text-xl mb-3 line-clamp-2 leading-snug">{pengumuman.judul}</h3>
              <p className="text-white/70 text-sm font-medium leading-relaxed line-clamp-3 mb-4">
                {pengumuman.isi}
              </p>
              <div className="mt-auto pt-2">
                <button 
                  onClick={() => setIsOpen(true)}
                  className="w-full py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white hover:text-red-600 transition-colors border border-white/20 backdrop-blur-sm"
                >
                  Selengkapnya
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col flex-1 justify-center items-center text-center">
              <h3 className="font-heading font-extrabold text-white text-xl mb-3">Papan Informasi</h3>
              <p className="text-white/60 text-sm font-medium leading-relaxed">Belum ada pengumuman terbaru yang dipublikasikan saat ini.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal / Popup */}
      {isOpen && pengumuman && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Pengumuman Resmi</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                    <Clock size={12} />
                    <span>{new Date(pengumuman.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto">
              <h2 className="font-heading font-extrabold text-2xl text-slate-900 mb-6 leading-snug">
                {pengumuman.judul}
              </h2>
              <div className="prose prose-slate max-w-none">
                {pengumuman.isi.split('\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="text-slate-600 text-base leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
