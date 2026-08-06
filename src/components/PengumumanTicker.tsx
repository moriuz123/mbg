'use client';

import React, { useState, useEffect } from 'react';
import { Megaphone, ChevronRight, X } from 'lucide-react';

export default function PengumumanTicker({ pengumumanList }: { pengumumanList: any[] }) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (pengumumanList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pengumumanList.length);
    }, 5000); // Rotasi setiap 5 detik
    return () => clearInterval(interval);
  }, [pengumumanList]);

  if (!isVisible || pengumumanList.length === 0) return null;

  const activePengumuman = pengumumanList[currentIndex];

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="bg-[#0a2463] text-white border-b border-white/10 relative z-20">
      <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-accent-500 text-[#071840] p-1.5 rounded-lg shrink-0 flex items-center justify-center animate-pulse">
            <Megaphone size={16} />
          </div>
          <div className="flex items-center gap-2 text-sm md:text-base font-medium truncate">
            <span className="shrink-0 font-bold text-accent-500">PENGUMUMAN:</span>
            <span className="truncate">{activePengumuman.judul} — {activePengumuman.isi}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-xs text-white/50 hidden md:block">
            {activePengumuman.createdAt ? formatDate(activePengumuman.createdAt) : '-'}
          </span>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-white/50 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
