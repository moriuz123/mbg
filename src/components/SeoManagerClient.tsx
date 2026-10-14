'use client';

import React, { useState, useMemo } from 'react';
import { 
  Globe, Search, Share2, ShieldCheck, CheckCircle2, AlertTriangle, 
  ExternalLink, UploadCloud, Save, Sparkles, Smartphone, Monitor, 
  Bot, Tag, FileText, Code2, RefreshCw, BarChart
} from 'lucide-react';
import { SeoSettingsMap, updateSeoSettings } from '@/app/actions/seoSettings';
import { uploadFile } from '@/app/actions/upload';
import toast, { Toaster } from 'react-hot-toast';

interface Props {
  initialSettings: SeoSettingsMap;
}

export default function SeoManagerClient({ initialSettings }: Props) {
  const [form, setForm] = useState<SeoSettingsMap>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'main' | 'social' | 'indexing' | 'analytics' | 'schema'>('main');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Dynamic Audit Score calculation
  const seoAudit = useMemo(() => {
    let score = 0;
    const checks: { title: string; passed: boolean; tip: string }[] = [];

    // 1. Title Check (15 pts)
    const titleLen = form.seo_meta_title.trim().length;
    const titlePassed = titleLen >= 40 && titleLen <= 70;
    if (titlePassed) score += 15;
    else if (titleLen > 0) score += 8;
    checks.push({
      title: 'Judul Meta (Title Tag)',
      passed: titlePassed,
      tip: titleLen === 0 
        ? 'Wajib diisi.' 
        : titleLen < 40 
          ? `Terlalu pendek (${titleLen} karakter). Idealnya 50-65 karakter.` 
          : titleLen > 70 
            ? `Terlalu panjang (${titleLen} karakter). Berpotensi terpotong di Google.` 
            : `Panjang ideal (${titleLen} karakter).`,
    });

    // 2. Description Check (15 pts)
    const descLen = form.seo_meta_description.trim().length;
    const descPassed = descLen >= 100 && descLen <= 170;
    if (descPassed) score += 15;
    else if (descLen > 0) score += 8;
    checks.push({
      title: 'Deskripsi Meta (Meta Description)',
      passed: descPassed,
      tip: descLen === 0 
        ? 'Wajib diisi.' 
        : descLen < 100 
          ? `Terlalu pendek (${descLen} karakter). Disarankan minimal 120 karakter.` 
          : descLen > 170 
            ? `Terlalu panjang (${descLen} karakter). Idealnya 120-160 karakter.` 
            : `Panjang optimal (${descLen} karakter).`,
    });

    // 3. Keywords Check (10 pts)
    const keywordsCount = form.seo_meta_keywords.split(',').filter(k => k.trim()).length;
    const kwPassed = keywordsCount >= 4;
    if (kwPassed) score += 10;
    else if (keywordsCount > 0) score += 5;
    checks.push({
      title: 'Kata Kunci (Meta Keywords)',
      passed: kwPassed,
      tip: `${keywordsCount} kata kunci terpasang. Idealnya 5-10 kata kunci relevan.`,
    });

    // 4. Canonical URL (15 pts)
    const canonicalPassed = form.seo_canonical_url.startsWith('http://') || form.seo_canonical_url.startsWith('https://');
    if (canonicalPassed) score += 15;
    checks.push({
      title: 'URL Kanonikal Utama',
      passed: canonicalPassed,
      tip: canonicalPassed ? 'URL kanonikal valid.' : 'Gunakan URL lengkap dengan https://.',
    });

    // 5. Open Graph Image (15 pts)
    const ogImgPassed = Boolean(form.seo_og_image && form.seo_og_image.trim().length > 3);
    if (ogImgPassed) score += 15;
    checks.push({
      title: 'Gambar Banner Open Graph (Social Preview)',
      passed: ogImgPassed,
      tip: ogImgPassed ? 'Gambar banner medsos tersedia.' : 'Wajib diunggah agar preview WhatsApp/Facebook menarik.',
    });

    // 6. Open Graph Title & Description (10 pts)
    const ogMetaPassed = Boolean(form.seo_og_title.trim() && form.seo_og_description.trim());
    if (ogMetaPassed) score += 10;
    checks.push({
      title: 'Konten Open Graph Medsos',
      passed: ogMetaPassed,
      tip: ogMetaPassed ? 'Judul & deskripsi Open Graph terisi.' : 'Lengkapi judul dan deskripsi media sosial.',
    });

    // 7. Search Console Verification (10 pts)
    const gscPassed = Boolean(form.seo_google_verification && form.seo_google_verification.trim().length > 5);
    if (gscPassed) score += 10;
    checks.push({
      title: 'Verifikasi Google Search Console',
      passed: gscPassed,
      tip: gscPassed ? 'Kode verifikasi terpasang.' : 'Pasang kode verifikasi dari Google Search Console.',
    });

    // 8. Robots Directives (10 pts)
    const robotsPassed = form.seo_robots_index.includes('index');
    if (robotsPassed) score += 10;
    checks.push({
      title: 'Direktif Indeksasi Robot',
      passed: robotsPassed,
      tip: robotsPassed ? 'Situs diizinkan untuk diindeks oleh mesin pencari.' : 'Peringatan: situs dalam mode noindex!',
    });

    return {
      score,
      checks,
      rating: score >= 85 ? 'Sangat Optimal (Enterprise Ready)' : score >= 60 ? 'Cukup Baik' : 'Perlu Optimasi',
      badgeColor: score >= 85 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : score >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200',
    };
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading('Mengunggah gambar Open Graph...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadFile(formData);
      setForm(prev => ({ ...prev, seo_og_image: res.url }));
      toast.success('Gambar Open Graph berhasil diunggah!', { id: toastId });
    } catch (err: any) {
      toast.error('Gagal mengunggah: ' + (err.message || ''), { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading('Menyimpan konfigurasi SEO...');
    try {
      await updateSeoSettings(form);
      toast.success('Konfigurasi SEO berhasil disimpan & metadata diperbarui!', { id: toastId });
    } catch (err: any) {
      toast.error('Gagal menyimpan SEO: ' + (err.message || ''), { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  // Keywords as tags
  const keywordsList = form.seo_meta_keywords
    .split(',')
    .map(k => k.trim())
    .filter(Boolean);

  return (
    <div className="space-y-8 pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200">
              <Globe size={12} className="text-primary-600" /> Enterprise SEO Suite
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border ${seoAudit.badgeColor}`}>
              Skor SEO: {seoAudit.score}/100 • {seoAudit.rating}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight font-heading">
            Konfigurasi SEO & Indeksasi Mesin Pencari
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Optimalkan visibilitas portal MBG di Google, Bing, pratinjau media sosial, sitemap otomatis, dan data terstruktur Schema.org.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors shadow-md shadow-primary-500/20 disabled:opacity-50 shrink-0"
        >
          <Save size={16} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan SEO'}
        </button>
      </div>

      {/* SEO Health & Live Simulators Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SEO Health Score Card (4 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 font-heading">
              <Sparkles size={18} className="text-amber-500" /> Skor Audit SEO Otomatis
            </h2>
            <span className="text-2xl font-black text-primary-700 font-heading">
              {seoAudit.score}%
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                seoAudit.score >= 85 ? 'bg-emerald-500' : seoAudit.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${seoAudit.score}%` }}
            />
          </div>

          <div className="divide-y divide-slate-100 pt-2 space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {seoAudit.checks.map((c) => (
              <div key={c.title} className="pt-2 flex items-start gap-2.5 text-xs">
                {c.passed ? (
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-bold ${c.passed ? 'text-slate-800' : 'text-amber-900'}`}>
                    {c.title}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{c.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live SERP & Social Preview Simulator (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Search size={18} className="text-primary-600" />
              <h2 className="text-base font-bold text-slate-800 font-heading">
                Pratinjau Langsung (Live SERP & Social Preview)
              </h2>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded flex items-center gap-1 font-bold ${previewDevice === 'desktop' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
              >
                <Monitor size={14} /> Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded flex items-center gap-1 font-bold ${previewDevice === 'mobile' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
              >
                <Smartphone size={14} /> Mobile
              </button>
            </div>
          </div>

          {/* Google SERP Card */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              1. Tampilan Hasil Pencarian Google (SERP Simulator)
            </span>
            <div className={`p-4 rounded-xl border border-slate-200 bg-white shadow-sm font-sans ${previewDevice === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
              <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-primary-600">
                  G
                </div>
                <div className="truncate text-[12px] text-slate-700">
                  {form.seo_canonical_url.replace(/^https?:\/\//, '')}
                  <span className="text-slate-400"> › beranda</span>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-2">
                {form.seo_meta_title || 'Judul Meta Website Belum Diisi'}
              </h3>
              <p className="text-xs sm:text-sm text-[#4d5156] mt-1 line-clamp-2 leading-relaxed">
                {form.seo_meta_description || 'Deskripsi meta halaman belum diisi. Google akan menampilkan cuplikan otomatis dari teks halaman jika bagian ini dibiarkan kosong.'}
              </p>
            </div>
          </div>

          {/* WhatsApp / Social Media Share Card */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              2. Pratinjau Tautan WhatsApp / Media Sosial (Open Graph Card)
            </span>
            <div className="max-w-md rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shadow-sm">
              <div className="h-36 sm:h-44 bg-slate-200 relative overflow-hidden flex items-center justify-center">
                {form.seo_og_image ? (
                  <img 
                    src={form.seo_og_image} 
                    alt="Open Graph Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-400 text-xs flex flex-col items-center gap-1">
                    <Share2 size={24} />
                    <span>Belum ada gambar banner Open Graph</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-white border-t border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {form.seo_canonical_url.replace(/^https?:\/\//, '').split('/')[0]}
                </span>
                <p className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">
                  {form.seo_og_title || form.seo_meta_title || 'Sistem MBG Lebak'}
                </p>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {form.seo_og_description || form.seo_meta_description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Form Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('main')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'main'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText size={16} /> Metadata Utama
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'social'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Share2 size={16} /> Open Graph & Medsos
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('indexing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'indexing'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bot size={16} /> Mesin Pencari & Verifikasi
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'analytics'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart size={16} /> Analitik & Counter
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'schema'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Code2 size={16} /> Peta Situs & Schema.org
        </button>
      </div>

      {/* TAB CONTENT */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
        {/* TAB 1: METADATA UTAMA */}
        {activeTab === 'main' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold text-slate-800">
                  Judul Meta Utama (Title Tag) <span className="text-red-500">*</span>
                </label>
                <span className={`text-xs font-mono font-bold ${
                  form.seo_meta_title.length >= 40 && form.seo_meta_title.length <= 70 
                    ? 'text-emerald-600' 
                    : 'text-amber-600'
                }`}>
                  {form.seo_meta_title.length}/60 karakter (Rekomendasi: 50-65)
                </span>
              </div>
              <input
                type="text"
                name="seo_meta_title"
                value={form.seo_meta_title}
                onChange={handleChange}
                placeholder="Contoh: Sistem Digitalisasi Supply Chain MBG - Pemerintah Kabupaten Lebak"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Tampil sebagai judul tab peramban dan judul tautan di hasil pencarian Google.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold text-slate-800">
                  Deskripsi Meta (Meta Description) <span className="text-red-500">*</span>
                </label>
                <span className={`text-xs font-mono font-bold ${
                  form.seo_meta_description.length >= 100 && form.seo_meta_description.length <= 170 
                    ? 'text-emerald-600' 
                    : 'text-amber-600'
                }`}>
                  {form.seo_meta_description.length}/160 karakter (Rekomendasi: 120-160)
                </span>
              </div>
              <textarea
                name="seo_meta_description"
                rows={3}
                value={form.seo_meta_description}
                onChange={handleChange}
                placeholder="Deskripsi ringkas yang menjelaskan isi, peran sistem, dan transparansi rantai pasok pangan MBG Lebak..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Ringkasan yang ditampilkan Google di bawah judul hasil penelusuran.
              </p>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800 block mb-1.5">
                Kata Kunci Pencarian (Meta Keywords)
              </label>
              <textarea
                name="seo_meta_keywords"
                rows={2}
                value={form.seo_meta_keywords}
                onChange={handleChange}
                placeholder="MBG Lebak, Makan Bergizi Gratis, SPPG Lebak, Ketahanan Pangan Lebak"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {keywordsList.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                    <Tag size={12} className="text-slate-400" /> {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">Pisahkan setiap kata kunci menggunakan tanda koma (,).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">
                  URL Kanonikal Utama (Canonical URL)
                </label>
                <input
                  type="url"
                  name="seo_canonical_url"
                  value={form.seo_canonical_url}
                  onChange={handleChange}
                  placeholder="https://sdsuci.lebakkab.go.id"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">
                  Penulis / Instansi (Author)
                </label>
                <input
                  type="text"
                  name="seo_author"
                  value={form.seo_author}
                  onChange={handleChange}
                  placeholder="Dinas Ketahanan Pangan Kab. Lebak"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">
                  Penerbit Resmi (Publisher)
                </label>
                <input
                  type="text"
                  name="seo_publisher"
                  value={form.seo_publisher}
                  onChange={handleChange}
                  placeholder="Pemerintah Kabupaten Lebak"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SOCIAL & OPEN GRAPH */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">
                  Judul Open Graph (WhatsApp / Facebook)
                </label>
                <input
                  type="text"
                  name="seo_og_title"
                  value={form.seo_og_title}
                  onChange={handleChange}
                  placeholder="Sistem Digitalisasi Supply Chain MBG - Pemkab Lebak"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">Judul yang muncul tebal saat link dibagikan di WhatsApp.</p>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">
                  Format Kartu Twitter / X
                </label>
                <select
                  name="seo_twitter_card"
                  value={form.seo_twitter_card}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                >
                  <option value="summary_large_image">Summary Large Image (Gambar Besar Rekomendasi)</option>
                  <option value="summary">Summary (Thumbnail Kecil)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800 block mb-1.5">
                Deskripsi Open Graph
              </label>
              <textarea
                name="seo_og_description"
                rows={2}
                value={form.seo_og_description}
                onChange={handleChange}
                placeholder="Transparansi pasokan bahan pangan lokal, pemantauan dapur SPPG, dan distribusi gizi sekolah..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            {/* OG Image Upload */}
            <div>
              <label className="text-sm font-bold text-slate-800 block mb-1.5">
                Banner Gambar Open Graph (Rekomendasi 1200 x 630 piksel)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="text"
                  name="seo_og_image"
                  value={form.seo_og_image}
                  onChange={handleChange}
                  placeholder="/LOGO-LEBAK.png atau tautan URL gambar"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none font-mono"
                />
                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl cursor-pointer transition-colors shrink-0">
                  <UploadCloud size={16} />
                  <span>{isUploading ? 'Mengunggah...' : 'Unggah Banner'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>
              {form.seo_og_image && (
                <div className="mt-3 w-48 h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                  <img src={form.seo_og_image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800 block mb-1.5">
                Akun Twitter / X Resmi
              </label>
              <input
                type="text"
                name="seo_twitter_handle"
                value={form.seo_twitter_handle}
                onChange={handleChange}
                placeholder="@pemkablebak"
                className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 3: INDEXING & VERIFICATION */}
        {activeTab === 'indexing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">
                  Kode Verifikasi Google Search Console
                </label>
                <input
                  type="text"
                  name="seo_google_verification"
                  value={form.seo_google_verification}
                  onChange={handleChange}
                  placeholder="Contoh: google-site-verification=xxxxxxxxx"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none font-mono"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Didapatkan dari menu &ldquo;Pengaturan &gt; Verifikasi Kepemilikan (Tag HTML)&rdquo; di Google Search Console.
                </p>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">
                  Kode Verifikasi Bing Webmaster Tools
                </label>
                <input
                  type="text"
                  name="seo_bing_verification"
                  value={form.seo_bing_verification}
                  onChange={handleChange}
                  placeholder="Contoh: msvalidate.01=xxxxxxxxx"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800 block mb-1.5">
                Instruksi Robot Perayap (Robots Meta Tag)
              </label>
              <select
                name="seo_robots_index"
                value={form.seo_robots_index}
                onChange={handleChange}
                className="w-full max-w-md px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white font-mono"
              >
                <option value="index, follow">index, follow (Situs Aktif & Terindeks Mesin Pencari - Standar Produksi)</option>
                <option value="noindex, nofollow">noindex, nofollow (Jangan Indeks - Gunakan saat Pengujian/Staging)</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Menentukan apakah mesin pencari diizinkan mencantumkan situs ini di penelusuran publik.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS & WIDGET */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-bold text-slate-800 block mb-1.5">
                Google Analytics 4 (GA4 Measurement ID)
              </label>
              <input
                type="text"
                name="seo_google_analytics_id"
                value={form.seo_google_analytics_id}
                onChange={handleChange}
                placeholder="Format: G-XXXXXXXXXX"
                className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none font-mono"
              />
              <p className="text-xs text-slate-500 mt-1">
                Jika diisi, skrip pelacakan resmi Google Analytics 4 akan otomatis disematkan di halaman publik.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-800">Widget Counter Statistik Pengunjung Publik di Footer</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Menampilkan badge jumlah pengunjung hari ini, total kunjungan, dan pengunjung aktif di footer publik.
                </p>
              </div>
              <select
                name="seo_show_visitor_counter"
                value={form.seo_show_visitor_counter}
                onChange={handleChange}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="true">Tampilkan (Aktif)</option>
                <option value="false">Sembunyikan</option>
              </select>
            </div>
          </div>
        )}

        {/* TAB 5: SCHEMA.ORG & SITEMAP */}
        {activeTab === 'schema' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-primary-100 bg-primary-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-primary-900">Peta Situs Otomatis (Dynamic XML Sitemap)</h4>
                <p className="text-xs text-primary-700 mt-0.5">
                  Next.js secara dinamis menyajikan daftar seluruh URL publik lengkap dengan prioritas indeksasi.
                </p>
              </div>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-primary-200 text-primary-700 text-xs font-bold hover:bg-primary-100 transition-colors shrink-0"
              >
                <ExternalLink size={14} /> Buka /sitemap.xml
              </a>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Berkas Robots.txt Dinamis</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mengatur izin akses bot crawler dan mengarahkan otomatis ke berkas sitemap.
                </p>
              </div>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors shrink-0"
              >
                <ExternalLink size={14} /> Buka /robots.txt
              </a>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-2">
                Data Terstruktur Schema.org (JSON-LD Government Organization)
              </h4>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  "name": "Sistem Digitalisasi Supply Chain MBG Lebak",
  "url": form.seo_canonical_url,
  "logo": `${form.seo_canonical_url}/LOGO-LEBAK.png`,
  "department": "Dinas Ketahanan Pangan Kabupaten Lebak",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Rangkasbitung",
    "addressRegion": "Banten",
    "addressCountry": "ID"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${form.seo_canonical_url}/sppg?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
}, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Perubahan konfigurasi SEO berlaku instan pada metadata situs.
          </span>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors shadow-md shadow-primary-500/20 disabled:opacity-50"
          >
            <Save size={16} /> {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan SEO'}
          </button>
        </div>
      </form>
    </div>
  );
}
