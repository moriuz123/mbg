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
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function TentangClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Apa itu Program Makan Bergizi Gratis (MBG)?',
      a: 'Program Makan Bergizi Gratis (MBG) adalah kebijakan strategis nasional yang diinisiasi oleh Pemerintah Indonesia melalui Badan Gizi Nasional (BGN) bersama Pemerintah Kabupaten Lebak untuk menyediakan nutrisi harian yang sehat, seimbang, dan aman bagi anak sekolah serta kelompok rentan.'
    },
    {
      q: 'Siapa saja sasaran penerima manfaat Program MBG?',
      a: 'Sasaran utama mencakup peserta didik jenjang PAUD, SD/MI, SMP/MTs, SMA/SMK/MA, serta kelompok sasaran pencegahan stunting di Posyandu yaitu Ibu Hamil (Bumil), Ibu Menyusui (Busui), dan Anak Balita.'
    },
    {
      q: 'Bagaimana standar keamanan dan kualitas makanan dijamin?',
      a: 'Setiap Dapur SPPG menerapkan protokol pengawasan ketat mencakup uji rapid test harian terhadap cemaran kimia (Formalin, Boraks, Residu Pestisida) dan mikrobiologi (E. Coli, Salmonella) sebelum makanan diolah dan didistribusikan.'
    },
    {
      q: 'Bagaimana alur distribusi makanan dari dapur hingga diterima?',
      a: 'Bahan baku segar dipasok dari petani/pemasok lokal, diuji di dapur SPPG, dimasak oleh penjamah makanan bersertifikat, kemudian dikirim menggunakan kendaraan distribusi khusus dan diverifikasi secara digital oleh pihak sekolah/posyandu.'
    },
    {
      q: 'Bagaimana jika terdapat temuan ketidaksesuaian atau aduan?',
      a: 'Sekolah, posyandu, maupun masyarakat umum dapat menyampaikan laporan langsung melalui kanal Pengaduan Digital MBG yang akan segera ditindaklanjuti oleh Tim Pengawas SPPG Dinas dan Badan Gizi Nasional.'
    }
  ];

  return (
    <div className="space-y-16 py-8">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles size={14} className="text-amber-400" /> Badan Gizi Nasional × Pemkab Lebak
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Generasi Sehat, <span className="bg-gradient-to-r from-amber-300 via-primary-300 to-emerald-300 bg-clip-text text-transparent">Indonesia Kuat</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Program Makan Bergizi Gratis (MBG) di Kabupaten Lebak adalah wujud nyata komitmen pemenuhan gizi seimbang harian dari hulu ke hilir demi mencetak anak bangsa yang cerdas, berdaya saing, dan bebas stunting.
            </p>

            {/* Quick Stats Pills */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
                <span className="block text-2xl sm:text-3xl font-extrabold text-amber-300">35+</span>
                <span className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">Unit SPPG</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
                <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-300">100%</span>
                <span className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">Uji Rapid Test</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
                <span className="block text-2xl sm:text-3xl font-extrabold text-blue-300">Ribuan</span>
                <span className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">Penerima MBG</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link 
                href="/sppg" 
                className="px-6 py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary-600/30 flex items-center gap-2"
              >
                Jelajahi Titik Layanan SPPG <ArrowRight size={16} />
              </Link>
              <Link 
                href="/sekolah" 
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
              >
                Lihat Penerima Sekolah
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 group">
              <img 
                src="/images/mbg_tentang_hero.jpg" 
                alt="Program Makan Bergizi Gratis Lebak" 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 text-xs font-semibold text-slate-200">
                🌱 Pemenuhan Nutrisi Berkelanjutan untuk Masa Depan Lebak
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRESIDEN RI QUOTE & LANDASAN HUKUM */}
      <section className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-emerald-500/10 p-8 sm:p-10 rounded-3xl border border-amber-200/60 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex p-3 bg-amber-500 text-white rounded-2xl shadow-md mb-2">
            <Award size={28} />
          </div>
          
          <blockquote className="text-xl sm:text-2xl font-extrabold text-slate-800 italic leading-snug">
            "Kita tidak boleh membiarkan satu anak pun di Indonesia menderita kurang gizi. Gizi yang baik hari ini adalah investasi mutlak untuk kecerdasan dan kedaulatan bangsa Indonesia esok hari."
          </blockquote>
          
          <div className="pt-2">
            <p className="font-extrabold text-slate-900 text-base">Prabowo Subianto</p>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Presiden Republik Indonesia</p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3 text-xs">
            <span className="px-3 py-1 bg-white rounded-full border border-slate-200 font-semibold text-slate-600 shadow-sm">
              📜 Peraturan Presiden No. 83 Tahun 2024
            </span>
            <span className="px-3 py-1 bg-white rounded-full border border-slate-200 font-semibold text-slate-600 shadow-sm">
              🏛️ Mandat Badan Gizi Nasional (BGN)
            </span>
            <span className="px-3 py-1 bg-white rounded-full border border-slate-200 font-semibold text-slate-600 shadow-sm">
              📍 Implementasi Pemkab Lebak
            </span>
          </div>
        </div>
      </section>

      {/* VISI & MISI UTAMA */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Visi & Misi Program MBG Lebak
          </h2>
          <p className="text-slate-500 text-sm">
            Landasan kerja kolaboratif antara Badan Gizi Nasional dan Pemerintah Kabupaten Lebak.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Visi */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4 relative z-10">
              <div className="p-3 bg-white/20 w-fit rounded-2xl backdrop-blur-md">
                <Sparkles size={28} className="text-amber-300" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary-200">Visi Utama</span>
              <h3 className="text-2xl font-black leading-snug">
                Mewujudkan Generasi Emas 2045 Kabupaten Lebak yang Sehat, Cerdas, Berkualitas, dan Bebas Stunting.
              </h3>
            </div>
            <p className="text-xs text-primary-100 mt-6 pt-4 border-t border-primary-500/40 font-medium">
              Target pencapaian standar kecukupan gizi 100% pada anak sekolah dan kelompok rentan di seluruh pelosok Lebak.
            </p>
          </div>

          {/* Card Misi Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-all">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 w-fit rounded-xl">
                <Utensils size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Gizi Seimbang</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Penyusunan standar menu gizi seimbang yang dikaji rutin oleh tim spesialis nutrisi.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-all">
              <div className="p-2.5 bg-blue-50 text-blue-600 w-fit rounded-xl">
                <Microscope size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Keamanan Pangan</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inspeksi harian rapid test untuk menjamin bebas dari cemaran kimia dan bakteri.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-all">
              <div className="p-2.5 bg-amber-50 text-amber-600 w-fit rounded-xl">
                <Wheat size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Ekonomi Lokal</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Memberdayakan petani, peternak, dan pemasok lokal sebagai penyedia bahan baku utama.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-all">
              <div className="p-2.5 bg-purple-50 text-purple-600 w-fit rounded-xl">
                <FileText size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Transparansi Publik</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pelaporan harian berbasis digital yang dapat diakses publik dari hulu ke hilir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 PILAR UTAMA EKOSISTEM MBG */}
      <section className="space-y-8 bg-slate-100/70 p-8 sm:p-10 rounded-3xl border border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
            Arsitektur Sistem
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            4 Pilar Utama Ekosistem Program MBG
          </h2>
          <p className="text-slate-500 text-sm">
            Sinergi antar lembaga dan pelaku usaha lokal dalam menciptakan rantai pasok makanan yang aman.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center font-bold">
              <Building2 size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">1. Dapur SPPG Modern</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Satuan Pelayanan Pemenuhan Gizi yang dilengkapi fasilitas memasak higiene tinggi, koki sertifikasi BNSP, dan penjamah makanan terlatih.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
              <Truck size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">2. Rantai Pasok Lokal</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kemitraan langsung dengan penggilingan beras, kelompok tani sayur segar, peternak ayam/telur, dan UMKM di wilayah Kabupaten Lebak.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
              <GraduationCap size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">3. Integrasi Penerima</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Penyaluran tepat waktu ke sekolah (PAUD-SMA) dan Posyandu (Ibu Hamil, Busui, Balita) dengan sistem verifikasi qr/digital.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center font-bold">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">4. Pengawasan & Aduan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Layanan aduan publik serta inspeksi independen harian untuk menjaga konsistensi porsi dan standar gizi makanan.
            </p>
          </div>
        </div>
      </section>

      {/* SASARAN & DEMOGRAFI PENERIMA */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Demografi Sasaran Penerima Manfaat
          </h2>
          <p className="text-slate-500 text-sm">
            Fokus penanganan gizi komprehensif pada fase krusial tumbuh kembang anak dan kesehatan ibu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-primary-300 transition-colors space-y-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit">
              <GraduationCap size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Anak Sekolah PAUD - SD</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mendukung masa pembentukan kebiasaan makan sehat, perkembangan fisik dasar, dan konsentrasi belajar sejak dini.
            </p>
            <div className="pt-2 text-[11px] font-bold text-blue-600 flex items-center gap-1">
              <CheckCircle2 size={14} /> Paket Makan Siang Seimbang
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-primary-300 transition-colors space-y-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
              <GraduationCap size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Siswa SMP - SMA/SMK</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Menyuplai kebutuhan energi dan protein makro pada usia remaja awal hingga akhir untuk menunjang aktivitas sekolah.
            </p>
            <div className="pt-2 text-[11px] font-bold text-indigo-600 flex items-center gap-1">
              <CheckCircle2 size={14} /> Kecukupan Kalori Tinggi
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-primary-300 transition-colors space-y-3">
            <div className="p-3 bg-pink-50 text-pink-600 rounded-xl w-fit">
              <HeartPulse size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Ibu Hamil & Menyusui</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mencegah potensi janin stunting sejak dalam kandungan dan menjamin asupan nutrisi mikro ibu pasca persalinan.
            </p>
            <div className="pt-2 text-[11px] font-bold text-pink-600 flex items-center gap-1">
              <CheckCircle2 size={14} /> Asupan Asam Folat & Zat Besi
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-primary-300 transition-colors space-y-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
              <Users size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Anak Balita (Posyandu)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Menjaga 1000 Hari Pertama Kehidupan (HPK) agar pertumbuhan tinggi dan berat badan anak sesuai standar WHO.
            </p>
            <div className="pt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={14} /> PMT Pemulihan Tinggi Protein
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            <HelpCircle size={14} /> Pertanyaan Umum
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-slate-500 text-sm">
            Informasi lengkap seputar pelaksanaan dan pengawasan Program MBG di Kabupaten Lebak.
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
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-emerald-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center space-y-6 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black">
            Ingin Mengajukan Pengaduan atau Informasi Lebih Lanjut?
          </h2>
          <p className="text-primary-100 text-sm sm:text-base font-normal">
            Kanal pengaduan terbuka 24/7 bagi sekolah, kader posyandu, maupun masyarakat Kabupaten Lebak demi menjaga kualitas gizi terbaik.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link 
              href="/pengaduan" 
              className="px-6 py-3 bg-white text-primary-700 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all shadow-lg shadow-black/10 flex items-center gap-2"
            >
              <FileText size={16} /> Buat Pengaduan / Masukan
            </Link>
            <Link 
              href="/sppg" 
              className="px-6 py-3 bg-primary-800/80 hover:bg-primary-900 text-white border border-primary-400/40 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
            >
              Lihat Direktori SPPG
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
