'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  PhoneCall, 
  Clock, 
  Lock, 
  Building2, 
  GraduationCap, 
  AlertCircle, 
  Sparkles,
  HelpCircle,
  ArrowUpRight,
  FileText
} from 'lucide-react';
import { submitPengaduanPublic } from '@/app/actions/pengaduan';
import Link from 'next/link';

type TargetList = {
  sekolahList: { id: number; nama: string }[];
  sppgList: { id: number; nama: string }[];
};

export default function PengaduanPublicForm({ targets }: { targets: TargetList }) {
  const [targetType, setTargetType] = useState('umum');
  const [kategoriAduan, setKategoriAduan] = useState('Kualitas Makanan');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');
    const formData = new FormData(e.currentTarget);
    formData.append('kategoriAduan', kategoriAduan);

    const res = await submitPengaduanPublic(formData);
    
    if (res.success) {
      setSuccessMsg(res.message);
      setTicketId(`MBG-${Math.floor(100000 + Math.random() * 900000)}`);
      (e.target as HTMLFormElement).reset();
      setTargetType('umum');
    } else {
      alert(res.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-12 py-6">
      
      {/* HERO SECTION BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#071840] to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck size={14} className="text-emerald-400" /> Project Digitalisasi Supply Chain
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Layanan Pengaduan & <br />
              <span className="text-emerald-400 block mt-2">Aspirasi Logistik MBG</span>
            </h1>

            <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-normal">
              Kanal resmi pengaduan publik untuk ekosistem Digitalisasi Supply Chain Makan Bergizi Gratis. Bantu kami menjaga mutu pasokan logistik, kebersihan Dapur SPPG, dan ketepatan waktu distribusi makanan.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
                <span className="block text-xl sm:text-2xl font-extrabold text-emerald-400">100%</span>
                <span className="text-[11px] text-slate-100 font-medium uppercase tracking-wider">Rahasia & Safe</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
                <span className="block text-xl sm:text-2xl font-extrabold text-accent-500">&lt; 24 Jam</span>
                <span className="text-[11px] text-slate-100 font-medium uppercase tracking-wider">Respon Cepat</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
                <span className="block text-xl sm:text-2xl font-extrabold text-blue-400">Resmi</span>
                <span className="text-[11px] text-slate-100 font-medium uppercase tracking-wider">Terintegrasi</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 group">
              <img 
                src="/images/mbg_pengaduan_banner.jpg" 
                alt="Banner Layanan Pengaduan MBG" 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 text-xs font-semibold text-slate-200">
                🔒 Sistem Pelaporan Terlindung & Terpantau Langsung Tim Dinas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KANAL PENGADUAN EKSTERNAL RESMI */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
            Kanal Pengaduan Lainnya
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pilihan Kanal Pelaporan Resmi
          </h2>
          <p className="text-slate-500 text-sm">
            Selain formulir di situs ini, Anda dapat menggunakan layanan WhatsApp Bot Pemkab Lebak atau Portal SPAN-LAPOR Nasional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: LAPOR RUHAY WhatsApp */}
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition-all">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md text-white">
                  <MessageSquare size={26} />
                </div>
                <span className="px-3 py-1 bg-emerald-500/40 text-emerald-100 rounded-full text-xs font-bold border border-emerald-400/30">
                  WhatsApp Bot 24/7
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black mb-1">LAPOR RUHAY!</h3>
                <p className="text-xs text-emerald-100 font-medium">Chatbot Pengaduan Resmi Pemerintah Kabupaten Lebak</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 space-y-1">
                <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">Nomor WhatsApp Boot:</span>
                <span className="font-black text-lg text-white font-mono flex items-center gap-2">
                  <PhoneCall size={18} className="text-emerald-300" /> +62 819-4411-4581
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-emerald-500/40 relative z-10">
              <a 
                href="https://wa.me/6281944114581?text=Halo%20Lapor%20Ruhay,%20Saya%20ingin%20melaporkan%20pengaduan%20terkait%20Program%20Makan%20Bergizi%20Gratis%20(MBG)%20Kabupaten%20Lebak."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                Chat WhatsApp Lapor Ruhay <ArrowUpRight size={18} />
              </a>
            </div>
          </div>

          {/* Card 2: SPAN-LAPOR.GO.ID */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition-all">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md text-white">
                  <ShieldCheck size={26} />
                </div>
                <span className="px-3 py-1 bg-red-500/40 text-red-100 rounded-full text-xs font-bold border border-red-400/30">
                  SPAN-LAPOR KemenPAN-RB
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black mb-1">LAPOR.GO.ID</h3>
                <p className="text-xs text-slate-300 font-medium">Layanan Aspirasi dan Pengaduan Online Rakyat Pemkab Lebak</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 space-y-1">
                <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider block">Instansi Tujuan:</span>
                <span className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <Building2 size={16} className="text-indigo-300 shrink-0" /> Pemerintah Kabupaten Lebak
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-indigo-500/40 relative z-10">
              <a 
                href="https://span.lapor.go.id/instansi/pemerintah-kabupaten-lebak"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                Akses SPAN-LAPOR.go.id <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FORM PENGADUAN DIRECT WEB APP */}
      <section className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-10 relative">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="p-3 bg-primary-100 text-primary-600 rounded-2xl">
            <MessageSquare size={28} />
          </div>
          <div>
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">Formulir Pengaduan Direct</span>
            <h2 className="text-2xl font-bold text-slate-800">Kirim Laporan Pengaduan MBG</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Laporan Anda akan terkirim langsung ke Dashboard Pengawasan Dapur SPPG & Tim Dinas Gizi Lebak.
            </p>
          </div>
        </div>

        {successMsg ? (
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-8 text-center max-w-xl mx-auto space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-800">Laporan Berhasil Terkirim!</h3>
              <p className="text-slate-600 text-sm mt-1">{successMsg}</p>
            </div>

            {ticketId && (
              <div className="bg-white p-4 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Nomor Tiket Referensi</span>
                <span className="text-lg font-mono font-black text-emerald-700 tracking-wider">{ticketId}</span>
              </div>
            )}

            <button 
              onClick={() => setSuccessMsg('')} 
              className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors text-sm shadow-md"
            >
              Kirim Laporan Lainnya
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Target Radio Selection */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                1. Kategori Objek Laporan <span className="text-red-500">*</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${targetType === 'umum' ? 'bg-primary-50 border-primary-500 text-primary-900 shadow-sm font-bold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}`}>
                  <input type="radio" name="targetType" value="umum" checked={targetType === 'umum'} onChange={(e) => setTargetType(e.target.value)} className="w-4 h-4 text-primary-600" />
                  <span className="text-sm">Umum / Sistem MBG</span>
                </label>

                <label className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${targetType === 'sekolah' ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-sm font-bold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}`}>
                  <input type="radio" name="targetType" value="sekolah" checked={targetType === 'sekolah'} onChange={(e) => setTargetType(e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Sekolah Penerima</span>
                </label>

                <label className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${targetType === 'sppg' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm font-bold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}`}>
                  <input type="radio" name="targetType" value="sppg" checked={targetType === 'sppg'} onChange={(e) => setTargetType(e.target.value)} className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">Dapur SPPG / Mutu</span>
                </label>
              </div>

              {targetType === 'sekolah' && (
                <div className="space-y-1.5 pt-2 animate-fade-in">
                  <label className="text-xs font-bold text-blue-800">Pilih Nama Sekolah Penerima</label>
                  <select name="targetId" required className="w-full p-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-slate-800">
                    <option value="">-- Pilih Sekolah --</option>
                    {targets.sekolahList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                  </select>
                </div>
              )}

              {targetType === 'sppg' && (
                <div className="space-y-1.5 pt-2 animate-fade-in">
                  <label className="text-xs font-bold text-emerald-800">Pilih Nama Dapur (SPPG)</label>
                  <select name="targetId" required className="w-full p-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium text-slate-800">
                    <option value="">-- Pilih Dapur (SPPG) --</option>
                    {targets.sppgList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Sub-Kategori Topic Badges */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                2. Topik Keluhan Main
              </label>
              <div className="flex flex-wrap gap-2">
                {['Kualitas Makanan', 'Kebersihan Dapur', 'Ketepatan Waktu', 'Jumlah Porsi', 'Rasa & Menu', 'Lainnya'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setKategoriAduan(tag)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                      kategoriAduan === tag ? 'bg-primary-600 text-white border-primary-600 shadow-sm' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Identitas Pelapor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Pelapor (Opsional)</label>
                <input 
                  type="text" 
                  name="namaPelapor" 
                  placeholder="Kosongkan jika ingin Anonim (Rahasia)" 
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">No. HP / WhatsApp (Opsional)</label>
                <input 
                  type="text" 
                  name="kontak" 
                  placeholder="Misal: 081234567890" 
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                />
              </div>
            </div>

            {/* Isi Pengaduan */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Isi Detail Pengaduan / Keluhan <span className="text-red-500">*</span>
              </label>
              <textarea 
                name="isiPengaduan" 
                required 
                rows={5}
                placeholder="Tuliskan secara jelas lokasi, tanggal kejadian, dan kronologi keluhan..."
                className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm leading-relaxed"
              ></textarea>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-lg shadow-primary-600/30 transition-all flex justify-center items-center gap-2 text-base disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? 'Mengirim Laporan...' : (
                  <>
                    Kirim Laporan Pengaduan <Send size={18} />
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </section>

      {/* PROSEDUR PENANGANAN ADUAN */}
      <section className="bg-slate-100/70 p-8 sm:p-10 rounded-3xl border border-slate-200/80 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
            Alur Kerja
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Prosedur Penanganan Pengaduan
          </h2>
          <p className="text-slate-500 text-sm">
            Setiap aduan yang masuk diproses secara terstruktur oleh Tim Pengawas SPPG & Dinas Gizi Lebak.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold mx-auto">
              1
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Laporan Diterima</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sistem mencatat laporan dan memberikan tiket referensi pelaporan.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mx-auto">
              2
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Verifikasi Tim</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tim Pengawas mengecek kebenaran data dan memverifikasi lokasi SPPG.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold mx-auto">
              3
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Inspeksi & Koreksi</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pemeriksaan sampel makanan / teguran & perbaikan operasional dapur.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold mx-auto">
              4
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Laporan Selesai</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hasil konfirmasi dan perbaikan diperbarui di sistem monitoring.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
