'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Users, Home as HomeIcon, ShieldCheck, GraduationCap, HeartPulse, Factory, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
  const { count: totalPenggilingan, ref: refPenggilingan } = useCounter(supplyChainStats?.totalPenggilingan || 0, 2000);
  const { count: totalPemasok, ref: refPemasok } = useCounter(supplyChainStats?.totalPemasok || 0, 2000);
  const { count: totalSekolah, ref: refSekolah } = useCounter(stats.totalSekolah, 2000);
  const { count: totalPosyandu, ref: refPosyandu } = useCounter(stats.totalPosyandu, 2000);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        
        {/* Card 1: Mitra Penggilingan */}
        <div ref={refPenggilingan} className="bg-white p-5 rounded-2xl border border-emerald-100/50 border-t-4 border-t-emerald-500 shadow-lg shadow-emerald-500/5 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative flex flex-col justify-between">
          <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-opacity text-emerald-900">
            <Factory size={100} />
          </div>
          <div>
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 mb-4">
              <Factory size={22} />
            </div>
            <div className="relative z-10 mb-4">
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">{totalPenggilingan}</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-1">Mitra Penggilingan Aktif</p>
            </div>
          </div>
          <Link href="/data-penggilingan" className="relative z-10 flex items-center justify-between bg-slate-50 hover:bg-emerald-50 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors mt-2">
            Lihat Direktori <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Card 2: Pemasok Lokal */}
        <div ref={refPemasok} className="bg-white p-5 rounded-2xl border border-amber-100/50 border-t-4 border-t-amber-500 shadow-lg shadow-amber-500/5 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative flex flex-col justify-between">
          <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-opacity text-amber-900">
            <Package size={100} />
          </div>
          <div>
            <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 mb-4">
              <Package size={22} />
            </div>
            <div className="relative z-10 mb-4">
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">{totalPemasok}</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-1">Pemasok Komoditas</p>
            </div>
          </div>
          <Link href="/rantai-pasok" className="relative z-10 flex items-center justify-between bg-slate-50 hover:bg-amber-50 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-600 hover:text-amber-700 transition-colors mt-2">
            Lihat Rantai Pasok <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Card 3: SPPG */}
        <div ref={refSppg} className="bg-white p-5 rounded-2xl border border-blue-100/50 border-t-4 border-t-blue-500 shadow-lg shadow-blue-500/5 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative flex flex-col justify-between">
          <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-opacity text-blue-900">
            <HomeIcon size={100} />
          </div>
          <div>
            <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 mb-4">
              <HomeIcon size={22} />
            </div>
            <div className="relative z-10 mb-4">
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">{totalSppg}</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-1">Titik Dapur SPPG</p>
            </div>
          </div>
          <Link href="/data-sppg" className="relative z-10 flex items-center justify-between bg-slate-50 hover:bg-blue-50 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-600 hover:text-blue-700 transition-colors mt-2">
            Lihat Lokasi <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Card 4: Sekolah */}
        <div ref={refSekolah} className="bg-white p-5 rounded-2xl border border-indigo-100/50 border-t-4 border-t-indigo-500 shadow-lg shadow-indigo-500/5 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative flex flex-col justify-between">
          <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-opacity text-indigo-900">
            <GraduationCap size={100} />
          </div>
          <div>
            <div className="w-12 h-12 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 mb-4">
              <GraduationCap size={22} />
            </div>
            <div className="relative z-10 mb-3">
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">{totalSekolah}</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-1">Unit Sekolah</p>
            </div>
            <div className="relative z-10 mb-2">
              <div className="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/50 flex justify-between items-center">
                <span className="text-[9px] font-bold text-indigo-600">Total Murid</span>
                <span className="text-[11px] font-black text-indigo-700">{formatNumber(stats.totalSiswa)}</span>
              </div>
            </div>
          </div>
          <Link href="/sekolah" className="relative z-10 flex items-center justify-between bg-slate-50 hover:bg-indigo-50 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-600 hover:text-indigo-700 transition-colors mt-auto">
            Daftar Sekolah <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Card 5: Posyandu */}
        <div ref={refPosyandu} className="bg-white p-5 rounded-2xl border border-rose-100/50 border-t-4 border-t-rose-500 shadow-lg shadow-rose-500/5 hover:shadow-xl hover:shadow-rose-500/10 hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative flex flex-col justify-between">
          <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-opacity text-rose-900">
            <HeartPulse size={100} />
          </div>
          <div>
            <div className="w-12 h-12 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 mb-4">
              <HeartPulse size={22} />
            </div>
            <div className="relative z-10 mb-3">
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">{totalPosyandu}</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-1">Unit Posyandu</p>
            </div>
            <div className="relative z-10 mb-2">
              <div className="grid grid-cols-3 gap-1">
                <div className="flex flex-col items-center bg-rose-50/50 border border-rose-100/30 rounded py-1">
                  <span className="text-[8px] font-bold text-rose-500 mb-0.5">Bumil</span>
                  <span className="text-[10px] font-black text-rose-700">{formatNumber(stats.totalBumil || 0)}</span>
                </div>
                <div className="flex flex-col items-center bg-rose-50/50 border border-rose-100/30 rounded py-1">
                  <span className="text-[8px] font-bold text-rose-500 mb-0.5">Busui</span>
                  <span className="text-[10px] font-black text-rose-700">{formatNumber(stats.totalBusui || 0)}</span>
                </div>
                <div className="flex flex-col items-center bg-rose-50/50 border border-rose-100/30 rounded py-1">
                  <span className="text-[8px] font-bold text-rose-500 mb-0.5">Balita</span>
                  <span className="text-[10px] font-black text-rose-700">{formatNumber(stats.totalBalita || 0)}</span>
                </div>
              </div>
            </div>
          </div>
          <Link href="/posyandu" className="relative z-10 flex items-center justify-between bg-slate-50 hover:bg-rose-50 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-600 hover:text-rose-700 transition-colors mt-auto">
            Daftar Posyandu <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
