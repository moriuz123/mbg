'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Utensils, 
  HeartPulse, 
  Award, 
  Users, 
  Microscope, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap, 
  Building2, 
  Truck, 
  CheckCircle2, 
  Wheat, 
  Apple, 
  Flame, 
  ArrowRight,
  HelpCircle,
  FileText,
  MapPin,
  Package,
  Activity,
  BarChart2
} from 'lucide-react';
import Link from 'next/link';

export default function TentangClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Mengapa transparansi rantai pasok logistik ini penting?',
      a: 'Transparansi dari hulu ke hilir menjamin bahwa setiap bahan pangan yang digunakan di Dapur SPPG berasal dari Mitra Lokal yang terverifikasi, menjaga kualitas kesegaran makanan, dan memastikan perputaran ekonomi terjadi di wilayah Kabupaten Lebak.'
    },
    {
      q: 'Siapa saja yang terlibat dalam rantai pasok MBG Lebak?',
      a: 'Ekosistem ini melibatkan Petani Lokal, Peternak, Koperasi, Mitra Penggilingan Padi Lokal sebagai penyedia bahan hulu, Dapur Satelit (SPPG) sebagai unit produksi dan kontrol kualitas, serta Armada Logistik untuk distribusi akhir ke Sekolah dan Posyandu.'
    },
    {
      q: 'Bagaimana sistem melacak distribusi makanan setiap harinya?',
      a: 'Sistem mencatat setiap transaksi pembelian komoditas harian secara real-time. Pada tahap hilir, setiap keberangkatan dan kedatangan kendaraan distribusi ke sekolah diverifikasi secara digital untuk memastikan makanan tiba tepat waktu.'
    },
    {
      q: 'Apakah warga bisa melihat data pembelian komoditas?',
      a: 'Tentu. Sistem ini mengusung prinsip "Open Data" di mana masyarakat publik dapat memantau secara langsung volume serapan gabah, asal pasokan bahan pokok, serta aktivitas pembelian Dapur SPPG melalui Dasbor Publik.'
    },
    {
      q: 'Bagaimana cara bergabung menjadi Mitra Pemasok logistik?',
      a: 'Pelaku UMKM, Petani, dan Penggilingan Lokal yang memenuhi standar kelayakan dan sertifikasi keamanan pangan dapat mendaftar melalui Dinas terkait untuk dikurasi menjadi Mitra Pemasok resmi Dapur SPPG.'
    }
  ];

  return (
    <div className="space-y-16 py-8">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#071840] to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Activity size={14} className="text-emerald-400" /> Project Digitalisasi Supply Chain
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Digitalisasi Supply Chain <br />
              <span className="text-emerald-400 block mt-2">Makan Bergizi Gratis</span>
            </h1>

            <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-normal">
              Platform logistik terintegrasi untuk melacak pasokan komoditas segar dari petani lokal hingga menjadi sajian gizi seimbang di meja sekolah seluruh wilayah Kabupaten Lebak.
            </p>

            {/* Quick Stats Pills */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
                <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-300">100%</span>
                <span className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">Tracking Real-time</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
                <span className="block text-2xl sm:text-3xl font-extrabold text-blue-300">Lokal</span>
                <span className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">Prioritas Serapan</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
                <span className="block text-2xl sm:text-3xl font-extrabold text-indigo-300">Data</span>
                <span className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">Terbuka Publik</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link 
                href="/rantai-pasok" 
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                Buka Dasbor Rantai Pasok <BarChart2 size={16} />
              </Link>
              <Link 
                href="/data-penggilingan" 
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
              >
                Direktori Mitra Penggilingan
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 group">
              <img 
                src="/images/mbg_tentang_hero.jpg" 
                alt="Logistik Makan Bergizi Gratis" 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-2">
                <Truck size={16} className="text-emerald-400" /> Digitalisasi Distribusi & Pengawasan Logistik
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISI & MISI LOGISTIK */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Visi Ketahanan Rantai Pasok Lokal
          </h2>
          <p className="text-slate-500 text-sm">
            Fokus pada pemberdayaan ekonomi sirkular dan kepastian keamanan suplai bahan pokok.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Visi */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4 relative z-10">
              <div className="p-3 bg-white/20 w-fit rounded-2xl backdrop-blur-md">
                <Package size={28} className="text-emerald-200" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">Visi Logistik</span>
              <h3 className="text-2xl font-black leading-snug">
                Menciptakan Ekosistem Rantai Pasok Mandiri yang Memajukan Pertanian Lokal dan Menjamin Keamanan Pangan.
              </h3>
            </div>
            <p className="text-xs text-emerald-100 mt-6 pt-4 border-t border-emerald-500/40 font-medium">
              Transformasi sistem pengadaan terpusat menjadi desentralisasi berbasis pemberdayaan mitra lokal di Kabupaten Lebak.
            </p>
          </div>

          {/* Card Misi Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 border-t-4 border-t-amber-500 shadow-sm space-y-2 hover:shadow-md transition-all">
              <div className="p-2.5 bg-amber-50 text-amber-600 w-fit rounded-xl">
                <Wheat size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Serapan Agrikultur</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Memprioritaskan serapan gabah dan sayuran segar langsung dari petani dan penggilingan daerah.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 border-t-4 border-t-blue-500 shadow-sm space-y-2 hover:shadow-md transition-all">
              <div className="p-2.5 bg-blue-50 text-blue-600 w-fit rounded-xl">
                <BarChart2 size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Akuntabilitas Data</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pencatatan volume pasokan dan nilai transaksi secara terbuka untuk publik dan auditor.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 border-t-4 border-t-rose-500 shadow-sm space-y-2 hover:shadow-md transition-all">
              <div className="p-2.5 bg-rose-50 text-rose-600 w-fit rounded-xl">
                <Microscope size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Quality Control</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Menyortir dan memastikan kelayakan bahan baku sebelum diolah massal di Dapur SPPG.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 border-t-4 border-t-indigo-500 shadow-sm space-y-2 hover:shadow-md transition-all">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 w-fit rounded-xl">
                <Truck size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Distribusi Presisi</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Memastikan kendaraan pengantar makanan tiba di ratusan titik sekolah sesuai jadwal makan gizi harian.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ALUR RANTAI PASOK */}
      <section className="space-y-8 bg-slate-100/70 p-8 sm:p-10 rounded-3xl border border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Node Rantai Pasok
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            4 Fase Distribusi Hulu ke Hilir
          </h2>
          <p className="text-slate-500 text-sm">
            Bagaimana komoditas mentah ditransformasi menjadi makanan bergizi hingga sampai ke tangan siswa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-emerald-500 shadow-sm space-y-4 relative z-10 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
              <Users size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">1. Sumber Pasokan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Petani lokal, peternak, dan penggilingan padi daerah menyuplai bahan pokok mentah (gabah, sayur, lauk) yang berizin resmi.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-blue-500 shadow-sm space-y-4 relative z-10 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
              <Building2 size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">2. Dapur SPPG</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Titik hub logistik (Satuan Pelayanan Pemenuhan Gizi) yang menerima bahan, melakukan QC, dan mengolah makanan secara terpusat.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-amber-500 shadow-sm space-y-4 relative z-10 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
              <Truck size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">3. Armada Kurir</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pengemasan ke dalam food-grade container box tertutup lalu dikirim menggunakan armada khusus sesuai rute optimal ke sekolah.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-indigo-500 shadow-sm space-y-4 relative z-10 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">4. Titik Penerima</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Posyandu dan Sekolah melakukan scan serah-terima digital, memastikan jumlah paket sesuai dan diterima dalam keadaan baik.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            <HelpCircle size={14} /> Tanya Jawab Logistik
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-slate-500 text-sm">
            Informasi mengenai sistem rantai pasok dan operasional logistik harian MBG.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/50"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-bold text-slate-800 flex justify-between items-center gap-4 hover:bg-slate-100/80 transition-colors"
                >
                  <span className="text-base">{faq.q}</span>
                  <span className="p-1 rounded-full bg-white text-slate-500 border border-slate-200 shrink-0">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA FOOTER BANNER */}
      <section className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center space-y-6 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black">
            Ingin Mengajukan Pengaduan atau Menjadi Mitra?
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base font-normal">
            Kanal pengaduan terbuka 24/7. Hubungi kami jika terdapat kendala kualitas distribusi atau pelajari syarat bergabung ke dalam rantai pasok.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link 
              href="/pengaduan" 
              className="px-6 py-3 bg-white text-emerald-700 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all shadow-lg shadow-black/10 flex items-center gap-2"
            >
              <FileText size={16} /> Buat Pengaduan Keluhan
            </Link>
            <Link 
              href="/sppg" 
              className="px-6 py-3 bg-emerald-800/80 hover:bg-emerald-900 text-white border border-emerald-400/40 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
            >
              Lihat Data Dapur SPPG
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

