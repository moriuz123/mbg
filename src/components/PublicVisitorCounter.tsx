'use client';

import React, { useEffect, useState } from 'react';
import { Eye, Users, Activity } from 'lucide-react';
import { getPublicVisitorSummary } from '@/app/actions/visitorStats';

export default function PublicVisitorCounter() {
  const [stats, setStats] = useState<{
    todayCount: number;
    totalCount: number;
    onlineCount: number;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    getPublicVisitorSummary()
      .then((res) => {
        if (isMounted) setStats(res);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  if (!stats) return null;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-white/90">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span><strong>{stats.onlineCount}</strong> Online</span>
      </div>
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-white/90">
        <Eye size={12} className="text-accent-400" />
        <span>Hari Ini: <strong>{stats.todayCount.toLocaleString('id-ID')}</strong></span>
      </div>
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-white/90">
        <Users size={12} className="text-primary-300" />
        <span>Total Kunjungan: <strong>{stats.totalCount.toLocaleString('id-ID')}</strong></span>
      </div>
    </div>
  );
}
