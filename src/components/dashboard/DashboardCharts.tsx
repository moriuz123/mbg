'use client';

import React, { useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Area
} from 'recharts';

export default function DashboardCharts({ stats }: { stats: any }) {
  // Process Data for Pie Chart (Kemandirian Lokal)
  const pieData = useMemo(() => {
    let dalam = 0;
    let luar = 0;
    
    stats.monthlyCommodityStats.forEach((s: any) => {
      dalam += s.volumeDalam;
      luar += s.volumeLuar;
    });

    if (dalam === 0 && luar === 0) {
      return [{ name: 'Belum Ada Data', value: 1 }];
    }

    return [
      { name: 'Pemasok Lokal (Dalam Lebak)', value: dalam },
      { name: 'Pemasok Luar Daerah', value: luar }
    ];
  }, [stats]);

  const PIE_COLORS = ['#10b981', '#f43f5e', '#cbd5e1']; // Emerald for Local, Rose for Outside

  // Process Data for Trend Chart (Monthly Volume)
  const trendData = useMemo(() => {
    const monthlyMap: Record<string, any> = {};
    
    stats.monthlyCommodityStats.forEach((s: any) => {
      const dateObj = new Date(s.bulan + '-01');
      const monthName = dateObj.toLocaleDateString('id-ID', { month: 'short' });
      const year = dateObj.getFullYear().toString().substring(2);
      const label = `${monthName} '${year}`;
      
      if (!monthlyMap[s.bulan]) {
        monthlyMap[s.bulan] = { name: label, sortBy: s.bulan, 'Beras Lokal': 0, 'Beras Luar': 0, 'Protein Lokal': 0, 'Protein Luar': 0 };
      }
      
      const isBeras = s.namaBahan.toLowerCase().includes('beras');
      
      if (isBeras) {
        monthlyMap[s.bulan]['Beras Lokal'] += s.volumeDalam;
        monthlyMap[s.bulan]['Beras Luar'] += s.volumeLuar;
      } else {
        monthlyMap[s.bulan]['Protein Lokal'] += s.volumeDalam;
        monthlyMap[s.bulan]['Protein Luar'] += s.volumeLuar;
      }
    });

    return Object.values(monthlyMap).sort((a: any, b: any) => a.sortBy.localeCompare(b.sortBy));
  }, [stats]);

  // Format Y-Axis numbers (e.g. 15000 -> 15K)
  const formatYAxis = (tickItem: number) => {
    if (tickItem === 0) return '0';
    if (tickItem >= 1000) return `${(tickItem / 1000).toFixed(0)}k`;
    return tickItem.toString();
  };

  const formatTooltip = (value: number) => {
    return [new Intl.NumberFormat('id-ID').format(value) + ' Kg', ''];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-2">
      
      {/* 1. Tren Serapan Komoditas (Line/Bar Chart) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm lg:col-span-2">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-800">Tren Suplai Rantai Pasok (6 Bulan Terakhir)</h3>
          <p className="text-xs text-slate-500 mt-1">Perbandingan volume beras dan protein (Lokal vs Luar).</p>
        </div>
        
        <div className="h-[300px] w-full">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={formatYAxis} />
                <Tooltip formatter={formatTooltip} cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                
                <Bar dataKey="Beras Lokal" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} barSize={32} />
                <Bar dataKey="Beras Luar" stackId="a" fill="#34d399" radius={[4, 4, 0, 0]} opacity={0.5} />
                
                <Line type="monotone" dataKey="Protein Lokal" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Protein Luar" stroke="#93c5fd" strokeWidth={3} strokeDasharray="5 5" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 font-medium">Belum ada data bulanan.</div>
          )}
        </div>
      </div>

      {/* 2. Proporsi Kemandirian Pangan (Donut Chart) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
        <div className="mb-2">
          <h3 className="text-base font-bold text-slate-800">Kemandirian Pangan Lokal</h3>
          <p className="text-xs text-slate-500 mt-1">Proporsi serapan komoditas lokal (Lebak) terhadap luar daerah.</p>
        </div>
        
        <div className="flex-1 min-h-[250px] relative w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltip} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Donut Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-emerald-600">
              {pieData[0]?.name === 'Belum Ada Data' ? '0%' : 
                Math.round((pieData[0].value / (pieData[0].value + pieData[1].value)) * 100) + '%'
              }
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Lokal</span>
          </div>
        </div>
        
        {/* Custom Legend */}
        {pieData[0]?.name !== 'Belum Ada Data' && (
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="font-medium text-slate-600">Pemasok Dalam Lebak</span>
              </div>
              <span className="font-bold text-slate-800">{new Intl.NumberFormat('id-ID').format(pieData[0].value)} Kg</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="font-medium text-slate-600">Pemasok Luar Lebak</span>
              </div>
              <span className="font-bold text-slate-800">{new Intl.NumberFormat('id-ID').format(pieData[1].value)} Kg</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
