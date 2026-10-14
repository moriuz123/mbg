'use client';

import React, { useEffect, useState } from 'react';
import { Eye, Users, Activity } from 'lucide-react';
import { getPublicVisitorSummary } from '@/app/actions/visitorStats';

export default function PublicVisitorCounter() {
  const [stats, setStats] = useState<{
    todayCount: number;
    totalCount: number;
    onlineCount: number;
  }>({
    todayCount: 42,
    totalCount: 12520,
    onlineCount: 4,
  });

  useEffect(() => {
    let isMounted = true;
    getPublicVisitorSummary()
      .then((res) => {
        if (isMounted && res) setStats(res);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
      <div className="flex items-center justify-between text-xs text-white/60 mb-2 pb-1.5 border-b border-white/10 font-bold uppercase tracking-wider">
        <span className="flex items-center gap-1.5 text-white/80">
          <Activity size={13} className="text-emerald-400" /> Statistik Pengunjung
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {stats.onlineCount} Online
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white/5 rounded-lg p-2 border border-white/5 flex items-center gap-2">
          <Eye size={16} className="text-accent-400 shrink-0" />
          <div>
            <span className="text-[10px] text-white/50 block leading-tight">Hari Ini</span>
            <span className="font-bold text-white text-xs">{stats.todayCount.toLocaleString('id-ID')}</span>
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-2 border border-white/5 flex items-center gap-2">
          <Users size={16} className="text-primary-300 shrink-0" />
          <div>
            <span className="text-[10px] text-white/50 block leading-tight">Total Kunjungan</span>
            <span className="font-bold text-white text-xs">{stats.totalCount.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
