'use client';

import React, { useState, useTransition } from 'react';
import { 
  Users, Eye, Clock, Activity, Globe, Smartphone, Laptop, Tablet, 
  ArrowUpRight, ArrowDownRight, Download, RefreshCw, Bot, ShieldCheck, 
  Calendar, Layers, Sparkles, Compass, CheckCircle2, ChevronRight, BarChart2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { AnalyticsSummary, getVisitorAnalytics, exportVisitorLogsCsv } from '@/app/actions/visitorStats';
import toast, { Toaster } from 'react-hot-toast';

interface Props {
  initialData: AnalyticsSummary;
}

const PIE_COLORS = ['#1e5ca8', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

export default function VisitorAnalyticsClient({ initialData }: Props) {
  const [data, setData] = useState<AnalyticsSummary>(initialData);
  const [period, setPeriod] = useState<string>(initialData.period || '7d');
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'crawlers' | 'live'>('overview');
  const [isPending, startTransition] = useTransition();

  const handlePeriodChange = (newPeriod: any) => {
    setPeriod(newPeriod);
    startTransition(async () => {
      try {
        const updated = await getVisitorAnalytics(newPeriod);
        setData(updated);
        toast.success(`Data analitik periode ${getPeriodLabel(newPeriod)} dimuat`);
      } catch (err: any) {
        toast.error('Gagal memperbarui data: ' + (err.message || ''));
      }
    });
  };

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        const updated = await getVisitorAnalytics(period as any);
        setData(updated);
        toast.success('Data analitik berhasil disegarkan!');
      } catch (err: any) {
        toast.error('Gagal memperbarui data: ' + (err.message || ''));
      }
    });
  };

  const handleExportCsv = async () => {
    const toastId = toast.loading('Menyiapkan berkas CSV analitik...');
    try {
      const csvString = await exportVisitorLogsCsv(period);
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `mbg-analitik-pengunjung-${period}-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Laporan CSV berhasil diunduh!', { id: toastId });
    } catch (err: any) {
      toast.error('Gagal mengunduh CSV: ' + (err.message || ''), { id: toastId });
    }
  };

  const getPeriodLabel = (p: string) => {
    switch (p) {
      case 'today': return 'Hari Ini';
      case '7d': return '7 Hari Terakhir';
      case '30d': return '30 Hari Terakhir';
      case 'this_month': return 'Bulan Ini';
      case 'all': return 'Semua Waktu';
      default: return p;
    }
  };

  const humanTrafficPercent = data.totalPageviews + data.totalBotHits > 0
    ? Math.round((data.totalPageviews / (data.totalPageviews + data.totalBotHits)) * 100)
    : 100;

  return (
    <div className="space-y-8 pb-12">
      <Toaster position="top-right" />

      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200">
              <Sparkles size={12} className="text-primary-600" /> Enterprise Analytics Engine
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1" />
              {data.realtimeOnline} Aktif Sekarang
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight font-heading">
            Statistik & Analitik Pengunjung
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Pantau volume pengunjung, tren keterlibatan, sebaran perangkat, dan aktivitas perayap mesin pencari Google.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Period Selector Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            {(['today', '7d', '30d', 'this_month', 'all'] as const).map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                disabled={isPending}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  period === p 
                    ? 'bg-white text-primary-700 shadow-sm font-black' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {getPeriodLabel(p)}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={isPending}
            title="Segarkan Data"
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={isPending ? 'animate-spin text-primary-600' : ''} />
          </button>

          <button
            onClick={handleExportCsv}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Pageviews */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-primary-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Tayangan (Pageviews)</span>
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Eye size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-heading">
              {data.totalPageviews.toLocaleString('id-ID')}
            </span>
            {data.pageviewsGrowth !== 0 && (
              <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-md ${
                data.pageviewsGrowth > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                {data.pageviewsGrowth > 0 ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                {Math.abs(data.pageviewsGrowth)}%
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2">Akumulasi kunjungan manusia periode ini</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500" />
        </div>

        {/* Unique Visitors */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pengunjung Unik</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-heading">
              {data.uniqueVisitors.toLocaleString('id-ID')}
            </span>
            {data.visitorsGrowth !== 0 && (
              <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-md ${
                data.visitorsGrowth > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                {data.visitorsGrowth > 0 ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                {Math.abs(data.visitorsGrowth)}%
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2">Berdasarkan sidik perangkat & sesi anonim</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* Total Sessions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sesi Penjelajahan</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-heading">
              {data.totalSessions.toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({data.uniqueVisitors > 0 ? (data.totalPageviews / data.uniqueVisitors).toFixed(1) : 1} hal/pengunjung)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Durasi aktifitas sesi per pengguna</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500" />
        </div>

        {/* Real-time Online & Bot Ratio */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Trafik Manusia vs Bot</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bot size={20} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black text-slate-900 font-heading">
                {humanTrafficPercent}%
              </span>
              <span className="text-xs font-bold text-emerald-600 ml-1">Manusia</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-600">{data.totalBotHits}</span>
              <span className="text-[11px] block text-slate-400">Rayapan Bot</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${humanTrafficPercent}%` }} />
            <div className="bg-amber-400 h-full" style={{ width: `${100 - humanTrafficPercent}%` }} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'overview'
              ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart2 size={16} /> Tren & Ringkasan Visual
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'pages'
              ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers size={16} /> Halaman Populer & Sumber Trafik
        </button>

        <button
          onClick={() => setActiveTab('crawlers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'crawlers'
              ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bot size={16} /> Audit Perayap Mesin Pencari ({data.botActivity.length})
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'live'
              ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity size={16} /> Live Feed Kunjungan
        </button>
      </div>

      {/* TAB 1: OVERVIEW & CHARTS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Area Chart: Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 font-heading">
                  Tren Kunjungan & Pengunjung Unik
                </h3>
                <p className="text-xs text-slate-500">
                  Perbandingan antara jumlah tayangan halaman (pageviews) dengan jumlah pengunjung individu.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-primary-500" /> Pageviews
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" /> Pengunjung Unik
                </span>
              </div>
            </div>

            <div className="h-[320px] w-full">
              {data.timeline.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e5ca8" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#1e5ca8" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="label" 
                      tick={{ fontSize: 11, fill: '#64748b' }} 
                      stroke="#cbd5e1" 
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#64748b' }} 
                      stroke="#cbd5e1" 
                      allowDecimals={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderColor: '#1e293b', 
                        borderRadius: '0.75rem', 
                        color: '#fff', 
                        fontSize: '12px' 
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pageviews" 
                      name="Pageviews"
                      stroke="#1e5ca8" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#colorPv)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="visitors" 
                      name="Pengunjung Unik"
                      stroke="#10b981" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#colorVis)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  Belum ada rekapan kunjungan pada periode ini
                </div>
              )}
            </div>
          </div>

          {/* Grid 3 Kolom: Perangkat, Browser, OS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Perangkat */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-1 font-heading">Kategori Perangkat</h3>
              <p className="text-xs text-slate-400 mb-4">Proporsi Desktop vs Mobile vs Tablet</p>
              
              <div className="h-[180px] w-full">
                {data.devices.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.devices}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                      >
                        {data.devices.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs">Belum ada data</div>
                )}
              </div>

              <div className="space-y-2 mt-2 pt-2 border-t border-slate-100">
                {data.devices.map((d, idx) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                      <span className="font-semibold text-slate-700">{d.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{d.count} ({d.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Browser */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-1 font-heading">Peramban (Browser)</h3>
              <p className="text-xs text-slate-400 mb-4">Browser populer pengunjung</p>
              
              <div className="space-y-3">
                {data.browsers.map((b, idx) => (
                  <div key={b.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">{b.name}</span>
                      <span className="font-bold text-slate-900">{b.percentage}% ({b.count})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${b.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                {data.browsers.length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-xs">Belum ada data browser</div>
                )}
              </div>
            </div>

            {/* Sistem Operasi */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-1 font-heading">Sistem Operasi (OS)</h3>
              <p className="text-xs text-slate-400 mb-4">Platform OS pengunjung</p>
              
              <div className="space-y-3">
                {data.operatingSystems.map((o, idx) => (
                  <div key={o.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">{o.name}</span>
                      <span className="font-bold text-slate-900">{o.percentage}% ({o.count})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${o.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                {data.operatingSystems.length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-xs">Belum ada data OS</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOP PAGES & REFERRERS */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 font-heading">Top Halaman Paling Ramai</h3>
                <p className="text-xs text-slate-400">Rute publik yang paling sering dikunjungi</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                10 Teratas
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {data.topPages.map((page, idx) => (
                <div key={page.path} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 truncate font-mono">
                        {page.path}
                      </p>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                        <div className="bg-primary-500 h-full rounded-full" style={{ width: `${page.percentage}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-slate-900 block">{page.pageviews.toLocaleString('id-ID')}</span>
                    <span className="text-[11px] text-slate-400">{page.visitors} orang ({page.percentage}%)</span>
                  </div>
                </div>
              ))}
              {data.topPages.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">Belum ada kunjungan halaman</div>
              )}
            </div>
          </div>

          {/* Referrers & Acquisition */}
          <div className="space-y-6">
            {/* Referrer Types */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-1 font-heading">Saluran Akuisisi Trafik</h3>
              <p className="text-xs text-slate-400 mb-4">Bagaimana pengunjung menemukan situs ini</p>
              
              <div className="space-y-3">
                {data.referrerTypes.map((rt) => (
                  <div key={rt.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-primary-600">
                        <Compass size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{rt.name}</p>
                        <p className="text-[11px] text-slate-500">{rt.count} kunjungan</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg">
                      {rt.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Referring Domains */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-1 font-heading">Domain Rujukan Teratas</h3>
              <p className="text-xs text-slate-400 mb-4">Sumber web luar yang mengirim pengunjung</p>

              <div className="space-y-2">
                {data.topReferrers.map((tr) => (
                  <div key={tr.name} className="flex items-center justify-between text-xs py-2 border-b border-slate-100 last:border-none">
                    <span className="font-semibold text-slate-700 font-mono">{tr.name}</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {tr.count} sesi ({tr.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SEARCH ENGINE CRAWLER & BOT AUDIT */}
      {activeTab === 'crawlers' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 font-heading">
                  Audit Perayapan Mesin Pencari (SEO Crawlers)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Rekaman resmi bot mesin pencari (Googlebot, Bingbot, dll) yang merayapi dan mengindeks halaman MBG Lebak.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-600 font-heading">{data.totalBotHits}</span>
              <span className="text-xs text-slate-400 block">Total Rayapan Bot Terdeteksi</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Nama Mesin Pencari / Bot</th>
                  <th className="py-3 px-4">Frekuensi Rayapan (Hits)</th>
                  <th className="py-3 px-4">Terakhir Aktif</th>
                  <th className="py-3 px-4 rounded-r-xl">Contoh Halaman Terakhir Ditelusuri</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.botActivity.map((bot) => (
                  <tr key={bot.botName} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      {bot.botName}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-bold">
                        {bot.hits} kali
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{bot.lastActive}</td>
                    <td className="py-3 px-4 text-primary-600 font-mono font-medium">{bot.samplePath}</td>
                  </tr>
                ))}
                {data.botActivity.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      Belum ada aktivitas crawler bot terdeteksi pada periode ini. Pastikan sitemap.xml sudah terdaftar di Google Search Console.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE RECENT VISITOR FEED */}
      {activeTab === 'live' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-lg font-bold text-slate-800 font-heading">
                  Feed Kunjungan Terkini (50 Terakhir)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Aliran aktivitas real-time pengunjung publik dengan perlindungan privasi IP termasker.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <RefreshCw size={12} className={isPending ? 'animate-spin' : ''} /> Segarkan Feed
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-3 rounded-l-xl">Waktu</th>
                  <th className="py-3 px-3">Halaman (Path)</th>
                  <th className="py-3 px-3">Tipe</th>
                  <th className="py-3 px-3">Perangkat / OS</th>
                  <th className="py-3 px-3">Peramban</th>
                  <th className="py-3 px-3">Sumber Rujukan</th>
                  <th className="py-3 px-3 rounded-r-xl">IP (Masked)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {data.recentVisitors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {v.createdAt}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-primary-700 font-semibold">{v.path}</span>
                      {v.title && <span className="block text-[11px] text-slate-400 truncate max-w-xs">{v.title}</span>}
                    </td>
                    <td className="py-2.5 px-3">
                      {v.isBot ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Bot: {v.botName || 'Crawler'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Manusia
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 capitalize">
                      {v.device} • {v.os || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {v.browser || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 truncate max-w-[150px]">
                      {v.referrerDomain || 'Direct'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                      {v.ipAddress || '127.0.0.xxx'}
                    </td>
                  </tr>
                ))}
                {data.recentVisitors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Belum ada data kunjungan yang tercatat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
