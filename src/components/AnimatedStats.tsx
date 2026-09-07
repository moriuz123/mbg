'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Users, Home as HomeIcon, ShieldCheck, GraduationCap, HeartPulse, Factory, Package } from 'lucide-react';

function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return { count, ref };
}

export default function AnimatedStats({ stats, supplyChainStats }: { stats: any, supplyChainStats?: any }) {
  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const { count: totalPenerima, ref: refPenerima } = useCounter(stats.totalPenerima, 2500);
  const { count: totalSppg, ref: refSppg } = useCounter(stats.totalSppg, 2000);
  const { count: totalSekolah, ref: refSekolah } = useCounter(stats.totalSekolah, 2000);
  const { count: totalPosyandu, ref: refPosyandu } = useCounter(stats.totalPosyandu, 2000);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        
        {/* Card 1: Mitra Penggilingan */}
        <div ref={refPenerima} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-500 group overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Factory size={80} />
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform mb-4">
            <Factory size={24} />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tighter">{supplyChainStats?.totalPenggilingan || 0}</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Mitra Penggilingan Aktif</p>
          </div>
        </div>

        {/* Card 2: Pemasok Lokal */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-500 group overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Package size={80} />
          </div>
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform mb-4">
            <Package size={24} />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tighter">{supplyChainStats?.totalPemasok || 0}</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Pemasok Komoditas</p>
          </div>
        </div>

        {/* Card 3: SPPG */}
        <div ref={refSppg} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-500 group overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <HomeIcon size={80} />
          </div>
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform mb-4">
            <HomeIcon size={24} />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tighter">{totalSppg}</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Titik Dapur SPPG</p>
          </div>
        </div>

        {/* Card 4: Sekolah */}
        <div ref={refSekolah} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-500 group overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <GraduationCap size={80} />
          </div>
          <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform mb-4">
            <GraduationCap size={24} />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tighter">{totalSekolah}</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">Sekolah Penerima</p>
            <div className="inline-block bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold">
              {formatNumber(stats.totalSiswa)} Siswa
            </div>
          </div>
        </div>

        {/* Card 5: Posyandu */}
        <div ref={refPosyandu} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-500 group overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <HeartPulse size={80} />
          </div>
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform mb-4">
            <HeartPulse size={24} />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tighter">{totalPosyandu}</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">Posyandu Aktif</p>
            <div className="inline-block bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-bold">
              {formatNumber(stats.totalPosyanduPenerima)} Sasaran
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
