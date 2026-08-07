'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Users, Home as HomeIcon, ShieldCheck, GraduationCap, HeartPulse } from 'lucide-react';

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
      
      // Easing function (easeOutExpo)
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

export default function AnimatedStats({ stats }: { stats: any }) {
  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const { count: totalPenerima, ref: refPenerima } = useCounter(stats.totalPenerima, 2500);
  const { count: totalSppg, ref: refSppg } = useCounter(stats.totalSppg, 2000);
  const { count: totalSekolah, ref: refSekolah } = useCounter(stats.totalSekolah, 2000);
  const { count: totalPosyandu, ref: refPosyandu } = useCounter(stats.totalPosyandu, 2000);
  const { count: keamananPangan, ref: refKeamanan } = useCounter(stats.keamananPangan, 2000);
  const { count: realisasi, ref: refRealisasi } = useCounter(stats.realisasiPengiriman, 2500);

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-center">
      <div className="lg:w-1/3" ref={refRealisasi}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 font-semibold text-sm mb-6 border border-primary-100">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
          </span>
          Live Monitoring
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">Dampak Nyata Program</h2>
        <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
          Pemantauan data secara real-time memastikan bahwa setiap porsi makanan sampai ke tangan anak-anak yang membutuhkan dengan aman dan tepat waktu.
        </p>
        
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-700 ease-out"></div>
          <div className="flex justify-between items-end mb-4">
            <span className="font-bold text-slate-700 text-lg">Realisasi Pengiriman Hari Ini</span>
            <span className="text-4xl font-black text-primary-600 tracking-tighter">{realisasi}%</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full relative transition-all duration-1000 ease-out"
              style={{ width: `${realisasi}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-2/3 w-full">
        <div className="grid sm:grid-cols-2 gap-8">
          
          {/* Card 1 */}
          <div ref={refPenerima} className="bg-white p-10 rounded-2xl border border-slate-100 shadow-2xl shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 group-hover:scale-110 group-hover:-rotate-6 transform origin-center">
              <Users size={180} />
            </div>
            <div>
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-8 relative z-10 ring-4 ring-emerald-50 shadow-inner group-hover:scale-110 transition-transform">
                <Users size={32} />
              </div>
              <h3 className="text-6xl font-black text-slate-900 mb-2 relative z-10 tracking-tighter">{formatNumber(totalPenerima)}</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-8 relative z-10">Penerima Manfaat</p>
            </div>
            <div className="flex flex-wrap gap-2 relative z-10">
              {stats.breakdownPenerima?.map((b: any, idx: number) => (
                <span key={idx} className="px-4 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-full border border-slate-200 hover:bg-slate-100 transition-colors">
                  {b.kategori}: {formatNumber(b.totalSiswa)}
                </span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Card 2: Titik Dapur */}
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

            {/* Card 3: Sekolah */}
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

            {/* Card 4: Posyandu */}
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

            {/* Card 5: Uji Rapid */}
            <div ref={refKeamanan} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-500 group overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck size={80} />
              </div>
              <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform mb-4">
                <ShieldCheck size={24} />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tighter">{keamananPangan}%</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Uji Rapid Aman</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
