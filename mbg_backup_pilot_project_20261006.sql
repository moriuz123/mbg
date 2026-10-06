--
-- PostgreSQL database dump
--

\restrict ZIuyjNuooUFmBDhAdeae6zscAOHAE6OqxQCKyVmlMrPwuVF0NRKjWmW2HUW3xOK

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp without time zone,
    "refreshTokenExpiresAt" timestamp without time zone,
    scope text,
    password text,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.account OWNER TO postgres;

--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_log (
    audit_id integer NOT NULL,
    user_id text,
    tabel_nama text NOT NULL,
    record_id integer NOT NULL,
    aksi text,
    data_lama text,
    data_baru text,
    tanggal timestamp without time zone DEFAULT now()
);


ALTER TABLE public.audit_log OWNER TO postgres;

--
-- Name: audit_log_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.audit_log ALTER COLUMN audit_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.audit_log_audit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: desa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.desa (
    desa_id integer NOT NULL,
    kecamatan_id integer NOT NULL,
    nama_desa text NOT NULL
);


ALTER TABLE public.desa OWNER TO postgres;

--
-- Name: desa_desa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.desa ALTER COLUMN desa_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.desa_desa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: jenis_pangan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jenis_pangan (
    jenis_pangan_id integer NOT NULL,
    nama_bahan text NOT NULL,
    kategori text,
    satuan_default text DEFAULT 'Kilogram'::text,
    batas_kritis numeric(10,2) DEFAULT 5.00
);


ALTER TABLE public.jenis_pangan OWNER TO postgres;

--
-- Name: jenis_pangan_jenis_pangan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.jenis_pangan ALTER COLUMN jenis_pangan_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.jenis_pangan_jenis_pangan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: kabupaten; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kabupaten (
    kabupaten_id integer NOT NULL,
    nama_kabupaten text NOT NULL,
    is_luar_banten boolean DEFAULT false NOT NULL
);


ALTER TABLE public.kabupaten OWNER TO postgres;

--
-- Name: kabupaten_kabupaten_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.kabupaten ALTER COLUMN kabupaten_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.kabupaten_kabupaten_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: kategori_penerima; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kategori_penerima (
    kategori_id integer NOT NULL,
    nama_kategori text NOT NULL,
    urutan integer DEFAULT 0
);


ALTER TABLE public.kategori_penerima OWNER TO postgres;

--
-- Name: kategori_penerima_kategori_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.kategori_penerima ALTER COLUMN kategori_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.kategori_penerima_kategori_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: kecamatan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kecamatan (
    kecamatan_id integer NOT NULL,
    nama_kecamatan text NOT NULL
);


ALTER TABLE public.kecamatan OWNER TO postgres;

--
-- Name: kecamatan_kecamatan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.kecamatan ALTER COLUMN kecamatan_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.kecamatan_kecamatan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: master_parameter_uji; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.master_parameter_uji (
    id integer NOT NULL,
    nama_parameter text NOT NULL,
    kategori text DEFAULT 'Kimia'::text,
    satuan text,
    ambang_batas text,
    deskripsi text,
    status_aktif boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    sppg_id integer
);


ALTER TABLE public.master_parameter_uji OWNER TO postgres;

--
-- Name: master_parameter_uji_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.master_parameter_uji ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.master_parameter_uji_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: navigation_menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.navigation_menu (
    id integer NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    urutan integer DEFAULT 0,
    status text DEFAULT 'Aktif'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.navigation_menu OWNER TO postgres;

--
-- Name: navigation_menu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.navigation_menu ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.navigation_menu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pemasok; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pemasok (
    pemasok_id integer NOT NULL,
    nama_pemasok text NOT NULL,
    alamat_pemasok text,
    kontak text,
    tipe_pemasok text,
    npwp text,
    pic_nama text,
    pic_kontak text,
    email text,
    kecamatan_id integer,
    desa_id integer,
    status text DEFAULT 'Aktif'::text,
    bank_nama text,
    bank_rekening text,
    bank_atas_nama text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    kabupaten_id integer
);


ALTER TABLE public.pemasok OWNER TO postgres;

--
-- Name: pemasok_pemasok_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.pemasok ALTER COLUMN pemasok_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pemasok_pemasok_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pengaduan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pengaduan (
    id integer NOT NULL,
    nama_pelapor text,
    kontak text,
    sppg_id integer,
    sekolah_id integer,
    isi_pengaduan text NOT NULL,
    status text DEFAULT 'Baru'::text,
    tanggal timestamp without time zone DEFAULT now(),
    tanggapan text
);


ALTER TABLE public.pengaduan OWNER TO postgres;

--
-- Name: pengaduan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.pengaduan ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pengaduan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: penggilingan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.penggilingan (
    penggilingan_id integer NOT NULL,
    nama_penggilingan text NOT NULL,
    alamat text,
    kecamatan_id integer,
    penanggung_jawab text,
    no_hp text,
    kapasitas_terpasang_kg_minggu numeric(12,2),
    status text DEFAULT 'Aktif'::text,
    created_at timestamp without time zone DEFAULT now(),
    desa_id integer,
    nib text,
    nomor_umku text,
    kbli text,
    nama_dagang text,
    nomor_registrasi_pduk text,
    status_pduk text,
    tanggal_dikeluarkan_pduk text,
    berlaku_sampai_pduk text,
    nama_unit_produksi text,
    no_permohonan_oss text
);


ALTER TABLE public.penggilingan OWNER TO postgres;

--
-- Name: penggilingan_distribusi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.penggilingan_distribusi (
    id integer NOT NULL,
    penggilingan_id integer NOT NULL,
    minggu_mulai date NOT NULL,
    minggu_selesai date NOT NULL,
    volume_kg numeric(12,2) NOT NULL,
    tujuan_tipe text NOT NULL,
    sppg_tujuan_id integer,
    lokasi_lain text,
    catatan text,
    created_at timestamp without time zone DEFAULT now(),
    jenis_produk text,
    nomor_polisi text,
    nama_supir text,
    foto_surat_jalan text,
    wilayah_distribusi text,
    kecamatan_tujuan_id integer,
    desa_tujuan_id integer,
    alamat_lengkap text,
    kontak_person text,
    provinsi_tujuan text,
    kabupaten_kota_tujuan text,
    status_verifikasi text DEFAULT 'Draft'::text
);


ALTER TABLE public.penggilingan_distribusi OWNER TO postgres;

--
-- Name: penggilingan_distribusi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.penggilingan_distribusi ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.penggilingan_distribusi_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: penggilingan_penggilingan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.penggilingan ALTER COLUMN penggilingan_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.penggilingan_penggilingan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: penggilingan_produksi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.penggilingan_produksi (
    id integer NOT NULL,
    penggilingan_id integer NOT NULL,
    minggu_mulai date NOT NULL,
    minggu_selesai date NOT NULL,
    beras_dihasilkan_kg numeric(12,2) NOT NULL,
    rendemen_persen numeric(5,2),
    catatan text,
    created_at timestamp without time zone DEFAULT now(),
    gabah_digiling_kg numeric(12,2) NOT NULL,
    mutu_beras text,
    dedak_kg numeric(12,2),
    menir_kg numeric(12,2),
    sekam_kg numeric(12,2),
    biaya_operasional numeric(15,2),
    batch_number text,
    status_verifikasi text DEFAULT 'Draft'::text
);


ALTER TABLE public.penggilingan_produksi OWNER TO postgres;

--
-- Name: penggilingan_produksi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.penggilingan_produksi ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.penggilingan_produksi_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: penggilingan_sumber_gabah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.penggilingan_sumber_gabah (
    id integer NOT NULL,
    penggilingan_id integer NOT NULL,
    minggu_mulai date NOT NULL,
    minggu_selesai date NOT NULL,
    sumber_gabah text NOT NULL,
    volume_kg numeric(12,2) NOT NULL,
    catatan text,
    created_at timestamp without time zone DEFAULT now(),
    nama_sumber text,
    alamat_sumber text,
    kontak_person text,
    lokasi_wilayah text DEFAULT 'Dalam Lebak'::text,
    kecamatan_id integer,
    desa_id integer,
    provinsi_luar text,
    kabupaten_luar text,
    kecamatan_luar text,
    desa_luar text,
    kondisi_gabah text,
    kadar_air numeric(5,2),
    kadar_hampa numeric(5,2),
    varietas text,
    nomor_polisi text,
    nama_supir text,
    foto_nota_url text,
    status_verifikasi text DEFAULT 'Draft'::text
);


ALTER TABLE public.penggilingan_sumber_gabah OWNER TO postgres;

--
-- Name: penggilingan_sumber_gabah_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.penggilingan_sumber_gabah ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.penggilingan_sumber_gabah_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pengumuman; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pengumuman (
    id integer NOT NULL,
    judul text NOT NULL,
    isi text NOT NULL,
    author_id text NOT NULL,
    sppg_id integer,
    status text DEFAULT 'Aktif'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pengumuman OWNER TO postgres;

--
-- Name: pengumuman_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.pengumuman ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pengumuman_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: posyandu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posyandu (
    id integer NOT NULL,
    nama_posyandu text NOT NULL,
    desa_id integer,
    kecamatan_id integer,
    alamat_posyandu text,
    nama_ketua_kader text,
    no_hp_ketua_kader text,
    jumlah_busui integer DEFAULT 0,
    jumlah_balita integer DEFAULT 0,
    jumlah_bumil integer DEFAULT 0,
    jumlah_total integer DEFAULT 0,
    keterangan text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.posyandu OWNER TO postgres;

--
-- Name: posyandu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.posyandu ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.posyandu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: posyandu_laporan_aktifitas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posyandu_laporan_aktifitas (
    id integer NOT NULL,
    sppg_laporan_id integer NOT NULL,
    posyandu_id integer NOT NULL,
    tanggal_diterima timestamp without time zone DEFAULT now() NOT NULL,
    status_diterima text DEFAULT 'Diterima Lengkap'::text NOT NULL,
    jumlah_porsi_diterima integer,
    kondisi_makanan text DEFAULT 'Baik'::text,
    catatan text,
    foto_dokumentasi text,
    diverifikasi_oleh text,
    created_at timestamp without time zone DEFAULT now(),
    status_verifikasi text DEFAULT 'Draft'::text
);


ALTER TABLE public.posyandu_laporan_aktifitas OWNER TO postgres;

--
-- Name: posyandu_laporan_aktifitas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.posyandu_laporan_aktifitas ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.posyandu_laporan_aktifitas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: posyandu_penerimaan_mbg; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posyandu_penerimaan_mbg (
    id integer NOT NULL,
    posyandu_id integer NOT NULL,
    sppg_id integer NOT NULL,
    status text DEFAULT 'Aktif'::text NOT NULL,
    tanggal_mulai_mbg date NOT NULL,
    tanggal_selesai_mbg date,
    catatan_status text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.posyandu_penerimaan_mbg OWNER TO postgres;

--
-- Name: posyandu_penerimaan_mbg_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.posyandu_penerimaan_mbg ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.posyandu_penerimaan_mbg_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sekolah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sekolah (
    sekolah_id integer NOT NULL,
    nama_sekolah text NOT NULL,
    npsn text,
    kategori_id integer NOT NULL,
    desa_id integer,
    kecamatan_id integer,
    alamat_sekolah text,
    nama_kepala_sekolah text,
    no_hp_kepala_sekolah text,
    email_sekolah text,
    jumlah_siswa_laki integer DEFAULT 0,
    jumlah_siswa_perempuan integer DEFAULT 0,
    jumlah_siswa_total integer,
    tahun_ajaran_last text,
    keterangan text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.sekolah OWNER TO postgres;

--
-- Name: sekolah_laporan_aktifitas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sekolah_laporan_aktifitas (
    id integer NOT NULL,
    sppg_laporan_id integer NOT NULL,
    sekolah_id integer NOT NULL,
    tanggal_diterima timestamp without time zone DEFAULT now() NOT NULL,
    status_diterima text DEFAULT 'Diterima Lengkap'::text NOT NULL,
    jumlah_porsi_diterima integer,
    kondisi_makanan text DEFAULT 'Baik'::text,
    catatan text,
    foto_dokumentasi text,
    diverifikasi_oleh text,
    created_at timestamp without time zone DEFAULT now(),
    status_verifikasi text DEFAULT 'Draft'::text
);


ALTER TABLE public.sekolah_laporan_aktifitas OWNER TO postgres;

--
-- Name: sekolah_laporan_aktifitas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.sekolah_laporan_aktifitas ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sekolah_laporan_aktifitas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sekolah_penerimaan_mbg; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sekolah_penerimaan_mbg (
    id integer NOT NULL,
    sekolah_id integer NOT NULL,
    sppg_id integer NOT NULL,
    status text DEFAULT 'Aktif'::text NOT NULL,
    tanggal_mulai_mbg date NOT NULL,
    tanggal_selesai_mbg date,
    tahun_ajaran text,
    jumlah_hari_operasional integer,
    catatan_status text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.sekolah_penerimaan_mbg OWNER TO postgres;

--
-- Name: sekolah_penerimaan_mbg_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.sekolah_penerimaan_mbg ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sekolah_penerimaan_mbg_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sekolah_sekolah_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.sekolah ALTER COLUMN sekolah_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sekolah_sekolah_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    id text NOT NULL,
    "expiresAt" timestamp without time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: site_setting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site_setting (
    key text NOT NULL,
    value text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.site_setting OWNER TO postgres;

--
-- Name: sppg; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sppg (
    sppg_id integer NOT NULL,
    id_sppg_code text,
    nama_sppg text NOT NULL,
    desa_id integer,
    yayasan_id integer,
    alamat text,
    status_operasional text DEFAULT 'Belum Operasional'::text NOT NULL,
    tanggal_operasional date,
    bpjs_kesehatan boolean DEFAULT false,
    nama_ka_sppg text,
    no_hp_ka_sppg text,
    jumlah_penjamah_makanan integer DEFAULT 0,
    jumlah_bpjs_tk integer DEFAULT 0,
    chef_bersertifikat_bnsp integer DEFAULT 0,
    keterangan text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.sppg OWNER TO postgres;

--
-- Name: sppg_laporan_aktifitas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sppg_laporan_aktifitas (
    id integer NOT NULL,
    sppg_id integer NOT NULL,
    sekolah_id integer,
    tanggal date NOT NULL,
    jumlah_porsi integer,
    status text DEFAULT 'Terkirim'::text,
    catatan text,
    foto_dokumentasi text,
    created_at timestamp without time zone DEFAULT now(),
    posyandu_id integer,
    standar_menu_id integer NOT NULL,
    status_verifikasi text DEFAULT 'Draft'::text
);


ALTER TABLE public.sppg_laporan_aktifitas OWNER TO postgres;

--
-- Name: sppg_laporan_aktifitas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.sppg_laporan_aktifitas ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sppg_laporan_aktifitas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sppg_pemakaian_bahan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sppg_pemakaian_bahan (
    id integer NOT NULL,
    sppg_id integer NOT NULL,
    jenis_pangan_id integer NOT NULL,
    standar_menu_id integer,
    tanggal_pemakaian date NOT NULL,
    minggu_ke integer,
    volume numeric(12,2) NOT NULL,
    satuan text DEFAULT 'Kg'::text NOT NULL,
    catatan text,
    created_at timestamp without time zone DEFAULT now(),
    status_verifikasi text DEFAULT 'Draft'::text
);


ALTER TABLE public.sppg_pemakaian_bahan OWNER TO postgres;

--
-- Name: sppg_pemakaian_bahan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.sppg_pemakaian_bahan ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sppg_pemakaian_bahan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sppg_pembelian_bahan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sppg_pembelian_bahan (
    id integer NOT NULL,
    sppg_id integer NOT NULL,
    pemasok_id integer,
    jenis_pangan_id integer NOT NULL,
    tanggal_pembelian date NOT NULL,
    minggu_ke integer,
    volume numeric(12,2) NOT NULL,
    satuan text DEFAULT 'Kg'::text NOT NULL,
    harga_total numeric(15,2),
    foto_nota text,
    catatan text,
    created_at timestamp without time zone DEFAULT now(),
    status_verifikasi text DEFAULT 'Draft'::text,
    tipe_sumber text DEFAULT 'Pemasok'::text,
    penggilingan_id integer
);


ALTER TABLE public.sppg_pembelian_bahan OWNER TO postgres;

--
-- Name: sppg_pembelian_bahan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.sppg_pembelian_bahan ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sppg_pembelian_bahan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sppg_penerima_manfaat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sppg_penerima_manfaat (
    id integer NOT NULL,
    sppg_id integer NOT NULL,
    sekolah_id integer NOT NULL,
    tahun_ajaran text,
    jumlah_laki integer DEFAULT 0,
    jumlah_perempuan integer DEFAULT 0,
    jumlah_total integer,
    status text DEFAULT 'Aktif'::text,
    tanggal_mulai date NOT NULL,
    tanggal_selesai date,
    catatan text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    status_verifikasi text DEFAULT 'Draft'::text
);


ALTER TABLE public.sppg_penerima_manfaat OWNER TO postgres;

--
-- Name: sppg_penerima_manfaat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.sppg_penerima_manfaat ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sppg_penerima_manfaat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sppg_posyandu_manfaat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sppg_posyandu_manfaat (
    id integer NOT NULL,
    sppg_id integer NOT NULL,
    posyandu_id integer NOT NULL,
    jumlah_busui integer DEFAULT 0,
    jumlah_balita integer DEFAULT 0,
    jumlah_bumil integer DEFAULT 0,
    jumlah_total integer DEFAULT 0,
    status text DEFAULT 'Aktif'::text,
    tanggal_mulai date NOT NULL,
    tanggal_selesai date,
    catatan text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    status_verifikasi text DEFAULT 'Draft'::text
);


ALTER TABLE public.sppg_posyandu_manfaat OWNER TO postgres;

--
-- Name: sppg_posyandu_manfaat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.sppg_posyandu_manfaat ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sppg_posyandu_manfaat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sppg_sertifikasi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sppg_sertifikasi (
    sertifikasi_id integer NOT NULL,
    sppg_id integer NOT NULL,
    jenis_sertifikasi text NOT NULL,
    status boolean DEFAULT false,
    tanggal_berlaku date,
    keterangan text
);


ALTER TABLE public.sppg_sertifikasi OWNER TO postgres;

--
-- Name: sppg_sertifikasi_sertifikasi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.sppg_sertifikasi ALTER COLUMN sertifikasi_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sppg_sertifikasi_sertifikasi_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sppg_sppg_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.sppg ALTER COLUMN sppg_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sppg_sppg_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sppg_uji_rapid_test; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sppg_uji_rapid_test (
    id integer NOT NULL,
    sppg_id integer NOT NULL,
    jenis_pangan_id integer NOT NULL,
    tanggal_uji date NOT NULL,
    parameter_uji text NOT NULL,
    hasil_uji text NOT NULL,
    petugas_penguji text NOT NULL,
    tindakan_lanjut text,
    foto_bukti text,
    created_at timestamp without time zone DEFAULT now(),
    parameter_uji_id integer,
    pembelian_id integer
);


ALTER TABLE public.sppg_uji_rapid_test OWNER TO postgres;

--
-- Name: sppg_uji_rapid_test_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.sppg_uji_rapid_test ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sppg_uji_rapid_test_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: standar_kecukupan_gizi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.standar_kecukupan_gizi (
    id integer NOT NULL,
    kategori_id integer NOT NULL,
    jenis_makan text NOT NULL,
    min_energi_kkal numeric(7,2) NOT NULL,
    max_energi_kkal numeric(7,2) NOT NULL,
    min_protein_gram numeric(6,2) NOT NULL,
    max_protein_gram numeric(6,2) NOT NULL,
    min_lemak_gram numeric(6,2) NOT NULL,
    max_lemak_gram numeric(6,2) NOT NULL,
    min_karbohidrat_gram numeric(6,2) NOT NULL,
    max_karbohidrat_gram numeric(6,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.standar_kecukupan_gizi OWNER TO postgres;

--
-- Name: standar_kecukupan_gizi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.standar_kecukupan_gizi ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.standar_kecukupan_gizi_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: standar_menu_gizi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.standar_menu_gizi (
    id integer NOT NULL,
    nama_menu text NOT NULL,
    deskripsi text,
    kalori_kkal integer,
    protein_gram numeric(5,2),
    karbohidrat_gram numeric(5,2),
    lemak_gram numeric(5,2),
    kategori_target_id integer,
    status text DEFAULT 'Aktif'::text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    jenis_makan text DEFAULT 'Siang'::text,
    sppg_id integer
);


ALTER TABLE public.standar_menu_gizi OWNER TO postgres;

--
-- Name: standar_menu_gizi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.standar_menu_gizi ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.standar_menu_gizi_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: supply_chain_kebutuhan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supply_chain_kebutuhan (
    id integer NOT NULL,
    sppg_id integer NOT NULL,
    jenis_pangan_id integer NOT NULL,
    pemasok_id integer,
    kebutuhan_per_bulan numeric(12,2) NOT NULL,
    satuan text DEFAULT 'Kilogram'::text,
    periode date NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.supply_chain_kebutuhan OWNER TO postgres;

--
-- Name: supply_chain_kebutuhan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.supply_chain_kebutuhan ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.supply_chain_kebutuhan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sys_menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sys_menu (
    id text NOT NULL,
    nama_modul text NOT NULL,
    url text NOT NULL,
    icon text,
    hak_akses text NOT NULL,
    status text DEFAULT 'Aktif'::text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sys_menu OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean NOT NULL,
    image text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    role text DEFAULT 'publik'::text NOT NULL,
    kecamatan_id integer,
    penggilingan_id integer,
    sekolah_id integer,
    sppg_id integer,
    username text,
    "displayUsername" text,
    posyandu_id integer,
    kabupaten_id integer
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: verification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp without time zone NOT NULL,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.verification OWNER TO postgres;

--
-- Name: yayasan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.yayasan (
    yayasan_id integer NOT NULL,
    nama_yayasan text NOT NULL,
    alamat text,
    kontak text,
    desa_id integer,
    kecamatan_id integer
);


ALTER TABLE public.yayasan OWNER TO postgres;

--
-- Name: yayasan_yayasan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.yayasan ALTER COLUMN yayasan_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.yayasan_yayasan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") FROM stdin;
account_sekolah_1_1791257238682	sekolah_user_1_1791257238682	credential	sekolah_user_1_1791257238682	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_2_1791257238691	sekolah_user_2_1791257238691	credential	sekolah_user_2_1791257238691	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_3_1791257238695	sekolah_user_3_1791257238695	credential	sekolah_user_3_1791257238695	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_4_1791257238700	sekolah_user_4_1791257238700	credential	sekolah_user_4_1791257238700	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_5_1791257238704	sekolah_user_5_1791257238704	credential	sekolah_user_5_1791257238704	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_6_1791257238712	sekolah_user_6_1791257238712	credential	sekolah_user_6_1791257238712	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_7_1791257238717	sekolah_user_7_1791257238717	credential	sekolah_user_7_1791257238717	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_8_1791257238721	sekolah_user_8_1791257238721	credential	sekolah_user_8_1791257238721	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
aR1N8FCIkpqLwkSgyX8KB3twyIYio2HT	DcD6TFEg2U3i1a6uvQnAqcmgsypGztOB	credential	DcD6TFEg2U3i1a6uvQnAqcmgsypGztOB	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-08-05 15:24:58.186	2026-08-05 15:24:58.186
8cOFoX4rD6231H2NsG0twhOTLzytdMRV	F3muO6pZQbw9BvZaIJXCVxon1ws4LBAX	credential	F3muO6pZQbw9BvZaIJXCVxon1ws4LBAX	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-08-05 15:18:49.61	2026-08-05 15:18:49.61
ULiEyXqLfPXxbjYDg7UiFkWJrY850Jgq	D7sxIVBI3QWrOVgCCpcxesqmhHUJ1eZY	credential	D7sxIVBI3QWrOVgCCpcxesqmhHUJ1eZY	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-08-05 15:19:36.565	2026-08-05 15:19:36.565
qZ05IZt8Bze7CdMBLvu0FAipeDN7YDKO	FzmZmuQKqlCvfu6WGyehYwCeX7aBYuB5	credential	FzmZmuQKqlCvfu6WGyehYwCeX7aBYuB5	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-08-06 01:28:46.687	2026-08-06 01:28:46.687
reT7VoJscqvoNqzEuKieFzqwwsBG4JLh	uQcpC7ITHLZzyHlKbRfGvz9CMDevv1Yr	credential	uQcpC7ITHLZzyHlKbRfGvz9CMDevv1Yr	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-08-06 01:28:47.192	2026-08-06 01:28:47.192
V1rhe0GXPMW8nkJq7csZm5kHym3lHgyV	3Hfv1a9QnuJ2HUYvofT9AvtbUzSgDewf	credential	3Hfv1a9QnuJ2HUYvofT9AvtbUzSgDewf	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-08-06 01:28:47.656	2026-08-06 01:28:47.656
UkK3lGpLXjgyxISnek4UKp08skdu0gna	JgMcBdIKre0A7AB55mbmVGlcQf4aNJi9	credential	JgMcBdIKre0A7AB55mbmVGlcQf4aNJi9	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-08-06 01:28:48.172	2026-08-06 01:28:48.172
3qd7lgYNUwxNvP1El9X8wiJVuMSEhWAD	PzlimWqn7rDrdL8MY0RIjpfDMRaqch7L	credential	PzlimWqn7rDrdL8MY0RIjpfDMRaqch7L	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-08-06 01:28:48.586	2026-08-06 01:28:48.586
account_sekolah_9_1791257238749	sekolah_user_9_1791257238749	credential	sekolah_user_9_1791257238749	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_10_1791257238776	sekolah_user_10_1791257238776	credential	sekolah_user_10_1791257238776	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_11_1791257238794	sekolah_user_11_1791257238794	credential	sekolah_user_11_1791257238794	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_12_1791257238802	sekolah_user_12_1791257238802	credential	sekolah_user_12_1791257238802	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_13_1791257238807	sekolah_user_13_1791257238807	credential	sekolah_user_13_1791257238807	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_14_1791257238813	sekolah_user_14_1791257238813	credential	sekolah_user_14_1791257238813	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_15_1791257238825	sekolah_user_15_1791257238825	credential	sekolah_user_15_1791257238825	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_16_1791257238829	sekolah_user_16_1791257238829	credential	sekolah_user_16_1791257238829	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_17_1791257238832	sekolah_user_17_1791257238832	credential	sekolah_user_17_1791257238832	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_18_1791257238835	sekolah_user_18_1791257238835	credential	sekolah_user_18_1791257238835	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_19_1791257238839	sekolah_user_19_1791257238839	credential	sekolah_user_19_1791257238839	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_20_1791257238843	sekolah_user_20_1791257238843	credential	sekolah_user_20_1791257238843	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_21_1791257238846	sekolah_user_21_1791257238846	credential	sekolah_user_21_1791257238846	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_22_1791257238849	sekolah_user_22_1791257238849	credential	sekolah_user_22_1791257238849	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_23_1791257238853	sekolah_user_23_1791257238853	credential	sekolah_user_23_1791257238853	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_24_1791257238856	sekolah_user_24_1791257238856	credential	sekolah_user_24_1791257238856	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_25_1791257238858	sekolah_user_25_1791257238858	credential	sekolah_user_25_1791257238858	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_26_1791257238862	sekolah_user_26_1791257238862	credential	sekolah_user_26_1791257238862	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_27_1791257238866	sekolah_user_27_1791257238866	credential	sekolah_user_27_1791257238866	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_28_1791257238868	sekolah_user_28_1791257238868	credential	sekolah_user_28_1791257238868	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_29_1791257238871	sekolah_user_29_1791257238871	credential	sekolah_user_29_1791257238871	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_30_1791257238874	sekolah_user_30_1791257238874	credential	sekolah_user_30_1791257238874	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_31_1791257238878	sekolah_user_31_1791257238878	credential	sekolah_user_31_1791257238878	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_32_1791257238882	sekolah_user_32_1791257238882	credential	sekolah_user_32_1791257238882	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_33_1791257238885	sekolah_user_33_1791257238885	credential	sekolah_user_33_1791257238885	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_34_1791257238889	sekolah_user_34_1791257238889	credential	sekolah_user_34_1791257238889	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_35_1791257238894	sekolah_user_35_1791257238894	credential	sekolah_user_35_1791257238894	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_36_1791257238898	sekolah_user_36_1791257238898	credential	sekolah_user_36_1791257238898	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_37_1791257238902	sekolah_user_37_1791257238901	credential	sekolah_user_37_1791257238901	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_38_1791257238905	sekolah_user_38_1791257238905	credential	sekolah_user_38_1791257238905	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_39_1791257238908	sekolah_user_39_1791257238908	credential	sekolah_user_39_1791257238908	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_40_1791257238911	sekolah_user_40_1791257238911	credential	sekolah_user_40_1791257238911	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_41_1791257238914	sekolah_user_41_1791257238914	credential	sekolah_user_41_1791257238914	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_42_1791257238918	sekolah_user_42_1791257238918	credential	sekolah_user_42_1791257238918	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_43_1791257238921	sekolah_user_43_1791257238921	credential	sekolah_user_43_1791257238921	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_44_1791257238925	sekolah_user_44_1791257238925	credential	sekolah_user_44_1791257238925	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_45_1791257238928	sekolah_user_45_1791257238928	credential	sekolah_user_45_1791257238928	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_46_1791257238930	sekolah_user_46_1791257238930	credential	sekolah_user_46_1791257238930	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_47_1791257238933	sekolah_user_47_1791257238933	credential	sekolah_user_47_1791257238933	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_48_1791257238937	sekolah_user_48_1791257238937	credential	sekolah_user_48_1791257238937	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_49_1791257238940	sekolah_user_49_1791257238940	credential	sekolah_user_49_1791257238940	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_50_1791257238943	sekolah_user_50_1791257238943	credential	sekolah_user_50_1791257238943	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
yVguPeLlfEjn9P5EprtFdZNMXlfE936A	VfUndop1nWSrHLRW8ZzjD5ZlknGqO72j	credential	VfUndop1nWSrHLRW8ZzjD5ZlknGqO72j	\N	\N	\N	\N	\N	\N	63cf9cfba125e36047ceb1e7d9fa7f94:3728b6177564b132479d2878e00cdce145f64cb26887c74fc7cf01921cff13c452fa7a70a0dba4e33f34e7062c0a02376ade4d0317480ed666771aff0bab7f03	2026-09-07 10:10:29.444	2026-09-07 10:10:29.444
mUNqgtbY7B3WZWisIEGLUwJwNp79ZrzE	RZBha9s4SFRQ0127nLSNtFkqfDG1tf1f	credential	RZBha9s4SFRQ0127nLSNtFkqfDG1tf1f	\N	\N	\N	\N	\N	\N	40fda3e0548b5adceffd138f9e4b4359:29c1a1e61c92d1c5c57877f4d1a5be7db903c9696416e184bf809b3da80c685069cf7aaf99b15d05ffd439af313b2071894186c0cf47cb560471bc60aaba7928	2026-09-07 10:10:29.652	2026-09-07 10:10:29.652
O7uaijYoNEXnmLJYq7ywBe7HLOaVeJYD	V6iTjPzMG6yRBKoCcRnEmwmsfF0TP56P	credential	V6iTjPzMG6yRBKoCcRnEmwmsfF0TP56P	\N	\N	\N	\N	\N	\N	2effb3b7e852277e206e4a015523235b:c127a7232a50f770d973b097841af394a85ef1a58f159cdf4b3174d59d6fea109c6a047989118a547cbcfa12cf834a0c5d087432b93a0f14a1b78fbba0ace272	2026-09-07 10:10:29.836	2026-09-07 10:10:29.836
8RLtV9H9ZrM20GqEx1xW7rkcioyRuarP	PKCWsMz5t7LmrqrODkO80BqfoTim6jPH	credential	PKCWsMz5t7LmrqrODkO80BqfoTim6jPH	\N	\N	\N	\N	\N	\N	2d93b2ebdf0f00c5d4ca8a57964fc7e5:4055a4b5fb7bbfc6b3c6a825919ff22d98d75115d09362f4be3e71fad88ffa0f2adcba80dcadbfab4fd3da46aa42025d9f49cbec6da27993aba310544a9ac249	2026-09-07 10:10:30.019	2026-09-07 10:10:30.019
lJ0pCFfOkN8WwYZzFRvfXV8aRMrQrihr	WBaRiHk6gvAOFL3Q5VWPYfggdNhlN16k	credential	WBaRiHk6gvAOFL3Q5VWPYfggdNhlN16k	\N	\N	\N	\N	\N	\N	d749bd587cc520dcede2da838fc61b12:2b603d4d615d57cb47ab8b68bef234fec85bea401561ccb0dd7146527cec12322232b3de2a83dfae2442bd8eb707a2dfe2f0342d9e66200cdb56568708b890f0	2026-09-07 10:10:30.194	2026-09-07 10:10:30.194
9OU82eQlhYtzjYPjOPHWjWNiROYLi4QR	VVbi2nEJkN6JKVt82wuxz5rirnoGgUkD	credential	VVbi2nEJkN6JKVt82wuxz5rirnoGgUkD	\N	\N	\N	\N	\N	\N	33454ff6fe4595f0585b45914144c8c3:fc635190cc15d752f551d64c368825265125af3ec80d17d2dcc494d3ea073d0dab572b77c321bcf6c9fe4b5e7ed983f1bdc6f38575939d2afb0eb8e6bb3851bc	2026-09-07 10:10:30.386	2026-09-07 10:10:30.386
bZI8JtlupymkajazxCSi5XNrZuwmqw93	Oaw3RzwC2cEjgvFg4V3CHP1NFityTNHL	credential	Oaw3RzwC2cEjgvFg4V3CHP1NFityTNHL	\N	\N	\N	\N	\N	\N	59fdd8bfc8a76d6af627ff960fb756fe:1093d8060a90ef97ffaaadd94d5ffb4318fb3d59e547d76916f39911651d3f02c15845f1024fd699d50221fd94ba376585c0ce4b141c4f3212bdc763a1c7ae77	2026-09-07 10:10:30.577	2026-09-07 10:10:30.577
account_sekolah_51_1791257238946	sekolah_user_51_1791257238946	credential	sekolah_user_51_1791257238946	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
nNnzutz6cm9xKPqDK1NcVYNGr7VJ7RJk	MOnUZMhPIsYD8MeVCa18xTGJwX80FbBg	credential	MOnUZMhPIsYD8MeVCa18xTGJwX80FbBg	\N	\N	\N	\N	\N	\N	2af6f88906adb255a2f3cc21d5891715:e49bbba2d832b87b4810ac9b9c4f2389d257f6b63eed540700927127f919d242027853e0e93d32d0fcac1ad883911bec915bebf09dfd067071608d356c843879	2026-09-07 10:10:30.803	2026-09-07 10:10:30.803
8G9N30RyaWpaasyBoOfPJfHxqcwKTi0i	xxPcK4Koz52MBuvq4nNW0zydPwasnrg1	credential	xxPcK4Koz52MBuvq4nNW0zydPwasnrg1	\N	\N	\N	\N	\N	\N	584ba8e8696c9aab8eda31ebc4a869a1:cf25ebe817c54fc2cddee311a77294de5bb4ee8b42ee1f793e74da9ea0fcb82f1bfd3aa0cfaaa96f3bbd4146d49a8f3b7b14dd9e77a4523e1eff6b2aa33aeb54	2026-09-07 10:10:30.999	2026-09-07 10:10:30.999
5TMKEvQ0WFgFqbcemIdHLUKF6Qy5gOR7	mtVVv75f2yHzeSMPZJTDTFRt8DWPXEMg	credential	mtVVv75f2yHzeSMPZJTDTFRt8DWPXEMg	\N	\N	\N	\N	\N	\N	80c76c38774617b48ed2a0b8096fab17:233850d87bba4bc7515c561d6ae598b634edf26db14f55c05af81001d04aea552876f68584611bbc844ce64b0afd06acdcb628285378ff5bb6232fd13577a191	2026-09-07 10:10:31.174	2026-09-07 10:10:31.174
36TpCEyM7sbDz2YmBgoYAgTHwte6H9eJ	CRFTMVKIhpGXErJqZ2LdOQhbRXBDW2Xk	credential	CRFTMVKIhpGXErJqZ2LdOQhbRXBDW2Xk	\N	\N	\N	\N	\N	\N	1a8ce8e0051140f307abfcfd838d4b4e:bcc40c97977896f021f5c90e7c815ae90530eb626c3649fabd132e37b25c71cf4bc2df3381c9bd76c12341140f5029211013adc9acd73209763aee47634d24be	2026-09-07 10:10:31.369	2026-09-07 10:10:31.369
crE982GwcNl1xKoyVgVT99qBUPCknmui	mIQPPpLasGPF10hcv169nWToFgJ5O4sQ	credential	mIQPPpLasGPF10hcv169nWToFgJ5O4sQ	\N	\N	\N	\N	\N	\N	2eec4ee012304657b25d5c9c76c9ac02:b23647aae440b9770f131d9fce81f5d5ae35c6a000866cde8e821eb083c475f030b002aaf623fdeca9afd31aff187e319e4b868c646045271afed041eb16d933	2026-09-07 10:10:31.552	2026-09-07 10:10:31.552
ZwJvl8ZEonoBfzarZw9ahbNVgxyKsdrm	r3ExbT8pJA3HnBdqzk587rBJAwRGDPcr	credential	r3ExbT8pJA3HnBdqzk587rBJAwRGDPcr	\N	\N	\N	\N	\N	\N	5f780b165b96a9418619bdd7a5742d60:22d82c37bbc76c6940ca7a3210e512dadb68c94654ce70cec97a92e053d3490839d5f4f62c62984129d8cfb23f98200eb1bedfa1c065544d00f2c72f590d82e2	2026-09-07 10:10:31.727	2026-09-07 10:10:31.727
EpjGtNpr53JzeGSrwdVF4yC4kaZX8Mgx	YNoqOx8TbqFJRVNtEVsaoUN9vQKGJa7r	credential	YNoqOx8TbqFJRVNtEVsaoUN9vQKGJa7r	\N	\N	\N	\N	\N	\N	d363c4e661ce946b760487e3c9255b1d:c7e9fe4c5336dc352f49a75c66a207921cd4c62997f7e5d2cd74f6e8f3b00bc4514bbcc308f60318cdd2b33bf7e73d7ecc125f42f9639b6d72dfae7440cce71b	2026-09-07 10:10:31.919	2026-09-07 10:10:31.919
2HeRAZeJvzptjGVMsm3veSIrcsSye5iE	WfqmHnjZhDhKleDJbtDb9MQ0qz3lHQv3	credential	WfqmHnjZhDhKleDJbtDb9MQ0qz3lHQv3	\N	\N	\N	\N	\N	\N	f63a38b940cdd795759ede512b268eb3:657a0405263189ccf698c2d7952da90a435d2aec15331fa4f6f7bdd9be382e08da429a01beac4a3192ea3cde40d50b307f8f976d227fdb3fcde5298a962a1182	2026-09-07 10:10:32.111	2026-09-07 10:10:32.111
6eSUIMKByRV2rC7YNG1JjH3RB1X6hMJH	QkaJZ8vWPfXA3oUCpp9e1CkMPEvRST3t	credential	QkaJZ8vWPfXA3oUCpp9e1CkMPEvRST3t	\N	\N	\N	\N	\N	\N	1409582c6679efaa35df9627293adcbb:168f1db47fd1aae86766303f59fbd17644442b80009bfeafb28b399ac8f14a913a5f4775b72d05f00c8a6286935d847953c5b9894ab57123fdca0d9f9691af65	2026-09-07 10:10:32.303	2026-09-07 10:10:32.303
VFvfK1Ka0NAisDarMUJFHWjmsjiyDPhI	76L8PTFMqYlnurediMRIJAGLebr0pZZa	credential	76L8PTFMqYlnurediMRIJAGLebr0pZZa	\N	\N	\N	\N	\N	\N	4d590b9a8848938ffde521c8a57940b5:97798d063e04503e50d5470b3caa1f21ba6b24b3d6cfa02c2fa1629fd546542ba9938c5192330e6fd3700ffe2e792871f6452e847e878fe66240533fb1db295a	2026-09-07 10:10:32.511	2026-09-07 10:10:32.511
QjvsechyYG0o8F96D9yYFToTqUGqv7Ua	LXQTJP3w0Nzz0X3wiMBx9F3TF3TuwhqF	credential	LXQTJP3w0Nzz0X3wiMBx9F3TF3TuwhqF	\N	\N	\N	\N	\N	\N	351bf96f6a172dc69d5a701c453a853b:49c7ad0870c2043565f0727075362fd24ce04872d5a441b7215e46657d89ca25a0dbc179b4baacd0fb3d000a6582080957ae32e32d2bd568bb13a317d429874a	2026-09-07 10:10:32.778	2026-09-07 10:10:32.778
4ijs2Fmux7PyiCm0PHWwlUirUkr7k5zD	hx6qOcUol54sGF1FjRG1PdMfAsxwrpbR	credential	hx6qOcUol54sGF1FjRG1PdMfAsxwrpbR	\N	\N	\N	\N	\N	\N	1a371bd0022a5e999f3255779aa5d007:28975fc4114eb8e06b3f5bf6f24e137906477d6273fba95b372bc00bc5036a56d5cdccb044333ad1ec54d31148f9a3586925163cb86fd3ff4102eb3b617828d4	2026-09-07 10:10:32.97	2026-09-07 10:10:32.97
2XAavOhkNIGS7EFURDJcyoVhmMf8fwDK	2pUGrFQOlJ5o5UIXErjqXDv21IH8APqY	credential	2pUGrFQOlJ5o5UIXErjqXDv21IH8APqY	\N	\N	\N	\N	\N	\N	1ec7c2af4a04fcb2314017f9d2dcbe66:b70ba15e698eea3f0192083e6ca65188ddff5f69213ed06a9091c4d42f94f5302491900e60fa848d6a5e7cd9e00a381bc0bf41cf7a0480bbe44560000fa3f9b4	2026-09-07 10:10:33.179	2026-09-07 10:10:33.179
dWIWJpFbVG4NaKQ2wbhweGjg7jQg867K	t6XhzoA2BEor8YnzzyxGn6fvpmXpGmp3	credential	t6XhzoA2BEor8YnzzyxGn6fvpmXpGmp3	\N	\N	\N	\N	\N	\N	5696d50c0306eea9828421c32bba7c76:189af58e6f31e482456bddb286923012bd896950114136257c0df5a667e4654bbd627194c576f44975ab1f0389f721e245c3aae88b83916b23afbb12d4baebc0	2026-09-07 10:10:33.383	2026-09-07 10:10:33.383
OM3DUegkxSIPCsO1H74orH6kEgSoSA3w	IXBS2ErppZvGPFfYIcvRrnfo82rCbwsP	credential	IXBS2ErppZvGPFfYIcvRrnfo82rCbwsP	\N	\N	\N	\N	\N	\N	31f4eb126543b0836477e30fc7421c41:e9e33573c1159bbc3913a136f39cb636573882c9c0e1b1ba06b3e543d017a0971d0590ceea03bc66e762ff9637dda7ffc9946844a73e954eddc6fdcc3d821fa0	2026-09-07 10:10:33.578	2026-09-07 10:10:33.578
fQeSPjDRfiuOFk1Vv2t1gQiXkHeBdKdu	aKKTGhe52LRl5mzTrENWBn9xs4T39Nfl	credential	aKKTGhe52LRl5mzTrENWBn9xs4T39Nfl	\N	\N	\N	\N	\N	\N	399f499e1eec9c44e202b88d51d0c717:16a675faccfa830c837356660b7596b34ea44fba1f448f08a99897d610a3d73a521210d2edee658b3655fa024aac4ff5a4113f11f4d050643b28b79618b711eb	2026-09-07 10:10:33.837	2026-09-07 10:10:33.837
IbUOrjOWKnXhXnarqbxitpbbm0MJfz0I	9XbAKzSfkrS50Zeo6cAq5gqEON4KIBc4	credential	9XbAKzSfkrS50Zeo6cAq5gqEON4KIBc4	\N	\N	\N	\N	\N	\N	6a50625f51e0d94a3f50ffebf8aabfd0:a41063ae4dfb512f6c79aea740b7cdcaabbf6fd34edf36a43516039b0c503995fbfdb6fa4ac74468c8757bb9a68ebd863c4e5a45bc306477d1c15f584bbfbb88	2026-09-07 10:10:34.028	2026-09-07 10:10:34.028
m4Clvz05KjpAXQAka3wVVKbCDrsswahO	RZlfJJ4DELzr3uu04Eko5TWRPJSWCa0f	credential	RZlfJJ4DELzr3uu04Eko5TWRPJSWCa0f	\N	\N	\N	\N	\N	\N	ee964ed41cac03852241e4d96b62c753:05d1404e64da00bdaf75f33a4656989f4bf500ffbf9633480c1d5bc97276549ced80e5afc3b385caa8c8bd0aec2ba58a787f6fe8895f82acbbf44b594cb0e0a2	2026-09-07 10:10:34.237	2026-09-07 10:10:34.237
UYp4rUrTUqjkax8MW6GqxzSMS1CEUDty	f1QSaxSyGMnwSGdKT71vAlmPsvCG39do	credential	f1QSaxSyGMnwSGdKT71vAlmPsvCG39do	\N	\N	\N	\N	\N	\N	f68eedf5b229836a219c0f738f882a80:89bf08063d55d58d91942bf6af2f1104b483f314af5c73d392b00f30c8b9f889111870ff2bb6b0f0ae045a3c996b9f2c659a28aaed3e551f82ce659825718d7a	2026-09-07 10:10:34.462	2026-09-07 10:10:34.462
ruNkGB1JPPsnu2GTrKrshfsLPKvbUtzS	gd4w9oIMkzTwtGATgVeS8N2DkaG0FHaR	credential	gd4w9oIMkzTwtGATgVeS8N2DkaG0FHaR	\N	\N	\N	\N	\N	\N	8bd795114e4fc05d30c27c0ae2b9157c:5fefeeb3434e8201014985dfc71857438e778d3d3785b2303eacd209793fe0ee7a580e2c8609ab54b7b528435e5d904644e719be4302029e8cba89780dd288d0	2026-09-07 10:10:34.637	2026-09-07 10:10:34.637
6b3RFqlKJAcpahe89kwYFfDYAuuQEWWY	SChWwr7bqDrmxCA5DmiyIVgTjElT3b44	credential	SChWwr7bqDrmxCA5DmiyIVgTjElT3b44	\N	\N	\N	\N	\N	\N	d832d68b0afb8abc3e9c15db1fe284c3:3d227f4fe76c2a9d295b707585c75bd309db80769ad09f463ee6f8f2ad5ecf7d9732e9302aa9ac8be3f9f745b1844ce92c31a1f81b0a4d8e20b01dc18920c135	2026-09-07 10:10:34.875	2026-09-07 10:10:34.875
MLsJdTHKRHsCcZoB7xYGvCc65pnREk7E	SYcYeYfho7FZa0WqYqv3cQiyf0Ed4aFU	credential	SYcYeYfho7FZa0WqYqv3cQiyf0Ed4aFU	\N	\N	\N	\N	\N	\N	303fae14d3ed4d3efb472ff1758aa943:6f11b05bcf009643456de3504ac5052e41561278517b1488649ed7a1154b34fa04b395ab226847ead3710148f3c7b26cf8fb778e995772e9d925c01a1a842759	2026-09-07 10:10:35.102	2026-09-07 10:10:35.102
lVaTjMkHyggt8eZ6Nt4YeaG79Ptb10Lw	zNSMGFpNdSt1ZyM2ilw1QqPdWWNvEuWl	credential	zNSMGFpNdSt1ZyM2ilw1QqPdWWNvEuWl	\N	\N	\N	\N	\N	\N	55ce947c261d3b2ac41aaef6c1777e18:1aa78c2b948140673e8dfd32672febe27709cbab5cfc4710a566bb2432241484dedbbb406478544c3f5de71464fe2095da68f12c8d2018135a55b2f2862b21b2	2026-09-07 10:10:35.292	2026-09-07 10:10:35.292
hQsrD9CpQtov1tFqvKgMm2I0KakprZSW	oLJrDOUnsVmMl3HldM5rnZMdiMpdt1Bd	credential	oLJrDOUnsVmMl3HldM5rnZMdiMpdt1Bd	\N	\N	\N	\N	\N	\N	702c9f37c6433b24a63a1592786adbb4:cd6d2930ebe855ba34a2e7c4082fc95933c09fc3aec93f71d59b4228650ca8136f1d074f6e2354c2b3a7500a045808d5056900b8d17f34c9bd8fc6516560d553	2026-09-07 10:10:35.492	2026-09-07 10:10:35.492
PobJHwnCxAdknHQDhuuIiNFapareSojx	LUQiBs90U3zcyJJPDl1XWbHIwLdAwC6d	credential	LUQiBs90U3zcyJJPDl1XWbHIwLdAwC6d	\N	\N	\N	\N	\N	\N	9a6cb91d907c186e86fdb8071a96a5b7:f0dfef6b850be60c1517106aad21897eb8287ca2ce2ebb992cc243a6f556d3fc4a5b003c060f7bdbaea00032fdda1e300ef1a793409f1e171d4ddcd7d35d4e5c	2026-09-07 10:10:35.704	2026-09-07 10:10:35.704
mthh6hffvgFPPg4IbdZiG1oWqZ9rh7En	kkhJ3heiCMQwWu86VBgvSiIIVEXARGSK	credential	kkhJ3heiCMQwWu86VBgvSiIIVEXARGSK	\N	\N	\N	\N	\N	\N	0fd6406d79af9482ba8a181d4aec9bce:3db397d55c2834950927d5e71a957b6a5fb27f2e9d3d398cb664714dbd1254081d68d4033f10ff0a6c287bcd5ff893cd0de214ac130730cbca4ea0e18c866fb4	2026-09-07 10:10:35.884	2026-09-07 10:10:35.884
ICC8m4ziNxvlnFfVu6ETIvVykg0yUmCh	mUrj3IIaO4LPKvd8RzFAn5aT0OMmaXKW	credential	mUrj3IIaO4LPKvd8RzFAn5aT0OMmaXKW	\N	\N	\N	\N	\N	\N	c6a5a2a460a35fc8155e4cfb42393eab:a3e3bd9eb5d061ba7b32715e3353a4dad0e649cffe81db1ec04a232690832790a7aa3c4e7189162006d4f7d3c7cddbeb413cb1985528ba7ee13f9253a0e59295	2026-09-07 10:10:36.079	2026-09-07 10:10:36.079
LZSJU12KGsnK6KsmDH0xSYF0iIyywMPT	RE01yPcQq7LjARQNyj4x9jZO7oUsbIfZ	credential	RE01yPcQq7LjARQNyj4x9jZO7oUsbIfZ	\N	\N	\N	\N	\N	\N	7abd1a0611e0ab3b7661aa5d0f677334:d789573e0d20f1e14dc7ec7c6bc44e89f7703f913abb0b484d5da3454be179f21f3371e998e92d8b5c9fca4c6ba57c61b3602bafd59e1e0207ffdc54ed0aad3b	2026-09-07 10:10:36.253	2026-09-07 10:10:36.253
account_sekolah_52_1791257238949	sekolah_user_52_1791257238949	credential	sekolah_user_52_1791257238949	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_53_1791257238951	sekolah_user_53_1791257238951	credential	sekolah_user_53_1791257238951	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_54_1791257238954	sekolah_user_54_1791257238954	credential	sekolah_user_54_1791257238954	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_55_1791257238958	sekolah_user_55_1791257238958	credential	sekolah_user_55_1791257238958	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_sekolah_56_1791257238960	sekolah_user_56_1791257238960	credential	sekolah_user_56_1791257238960	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_posyandu_1_1791257238965	posyandu_user_1_1791257238965	credential	posyandu_user_1_1791257238965	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_posyandu_2_1791257238970	posyandu_user_2_1791257238970	credential	posyandu_user_2_1791257238970	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_posyandu_3_1791257238977	posyandu_user_3_1791257238977	credential	posyandu_user_3_1791257238977	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_posyandu_4_1791257238980	posyandu_user_4_1791257238980	credential	posyandu_user_4_1791257238980	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_posyandu_5_1791257238984	posyandu_user_5_1791257238984	credential	posyandu_user_5_1791257238984	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_posyandu_6_1791257238988	posyandu_user_6_1791257238988	credential	posyandu_user_6_1791257238988	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_posyandu_7_1791257239004	posyandu_user_7_1791257239004	credential	posyandu_user_7_1791257239004	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_posyandu_8_1791257239008	posyandu_user_8_1791257239008	credential	posyandu_user_8_1791257239008	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_posyandu_9_1791257239011	posyandu_user_9_1791257239011	credential	posyandu_user_9_1791257239011	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_posyandu_10_1791257239014	posyandu_user_10_1791257239014	credential	posyandu_user_10_1791257239014	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_posyandu_11_1791257239017	posyandu_user_11_1791257239017	credential	posyandu_user_11_1791257239017	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_posyandu_12_1791257239020	posyandu_user_12_1791257239020	credential	posyandu_user_12_1791257239020	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_posyandu_13_1791257239024	posyandu_user_13_1791257239024	credential	posyandu_user_13_1791257239024	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_posyandu_14_1791257239028	posyandu_user_14_1791257239028	credential	posyandu_user_14_1791257239028	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
account_posyandu_15_1791257239032	posyandu_user_15_1791257239032	credential	posyandu_user_15_1791257239032	\N	\N	\N	\N	\N	\N	1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675
\.


--
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_log (audit_id, user_id, tabel_nama, record_id, aksi, data_lama, data_baru, tanggal) FROM stdin;
\.


--
-- Data for Name: desa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.desa (desa_id, kecamatan_id, nama_desa) FROM stdin;
1	1	Muara Ciujung Timur
2	1	Cijoro Pasir
3	2	Pasar Keong
11	30	Sukamanah
12	30	Malingping Selatan
13	30	Cilangkahan
14	30	Pagelaran
15	30	Kersaratu
16	30	Sukaraja
17	30	Kadujajar
18	30	Malingping Utara
19	30	Rahong
20	30	Sanghiang
21	30	Bolang
22	30	Sumber Waras
23	30	Cipeundeuy
24	30	Senanghati
25	36	Muara
26	36	Wanasalam
27	36	Sukatani
28	36	Cikeusik
29	36	Bejod
30	36	Cipedang
31	36	Cisarap
32	36	Parungsari
33	36	Cipeucang
34	36	Parungpanjang
35	36	Ketapang
36	36	Cilangkap
37	36	Karang Pamindangan
38	32	Situregen
39	32	Sukajadi
40	32	Hegarmanah
41	32	Panggarangan
42	32	Mekarjaya
43	32	Sindangratu
44	32	Cimandiri
45	32	Sogong
46	32	Jatake
47	32	Cibarengkok
48	16	Pondokpanjang
49	16	Ciparahu
50	16	Cihara
51	16	Karangkamulyan
52	16	Panyaungan
53	16	Mekarsari
54	16	Lebak Peundeuy
55	16	Citepuseun
56	16	Barunai
57	11	Bayah Barat
58	11	Darmasari
59	11	Sawarna
60	11	Cidikit
61	11	Bayah Timur
62	11	Cimancak
63	11	Suwakan
64	11	Pasirgombong
65	11	Cisuren
66	11	Pamubulan
67	11	Sawarna Timur
68	20	Cibareno
69	20	Cilograng
70	20	Lebaktipar
71	20	Cikatomas
72	20	Cijengkol
73	20	Pasirbungur
74	20	Cikamunding
75	20	Girimukti
76	20	Cireundeu
77	20	Gunungbatu
78	14	Cikotok
79	14	Cibeber
80	14	Warungbanten
81	14	Neglasari
82	14	Mekarsari
83	14	Cikadu
84	14	Kujangjaya
85	14	Cisungsang
86	14	Hegarmanah
87	14	Cihambali
88	14	Sukamulya
89	14	Citorek Tengah
90	14	Citorek Timur
91	14	Citorek Kidul
92	14	Kujangsari
93	14	Situmulya
94	14	Sinargalih
95	14	Wanasari
96	14	Gunung Wangun
97	14	Citorek Barat
98	14	Ciherang
99	14	Citorek Sabrang
100	17	Kandangsapi
101	17	Cihujan
102	17	Ciapus
103	17	Cijaku
104	17	Mekarjaya
105	17	Cipalabuh
106	17	Cibeureum
107	17	Cimenga
108	17	Sukasenang
109	17	Kapunduhan
110	15	Peucangpari
111	15	Cibungur
112	15	Cikaret
113	15	Cikadongdong
114	15	Cikaratuan
115	15	Mugijaya
116	15	Cigemblong
117	15	Cikate
118	15	Wangunjaya
119	10	Kertaraharja
120	10	Kerta
121	10	Bojongjuruh
122	10	Lebakkeusik
123	10	Leuwiipuh
124	10	Tamansari
125	10	Cilegong Ilir
126	10	Cisampih
127	10	Jalupang Girang
128	10	Cidahu
129	10	Keusik
130	10	Ciruji
131	10	Cibaturkeusik
132	10	Bendungan
133	10	Kumpay
134	10	Gunungsari
135	10	Kaduhauk
136	10	Labanjaya
137	10	Umbuljaya
138	10	Kertarahayu
139	19	Mekarjaya
140	19	Pasindangan
141	19	Kujangsari
142	19	Parungkujang
143	19	Cikareo
144	19	Cileles
145	19	Margamulya
146	19	Cipadang
147	19	Daroyon
148	19	Prabugantungan
149	19	Banjarsari
150	49	Cimanyangray
151	49	Keramatjaya
152	49	Bulakan
153	49	Cicaringin
154	49	Ciakar
155	49	Cisampang
156	49	Bojong Koneng
157	49	Ciginggang
158	49	Gunung Kencana
159	49	Sukanegara
160	49	Tanjungsari Indah
161	12	Keboncau
162	12	Cimayang
163	12	Parakanbeusi
164	12	Bojongmanik
165	12	Mekarmanik
166	12	Kadurahayu
167	12	Harjawana
168	12	Mekar Rahayu
169	12	Pasir Bitung
170	23	Parakanlima
171	23	Kadudamas
172	23	Datarcae
173	23	Karoya
174	23	Nangerang
175	23	Cirinten
176	23	Karangnunggal
177	23	Cempaka
178	23	Badur
179	23	Cibarani
180	28	Kanekes
181	28	Nayagati
182	28	Bojong Menteng
183	28	Cisimeut
184	28	Margawangi
185	28	Sangkanwangi
186	28	Jalupang Mulya
187	28	Leuwidamar
188	28	Cibungur
189	28	Lebak Parahiang
190	28	Wantisari
191	28	Cisimeut Raya
192	31	Pasireurih
193	31	Pasirnangka
194	31	Cikarang
195	31	Ciminyak
196	31	Leuwicoo
197	31	Muncang
198	31	Sukanagara
199	31	Sindangwangi
200	31	Jagaraksa
201	31	Tanjungwangi
202	31	Mekarwangi
203	31	Giri Jagabaya
204	35	Sinarjaya
205	35	Cirompang
206	35	Sukamaju
207	35	Majasari
208	35	Ciparasi
209	35	Sindanglaya
210	35	Sobang
211	35	Sukajaya
212	35	Hariang
213	35	Sukaresmi
214	22	Pasirhaur
215	22	Girilaya
216	22	Jayapura
217	22	Giriharja
218	22	Bintangsari
219	22	Cipanas
220	22	Luhurjaya
221	22	Sipayung
222	22	Bintangresmi
223	22	Malangsari
224	22	Sukasari
225	22	Haurgajrug
226	22	Talagahiang
227	22	Harumsari
228	27	Lebakgedong
229	27	Lebaksitu
230	27	Ciladaeun
231	27	Banjarsari
232	27	Lebaksangka
233	27	Banjar Irigasi
234	34	Maraya
235	34	Margaluyu
236	34	Sukamarga
237	34	Sindangsari
238	34	Sajiramekar
239	34	Sajira
240	34	Sukarame
241	34	Calungbungur
242	34	Sukajaya
243	34	Paja
244	34	Mekarsari
245	34	Pajagan
246	34	Parungsari
247	34	Bungur Mekar
248	34	Ciuyah
249	21	Sarageni
250	21	Jayasari
251	21	Margatirta
252	21	Gunung Anten
253	21	Sangkan Manik
254	21	Sudamanik
255	21	Girimukti
256	21	Jayamanik
257	21	Margaluyu
258	21	Sangiang Jaya
259	21	Tambak
260	21	Marga Jaya
261	21	Cimarga
262	21	Mekar Jaya
263	21	Inten Jaya
264	21	Karya Jaya
265	21	Mekarmulya
266	18	Anggalan
267	18	Muaradua
268	18	Muncangkopong
269	18	Taman Jaya
270	18	Curugpanjang
271	18	Cikulur
272	18	Cigoong Selatan
273	18	Cigoong Utara
274	18	Sumurbandung
275	18	Sukaharja
276	18	Sukadaya
277	18	Parage
278	18	Pasir Gintung
279	4	Pasirtangkil
280	4	Sukarendah
281	4	Selaraja
282	4	Warunggunung
283	4	Cibuah
284	4	Baros
285	4	Sindangsari
286	4	Banjarsari
287	4	Cempaka
288	4	Padasuka
289	4	Sukaraja
290	4	Jagabaya
291	3	Tambakbaya
292	3	Bojongleles
293	3	Kaduagung Timur
294	3	Kaduagung Barat
295	3	Malabar
296	3	Pasar Keong
297	3	Cibadak
298	3	Panancangan
299	3	Asem
300	3	Cisangu
301	3	Bojongcae
302	3	Kaduagung Tengah
303	3	Mekar Agung
304	3	Asem Margaluyu
305	3	Cimenteng Jaya
306	2	Pasir Tanjung
307	2	Rangkasbitung Timur
308	2	Rangkasbitung Barat
309	2	Muara Ciujung Timur
310	2	Jatimulya
311	2	Cimangeungteung
312	2	Citeras
313	2	Mekarsari
314	2	Nameng
315	2	Kolelet Wetan
316	2	Sukamanah
317	2	Pabuaran
318	2	Cijoro Pasir
319	2	Cijoro Lebak
320	2	Muara Ciujung Barat
321	2	Narimbang Mulia
322	26	Cilangkap
323	26	Pasir Kupa
324	26	Aweh
325	26	Sukamekarsari
326	26	Kalanganyar
327	26	Sangiang Tanjung
328	26	Cikatapis
329	29	Cilangkap
330	29	Pasir Kecapi
331	29	Mekarsari
332	29	Sangiang
333	29	Tanjung Sari
334	29	Maja
335	29	Curug Badak
336	29	Pasir Kembang
337	29	Padasuka
338	29	Gubugancibeureum
339	29	Binong
340	29	Sindangmulya
341	29	Buyut Mekar
342	29	Maja Baru
343	24	Guradog
344	24	Candi
345	24	Sekarwangi
346	24	Curugbitung
347	24	Ciburuy
348	24	Mayak
349	24	Cilayang
350	24	Cipining
351	24	Cidadap
352	24	Lebakasih
\.


--
-- Data for Name: jenis_pangan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jenis_pangan (jenis_pangan_id, nama_bahan, kategori, satuan_default, batas_kritis) FROM stdin;
16	Tomat	Bahan Segar	Kilogram	5.00
19	Ikan Daging Sapi	Bahan Segar	Kilogram	5.00
20	Kentang	Bahan Segar	Kilogram	5.00
21	Beras	Bahan Segar	Kilogram	5.00
22	Buah Naga	Bahan Segar	Kilogram	5.00
23	Telur	Bahan Segar	Kilogram	5.00
24	Sayuran	Bahan Segar	Kilogram	5.00
25	Ikan	Bahan Segar	Kilogram	5.00
26	Wortel	Bahan Segar	Kilogram	5.00
27	Jeruk	Bahan Segar	Kilogram	5.00
28	Buah	Bahan Segar	Kilogram	5.00
29	Ikan Dori Fillet	Bahan Segar	Kilogram	5.00
30	Jahe	Bahan Segar	Kilogram	5.00
31	Kembang Kol	Bahan Segar	Kilogram	5.00
32	Bawang Merah	Bahan Segar	Kilogram	5.00
33	Kelengkeng	Bahan Segar	Kilogram	5.00
34	Semangka	Bahan Segar	Kilogram	5.00
35	Jeruk Medan	Bahan Segar	Kilogram	5.00
36	Bawang Bombay	Bahan Segar	Kilogram	5.00
37	Daging Ayam	Bahan Segar	Kilogram	5.00
38	Bayam	Bahan Segar	Kilogram	5.00
39	Ayam	Bahan Segar	Kilogram	5.00
40	Salam	Bahan Segar	Kilogram	5.00
41	Edamame	Bahan Segar	Kilogram	5.00
42	Pakcoy	Bahan Segar	Kilogram	5.00
43	Apel	Bahan Segar	Kilogram	5.00
44	Jeruk Santang	Bahan Segar	Kilogram	5.00
45	Ikan lele	Bahan Segar	Kilogram	5.00
46	Mentimun	Bahan Segar	Kilogram	5.00
47	Brokoli	Bahan Segar	Kilogram	5.00
48	Daun salam	Bahan Segar	Kilogram	5.00
49	Ayam Fillet	Bahan Segar	Kilogram	5.00
50	Kacang panjang	Bahan Segar	Kilogram	5.00
51	Lengkuas	Bahan Segar	Kilogram	5.00
52	Bawang Putih	Bahan Segar	Kilogram	5.00
3	Telur Ayam	Protein Hewani	Kilogram	5.00
54	Daun Jeruk	Bahan Segar	Kilogram	5.00
55	Cabe tewe	Bahan Segar	Kilogram	5.00
56	Daging Sapi	Bahan Segar	Kilogram	5.00
57	Ikan Dori	Bahan Segar	Kilogram	5.00
58	Buncis	Bahan Segar	Kilogram	5.00
59	Anggur	Bahan Segar	Kilogram	5.00
60	Cabe hijau	Bahan Segar	Kilogram	5.00
61	Kol	Bahan Segar	Kilogram	5.00
62	Salak	Bahan Segar	Kilogram	5.00
63	Tauge	Bahan Segar	Kilogram	5.00
64	Sawi Hijau	Bahan Segar	Kilogram	5.00
65	Selada Keriting	Bahan Segar	Kilogram	5.00
66	Sawi Putih	Bahan Segar	Kilogram	5.00
67	Selada	Bahan Segar	Kilogram	5.00
68	Jagung  pipil	Bahan Segar	Kilogram	5.00
69	Kelapa Parut	Bahan Segar	Kilogram	5.00
70	Sereh	Bahan Segar	Kilogram	5.00
72	Cabai	Bahan Segar	Kilogram	5.00
77	Jagung Pipil	Karbohidrat/ Padi- Padian	Kilogram	5.00
76	Kunyit	Sayur	Kilogram	5.00
75	Jeruk Nipis	Sayur	Kilogram	5.00
74	Pisang	Buah	Kilogram	5.00
73	Labu siam	Sayur	Kilogram	5.00
71	Cabe Rawit	Bumbu/ Rempah	Kilogram	5.00
17	Cabe Merah	Bumbu/ Rempah	Kilogram	5.00
18	Melon	Buah	Kilogram	5.00
\.


--
-- Data for Name: kabupaten; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kabupaten (kabupaten_id, nama_kabupaten, is_luar_banten) FROM stdin;
1	Kabupaten Lebak	f
2	Kabupaten Pandeglang	f
3	Kabupaten Serang	f
4	Kabupaten Tangerang	f
5	Kota Cilegon	f
6	Kota Serang	f
7	Kota Tangerang	f
8	Kota Tangerang Selatan	f
9	Kota Bandung	t
10	DKI Jakarta	t
11	Kota Bogor	t
\.


--
-- Data for Name: kategori_penerima; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kategori_penerima (kategori_id, nama_kategori, urutan) FROM stdin;
1	KB	1
2	TK	2
3	RA	3
4	PAUD	4
5	SD/MI	5
6	SMP/MTS	6
7	SMA/SMK/MA	7
8	Posyandu Bumil	8
9	Posyandu Busui	9
10	Posyandu Balita	10
11	Santri	11
12	ATS	12
\.


--
-- Data for Name: kecamatan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kecamatan (kecamatan_id, nama_kecamatan) FROM stdin;
1	Rangkasbiutng
25	Gunungkencana
30	Malingping
36	Wanasalam
32	Panggarangan
16	Cihara
11	Bayah
20	Cilograng
14	Cibeber
17	Cijaku
15	Cigemblong
10	Banjarsari
19	Cileles
49	Gunung Kencana
12	Bojongmanik
23	Cirinten
28	Leuwidamar
31	Muncang
35	Sobang
22	Cipanas
27	Lebakgedong
34	Sajira
21	Cimarga
18	Cikulur
4	Warunggunung
3	Cibadak
2	Rangkasbitung
26	Kalanganyar
29	Maja
24	Curugbitung
\.


--
-- Data for Name: master_parameter_uji; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.master_parameter_uji (id, nama_parameter, kategori, satuan, ambang_batas, deskripsi, status_aktif, created_at, sppg_id) FROM stdin;
\.


--
-- Data for Name: navigation_menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.navigation_menu (id, name, url, urutan, status, created_at, updated_at) FROM stdin;
1	Beranda	/	1	Aktif	2026-08-06 17:48:47.304191	2026-08-06 17:48:47.304191
7	Tentang	/tentang	7	Aktif	2026-08-06 17:48:47.304191	2026-08-06 17:48:47.304191
5	Data SPPG	/sppg	2	Aktif	2026-08-06 17:48:47.304191	2026-08-06 17:48:47.304191
4	Mitra Penggilingan	/data-penggilingan	3	Aktif	2026-08-06 17:48:47.304191	2026-08-06 17:48:47.304191
8	Rantai Pasok	/rantai-pasok	4	Aktif	2026-09-08 11:03:37.171217	2026-09-08 11:03:37.171217
\.


--
-- Data for Name: pemasok; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pemasok (pemasok_id, nama_pemasok, alamat_pemasok, kontak, tipe_pemasok, npwp, pic_nama, pic_kontak, email, kecamatan_id, desa_id, status, bank_nama, bank_rekening, bank_atas_nama, created_at, updated_at, kabupaten_id) FROM stdin;
14	Prima Niaga Lancar	Ds.Pasar Keong - Cibadak	\N	Lokal	\N	\N	\N	\N	\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:03.996426	2026-09-09 06:48:03.996426	1
15	Sayur Biang Doa Ibu	Ds.Pasar Keong - Cibadak	\N	Lokal	\N	\N	\N	\N	\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.0229	2026-09-09 06:48:04.0229	1
16	AHY Suplier	Ds.Pasar Keong - Cibadak	\N	Lokal	\N	\N	\N	\N	\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.043213	2026-09-09 06:48:04.043213	1
19	Koperasi Penggerak Pembangunan Indonesia Maju	Kelurahan Sukajaya	\N	Lokal	\N	\N	\N	\N	\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.114585	2026-09-09 06:48:04.114585	1
22	Panenin	Jl.Kopi Maja-Desa Parungsari - Sajira	\N	Lokal	\N	\N	\N	\N	\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.185017	2026-09-09 06:48:04.185017	1
25	Ibu Subriah	Kp.Salahaur	\N	Lokal	\N	\N	\N	\N	\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.25625	2026-09-09 06:48:04.25625	1
26	Triyanti	Kp. Sampay Tengah	\N	Lokal	\N	\N	\N	\N	\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.276393	2026-09-09 06:48:04.276393	1
27	Rolin Fatmawati	Kp.Cibangkur Kidul	\N	Lokal	\N	\N	\N	\N	\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.29773	2026-09-09 06:48:04.29773	1
28	Siti Sumianah	Kp.Karoya	\N	Lokal	\N	\N	\N	\N	\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.318118	2026-09-09 06:48:04.318118	1
29	Ikbal Maulana	Kp. Cibangkur	\N	Lokal	\N	\N	\N	\N	\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.339713	2026-09-09 06:48:04.339713	1
30	Koperasi Merah Putih Berkarya	Kp.Aweh - Kalanganyar	\N	Lokal	\N	\N	\N	\N	\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.359855	2026-09-09 06:48:04.359855	1
34	TOKO BATAM	MC.Timur	\N	Lokal	\N	\N	\N	\N	\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.472122	2026-09-09 06:48:04.472122	1
23	Surya Patala Putra Fish Market	Cisolong - Pandeglang	\N	Lokal	\N	\N	\N	\N	\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.206315	2026-09-09 06:48:04.206315	2
24	Koperasi Lumbung Prima Arta	Jl.Ayip Usman No.27 - Serang	\N	Lokal	\N	\N	\N	\N	\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.234794	2026-09-09 06:48:04.234794	6
31	Kembang Karya Grup Supplier	Walantaka - Serang	\N	Lokal	\N	\N	\N	\N	\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.389515	2026-09-09 06:48:04.389515	6
32	CV BKL Suplier sayur dan buah	Jl.Raya Siliwangi No.27		Perusahaan					\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.409997	2026-09-09 06:48:04.409997	1
33	PT.PRIMA NIAGA LANCAR	Ds.Pasar Keong - Cibadak		Perusahaan					\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.431351	2026-09-09 06:48:04.431351	1
20	CV. Nusa Jaya	BTN PEPABRI		Perusahaan					\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.134828	2026-09-09 06:48:04.134828	1
21	PT.Sukma Karya Pratama	Warunggunung		Perusahaan					\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.156133	2026-09-09 06:48:04.156133	1
18	PT.Agro Mitra Tani	Jl.Sadang Sari I		Perusahaan					\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.093129	2026-09-09 06:48:04.093129	1
17	PT.Afrida Nafahatil	Cikedal - Pandeglang		Perusahaan					\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:04.07296	2026-09-09 06:48:04.07296	2
13	UD. Wiranata	Ds.Pasar Keong - Cibadak		Perusahaan					\N	\N	Aktif	\N	\N	\N	2026-09-09 06:48:03.941262	2026-09-09 06:48:03.941262	1
\.


--
-- Data for Name: pengaduan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pengaduan (id, nama_pelapor, kontak, sppg_id, sekolah_id, isi_pengaduan, status, tanggal, tanggapan) FROM stdin;
\.


--
-- Data for Name: penggilingan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.penggilingan (penggilingan_id, nama_penggilingan, alamat, kecamatan_id, penanggung_jawab, no_hp, kapasitas_terpasang_kg_minggu, status, created_at, desa_id, nib, nomor_umku, kbli, nama_dagang, nomor_registrasi_pduk, status_pduk, tanggal_dikeluarkan_pduk, berlaku_sampai_pduk, nama_unit_produksi, no_permohonan_oss) FROM stdin;
31	Penggilingan Padi ATM	Jl. Abdi Negara No. 1 Kelurahan Rangkasbitung Kab. Lebak Prov. Banten Kode Pos 42312, HP. 085781009838	\N	Perumda Pers. Daerah Lebak Niaga	081218614641	37234.00	Aktif	2026-09-07 09:09:49.646664	\N	0602240086694	060224008669400000001	46311	Lebak Niaga (Ln)	360201010010524	Putih	27 Mei 2024	26 Mei 2029	Penggilingan Padi ATM	I-202405211104423214523
13	SUBUR MAKMUR TANI	Kp. Jaringao RT/RW 006/002 Desa Bejod Kecamatan Wanasalam Kab. Lebak, Hp. 085882446853	36	Sar'an	085882446853	44648.00	Aktif	2026-09-07 09:09:49.082376	29	1406220040387	140622004038700000001	10631	SMT (Subur Makmut Tani)	360201010011122	Putih	21 November 2022	20 November 2027	SUBUR MAKMUR TANI	I-202206291358584438812
43	Putra Tani	Kp. Pasi Muncang Timur RT 007 RW 003 Desa Sukatani Kecamatan Wanasalam Kabupaten Lebak Provinsi Banten	36	Aminudin	085718135679	17183.00	Aktif	2026-09-07 09:09:50.005059	27	1709250032524	170925003252400000001	10631	Cap Pisang PT	360201010010925	Putih	30 September 2025	29 September 2030	Putra Tani	I-202509261546488814598 
14	TIGA PUTRI	Kp.Cihaseum RT/RW 007/003 Desa Rahong Kecamatan Malingping Kab. Lebak, Hp. 083871892734	30	Nasrul	083871892743	24049.00	Aktif	2026-09-07 09:09:49.135632	19	1406220027585	140622002758500000001	10631	TP HD	360201010021122	Putih	21 November 2022	20 November 2027	TIGA PUTRI	I-202211181729315158748
15	YANTO	Kp. Coo Timur Desa Leuwi Coo Kecamatan Muncang Kabupaten Lebak 	31	Yanto	082138304805	27961.00	Aktif	2026-09-07 09:09:49.199114	\N	0911220162552	091122016255200000001	10631	SINAR COO	360201010041122	Putih	21 November 2022	20 November 2027	YANTO	I-202211181745000361068
16	SIANGIN II	Kp. Siangin RT/RW. 002/001 Desa Pasir Haur Kecamatan Cipanas Kab. Lebak, Hp.085280656389	22	Uju Bin H.Adhari	085280656389	43505.00	Aktif	2026-09-07 09:09:49.221615	\N	0809220061207	080922006120700000001	10631	ST (Siangin Tani)	360201010051122	Putih	21 November 2022	20 November 2027	SIANGIN II	I-202209081406528088642
17	RADEN PERKASA	Kp. Kalapa Nunggal Desa Sukasari Kecamatan Cipanas Kabupaten Lebak	22	PT Raden Perkasa Group (Harli)	087773874666	15114.00	Aktif	2026-09-07 09:09:49.245992	224	1909220122931	190922012293100000001	10631	CIPANAS RAYA	360201010031122	Putih	21 November 2022	20 November 2027	RADEN PERKASA	I-202211181535343042982
34	Cipta Maju	Kp. Citeureup Rt.003 Rw.001, Desa/Kelurahan Cimanyangray, Kec.Gunungkencana, Kab. Lebak, Provinsi Banten	25	Eman Suparman	085776890908	26749.00	Aktif	2026-09-07 09:09:49.711311	\N	1310210017202	131021001720200000001	10631	Cipta Maju	360201010040924	Putih	05 Oktober 2024	04 Oktober 2029	Cipta Maju	I-202409231315437873267
35	Situjaya	Kp. Wakap, Desa/kelurahan Curugpanjang, Kec. Cikulur, Kab.Lebak, Provinsi Banten	18	Hasanudin	085813704809	44367.00	Aktif	2026-09-07 09:09:49.738362	270	2808240059662	280824005966200000001	10631	Situjaya	360201010051024	Putih	18 Oktober 2024	17 Oktober 2029	Situjaya	I-202409301150157286172
36	Poktan Berkah Mukti	Kp. Cikeusik, Desa/kelurahan Cikeusik, Kec.Wanasalam, Kab. Lebak, Provinsi Banten	36	Roni Patinasarani	081574934447	49923.00	Aktif	2026-09-07 09:09:49.777257	28	1909240099591	190924009959100000001	10631	Berkah Mukti	360201010061024	Putih	18 Oktober 2024	17 Oktober 2029	Poktan Berkah Mukti	I-202410011550482727779
37	Poktan Cahaya Tani	Kp. Budi Mulya Desa Wanasalam Kec. Wanasalam Kab. Lebak	36	Masud	083832976794	29067.00	Aktif	2026-09-07 09:09:49.805016	\N	1909240087881	190924008788100000001	10631	Cahaya Tani (CT)	360201010071024	Putih	18 Oktober 2024	17 Oktober 2029	Poktan Cahaya Tani	I-202410011618283567684
38	Poktan Pakasaban III	Kp. Bejod Tengah Desa Parungpanjang Kec. Wanasalam Kabupaten Lebak, Prov. Banten	36	Aan	085884397562	49413.00	Aktif	2026-09-07 09:09:49.827511	\N	1909240090983	190924009098300000001	10631	BJD Indah	360201010081024	Putih	31 Oktober 2024	30 Oktober 2029	Poktan Pakasaban III	I-202410241007239926695
18	GELAR MUKTI	Kp.Pagelaran RT/RW 002/002 Desa Pagelaran Kecamatan Malingping Kab. Lebak, Hp. 087773467234	30	Yadi Haryadi 	087773467234	39984.00	Aktif	2026-09-07 09:09:49.263613	14	1406220035843	140622003584300000001	10631	BP (BERAS PAGELARAN)	360201010071122	Putih	22 November 2022	21 November 2027	GELAR MUKTI	I-202206220835452975212
19	PAJAR II	Kp. Barengkok Girang RT/RW 008/003 Desa Bejod Kecamatan Wanasalam Kabupaten Lebak	36	Abdul Yunus	085775416619	27788.00	Aktif	2026-09-07 09:09:49.285913	29	1406220032206	140622003220600000001	10631	PAJAR II	360201010091122	Putih	23 November 2022	22 November 2027	PAJAR II	I-202206291210089886234
20	MULYASARI	Kp. Wanasari  Desa Tanjungwangi Kecamatan Muncang Kab. Lebak, Hp.081319032967	31	Nurjaya	081319032967	31565.00	Aktif	2026-09-07 09:09:49.36111	201	0809220139871	080922013987100000001	10631	Beras Ciminyak	360201010061122	Putih	22 November 2022	21 November 2027	MULYASARI	I-202211220922056906300
23	BINA TANI	Kp. Bueuk RT/RW 010/004 Desa Cisangu Kecamatan Cibadak Kabupaten Lebak, Hp. 087877795397	3	Emed Candra	087877795397	38490.00	Aktif	2026-09-07 09:09:49.464078	300	1810210016276	181021001627600000001	10631	Bina Tani	 360201010010823	Putih	16 Agustus 2023	15 Agustus 2028	BINA TANI	I-202308071543117432686
24	SEBRANG LOR	Kp. Parung Pasir RT/RW 004/001 Desa Cikulur Kecamatan Cikulur Kab. Lebak, Hp. 081212046222	18	Jaenal Abidin 	081212046222	27500.00	Aktif	2026-09-07 09:09:49.504841	271	1249000200926	124900020092600000001	10631	ATM (Aneka Tani Mandiri)	 360201010020823	Putih	16 Agustus 2023	15 Agustus 2028	SEBRANG LOR	I-202308071503432641837
25	TANI MULYA	Kp. Sadepe RT/RW.002.005 Desa Parakan Lima Kecamatan Cirinten Kab. Lebak Hp. 085774326322	23	Samsudin	085774326322	24905.00	Aktif	2026-09-07 09:09:49.52168	\N	0208230062992	020823006299200000001	10631	Berkah Tani	360201010030823	Putih	16 Agustus 2023	15 Agustus 2028	TANI MULYA	I-202308071536311791942
29	PAKASABAN III	Kp. Bejod Babakan RT/RW 004/002 Desa Parungpanjang Kecamatan Wanasalam Kab. Lebak, Hp. 082310408679	36	Mulyadi Maulana Mahmyd	082310408679	29863.00	Aktif	2026-09-07 09:09:49.606617	34	1406220027517	140622002751700000001	10631	PAKASABAN III	360201010070823	Putih	18 Agustus 2023	17 Agustus 2028	PAKASABAN III	I-202206291431029928284
21	PANASARAN	Kp. Sukamaju Desa Talagahiang Kec. Cipanas Kab.Lebak	22	Herman	085781008755	20943.00	Aktif	2026-09-07 09:09:49.394443	\N	0911220164973	091122016497300000001	10631	PANASARAN	360201010081122	Putih	23 November 2022	22 November 2027	PANASARAN	I-202211231156364482994
22	RIZKI JAYA	Kp. Leuwiloa Desa Sudamanik Kec. Cimarga Kab. Lebak	21	Ruswandi	083143301121	23792.00	Aktif	2026-09-07 09:09:49.437865	\N	0911220299916	091122029991600000001	10631	RJ	360201010101122	Putih	28 November 2022	27 November 2027	RIZKI JAYA	I-202211281535488577243
26	SRI MULYA II	Kp.Pasir Huni RT/RW.006.002 Desa Cipeucang Kec. Wanasalam, Kab. Lebak Hp. 085718651694	36	Udin	085718651694	33191.00	Aktif	2026-09-07 09:09:49.543789	\N	1409220074897	140922007489700000001	10631	TM (Tani Mulya)	360201010040823	Putih	16 Agustus 2023	15 Agustus 2028	SRI MULYA II	I-202308101008334679862
27	SIDA MULYA I	Kp.Sukamaju RT/RW.01.001 Desa Cipedang Kec. Wanasalam Kab. Lebak Hp. 083892829617	36	H. Sudirman	083892829617	40240.00	Aktif	2026-09-07 09:09:49.563265	\N	0208230057252	020823005725200000001	10631	HS	360201010050823	Putih	18 Agustus 2023	17 Agustus 2028	SIDA MULYA I	I-202308101006130724629
28	GAPOKTAN SURYA TANI KENCANA	Kp.Lebak Sembada RT/RW.001.005 Desa Citorek Kidul Kec. Cibeber Kab. Lebak Hp. 085888404764	14	Junaedi	085888404764	18272.00	Aktif	2026-09-07 09:09:49.585702	\N	0208230064373	20823006437300000001	10631	SURYA TANI	360201010060823	Putih	18 Agustus 2023	17 Agustus 2028	GAPOKTAN SURYA TANI KENCANA	I-202308101026353766064
30	BERKAH ABADI	Kp.Kandang Sapi Ds. Kandang Sapi RT/RW 004/001 Kec. Cijaku Kab. Lebak HP. 081807805285	17	Hadimi	081807805285	34012.00	Aktif	2026-09-07 09:09:49.628637	\N	14062200373689	1406220037368900000001	10631	Barokah	360201010081123	Putih	 10 November 2023	 9 November 2028	BERKAH ABADI	I-202310201255446963024
32	Suka Bungah	Kp. Pasir Haleuang, Desa Tambakbaya Kec. Cibadak Kab. Lebak Banten	3	Ruhiana	081387173150	26927.00	Aktif	2026-09-07 09:09:49.67	\N	0249000941987	024900094198700000001	10631	Suka Bungah	360201010020724	Putih	26 Juli 2024	25 Juli 2029	Suka Bungah	I-202407220948553936771
33	PD Cahaya Tani	Jl. Raya Rangkasbitung Pandeglang km.07, Desa/Kelurahan Warunggunung, Kec. Warunggungung, Kab.Lebak Provinsi Banten	\N	Bambang Fajar Suseno	08128120306	16003.00	Aktif	2026-09-07 09:09:49.689099	282	0220005610889	022000561088900000001	10631	Cap Bakul	360201010030924	Putih	13 September 2024	12 September 2029	PD Cahaya Tani	I-202409041138106104032
39	Poktan Tunas Karya Tani I	Kp. Wanasalam RT 001 RW 002 Desa Wanasalam Kec. Wanasalam Kab. Lebak	36	Ahyani	05813282642	26190.00	Aktif	2026-09-07 09:09:49.853384	\N	1909240086393	190924008639300000001	10631	Nabil Jaya	360201010091024	Putih	31 Oktober 2024	30 Oktober 2029	Poktan Tunas Karya Tani I	I-202410241019192221838
40	Gapoktan Permata Desa	Kp. Jalupang RT/RW 17/03 Desa Padasuka Kec. Warunggunung Kab. Lebak	4	Suherman	087773665566	45295.00	Aktif	2026-09-07 09:09:49.930119	\N	0712220072123	071222007212300000001	10631	Permata Desa	360201010101024	Putih	31 Oktober 2024	30 Oktober 2029	Gapoktan Permata Desa	I-202410241036578522083
41	Aneka Alam Niaga	Kp. Cilangos RT 006 RW 004, Desa Anggalan Kec. Cikulur Kab. Lebak Banten	18	Sukma	083898066917	21650.00	Aktif	2026-09-07 09:09:49.963632	\N	2808240056624	280824005662400000001	10631	Aneka Alam	360201010111024	Putih	8 November 2024	7 November 2029	Aneka Alam Niaga	I-202409301150157286172
42	Poktan Subur Sejahtera	Kp. Cikeusik Lebak Desa Malingping Selatan Kec. Malingping, Kab. Lebak	30	Mahpudin	087772113864	45724.00	Aktif	2026-09-07 09:09:49.987773	\N	1606220027609	160622002760900000001	10631	Subur Sejahtera	360201010112024	Putih	22 November 2024	21 November 2029	Poktan Subur Sejahtera	I-202411111147177996905
44	BUM Desa Cipedang Maju	Kp. Sinarbakti, Desa/Kel Cipedang Kec. Wanasalam Kab. Lebak Provinsi Banten	36	BUM Desa Cipedang Maju	081282857615	30017.00	Aktif	2026-09-07 09:09:50.027733	\N	2208250123961	220825012396100000001	47241	Cipedang Maju	360201010021025	Putih	03 Oktober 2025	02 Oktober 2030	BUM Desa Cipedang Maju	I-202510021332500917062
45	Penggilingan Poktan Situ Mukti	Kp. Pasir Mae, Desa Muara Dua Kec.Cikulur Kab. Lebak	18	Supiah	08571819393	19008.00	Aktif	2026-09-07 09:09:50.046946	\N	2410240025647	241024002564700000001	10631	SM	360201010010526	Putih	20 Mei 2026	19 Mei 2031	Penggilingan Poktan Situ Mukti	I-202605200838420523604 
47	PD. Ade Jaya	Kp. Cidadap, Desa Sukatani Kec. Wanasalam , Kab. Lebak	36	Ade Jakaria	81381858816	21041.00	Aktif	2026-09-07 09:09:50.097215	\N	2305260089769	230526008976900000001	10631	SRI NAZRIL	360201010030526	Putih	26 Mei 2026	25 Mei 2031	PD. Ade Jaya	I-202605252241026329469 
46	Harnu Beras	Kp. Pamatang Kendal, Desa Cisarap, Kec. Wanasalam Kab. Lebak	36	Asep Hermawan	081917705061	44527.00	Aktif	2026-09-07 09:09:50.069031	31	2305260091342	230526009134200000001	10631	HARNUM BERAS	360201010020526	Putih	26 Mei 2026	25 Mei 2031	Harnu Beras	I-202605252237338478496 
\.


--
-- Data for Name: penggilingan_distribusi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.penggilingan_distribusi (id, penggilingan_id, minggu_mulai, minggu_selesai, volume_kg, tujuan_tipe, sppg_tujuan_id, lokasi_lain, catatan, created_at, jenis_produk, nomor_polisi, nama_supir, foto_surat_jalan, wilayah_distribusi, kecamatan_tujuan_id, desa_tujuan_id, alamat_lengkap, kontak_person, provinsi_tujuan, kabupaten_kota_tujuan, status_verifikasi) FROM stdin;
1	36	2026-09-08	2026-09-08	500.00	SPPG	1	\N	Distribusi otomatis	2026-09-10 00:37:08.788943	Beras Premium	A 1234 BCD	Budi	\N	\N	\N	\N	\N	\N	\N	\N	Draft
2	36	2026-09-08	2026-09-08	300.00	SPPG	2	\N	Pengiriman sore	2026-09-10 00:37:14.034015	Beras Medium	A 5678 EFG	Anton	\N	\N	\N	\N	\N	\N	\N	\N	Verified
\.


--
-- Data for Name: penggilingan_produksi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.penggilingan_produksi (id, penggilingan_id, minggu_mulai, minggu_selesai, beras_dihasilkan_kg, rendemen_persen, catatan, created_at, gabah_digiling_kg, mutu_beras, dedak_kg, menir_kg, sekam_kg, biaya_operasional, batch_number, status_verifikasi) FROM stdin;
11	36	2026-09-08	2026-09-08	800.00	80.00	test	2026-09-08 08:11:39.877402	1000.00	Premium	0.00	0.00	0.00	0.00	\N	Draft
\.


--
-- Data for Name: penggilingan_sumber_gabah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.penggilingan_sumber_gabah (id, penggilingan_id, minggu_mulai, minggu_selesai, sumber_gabah, volume_kg, catatan, created_at, nama_sumber, alamat_sumber, kontak_person, lokasi_wilayah, kecamatan_id, desa_id, provinsi_luar, kabupaten_luar, kecamatan_luar, desa_luar, kondisi_gabah, kadar_air, kadar_hampa, varietas, nomor_polisi, nama_supir, foto_nota_url, status_verifikasi) FROM stdin;
13	36	2026-09-08	2026-09-08	Petani Langsung	1000.00	test	2026-09-08 08:10:34.999215	Misja	jl. test saja	0878787878316	Dalam Lebak	49	155	\N	\N	\N	\N	GKG	14.00	2.00	Ciherang	a1234rt	mimin	/uploads/upload-1788855033980-321156280.jpeg	Draft
\.


--
-- Data for Name: pengumuman; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pengumuman (id, judul, isi, author_id, sppg_id, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: posyandu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posyandu (id, nama_posyandu, desa_id, kecamatan_id, alamat_posyandu, nama_ketua_kader, no_hp_ketua_kader, jumlah_busui, jumlah_balita, jumlah_bumil, jumlah_total, keterangan, created_at, updated_at) FROM stdin;
1	Posyandu Jeruk	296	3	\N	\N	\N	51	134	18	203	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
2	Posyandu Talun 1	296	3	\N	\N	\N	6	58	7	71	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
3	Posyandu Talun 2	296	3	\N	\N	\N	8	55	7	70	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
4	Posyandu Talun 3	296	3	\N	\N	\N	12	42	12	66	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
5	Posyandu Pasir Eurih	296	3	\N	\N	\N	10	34	7	51	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
6	Posyandu Galih Nangtung	296	3	\N	\N	\N	11	73	5	89	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
7	Posyandu Anaku Sayang	324	26	\N	\N	\N	29	94	10	133	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
8	Posyandu Anggrek	324	26	\N	\N	\N	16	56	5	77	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
9	Posyandu Nusa Indah	324	26	\N	\N	\N	12	58	12	82	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
10	Posyandu Adiku Sayang	324	26	\N	\N	\N	6	79	6	91	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
11	Posyandu Matahari	324	26	\N	\N	\N	11	61	7	79	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
12	Posyandu Sri Rezeki	324	26	\N	\N	\N	22	67	9	98	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
13	Posyandu Anak Sayang-Sayang	324	26	\N	\N	\N	7	44	3	54	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
14	Posyandu Melati 1 sd 12	309	2	\N	\N	\N	94	425	41	560	Penerima Manfaat SPPG SPPG Lebak Rangkasbitung Muara Ciujung Timur 3	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
15	Posyandu Tulip 4 & 5	320	2	\N	\N	\N	50	143	29	222	Penerima Manfaat SPPG SPPG Lebak Rangkasbitung Muara Ciujung Barat 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
\.


--
-- Data for Name: posyandu_laporan_aktifitas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posyandu_laporan_aktifitas (id, sppg_laporan_id, posyandu_id, tanggal_diterima, status_diterima, jumlah_porsi_diterima, kondisi_makanan, catatan, foto_dokumentasi, diverifikasi_oleh, created_at, status_verifikasi) FROM stdin;
1	2	1	2026-10-06 03:27:18.462147	Diterima Lengkap	203	Baik	Paket makanan bergizi posyandu diterima dalam kondisi segar.	\N	Kader Posyandu Jeruk	2026-10-06 03:27:18.462147	Terverifikasi
2	5	7	2026-10-06 03:27:18.462147	Diterima Lengkap	133	Baik	Paket makanan bergizi posyandu diterima dalam kondisi segar.	\N	Kader Posyandu Anaku Sayang	2026-10-06 03:27:18.462147	Terverifikasi
3	7	14	2026-10-06 03:27:18.462147	Diterima Lengkap	560	Baik	Paket makanan bergizi posyandu diterima dalam kondisi segar.	\N	Kader Posyandu Melati 1 sd 12	2026-10-06 03:27:18.462147	Terverifikasi
4	9	15	2026-10-06 03:27:18.462147	Diterima Lengkap	222	Baik	Paket makanan bergizi posyandu diterima dalam kondisi segar.	\N	Kader Posyandu Tulip 4 & 5	2026-10-06 03:27:18.462147	Terverifikasi
\.


--
-- Data for Name: posyandu_penerimaan_mbg; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posyandu_penerimaan_mbg (id, posyandu_id, sppg_id, status, tanggal_mulai_mbg, tanggal_selesai_mbg, catatan_status, created_at, updated_at) FROM stdin;
1	1	1	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
2	2	1	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
3	3	1	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
4	4	1	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
5	5	1	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
6	6	1	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
7	7	3	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
8	8	3	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
9	9	3	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
10	10	3	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
11	11	3	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
12	12	3	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
13	13	3	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
14	14	4	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
15	15	5	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
\.


--
-- Data for Name: sekolah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sekolah (sekolah_id, nama_sekolah, npsn, kategori_id, desa_id, kecamatan_id, alamat_sekolah, nama_kepala_sekolah, no_hp_kepala_sekolah, email_sekolah, jumlah_siswa_laki, jumlah_siswa_perempuan, jumlah_siswa_total, tahun_ajaran_last, keterangan, created_at, updated_at) FROM stdin;
1	TK Negeri Syeh Malka	\N	2	296	3	\N	\N	\N	\N	17	17	34	2026/2027	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
2	TK Nuru Husen	\N	2	296	3	\N	\N	\N	\N	15	16	31	2026/2027	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
3	KB Al Musyawwir	\N	1	296	3	\N	\N	\N	\N	33	34	67	2026/2027	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
4	KB Azahra	\N	1	296	3	\N	\N	\N	\N	24	24	48	2026/2027	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
5	KB Asri	\N	1	296	3	\N	\N	\N	\N	16	16	32	2026/2027	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
6	Paud Nurul Husen	\N	4	296	3	\N	\N	\N	\N	15	16	31	2026/2027	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
7	SDN 1 Panancangan	\N	5	298	3	\N	\N	\N	\N	151	152	303	2026/2027	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
8	SDN 2 Pasar Keong	\N	5	296	3	\N	\N	\N	\N	122	123	245	2026/2027	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
9	SDN 1 Cisangu	\N	5	300	3	\N	\N	\N	\N	113	114	227	2026/2027	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
10	SDN 2 Cisangu	\N	5	300	3	\N	\N	\N	\N	64	65	129	2026/2027	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
11	MIS Nurul Husen	\N	5	296	3	\N	\N	\N	\N	62	62	124	2026/2027	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
12	SMPN 4  CIBADAK	\N	6	296	3	\N	\N	\N	\N	89	90	179	2026/2027	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
13	SMAN 1 Cibadak	\N	7	296	3	\N	\N	\N	\N	367	368	735	2026/2027	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
14	SMK Nurul Husen	\N	7	296	3	\N	\N	\N	\N	38	39	77	2026/2027	Penerima Manfaat SPPG SPPG Lebak Cibadak Pasar Keong	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
15	KB Nurul Muhtadin	\N	1	283	4	\N	\N	\N	\N	23	23	46	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
16	TK insan Cendikia	\N	2	283	4	\N	\N	\N	\N	22	22	44	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
17	TK Bina Insani	\N	2	283	4	\N	\N	\N	\N	28	29	57	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
18	RA Assa'adiyah	\N	3	283	4	\N	\N	\N	\N	33	34	67	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
19	RA Mathla'ul Anwar	\N	3	283	4	\N	\N	\N	\N	13	14	27	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
20	PAUD KB Al-Hidayah	\N	1	283	4	\N	\N	\N	\N	32	33	65	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
21	PAUD Al-Ikhlas	\N	4	283	4	\N	\N	\N	\N	17	18	35	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
22	SDIT Insan Cendikia	\N	5	283	4	\N	\N	\N	\N	76	77	153	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
23	MI Al Ittihad Pasirkopo	\N	5	283	4	\N	\N	\N	\N	78	78	156	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
24	MI hidayah Islamiyah Pasirtangkil	\N	5	279	4	\N	\N	\N	\N	48	48	96	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
25	SDN 1 Baros	\N	5	284	4	\N	\N	\N	\N	212	213	425	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
26	SDN 1 Sindang sari	\N	5	285	4	\N	\N	\N	\N	132	132	264	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
27	SDN 1 Pasirtangkil	\N	5	279	4	\N	\N	\N	\N	86	87	173	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
28	SDN 2 Pasirtangkil	\N	5	279	4	\N	\N	\N	\N	116	116	232	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
29	MTS Hidayah Islamiyah Pasirkopo	\N	6	283	4	\N	\N	\N	\N	35	35	70	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
30	MTS Hidayah Islamiyah Pasirtangkil	\N	6	279	4	\N	\N	\N	\N	38	39	77	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
31	MTS El Karim	\N	6	283	4	\N	\N	\N	\N	98	99	197	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
32	MTS plus Mabdail Falah	\N	6	283	4	\N	\N	\N	\N	20	20	40	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
33	MA El Karim	\N	7	283	4	\N	\N	\N	\N	64	64	128	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
34	MA Hidayah Islamiyah Pasirkopo	\N	7	283	4	\N	\N	\N	\N	26	26	52	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
35	SMA 1 Warunggunung	\N	7	283	4	\N	\N	\N	\N	442	442	884	2026/2027	Penerima Manfaat SPPG SPPG LEBAK WARUNGGUNUNG CIBUAH 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
36	RA ASSUKIYA	\N	3	324	26	\N	\N	\N	\N	62	63	125	2026/2027	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
37	SDN 01 PASIRKUPA	\N	5	323	26	\N	\N	\N	\N	145	145	290	2026/2027	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
38	SDN 04 SUKAMEKARSARI	\N	5	325	26	\N	\N	\N	\N	151	152	303	2026/2027	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
39	SDN 01 KALANGANYAR	\N	5	326	26	\N	\N	\N	\N	129	130	259	2026/2027	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
40	MTS BANI IDRIS	\N	6	324	26	\N	\N	\N	\N	80	80	160	2026/2027	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
41	MTS AL FALAH	\N	6	324	26	\N	\N	\N	\N	112	112	224	2026/2027	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
42	MTS DAARUL MUSYAFFA	\N	6	324	26	\N	\N	\N	\N	115	116	231	2026/2027	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
43	SMP KALANGANYAR	\N	6	326	26	\N	\N	\N	\N	156	156	312	2026/2027	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
44	SMK ASSUKIYA	\N	7	324	26	\N	\N	\N	\N	58	58	116	2026/2027	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
45	MA DAARUL MUSYAFFA	\N	7	324	26	\N	\N	\N	\N	103	103	206	2026/2027	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
46	MA AL FALAH	\N	7	324	26	\N	\N	\N	\N	77	78	155	2026/2027	Penerima Manfaat SPPG SPPG Lebak Kalanganyar Aweh 2	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
47	TK PGRI 1 RANGKASBITUNG	\N	2	309	2	\N	\N	\N	\N	34	35	69	2026/2027	Penerima Manfaat SPPG SPPG Lebak Rangkasbitung Muara Ciujung Timur 3	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
48	TK PELITA	\N	2	309	2	\N	\N	\N	\N	28	28	56	2026/2027	Penerima Manfaat SPPG SPPG Lebak Rangkasbitung Muara Ciujung Timur 3	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
49	SDN 1 RANGKASBITUNG BARAT	\N	5	308	2	\N	\N	\N	\N	441	442	883	2026/2027	Penerima Manfaat SPPG SPPG Lebak Rangkasbitung Muara Ciujung Timur 3	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
50	SDN 2 MUARA CIUJUNG TIMUR	\N	5	309	2	\N	\N	\N	\N	392	393	785	2026/2027	Penerima Manfaat SPPG SPPG Lebak Rangkasbitung Muara Ciujung Timur 3	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
51	SMAN 1 RANGKASBITUNG	\N	7	309	2	\N	\N	\N	\N	344	345	689	2026/2027	Penerima Manfaat SPPG SPPG Lebak Rangkasbitung Muara Ciujung Timur 3	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
52	SMKS MATHAUL ANWAR	\N	7	309	2	\N	\N	\N	\N	15	15	30	2026/2027	Penerima Manfaat SPPG SPPG Lebak Rangkasbitung Muara Ciujung Timur 3	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
53	PAUD ALHIDAYAH	\N	4	320	2	\N	\N	\N	\N	12	12	24	2026/2027	Penerima Manfaat SPPG SPPG Lebak Rangkasbitung Muara Ciujung Barat 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
54	SDN 1 MUARA CIUJUNG BARAT	\N	5	320	2	\N	\N	\N	\N	212	213	425	2026/2027	Penerima Manfaat SPPG SPPG Lebak Rangkasbitung Muara Ciujung Barat 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
55	SDN 2 MUARA CIUJUNG BARAT	\N	5	320	2	\N	\N	\N	\N	285	286	571	2026/2027	Penerima Manfaat SPPG SPPG Lebak Rangkasbitung Muara Ciujung Barat 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
56	SMPN 1 RANGKASBITUNG	\N	6	320	2	\N	\N	\N	\N	641	642	1283	2026/2027	Penerima Manfaat SPPG SPPG Lebak Rangkasbitung Muara Ciujung Barat 1	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
\.


--
-- Data for Name: sekolah_laporan_aktifitas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sekolah_laporan_aktifitas (id, sppg_laporan_id, sekolah_id, tanggal_diterima, status_diterima, jumlah_porsi_diterima, kondisi_makanan, catatan, foto_dokumentasi, diverifikasi_oleh, created_at, status_verifikasi) FROM stdin;
1	1	1	2026-10-06 03:27:18.462147	Diterima Lengkap	34	Baik	Makanan telah diterima lengkap dan sesuai standar gizi.	\N	Operator TK Negeri Syeh Malka	2026-10-06 03:27:18.462147	Terverifikasi
2	3	15	2026-10-06 03:27:18.462147	Diterima Lengkap	46	Baik	Makanan telah diterima lengkap dan sesuai standar gizi.	\N	Operator KB Nurul Muhtadin	2026-10-06 03:27:18.462147	Terverifikasi
3	4	36	2026-10-06 03:27:18.462147	Diterima Lengkap	125	Baik	Makanan telah diterima lengkap dan sesuai standar gizi.	\N	Operator RA ASSUKIYA	2026-10-06 03:27:18.462147	Terverifikasi
4	6	47	2026-10-06 03:27:18.462147	Diterima Lengkap	69	Baik	Makanan telah diterima lengkap dan sesuai standar gizi.	\N	Operator TK PGRI 1 RANGKASBITUNG	2026-10-06 03:27:18.462147	Terverifikasi
5	8	53	2026-10-06 03:27:18.462147	Diterima Lengkap	24	Baik	Makanan telah diterima lengkap dan sesuai standar gizi.	\N	Operator PAUD ALHIDAYAH	2026-10-06 03:27:18.462147	Terverifikasi
\.


--
-- Data for Name: sekolah_penerimaan_mbg; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sekolah_penerimaan_mbg (id, sekolah_id, sppg_id, status, tanggal_mulai_mbg, tanggal_selesai_mbg, tahun_ajaran, jumlah_hari_operasional, catatan_status, created_at, updated_at) FROM stdin;
1	1	1	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
2	2	1	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
3	3	1	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
4	4	1	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
5	5	1	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
6	6	1	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
7	7	1	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
8	8	1	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
9	9	1	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
10	10	1	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
11	11	1	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
12	12	1	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
13	13	1	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
14	14	1	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
15	15	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
16	16	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
17	17	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
18	18	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
19	19	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
20	20	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
21	21	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
22	22	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
23	23	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
24	24	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
25	25	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
26	26	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
27	27	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
28	28	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
29	29	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
30	30	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
31	31	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
32	32	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
33	33	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
34	34	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
35	35	2	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
36	36	3	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
37	37	3	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
38	38	3	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
39	39	3	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
40	40	3	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
41	41	3	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
42	42	3	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
43	43	3	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
44	44	3	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
45	45	3	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
46	46	3	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
47	47	4	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
48	48	4	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
49	49	4	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
50	50	4	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
51	51	4	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
52	52	4	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
53	53	5	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
54	54	5	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
55	55	5	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
56	56	5	Aktif	2026-01-01	\N	2026/2027	20	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId") FROM stdin;
IFtneOTmbFLHEq13VhkjOQMNL0AfVPyW	2026-09-15 01:16:04.122	vhIm136aAvF8D6bPIZyQmMKkQyERqEAL	2026-09-08 01:16:04.123	2026-09-08 01:16:04.123	172.21.0.1	curl/8.18.0	VfUndop1nWSrHLRW8ZzjD5ZlknGqO72j
kDz6kScBOGIprQIPVCsVVYzkVxkXok1F	2026-09-21 02:21:24.668	54EDd2xNNrXeIboQNdyJl3Qjh84jLONb	2026-09-14 02:21:24.672	2026-09-14 02:21:24.672	172.21.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36 Edg/153.0.0.0	FzmZmuQKqlCvfu6WGyehYwCeX7aBYuB5
0lWWuu3CRuaSemeu1oXiWHcVF76VmIHV	2026-09-21 08:59:02.507	roC5q0GItKmd8aAe1GIUwAeqkkcwBepd	2026-09-14 08:59:02.508	2026-09-14 08:59:02.508	172.21.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36 Edg/153.0.0.0	DcD6TFEg2U3i1a6uvQnAqcmgsypGztOB
tHsLIFj87HEYPoKEcAG4hDNxZkYRrQYs	2026-08-12 15:18:49.631	Ii10SbTuORsnV3vPG8qZv1FYRkO8IFbk	2026-08-05 15:18:49.632	2026-08-05 15:18:49.632	172.20.0.1	curl/8.18.0	F3muO6pZQbw9BvZaIJXCVxon1ws4LBAX
5pLlJMnlsspr2ILLtFFecZxB0JYSbIaQ	2026-08-12 15:19:36.571	hIIdU18y491Zo2tiMlMIGyPAYojyjQrx	2026-08-05 15:19:36.571	2026-08-05 15:19:36.571	172.20.0.1	curl/8.18.0	D7sxIVBI3QWrOVgCCpcxesqmhHUJ1eZY
U01pzHe3Ehm6QVngayKmRanD19msqXPG	2026-08-12 15:24:58.193	4mjnBO3QnwMZspiRm4fyfTiGzd22OqaS	2026-08-05 15:24:58.194	2026-08-05 15:24:58.194	172.20.0.1	curl/8.18.0	DcD6TFEg2U3i1a6uvQnAqcmgsypGztOB
3CnOqLNTcRiyKaKANrdfODuaxCjqXjmG	2026-08-13 01:28:46.693	hN3eexYQ8Z5l1xKjVrVePV0gLhZ87rhn	2026-08-06 01:28:46.694	2026-08-06 01:28:46.694	0000:0000:0000:0000:0000:0000:0000:0000	node	FzmZmuQKqlCvfu6WGyehYwCeX7aBYuB5
5Yag8skIVtL0cQrFESNmE3ctPdXv3z0p	2026-08-13 01:28:47.202	jALIRnjTbng3n0drV4qzQltxTjgYVVvY	2026-08-06 01:28:47.202	2026-08-06 01:28:47.202	0000:0000:0000:0000:0000:0000:0000:0000	node	uQcpC7ITHLZzyHlKbRfGvz9CMDevv1Yr
KHj8pt3m5IWHGYfITjho6pV34LpY3y9h	2026-08-13 01:28:47.662	w7vnrBPwhD2nrN0X2fpOpypif5UQ9GQf	2026-08-06 01:28:47.662	2026-08-06 01:28:47.662	0000:0000:0000:0000:0000:0000:0000:0000	node	3Hfv1a9QnuJ2HUYvofT9AvtbUzSgDewf
M48H5VnnExOLc2QdZyTnfmQVOvNTR1t6	2026-08-13 01:28:48.176	OpxZDatN0v95wko4bq8DfTPas6cSzN53	2026-08-06 01:28:48.177	2026-08-06 01:28:48.177	0000:0000:0000:0000:0000:0000:0000:0000	node	JgMcBdIKre0A7AB55mbmVGlcQf4aNJi9
Goa8CTfGBmCjzmmrXBJleLh0bSKHh6CL	2026-08-13 01:28:48.59	LlvAv7fcbmgl96Hph3fs0DvSZEeGKiGR	2026-08-06 01:28:48.591	2026-08-06 01:28:48.591	0000:0000:0000:0000:0000:0000:0000:0000	node	PzlimWqn7rDrdL8MY0RIjpfDMRaqch7L
2JQVkoyDur4CXesuJ3SOAhdfizw77cGA	2026-10-13 03:40:18.15	aEFXbtVsKmWa0pCChFNXyEnAWZHF0r2P	2026-10-06 03:40:18.152	2026-10-06 03:40:18.152	172.21.0.1	curl/8.18.0	sekolah_user_1_1791257238682
2JOjBtAfe4SA1n0bbr3afEqDR6onVjjV	2026-10-13 03:40:23.278	5RTPxvAFHj3UhrhRqXnVy3B8HmRkwQ7O	2026-10-06 03:40:23.278	2026-10-06 03:40:23.278	172.21.0.1	curl/8.18.0	posyandu_user_1_1791257238965
CYY6gpYR9C5eQiWtuu50XDXamF2PccCE	2026-10-13 03:42:15.131	3hVAAX7L8AhkZzmXy4jupl8u7yfZLWa8	2026-10-06 03:42:15.132	2026-10-06 03:42:15.132	172.21.0.1	curl/8.18.0	DcD6TFEg2U3i1a6uvQnAqcmgsypGztOB
CCED068YbQe7TTszqShvTUG8hNyAfvx0	2026-10-02 09:13:30.466	85bL7yZPVYGZlY5ydRc6Lz2pz4QI25AB	2026-09-25 09:13:30.467	2026-09-25 09:13:30.467	172.21.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	RZlfJJ4DELzr3uu04Eko5TWRPJSWCa0f
9yVvBiWdmZnPB0hqZhnCzaLPETqgO9D6	2026-10-05 03:44:58.665	u31cEpxvjFRHaUB1TrTYRwjYpByG9pCr	2026-09-28 03:44:58.665	2026-09-28 03:44:58.665	172.21.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36 Edg/153.0.0.0	DcD6TFEg2U3i1a6uvQnAqcmgsypGztOB
sprCKqHbiWjdOMPJbkHS89dZ7XOigjc5	2026-09-14 10:10:29.467	cLgWS9GzHapvGcp4gezxwb0EEMlRjwZR	2026-09-07 10:10:29.468	2026-09-07 10:10:29.468			VfUndop1nWSrHLRW8ZzjD5ZlknGqO72j
BFu1lBIwsqrOhScPhEgQbw8UJrDuC3Nz	2026-09-14 10:10:29.673	QpED04EflZaTvUGsDk5GBbPUeRS4gTJI	2026-09-07 10:10:29.674	2026-09-07 10:10:29.674			RZBha9s4SFRQ0127nLSNtFkqfDG1tf1f
FLwaVLidMB74OS7MZuXIJarBQuW8ctXr	2026-09-14 10:10:29.865	kwRQMUh1S6lcaTRcYLIlKhm2rk617QxI	2026-09-07 10:10:29.865	2026-09-07 10:10:29.865			V6iTjPzMG6yRBKoCcRnEmwmsfF0TP56P
u1DE4gOElwE4O0kYcXWcPEBnfOdjZDpp	2026-09-14 10:10:30.04	nt28yWXFI7JjGqbBqF4shlpnltgdxcWM	2026-09-07 10:10:30.04	2026-09-07 10:10:30.04			PKCWsMz5t7LmrqrODkO80BqfoTim6jPH
XbT2I0nerwlEWE1I0myYjIeyDyX0Ea33	2026-09-14 10:10:30.216	APVgEjtXVSibQcH9FmWPd2qV8sWi1Es8	2026-09-07 10:10:30.216	2026-09-07 10:10:30.216			WBaRiHk6gvAOFL3Q5VWPYfggdNhlN16k
aXwTceSreOZklA8JIhngArNkvZxFCOeI	2026-09-14 10:10:30.407	GZici5HsmqDjfB1Yx8bybaAevf4wJfE1	2026-09-07 10:10:30.407	2026-09-07 10:10:30.407			VVbi2nEJkN6JKVt82wuxz5rirnoGgUkD
H4tHhBaOdznYTyt5rafwJQN3ROt1H6g4	2026-09-14 10:10:30.599	U1A7jqjBMby5DZspxDqNt5xL0ECQWHw3	2026-09-07 10:10:30.599	2026-09-07 10:10:30.599			Oaw3RzwC2cEjgvFg4V3CHP1NFityTNHL
QTVspsSge9N2wzJqIeyjh1cwdEJT67e0	2026-09-14 10:10:30.824	WdT86HpeFMbmEhyriCsGsEMqiyhWFjPO	2026-09-07 10:10:30.824	2026-09-07 10:10:30.824			MOnUZMhPIsYD8MeVCa18xTGJwX80FbBg
vNaj8yS9WjzbaA2ESubtrncuWNKoLrRo	2026-09-14 10:10:31.019	JwzMW8Ksqn1bOsGVCqTUWdQijqh6i9DD	2026-09-07 10:10:31.02	2026-09-07 10:10:31.02			xxPcK4Koz52MBuvq4nNW0zydPwasnrg1
8KDEX8qtHbdFoPaPyvMlisw112AuVy8P	2026-09-14 10:10:31.194	3fW9GcB6LBCtsA6LJYXvtA7gILS3Ak9r	2026-09-07 10:10:31.194	2026-09-07 10:10:31.194			mtVVv75f2yHzeSMPZJTDTFRt8DWPXEMg
tIrlkNzM0cROkejEr0f05JMOdOSs7wEU	2026-09-14 10:10:31.391	yHnij86BGC74fsCPrkeyNYPeTKfmA6wq	2026-09-07 10:10:31.391	2026-09-07 10:10:31.391			CRFTMVKIhpGXErJqZ2LdOQhbRXBDW2Xk
WV0Vls0ZGsNZzSsxlZwxuu7jA57ONtRM	2026-09-14 10:10:31.574	vggqkoOvZzfBOWRoCPMMnzOZlEoeySvG	2026-09-07 10:10:31.574	2026-09-07 10:10:31.574			mIQPPpLasGPF10hcv169nWToFgJ5O4sQ
F05yxoInJX2VAm1FixVxAfKL3aTu1Adf	2026-09-14 10:10:31.749	DkS2AvssAlSHI73reRamkoMPxxlOWh7R	2026-09-07 10:10:31.749	2026-09-07 10:10:31.749			r3ExbT8pJA3HnBdqzk587rBJAwRGDPcr
Aq7h0RWFa7NcfeFoKTEeSgjjCEEMPBTX	2026-09-14 10:10:31.941	klJUVNjrff1QEpeqE3Lik9sqsVL8g8VI	2026-09-07 10:10:31.941	2026-09-07 10:10:31.941			YNoqOx8TbqFJRVNtEVsaoUN9vQKGJa7r
SRNV0NYmIUNnefGQWucg5akad7Sf35qn	2026-09-14 10:10:32.133	OSiD2wj9erHNIhgjGtISiVqKkjeW4rkJ	2026-09-07 10:10:32.133	2026-09-07 10:10:32.133			WfqmHnjZhDhKleDJbtDb9MQ0qz3lHQv3
vxOcgQ80ULAgVtD0R4XHiCHagwtTmHRs	2026-09-14 10:10:32.324	ezDahwpISKHQCdUntImrYOxVrd1ijpjs	2026-09-07 10:10:32.324	2026-09-07 10:10:32.324			QkaJZ8vWPfXA3oUCpp9e1CkMPEvRST3t
HfGCdZ2awA3asjvB6Wk3W8CaWP9cG8Wx	2026-09-14 10:10:32.549	1ObDl9Xl0gCKSGNbpqeOnU1MmXmwn5ED	2026-09-07 10:10:32.549	2026-09-07 10:10:32.549			76L8PTFMqYlnurediMRIJAGLebr0pZZa
bRNLLAWKWaOMTLijl13AncBV2M6GqrPk	2026-09-14 10:10:32.799	JQ1SA7wldDruQfzPElnx2he6SywgKdea	2026-09-07 10:10:32.799	2026-09-07 10:10:32.799			LXQTJP3w0Nzz0X3wiMBx9F3TF3TuwhqF
pcMwt3JlUtVzr81XK8BrYhGn9uMH16XO	2026-09-14 10:10:32.999	8VV1oLJ2XlUSw0tB6KZSyx2oLHJI7QCI	2026-09-07 10:10:32.999	2026-09-07 10:10:32.999			hx6qOcUol54sGF1FjRG1PdMfAsxwrpbR
T6aNRGbu0IU8S2Ch27zhea6qMVKfJWEE	2026-09-14 10:10:33.199	kWmlHy3DdpWjrFcYJN3JgVtPvpxqadnu	2026-09-07 10:10:33.199	2026-09-07 10:10:33.199			2pUGrFQOlJ5o5UIXErjqXDv21IH8APqY
WlmDzAvdnEvod9binC66oTkj1CSiTwOj	2026-09-14 10:10:33.416	47WPCBkBCGrgkrTeIyVmcJHbYXbIt7dC	2026-09-07 10:10:33.416	2026-09-07 10:10:33.416			t6XhzoA2BEor8YnzzyxGn6fvpmXpGmp3
7XHipXMxWDx70d9jPJdOZMsAeStyroch	2026-09-14 10:10:33.633	Cu0gwGnc64kMZXlghzkkt4zyoratQOpx	2026-09-07 10:10:33.633	2026-09-07 10:10:33.633			IXBS2ErppZvGPFfYIcvRrnfo82rCbwsP
jaHGh5ZYmCFH8HotaFLEwuxyUmAfatm0	2026-09-14 10:10:33.858	KcDry0QXIKDQSevBaGffTGzLfqY2OdC0	2026-09-07 10:10:33.858	2026-09-07 10:10:33.858			aKKTGhe52LRl5mzTrENWBn9xs4T39Nfl
gMs0vHPT9XycpBzAQQ4ni06ZjLEOZdGB	2026-09-14 10:10:34.05	mJxaaeBusKisFpshrX6zm02SF8Uk5HYg	2026-09-07 10:10:34.05	2026-09-07 10:10:34.05			9XbAKzSfkrS50Zeo6cAq5gqEON4KIBc4
R7jZyEannweEb9hFhoeYWhx9AjUqpptB	2026-09-14 10:10:34.258	V2aZ5rVUmZnbYeWhqYOusiGBXhK8Jj4K	2026-09-07 10:10:34.258	2026-09-07 10:10:34.258			RZlfJJ4DELzr3uu04Eko5TWRPJSWCa0f
BzdTbhKsh9Fz96TPFGQNeCOCvyXDYZI1	2026-09-14 10:10:34.483	TXyAkIYSpdIUqBtKkCKBVXkOgF0VbYJl	2026-09-07 10:10:34.483	2026-09-07 10:10:34.483			f1QSaxSyGMnwSGdKT71vAlmPsvCG39do
k7QbBAv98m1IOygKVGyRS9IQjCfeAGTt	2026-09-14 10:10:34.712	WofxwBfYHnaWpGq8GeoharQuEKpy2E2Z	2026-09-07 10:10:34.712	2026-09-07 10:10:34.712			gd4w9oIMkzTwtGATgVeS8N2DkaG0FHaR
Pzwrh65A7Ep5wFZavXNnFthUvHDcc9od	2026-09-14 10:10:34.895	FJm9KeydDUjERDSVHuTURqg2A9ju0YHz	2026-09-07 10:10:34.895	2026-09-07 10:10:34.895			SChWwr7bqDrmxCA5DmiyIVgTjElT3b44
OMpPfcse4GS6JKGgHrXGKGwsokDvX2aH	2026-09-14 10:10:35.128	a47PeKG04V9gWojlQvvr5XR1t1bVsRYk	2026-09-07 10:10:35.128	2026-09-07 10:10:35.128			SYcYeYfho7FZa0WqYqv3cQiyf0Ed4aFU
6LFwlBN3BKeQhl5qvK8pN9o9boShBssj	2026-09-14 10:10:35.312	fnC9eElL41G17Fep5XAwZCKjifmEVKbq	2026-09-07 10:10:35.312	2026-09-07 10:10:35.312			zNSMGFpNdSt1ZyM2ilw1QqPdWWNvEuWl
z3Y2VicvHJY0wbjopCuwH9HyX1bZCTQU	2026-09-14 10:10:35.512	4jVcerdJWlQkul6G98R1obawLre5QI0O	2026-09-07 10:10:35.512	2026-09-07 10:10:35.512			oLJrDOUnsVmMl3HldM5rnZMdiMpdt1Bd
4UQ2FB29d18BbLccAL99DRmd6jmHL3d5	2026-09-14 10:10:35.725	040VNUw4M24HHV5MatAiWVTz8xRMEjDo	2026-09-07 10:10:35.725	2026-09-07 10:10:35.725			LUQiBs90U3zcyJJPDl1XWbHIwLdAwC6d
7Dg8xDNL1dZ33fLyssitArqYSa8ysQCf	2026-09-14 10:10:35.904	AwbOkFa0OVMcYk1v1pBjimfc0BruSkNT	2026-09-07 10:10:35.904	2026-09-07 10:10:35.904			kkhJ3heiCMQwWu86VBgvSiIIVEXARGSK
1xtMHbq7amv2C0k5AnzMykjf9hdJFEDO	2026-09-14 10:10:36.1	rD9wyrddlZnXMkD19jvMFWzyHaK1pksl	2026-09-07 10:10:36.1	2026-09-07 10:10:36.1			mUrj3IIaO4LPKvd8RzFAn5aT0OMmaXKW
uGdcdFTqXYqnFHybvSZHwwMfzUsdkeRI	2026-09-14 10:10:36.275	hM7KzD9MKyEFW5JucY8ddpcD4myj6hdU	2026-09-07 10:10:36.275	2026-09-07 10:10:36.275			RE01yPcQq7LjARQNyj4x9jZO7oUsbIfZ
tH9M7bjzdpxlF3ElSQiCJphjY9jhuRKI	2026-09-14 10:11:11.081	Z8Ux2NVBu1obAPR63Zbr1JxVRfebnRhv	2026-09-07 10:11:11.082	2026-09-07 10:11:11.082			VfUndop1nWSrHLRW8ZzjD5ZlknGqO72j
\.


--
-- Data for Name: site_setting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site_setting (key, value, description, created_at, updated_at) FROM stdin;
logo	/LOGO-LEBAK.png	\N	2026-08-06 18:13:03.924609	2026-08-06 18:28:14.861
phone	(0252) 201113	\N	2026-08-06 18:13:03.962004	2026-08-06 18:28:14.863
site_name	MBG Kab. Lebak	\N	2026-08-06 18:13:03.860968	2026-08-06 18:28:14.862
address	Pusat Pemerintahan Kabupaten Lebak, Rangkasbitung	\N	2026-08-06 18:13:03.874193	2026-08-06 18:28:14.862
tagline	Sistem Informasi Makan Bergizi Gratis	\N	2026-08-06 18:13:03.886647	2026-08-06 18:28:14.862
site_description	Sistem Informasi Makan Bergizi Gratis	\N	2026-08-06 18:13:03.896763	2026-08-06 18:28:14.862
favicon	/uploads/upload-1786040861594-365471586.png	\N	2026-08-06 18:13:03.939684	2026-08-06 18:28:14.862
hero_bg_image	/uploads/upload-1786040654864-678193368.png	\N	2026-08-06 17:37:09.148661	2026-08-06 18:28:14.862
tagline_logo	/uploads/upload-1786040870558-199588482.png	\N	2026-08-06 18:13:03.954507	2026-08-06 18:28:14.862
gov_level	Pemerintah Kabupaten Lebak	\N	2026-08-06 18:13:03.861041	2026-08-06 18:28:14.863
email	mbg@lebakkab.go.id	\N	2026-08-06 18:13:03.955512	2026-08-06 18:28:14.863
\.


--
-- Data for Name: sppg; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sppg (sppg_id, id_sppg_code, nama_sppg, desa_id, yayasan_id, alamat, status_operasional, tanggal_operasional, bpjs_kesehatan, nama_ka_sppg, no_hp_ka_sppg, jumlah_penjamah_makanan, jumlah_bpjs_tk, chef_bersertifikat_bnsp, keterangan, created_at, updated_at) FROM stdin;
1	SPPG-CIBADAK-01	SPPG Lebak Cibadak Pasar Keong	296	19	Kampung Ciputat, RT 004 RW 001, Kelurahan Pasar Keong, Kecamatan Cibadak, Kabupaten Lebak, Provinsi Banten	Sudah Operasional	2025-01-01	t	Algi Firdaus	87773733856	1	1	1	\N	2026-09-09 02:08:28.176088	2026-10-06 03:27:18.462147
2	F02FDYHJ	SPPG LEBAK WARUNGGUNUNG CIBUAH 1	283	20	Kp. Cibuah kertamukti RT 014 RW 005 Desa Cibuah Kecamatan Warunggunung Kabupaten Lebak Provinsi Banten	Sudah Operasional	2025-01-01	t	Yayan Octaviana	083814941369	1	1	1	\N	2026-09-09 02:08:28.176088	2026-10-06 03:27:18.462147
3	V8YJWA3W	SPPG Lebak Kalanganyar Aweh 2	324	21	Jln. Maulana Yusuf, Kp. Aweh, Rt/Rw. 007/001 Ds. Aweh, Kec. Kalanganyar, Kab. Lebak	Sudah Operasional	2025-01-01	t	HADROMI	0895391997737	0	0	0	\N	2026-09-09 02:08:28.176088	2026-10-06 03:27:18.462147
4	WBAV2N4K	SPPG Lebak Rangkasbitung Muara Ciujung Timur 3	309	22	Jl. Kota Baru 2, Desa Muara Ciujung Timur, Kecamatan Rangkas Bitung, Kabupaten Lebak, Banten	Sudah Operasional	2025-01-01	t	Yusuf Firdaus	87771795406	1	1	1	\N	2026-09-09 02:08:28.176088	2026-10-06 03:27:18.462147
5	VYHRF3PX	SPPG Lebak Rangkasbitung Muara Ciujung Barat 1	320	1	Muara Ciujung Barat, Rangkasbitung, Kab. Lebak, Banten	Sudah Operasional	2025-01-01	t	Ayi Ahmad Nuramin	81316799234	1	1	1	\N	2026-09-09 02:08:28.176088	2026-10-06 03:27:18.462147
\.


--
-- Data for Name: sppg_laporan_aktifitas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sppg_laporan_aktifitas (id, sppg_id, sekolah_id, tanggal, jumlah_porsi, status, catatan, foto_dokumentasi, created_at, posyandu_id, standar_menu_id, status_verifikasi) FROM stdin;
1	1	1	2026-10-06	34	Diterima	Pengiriman makanan bergizi pilot project	https://placehold.co/600x400/EEE/31343C?text=Pengiriman+SPPG+1	2026-10-06 03:27:18.462147	\N	1	Terverifikasi
2	1	\N	2026-10-06	203	Diterima	Pengiriman paket gizi posyandu (bumil, busui, balita)	https://placehold.co/600x400/EEE/31343C?text=Posyandu+SPPG+1	2026-10-06 03:27:18.462147	1	1	Terverifikasi
3	2	15	2026-10-06	46	Diterima	Pengiriman makanan bergizi pilot project	https://placehold.co/600x400/EEE/31343C?text=Pengiriman+SPPG+2	2026-10-06 03:27:18.462147	\N	10	Terverifikasi
4	3	36	2026-10-06	125	Diterima	Pengiriman makanan bergizi pilot project	https://placehold.co/600x400/EEE/31343C?text=Pengiriman+SPPG+3	2026-10-06 03:27:18.462147	\N	11	Terverifikasi
5	3	\N	2026-10-06	133	Diterima	Pengiriman paket gizi posyandu (bumil, busui, balita)	https://placehold.co/600x400/EEE/31343C?text=Posyandu+SPPG+3	2026-10-06 03:27:18.462147	7	11	Terverifikasi
6	4	47	2026-10-06	69	Diterima	Pengiriman makanan bergizi pilot project	https://placehold.co/600x400/EEE/31343C?text=Pengiriman+SPPG+4	2026-10-06 03:27:18.462147	\N	12	Terverifikasi
7	4	\N	2026-10-06	560	Diterima	Pengiriman paket gizi posyandu (bumil, busui, balita)	https://placehold.co/600x400/EEE/31343C?text=Posyandu+SPPG+4	2026-10-06 03:27:18.462147	14	12	Terverifikasi
8	5	53	2026-10-06	24	Diterima	Pengiriman makanan bergizi pilot project	https://placehold.co/600x400/EEE/31343C?text=Pengiriman+SPPG+5	2026-10-06 03:27:18.462147	\N	13	Terverifikasi
9	5	\N	2026-10-06	222	Diterima	Pengiriman paket gizi posyandu (bumil, busui, balita)	https://placehold.co/600x400/EEE/31343C?text=Posyandu+SPPG+5	2026-10-06 03:27:18.462147	15	13	Terverifikasi
\.


--
-- Data for Name: sppg_pemakaian_bahan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sppg_pemakaian_bahan (id, sppg_id, jenis_pangan_id, standar_menu_id, tanggal_pemakaian, minggu_ke, volume, satuan, catatan, created_at, status_verifikasi) FROM stdin;
1	1	21	\N	2026-09-02	\N	50.00	Kg	Masak Nasi kloter 1	2026-09-09 08:12:07.020923	Draft
2	1	21	\N	2026-09-03	\N	50.00	Kg	Masak Nasi kloter 2	2026-09-09 08:12:07.020923	Draft
3	1	37	\N	2026-09-03	\N	20.00	Kg	Ayam kecap	2026-09-09 08:12:07.020923	Draft
4	1	21	\N	2026-09-04	\N	50.00	Kg	Masak Nasi kloter 3	2026-09-09 08:12:07.020923	Draft
5	1	37	\N	2026-09-04	\N	20.00	Kg	Ayam goreng	2026-09-09 08:12:07.020923	Draft
6	1	3	\N	2026-09-04	\N	15.00	Kg	Telur balado	2026-09-09 08:12:07.020923	Draft
\.


--
-- Data for Name: sppg_pembelian_bahan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sppg_pembelian_bahan (id, sppg_id, pemasok_id, jenis_pangan_id, tanggal_pembelian, minggu_ke, volume, satuan, harga_total, foto_nota, catatan, created_at, status_verifikasi, tipe_sumber, penggilingan_id) FROM stdin;
1	1	14	21	2026-09-01	1	500.00	Kg	\N	https://placehold.co/600x400/EEE/31343C?text=Nota+Beras	[Pembelian Lokal] Stok Awal Bulan	2026-09-09 08:12:06.895946	Draft	Pemasok	\N
2	1	15	37	2026-09-02	1	200.00	Kg	\N	https://placehold.co/600x400/EEE/31343C?text=Nota+Daging	[Pembelian Lokal] Daging Segar	2026-09-09 08:12:06.96263	Draft	Pemasok	\N
3	1	16	3	2026-09-03	1	150.00	Kg	\N	https://placehold.co/600x400/EEE/31343C?text=Nota+Telur	[Pembelian Lokal] Telur Negeri	2026-09-09 08:12:06.990754	Draft	Pemasok	\N
4	1	16	22	2026-09-28	\N	100.00	Kg	\N	https://lebakkab/test.jpg	[Pembelian Lokal] 3609	2026-09-28 00:27:03.338547	Draft	Pemasok	\N
\.


--
-- Data for Name: sppg_penerima_manfaat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sppg_penerima_manfaat (id, sppg_id, sekolah_id, tahun_ajaran, jumlah_laki, jumlah_perempuan, jumlah_total, status, tanggal_mulai, tanggal_selesai, catatan, created_at, updated_at, status_verifikasi) FROM stdin;
1	1	1	2026/2027	17	17	34	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
2	1	2	2026/2027	15	16	31	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
3	1	3	2026/2027	33	34	67	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
4	1	4	2026/2027	24	24	48	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
5	1	5	2026/2027	16	16	32	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
6	1	6	2026/2027	15	16	31	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
7	1	7	2026/2027	151	152	303	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
8	1	8	2026/2027	122	123	245	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
9	1	9	2026/2027	113	114	227	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
10	1	10	2026/2027	64	65	129	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
11	1	11	2026/2027	62	62	124	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
12	1	12	2026/2027	89	90	179	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
13	1	13	2026/2027	367	368	735	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
14	1	14	2026/2027	38	39	77	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
15	2	15	2026/2027	23	23	46	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
16	2	16	2026/2027	22	22	44	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
17	2	17	2026/2027	28	29	57	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
18	2	18	2026/2027	33	34	67	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
19	2	19	2026/2027	13	14	27	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
20	2	20	2026/2027	32	33	65	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
21	2	21	2026/2027	17	18	35	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
22	2	22	2026/2027	76	77	153	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
23	2	23	2026/2027	78	78	156	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
24	2	24	2026/2027	48	48	96	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
25	2	25	2026/2027	212	213	425	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
26	2	26	2026/2027	132	132	264	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
27	2	27	2026/2027	86	87	173	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
28	2	28	2026/2027	116	116	232	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
29	2	29	2026/2027	35	35	70	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
30	2	30	2026/2027	38	39	77	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
31	2	31	2026/2027	98	99	197	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
32	2	32	2026/2027	20	20	40	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
33	2	33	2026/2027	64	64	128	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
34	2	34	2026/2027	26	26	52	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
35	2	35	2026/2027	442	442	884	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
36	3	36	2026/2027	62	63	125	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
37	3	37	2026/2027	145	145	290	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
38	3	38	2026/2027	151	152	303	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
39	3	39	2026/2027	129	130	259	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
40	3	40	2026/2027	80	80	160	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
41	3	41	2026/2027	112	112	224	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
42	3	42	2026/2027	115	116	231	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
43	3	43	2026/2027	156	156	312	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
44	3	44	2026/2027	58	58	116	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
45	3	45	2026/2027	103	103	206	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
46	3	46	2026/2027	77	78	155	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
47	4	47	2026/2027	34	35	69	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
48	4	48	2026/2027	28	28	56	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
49	4	49	2026/2027	441	442	883	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
50	4	50	2026/2027	392	393	785	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
51	4	51	2026/2027	344	345	689	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
52	4	52	2026/2027	15	15	30	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
53	5	53	2026/2027	12	12	24	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
54	5	54	2026/2027	212	213	425	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
55	5	55	2026/2027	285	286	571	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
56	5	56	2026/2027	641	642	1283	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
\.


--
-- Data for Name: sppg_posyandu_manfaat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sppg_posyandu_manfaat (id, sppg_id, posyandu_id, jumlah_busui, jumlah_balita, jumlah_bumil, jumlah_total, status, tanggal_mulai, tanggal_selesai, catatan, created_at, updated_at, status_verifikasi) FROM stdin;
1	1	1	51	134	18	203	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
2	1	2	6	58	7	71	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
3	1	3	8	55	7	70	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
4	1	4	12	42	12	66	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
5	1	5	10	34	7	51	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
6	1	6	11	73	5	89	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
7	3	7	29	94	10	133	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
8	3	8	16	56	5	77	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
9	3	9	12	58	12	82	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
10	3	10	6	79	6	91	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
11	3	11	11	61	7	79	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
12	3	12	22	67	9	98	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
13	3	13	7	44	3	54	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
14	4	14	94	425	41	560	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
15	5	15	50	143	29	222	Aktif	2026-01-01	\N	\N	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Terverifikasi
\.


--
-- Data for Name: sppg_sertifikasi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sppg_sertifikasi (sertifikasi_id, sppg_id, jenis_sertifikasi, status, tanggal_berlaku, keterangan) FROM stdin;
\.


--
-- Data for Name: sppg_uji_rapid_test; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sppg_uji_rapid_test (id, sppg_id, jenis_pangan_id, tanggal_uji, parameter_uji, hasil_uji, petugas_penguji, tindakan_lanjut, foto_bukti, created_at, parameter_uji_id, pembelian_id) FROM stdin;
1	1	37	2026-09-02	Formalin & E.Coli	Aman / Negatif	Budi Santoso	Boleh Digunakan	https://placehold.co/600x400/34d399/1e293b?text=Test+Ayam+Negatif	2026-09-09 08:12:07.048658	\N	2
2	1	3	2026-09-03	Salmonella	Aman / Negatif	Budi Santoso	Boleh Digunakan	https://placehold.co/600x400/34d399/1e293b?text=Test+Telur+Negatif	2026-09-09 08:12:07.048658	\N	3
\.


--
-- Data for Name: standar_kecukupan_gizi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.standar_kecukupan_gizi (id, kategori_id, jenis_makan, min_energi_kkal, max_energi_kkal, min_protein_gram, max_protein_gram, min_lemak_gram, max_lemak_gram, min_karbohidrat_gram, max_karbohidrat_gram, created_at, updated_at) FROM stdin;
1	1	Pagi	280.00	350.00	5.00	6.30	10.00	12.50	44.00	55.00	2026-08-20 02:31:57.684717	2026-08-20 02:31:57.684717
2	2	Pagi	280.00	350.00	5.00	6.30	10.00	12.50	44.00	55.00	2026-08-20 02:31:57.971226	2026-08-20 02:31:57.971226
3	3	Pagi	280.00	350.00	5.00	6.30	10.00	12.50	44.00	55.00	2026-08-20 02:31:58.020517	2026-08-20 02:31:58.020517
4	4	Pagi	280.00	350.00	5.00	6.30	10.00	12.50	44.00	55.00	2026-08-20 02:31:58.039878	2026-08-20 02:31:58.039878
5	5	Pagi	330.00	413.00	8.00	10.00	11.00	13.80	50.00	62.50	2026-08-20 02:31:58.070556	2026-08-20 02:31:58.070556
\.


--
-- Data for Name: standar_menu_gizi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.standar_menu_gizi (id, nama_menu, deskripsi, kalori_kkal, protein_gram, karbohidrat_gram, lemak_gram, kategori_target_id, status, created_at, updated_at, jenis_makan, sppg_id) FROM stdin;
1	Nasi Ayam Bakar Kecap	Nasi putih, Ayam bakar kecap, Tempe orek, Tumis Buncis Wortel, Buah Pisang, Susu UHT	650	22.50	85.00	20.00	5	Aktif	2026-09-14 01:52:08.680172	2026-09-14 01:52:08.680172	Siang	1
2	Nasi Ikan Fillet Tepung	Nasi putih, Ikan fillet goreng tepung, Tahu isi sayur, Cah Sawi Hijau, Buah Jeruk, Susu UHT	720	25.00	95.00	22.50	6	Aktif	2026-09-14 01:52:08.680172	2026-09-14 01:52:08.680172	Siang	1
3	Nasi Semur Daging Sapi	Nasi putih, Semur daging sapi, Telur rebus setengah, Sayur Sop Makaroni, Buah Naga, Susu UHT	850	30.00	110.00	28.00	7	Aktif	2026-09-14 01:52:08.680172	2026-09-14 01:52:08.680172	Siang	1
4	Bubur Kacang Hijau Padat Gizi	Bubur kacang hijau dengan santan murni, gula aren, dan tambahan telur puyuh rebus	450	12.00	55.00	15.00	10	Aktif	2026-09-14 01:52:08.680172	2026-09-14 01:52:08.680172	Pagi	1
5	Nasi Sup Ayam Brokoli	Nasi putih, Sup kaldu ayam dengan brokoli dan wortel, Perkedel kentang, Semangka, Susu UHT	620	20.00	82.00	18.00	5	Aktif	2026-09-14 01:52:08.680172	2026-09-14 01:52:08.680172	Siang	1
10	Nasi Ayam Semur & Sayur Sehat	Paket menu makan bergizi seimbang lengkap dengan lauk hewani, nabati, sayur, dan buah.	650	24.50	75.00	18.00	\N	Aktif	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Siang	2
11	Nasi Ayam Semur & Sayur Sehat	Paket menu makan bergizi seimbang lengkap dengan lauk hewani, nabati, sayur, dan buah.	650	24.50	75.00	18.00	\N	Aktif	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Siang	3
12	Nasi Ayam Semur & Sayur Sehat	Paket menu makan bergizi seimbang lengkap dengan lauk hewani, nabati, sayur, dan buah.	650	24.50	75.00	18.00	\N	Aktif	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Siang	4
13	Nasi Ayam Semur & Sayur Sehat	Paket menu makan bergizi seimbang lengkap dengan lauk hewani, nabati, sayur, dan buah.	650	24.50	75.00	18.00	\N	Aktif	2026-10-06 03:27:18.462147	2026-10-06 03:27:18.462147	Siang	5
\.


--
-- Data for Name: supply_chain_kebutuhan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supply_chain_kebutuhan (id, sppg_id, jenis_pangan_id, pemasok_id, kebutuhan_per_bulan, satuan, periode, created_at) FROM stdin;
\.


--
-- Data for Name: sys_menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_menu (id, nama_modul, url, icon, hak_akses, status, "createdAt") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt", role, kecamatan_id, penggilingan_id, sekolah_id, sppg_id, username, "displayUsername", posyandu_id, kabupaten_id) FROM stdin;
F3muO6pZQbw9BvZaIJXCVxon1ws4LBAX	Dapur Umum Rangkas 6	sppg6@mbg.lebak.go.id	f	\N	2026-08-05 15:18:49.591	2026-08-05 15:18:49.591	publik	\N	\N	\N	\N	sppg6	sppg6	\N	\N
FzmZmuQKqlCvfu6WGyehYwCeX7aBYuB5	Operator SPPG Lebak Cibadak Pasar Keong	sppg1@mbg.lebak.go.id	f	\N	2026-08-06 01:28:46.682	2026-10-06 03:27:18.462147	operator_sppg	\N	\N	\N	1	sppg1	sppg1	\N	\N
DcD6TFEg2U3i1a6uvQnAqcmgsypGztOB	Admin Dinas (Superadmin)	admin@mbg.lebak.go.id	f	\N	2026-08-05 15:24:58.18	2026-08-05 15:24:58.18	admin_dinas	\N	\N	\N	\N	admin	admin	\N	\N
D7sxIVBI3QWrOVgCCpcxesqmhHUJ1eZY	Operator SPPG LEBAK WARUNGGUNUNG CIBUAH 1	sppg2@mbg.lebak.go.id	f	\N	2026-08-05 15:19:36.56	2026-10-06 03:27:18.462147	operator_sppg	\N	\N	\N	2	sppg2	sppg2	\N	\N
uQcpC7ITHLZzyHlKbRfGvz9CMDevv1Yr	Operator SPPG Lebak Kalanganyar Aweh 2	sppg3@mbg.lebak.go.id	f	\N	2026-08-06 01:28:47.188	2026-10-06 03:27:18.462147	operator_sppg	\N	\N	\N	3	sppg3	sppg3	\N	\N
3Hfv1a9QnuJ2HUYvofT9AvtbUzSgDewf	Operator SPPG Lebak Rangkasbitung Muara Ciujung Timur 3	sppg4@mbg.lebak.go.id	f	\N	2026-08-06 01:28:47.65	2026-10-06 03:27:18.462147	operator_sppg	\N	\N	\N	4	sppg4	sppg4	\N	\N
PzlimWqn7rDrdL8MY0RIjpfDMRaqch7L	Operator SPPG Lebak Rangkasbitung Muara Ciujung Barat 1	sppg5@mbg.lebak.go.id	f	\N	2026-08-06 01:28:48.582	2026-10-06 03:27:18.462147	operator_sppg	\N	\N	\N	5	sppg5	sppg5	\N	\N
sekolah_user_1_1791257238682	TK Negeri Syeh Malka	sekolah1@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	1	\N	sekolah1	\N	\N	\N
sekolah_user_2_1791257238691	TK Nuru Husen	sekolah2@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	2	\N	sekolah2	\N	\N	\N
sekolah_user_3_1791257238695	KB Al Musyawwir	sekolah3@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	3	\N	sekolah3	\N	\N	\N
sekolah_user_4_1791257238700	KB Azahra	sekolah4@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	4	\N	sekolah4	\N	\N	\N
sekolah_user_5_1791257238704	KB Asri	sekolah5@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	5	\N	sekolah5	\N	\N	\N
sekolah_user_6_1791257238712	Paud Nurul Husen	sekolah6@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	6	\N	sekolah6	\N	\N	\N
sekolah_user_7_1791257238717	SDN 1 Panancangan	sekolah7@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	7	\N	sekolah7	\N	\N	\N
sekolah_user_8_1791257238721	SDN 2 Pasar Keong	sekolah8@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	8	\N	sekolah8	\N	\N	\N
sekolah_user_9_1791257238749	SDN 1 Cisangu	sekolah9@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	9	\N	sekolah9	\N	\N	\N
sekolah_user_10_1791257238776	SDN 2 Cisangu	sekolah10@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	10	\N	sekolah10	\N	\N	\N
sekolah_user_11_1791257238794	MIS Nurul Husen	sekolah11@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	11	\N	sekolah11	\N	\N	\N
sekolah_user_12_1791257238802	SMPN 4  CIBADAK	sekolah12@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	12	\N	sekolah12	\N	\N	\N
sekolah_user_13_1791257238807	SMAN 1 Cibadak	sekolah13@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	13	\N	sekolah13	\N	\N	\N
sekolah_user_14_1791257238813	SMK Nurul Husen	sekolah14@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	14	\N	sekolah14	\N	\N	\N
sekolah_user_15_1791257238825	KB Nurul Muhtadin	sekolah15@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	15	\N	sekolah15	\N	\N	\N
sekolah_user_16_1791257238829	TK insan Cendikia	sekolah16@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	16	\N	sekolah16	\N	\N	\N
sekolah_user_17_1791257238832	TK Bina Insani	sekolah17@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	17	\N	sekolah17	\N	\N	\N
sekolah_user_18_1791257238835	RA Assa'adiyah	sekolah18@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	18	\N	sekolah18	\N	\N	\N
sekolah_user_19_1791257238839	RA Mathla'ul Anwar	sekolah19@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	19	\N	sekolah19	\N	\N	\N
sekolah_user_20_1791257238843	PAUD KB Al-Hidayah	sekolah20@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	20	\N	sekolah20	\N	\N	\N
sekolah_user_21_1791257238846	PAUD Al-Ikhlas	sekolah21@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	21	\N	sekolah21	\N	\N	\N
sekolah_user_22_1791257238849	SDIT Insan Cendikia	sekolah22@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	22	\N	sekolah22	\N	\N	\N
sekolah_user_23_1791257238853	MI Al Ittihad Pasirkopo	sekolah23@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	23	\N	sekolah23	\N	\N	\N
sekolah_user_24_1791257238856	MI hidayah Islamiyah Pasirtangkil	sekolah24@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	24	\N	sekolah24	\N	\N	\N
JgMcBdIKre0A7AB55mbmVGlcQf4aNJi9	Dapur Sehat Cibadak 2	sppg9@mbglebak.id	f	\N	2026-08-06 01:28:48.168	2026-08-06 01:28:48.168	publik	\N	\N	\N	\N	sppg9	sppg9	\N	\N
sekolah_user_25_1791257238858	SDN 1 Baros	sekolah25@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	25	\N	sekolah25	\N	\N	\N
sekolah_user_26_1791257238862	SDN 1 Sindang sari	sekolah26@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	26	\N	sekolah26	\N	\N	\N
sekolah_user_27_1791257238866	SDN 1 Pasirtangkil	sekolah27@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	27	\N	sekolah27	\N	\N	\N
MOnUZMhPIsYD8MeVCa18xTGJwX80FbBg	PAJAR II	penggilingan_pajarii_19@mbg.id	t	\N	2026-09-07 10:10:30.779	2026-09-07 10:10:30.779	operator_penggilingan	\N	19	\N	\N	penggilingan_pajarii_19	penggilingan_pajarii_19	\N	\N
xxPcK4Koz52MBuvq4nNW0zydPwasnrg1	MULYASARI	penggilingan_mulyasari_20@mbg.id	t	\N	2026-09-07 10:10:30.973	2026-09-07 10:10:30.973	operator_penggilingan	\N	20	\N	\N	penggilingan_mulyasari_20	penggilingan_mulyasari_20	\N	\N
mtVVv75f2yHzeSMPZJTDTFRt8DWPXEMg	BINA TANI	penggilingan_binatani_23@mbg.id	t	\N	2026-09-07 10:10:31.151	2026-09-07 10:10:31.151	operator_penggilingan	\N	23	\N	\N	penggilingan_binatani_23	penggilingan_binatani_23	\N	\N
CRFTMVKIhpGXErJqZ2LdOQhbRXBDW2Xk	SEBRANG LOR	penggilingan_sebranglor_24@mbg.id	t	\N	2026-09-07 10:10:31.332	2026-09-07 10:10:31.332	operator_penggilingan	\N	24	\N	\N	penggilingan_sebranglor_24	penggilingan_sebranglor_24	\N	\N
mIQPPpLasGPF10hcv169nWToFgJ5O4sQ	TANI MULYA	penggilingan_tanimulya_25@mbg.id	t	\N	2026-09-07 10:10:31.532	2026-09-07 10:10:31.532	operator_penggilingan	\N	25	\N	\N	penggilingan_tanimulya_25	penggilingan_tanimulya_25	\N	\N
r3ExbT8pJA3HnBdqzk587rBJAwRGDPcr	PAKASABAN III	penggilingan_pakasabani_29@mbg.id	t	\N	2026-09-07 10:10:31.706	2026-09-07 10:10:31.706	operator_penggilingan	\N	29	\N	\N	penggilingan_pakasabani_29	penggilingan_pakasabani_29	\N	\N
YNoqOx8TbqFJRVNtEVsaoUN9vQKGJa7r	PANASARAN	penggilingan_panasaran_21@mbg.id	t	\N	2026-09-07 10:10:31.9	2026-09-07 10:10:31.9	operator_penggilingan	\N	21	\N	\N	penggilingan_panasaran_21	penggilingan_panasaran_21	\N	\N
WfqmHnjZhDhKleDJbtDb9MQ0qz3lHQv3	RIZKI JAYA	penggilingan_rizkijaya_22@mbg.id	t	\N	2026-09-07 10:10:32.077	2026-09-07 10:10:32.077	operator_penggilingan	\N	22	\N	\N	penggilingan_rizkijaya_22	penggilingan_rizkijaya_22	\N	\N
VfUndop1nWSrHLRW8ZzjD5ZlknGqO72j	Penggilingan Padi ATM	penggilingan_penggiling_31@mbg.id	t	\N	2026-09-07 10:10:29.419	2026-09-07 10:10:29.419	operator_penggilingan	\N	31	\N	\N	penggilingan_penggiling_31	penggilingan_penggiling_31	\N	\N
RZBha9s4SFRQ0127nLSNtFkqfDG1tf1f	SUBUR MAKMUR TANI	penggilingan_suburmakmu_13@mbg.id	t	\N	2026-09-07 10:10:29.62	2026-09-07 10:10:29.62	operator_penggilingan	\N	13	\N	\N	penggilingan_suburmakmu_13	penggilingan_suburmakmu_13	\N	\N
V6iTjPzMG6yRBKoCcRnEmwmsfF0TP56P	TIGA PUTRI	penggilingan_tigaputri_14@mbg.id	t	\N	2026-09-07 10:10:29.814	2026-09-07 10:10:29.814	operator_penggilingan	\N	14	\N	\N	penggilingan_tigaputri_14	penggilingan_tigaputri_14	\N	\N
PKCWsMz5t7LmrqrODkO80BqfoTim6jPH	YANTO	penggilingan_yanto_15@mbg.id	t	\N	2026-09-07 10:10:29.999	2026-09-07 10:10:29.999	operator_penggilingan	\N	15	\N	\N	penggilingan_yanto_15	penggilingan_yanto_15	\N	\N
WBaRiHk6gvAOFL3Q5VWPYfggdNhlN16k	SIANGIN II	penggilingan_sianginii_16@mbg.id	t	\N	2026-09-07 10:10:30.173	2026-09-07 10:10:30.173	operator_penggilingan	\N	16	\N	\N	penggilingan_sianginii_16	penggilingan_sianginii_16	\N	\N
VVbi2nEJkN6JKVt82wuxz5rirnoGgUkD	RADEN PERKASA	penggilingan_radenperka_17@mbg.id	t	\N	2026-09-07 10:10:30.364	2026-09-07 10:10:30.364	operator_penggilingan	\N	17	\N	\N	penggilingan_radenperka_17	penggilingan_radenperka_17	\N	\N
Oaw3RzwC2cEjgvFg4V3CHP1NFityTNHL	GELAR MUKTI	penggilingan_gelarmukti_18@mbg.id	t	\N	2026-09-07 10:10:30.554	2026-09-07 10:10:30.554	operator_penggilingan	\N	18	\N	\N	penggilingan_gelarmukti_18	penggilingan_gelarmukti_18	\N	\N
QkaJZ8vWPfXA3oUCpp9e1CkMPEvRST3t	SRI MULYA II	penggilingan_srimulyaii_26@mbg.id	t	\N	2026-09-07 10:10:32.267	2026-09-07 10:10:32.267	operator_penggilingan	\N	26	\N	\N	penggilingan_srimulyaii_26	penggilingan_srimulyaii_26	\N	\N
76L8PTFMqYlnurediMRIJAGLebr0pZZa	SIDA MULYA I	penggilingan_sidamulyai_27@mbg.id	t	\N	2026-09-07 10:10:32.457	2026-09-07 10:10:32.457	operator_penggilingan	\N	27	\N	\N	penggilingan_sidamulyai_27	penggilingan_sidamulyai_27	\N	\N
LXQTJP3w0Nzz0X3wiMBx9F3TF3TuwhqF	GAPOKTAN SURYA TANI KENCANA	penggilingan_gapoktansu_28@mbg.id	t	\N	2026-09-07 10:10:32.75	2026-09-07 10:10:32.75	operator_penggilingan	\N	28	\N	\N	penggilingan_gapoktansu_28	penggilingan_gapoktansu_28	\N	\N
hx6qOcUol54sGF1FjRG1PdMfAsxwrpbR	BERKAH ABADI	penggilingan_berkahabad_30@mbg.id	t	\N	2026-09-07 10:10:32.947	2026-09-07 10:10:32.947	operator_penggilingan	\N	30	\N	\N	penggilingan_berkahabad_30	penggilingan_berkahabad_30	\N	\N
2pUGrFQOlJ5o5UIXErjqXDv21IH8APqY	Suka Bungah	penggilingan_sukabungah_32@mbg.id	t	\N	2026-09-07 10:10:33.159	2026-09-07 10:10:33.159	operator_penggilingan	\N	32	\N	\N	penggilingan_sukabungah_32	penggilingan_sukabungah_32	\N	\N
t6XhzoA2BEor8YnzzyxGn6fvpmXpGmp3	PD Cahaya Tani	penggilingan_pdcahayata_33@mbg.id	t	\N	2026-09-07 10:10:33.347	2026-09-07 10:10:33.347	operator_penggilingan	\N	33	\N	\N	penggilingan_pdcahayata_33	penggilingan_pdcahayata_33	\N	\N
IXBS2ErppZvGPFfYIcvRrnfo82rCbwsP	Putra Tani	penggilingan_putratani_43@mbg.id	t	\N	2026-09-07 10:10:33.558	2026-09-07 10:10:33.558	operator_penggilingan	\N	43	\N	\N	penggilingan_putratani_43	penggilingan_putratani_43	\N	\N
aKKTGhe52LRl5mzTrENWBn9xs4T39Nfl	Cipta Maju	penggilingan_ciptamaju_34@mbg.id	t	\N	2026-09-07 10:10:33.817	2026-09-07 10:10:33.817	operator_penggilingan	\N	34	\N	\N	penggilingan_ciptamaju_34	penggilingan_ciptamaju_34	\N	\N
9XbAKzSfkrS50Zeo6cAq5gqEON4KIBc4	Situjaya	penggilingan_situjaya_35@mbg.id	t	\N	2026-09-07 10:10:34.008	2026-09-07 10:10:34.008	operator_penggilingan	\N	35	\N	\N	penggilingan_situjaya_35	penggilingan_situjaya_35	\N	\N
RZlfJJ4DELzr3uu04Eko5TWRPJSWCa0f	Poktan Berkah Mukti	penggilingan_poktanberk_36@mbg.id	t	\N	2026-09-07 10:10:34.216	2026-09-07 10:10:34.216	operator_penggilingan	\N	36	\N	\N	penggilingan_poktanberk_36	penggilingan_poktanberk_36	\N	\N
f1QSaxSyGMnwSGdKT71vAlmPsvCG39do	Poktan Cahaya Tani	penggilingan_poktancaha_37@mbg.id	t	\N	2026-09-07 10:10:34.4	2026-09-07 10:10:34.4	operator_penggilingan	\N	37	\N	\N	penggilingan_poktancaha_37	penggilingan_poktancaha_37	\N	\N
gd4w9oIMkzTwtGATgVeS8N2DkaG0FHaR	Poktan Pakasaban III	penggilingan_poktanpaka_38@mbg.id	t	\N	2026-09-07 10:10:34.618	2026-09-07 10:10:34.618	operator_penggilingan	\N	38	\N	\N	penggilingan_poktanpaka_38	penggilingan_poktanpaka_38	\N	\N
SChWwr7bqDrmxCA5DmiyIVgTjElT3b44	Poktan Tunas Karya Tani I	penggilingan_poktantuna_39@mbg.id	t	\N	2026-09-07 10:10:34.851	2026-09-07 10:10:34.851	operator_penggilingan	\N	39	\N	\N	penggilingan_poktantuna_39	penggilingan_poktantuna_39	\N	\N
SYcYeYfho7FZa0WqYqv3cQiyf0Ed4aFU	Gapoktan Permata Desa	penggilingan_gapoktanpe_40@mbg.id	t	\N	2026-09-07 10:10:35.059	2026-09-07 10:10:35.059	operator_penggilingan	\N	40	\N	\N	penggilingan_gapoktanpe_40	penggilingan_gapoktanpe_40	\N	\N
zNSMGFpNdSt1ZyM2ilw1QqPdWWNvEuWl	Aneka Alam Niaga	penggilingan_anekaalamn_41@mbg.id	t	\N	2026-09-07 10:10:35.267	2026-09-07 10:10:35.267	operator_penggilingan	\N	41	\N	\N	penggilingan_anekaalamn_41	penggilingan_anekaalamn_41	\N	\N
oLJrDOUnsVmMl3HldM5rnZMdiMpdt1Bd	Poktan Subur Sejahtera	penggilingan_poktansubu_42@mbg.id	t	\N	2026-09-07 10:10:35.468	2026-09-07 10:10:35.468	operator_penggilingan	\N	42	\N	\N	penggilingan_poktansubu_42	penggilingan_poktansubu_42	\N	\N
LUQiBs90U3zcyJJPDl1XWbHIwLdAwC6d	BUM Desa Cipedang Maju	penggilingan_bumdesacip_44@mbg.id	t	\N	2026-09-07 10:10:35.654	2026-09-07 10:10:35.654	operator_penggilingan	\N	44	\N	\N	penggilingan_bumdesacip_44	penggilingan_bumdesacip_44	\N	\N
kkhJ3heiCMQwWu86VBgvSiIIVEXARGSK	Penggilingan Poktan Situ Mukti	penggilingan_penggiling_45@mbg.id	t	\N	2026-09-07 10:10:35.856	2026-09-07 10:10:35.856	operator_penggilingan	\N	45	\N	\N	penggilingan_penggiling_45	penggilingan_penggiling_45	\N	\N
mUrj3IIaO4LPKvd8RzFAn5aT0OMmaXKW	PD. Ade Jaya	penggilingan_pdadejaya_47@mbg.id	t	\N	2026-09-07 10:10:36.035	2026-09-07 10:10:36.035	operator_penggilingan	\N	47	\N	\N	penggilingan_pdadejaya_47	penggilingan_pdadejaya_47	\N	\N
RE01yPcQq7LjARQNyj4x9jZO7oUsbIfZ	Harnu Beras	penggilingan_harnuberas_46@mbg.id	t	\N	2026-09-07 10:10:36.236	2026-09-07 10:10:36.236	operator_penggilingan	\N	46	\N	\N	penggilingan_harnuberas_46	penggilingan_harnuberas_46	\N	\N
sekolah_user_28_1791257238868	SDN 2 Pasirtangkil	sekolah28@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	28	\N	sekolah28	\N	\N	\N
sekolah_user_29_1791257238871	MTS Hidayah Islamiyah Pasirkopo	sekolah29@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	29	\N	sekolah29	\N	\N	\N
sekolah_user_30_1791257238874	MTS Hidayah Islamiyah Pasirtangkil	sekolah30@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	30	\N	sekolah30	\N	\N	\N
sekolah_user_31_1791257238878	MTS El Karim	sekolah31@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	31	\N	sekolah31	\N	\N	\N
sekolah_user_32_1791257238882	MTS plus Mabdail Falah	sekolah32@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	32	\N	sekolah32	\N	\N	\N
sekolah_user_33_1791257238885	MA El Karim	sekolah33@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	33	\N	sekolah33	\N	\N	\N
sekolah_user_34_1791257238889	MA Hidayah Islamiyah Pasirkopo	sekolah34@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	34	\N	sekolah34	\N	\N	\N
sekolah_user_35_1791257238894	SMA 1 Warunggunung	sekolah35@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	35	\N	sekolah35	\N	\N	\N
sekolah_user_36_1791257238898	RA ASSUKIYA	sekolah36@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	36	\N	sekolah36	\N	\N	\N
sekolah_user_37_1791257238901	SDN 01 PASIRKUPA	sekolah37@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	37	\N	sekolah37	\N	\N	\N
sekolah_user_38_1791257238905	SDN 04 SUKAMEKARSARI	sekolah38@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	38	\N	sekolah38	\N	\N	\N
sekolah_user_39_1791257238908	SDN 01 KALANGANYAR	sekolah39@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	39	\N	sekolah39	\N	\N	\N
sekolah_user_40_1791257238911	MTS BANI IDRIS	sekolah40@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	40	\N	sekolah40	\N	\N	\N
sekolah_user_41_1791257238914	MTS AL FALAH	sekolah41@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	41	\N	sekolah41	\N	\N	\N
sekolah_user_42_1791257238918	MTS DAARUL MUSYAFFA	sekolah42@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	42	\N	sekolah42	\N	\N	\N
sekolah_user_43_1791257238921	SMP KALANGANYAR	sekolah43@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	43	\N	sekolah43	\N	\N	\N
sekolah_user_44_1791257238925	SMK ASSUKIYA	sekolah44@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	44	\N	sekolah44	\N	\N	\N
sekolah_user_45_1791257238928	MA DAARUL MUSYAFFA	sekolah45@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	45	\N	sekolah45	\N	\N	\N
sekolah_user_46_1791257238930	MA AL FALAH	sekolah46@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	46	\N	sekolah46	\N	\N	\N
sekolah_user_47_1791257238933	TK PGRI 1 RANGKASBITUNG	sekolah47@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	47	\N	sekolah47	\N	\N	\N
sekolah_user_48_1791257238937	TK PELITA	sekolah48@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	48	\N	sekolah48	\N	\N	\N
sekolah_user_49_1791257238940	SDN 1 RANGKASBITUNG BARAT	sekolah49@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	49	\N	sekolah49	\N	\N	\N
sekolah_user_50_1791257238943	SDN 2 MUARA CIUJUNG TIMUR	sekolah50@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	50	\N	sekolah50	\N	\N	\N
sekolah_user_51_1791257238946	SMAN 1 RANGKASBITUNG	sekolah51@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	51	\N	sekolah51	\N	\N	\N
sekolah_user_52_1791257238949	SMKS MATHAUL ANWAR	sekolah52@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	52	\N	sekolah52	\N	\N	\N
sekolah_user_53_1791257238951	PAUD ALHIDAYAH	sekolah53@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	53	\N	sekolah53	\N	\N	\N
sekolah_user_54_1791257238954	SDN 1 MUARA CIUJUNG BARAT	sekolah54@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	54	\N	sekolah54	\N	\N	\N
sekolah_user_55_1791257238958	SDN 2 MUARA CIUJUNG BARAT	sekolah55@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	55	\N	sekolah55	\N	\N	\N
sekolah_user_56_1791257238960	SMPN 1 RANGKASBITUNG	sekolah56@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_sekolah	\N	\N	56	\N	sekolah56	\N	\N	\N
posyandu_user_1_1791257238965	Posyandu Jeruk	posyandu1@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_posyandu	\N	\N	\N	\N	posyandu1	\N	1	\N
posyandu_user_2_1791257238970	Posyandu Talun 1	posyandu2@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_posyandu	\N	\N	\N	\N	posyandu2	\N	2	\N
posyandu_user_3_1791257238977	Posyandu Talun 2	posyandu3@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_posyandu	\N	\N	\N	\N	posyandu3	\N	3	\N
posyandu_user_4_1791257238980	Posyandu Talun 3	posyandu4@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_posyandu	\N	\N	\N	\N	posyandu4	\N	4	\N
posyandu_user_5_1791257238984	Posyandu Pasir Eurih	posyandu5@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_posyandu	\N	\N	\N	\N	posyandu5	\N	5	\N
posyandu_user_6_1791257238988	Posyandu Galih Nangtung	posyandu6@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_posyandu	\N	\N	\N	\N	posyandu6	\N	6	\N
posyandu_user_7_1791257239004	Posyandu Anaku Sayang	posyandu7@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_posyandu	\N	\N	\N	\N	posyandu7	\N	7	\N
posyandu_user_8_1791257239008	Posyandu Anggrek	posyandu8@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_posyandu	\N	\N	\N	\N	posyandu8	\N	8	\N
posyandu_user_9_1791257239011	Posyandu Nusa Indah	posyandu9@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_posyandu	\N	\N	\N	\N	posyandu9	\N	9	\N
posyandu_user_10_1791257239014	Posyandu Adiku Sayang	posyandu10@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_posyandu	\N	\N	\N	\N	posyandu10	\N	10	\N
posyandu_user_11_1791257239017	Posyandu Matahari	posyandu11@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_posyandu	\N	\N	\N	\N	posyandu11	\N	11	\N
posyandu_user_12_1791257239020	Posyandu Sri Rezeki	posyandu12@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_posyandu	\N	\N	\N	\N	posyandu12	\N	12	\N
posyandu_user_13_1791257239024	Posyandu Anak Sayang-Sayang	posyandu13@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_posyandu	\N	\N	\N	\N	posyandu13	\N	13	\N
posyandu_user_14_1791257239028	Posyandu Melati 1 sd 12	posyandu14@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_posyandu	\N	\N	\N	\N	posyandu14	\N	14	\N
posyandu_user_15_1791257239032	Posyandu Tulip 4 & 5	posyandu15@mbg.lebak.go.id	f	\N	2026-10-06 03:27:18.675	2026-10-06 03:27:18.675	operator_posyandu	\N	\N	\N	\N	posyandu15	\N	15	\N
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: yayasan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.yayasan (yayasan_id, nama_yayasan, alamat, kontak, desa_id, kecamatan_id) FROM stdin;
6	Yayasan Generasi Maju	Warunggunung	08122334455	\N	\N
1	Generasi Petarung Indonesia	Rangkasbitung	081234567890	\N	\N
2	Yayasan Kemala Bhayangkari	Cibadak	081987654321	\N	\N
3	Yayasan Mandiri Banten Sejahtera	Warunggunung	08122334455	\N	\N
4	Bima Sakti Cilisung	Rangkasbitung	081234567890	\N	\N
5	Yayasan Bakti Asta Cita	Cibadak	081987654321	\N	\N
19	Yayasan Hamim Center Founder	Kampung Ciputat, RT 004 RW 001, Kelurahan Pasar Keong, Kecamatan Cibadak, Kabupaten Lebak, Provinsi Banten	\N	296	3
20	Yayasan Mitra Cendekia Waskita	Kp. Cibuah kertamukti RT 014 RW 005 Desa Cibuah Kecamatan Warunggunung Kabupaten Lebak Provinsi Banten	\N	283	4
21	YAYASAN Rumah Gizi Anak	Jln. Maulana Yusuf, Kp. Aweh, Rt/Rw. 007/001 Ds. Aweh, Kec. Kalanganyar, Kab. Lebak	\N	324	26
22	YAYASAN BERKAH SEHAT BERSAUDARA	Jl. Kota Baru 2, Desa Muara Ciujung Timur, Kecamatan Rangkas Bitung, Kabupaten Lebak, Banten	\N	309	2
\.


--
-- Name: audit_log_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_log_audit_id_seq', 1, false);


--
-- Name: desa_desa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.desa_desa_id_seq', 352, true);


--
-- Name: jenis_pangan_jenis_pangan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jenis_pangan_jenis_pangan_id_seq', 77, true);


--
-- Name: kabupaten_kabupaten_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kabupaten_kabupaten_id_seq', 11, true);


--
-- Name: kategori_penerima_kategori_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kategori_penerima_kategori_id_seq', 21, true);


--
-- Name: kecamatan_kecamatan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kecamatan_kecamatan_id_seq', 65, true);


--
-- Name: master_parameter_uji_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.master_parameter_uji_id_seq', 1, false);


--
-- Name: navigation_menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.navigation_menu_id_seq', 9, true);


--
-- Name: pemasok_pemasok_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pemasok_pemasok_id_seq', 34, true);


--
-- Name: pengaduan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pengaduan_id_seq', 1, false);


--
-- Name: penggilingan_distribusi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.penggilingan_distribusi_id_seq', 2, true);


--
-- Name: penggilingan_penggilingan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.penggilingan_penggilingan_id_seq', 47, true);


--
-- Name: penggilingan_produksi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.penggilingan_produksi_id_seq', 11, true);


--
-- Name: penggilingan_sumber_gabah_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.penggilingan_sumber_gabah_id_seq', 13, true);


--
-- Name: pengumuman_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pengumuman_id_seq', 1, false);


--
-- Name: posyandu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posyandu_id_seq', 15, true);


--
-- Name: posyandu_laporan_aktifitas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posyandu_laporan_aktifitas_id_seq', 4, true);


--
-- Name: posyandu_penerimaan_mbg_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posyandu_penerimaan_mbg_id_seq', 15, true);


--
-- Name: sekolah_laporan_aktifitas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sekolah_laporan_aktifitas_id_seq', 5, true);


--
-- Name: sekolah_penerimaan_mbg_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sekolah_penerimaan_mbg_id_seq', 56, true);


--
-- Name: sekolah_sekolah_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sekolah_sekolah_id_seq', 56, true);


--
-- Name: sppg_laporan_aktifitas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sppg_laporan_aktifitas_id_seq', 9, true);


--
-- Name: sppg_pemakaian_bahan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sppg_pemakaian_bahan_id_seq', 6, true);


--
-- Name: sppg_pembelian_bahan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sppg_pembelian_bahan_id_seq', 4, true);


--
-- Name: sppg_penerima_manfaat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sppg_penerima_manfaat_id_seq', 56, true);


--
-- Name: sppg_posyandu_manfaat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sppg_posyandu_manfaat_id_seq', 15, true);


--
-- Name: sppg_sertifikasi_sertifikasi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sppg_sertifikasi_sertifikasi_id_seq', 1, false);


--
-- Name: sppg_sppg_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sppg_sppg_id_seq', 5, true);


--
-- Name: sppg_uji_rapid_test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sppg_uji_rapid_test_id_seq', 2, true);


--
-- Name: standar_kecukupan_gizi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.standar_kecukupan_gizi_id_seq', 12, true);


--
-- Name: standar_menu_gizi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.standar_menu_gizi_id_seq', 13, true);


--
-- Name: supply_chain_kebutuhan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supply_chain_kebutuhan_id_seq', 1, false);


--
-- Name: yayasan_yayasan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.yayasan_yayasan_id_seq', 22, true);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (audit_id);


--
-- Name: desa desa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desa
    ADD CONSTRAINT desa_pkey PRIMARY KEY (desa_id);


--
-- Name: jenis_pangan jenis_pangan_nama_bahan_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jenis_pangan
    ADD CONSTRAINT jenis_pangan_nama_bahan_unique UNIQUE (nama_bahan);


--
-- Name: jenis_pangan jenis_pangan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jenis_pangan
    ADD CONSTRAINT jenis_pangan_pkey PRIMARY KEY (jenis_pangan_id);


--
-- Name: kabupaten kabupaten_nama_kabupaten_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kabupaten
    ADD CONSTRAINT kabupaten_nama_kabupaten_unique UNIQUE (nama_kabupaten);


--
-- Name: kabupaten kabupaten_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kabupaten
    ADD CONSTRAINT kabupaten_pkey PRIMARY KEY (kabupaten_id);


--
-- Name: kategori_penerima kategori_penerima_nama_kategori_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kategori_penerima
    ADD CONSTRAINT kategori_penerima_nama_kategori_unique UNIQUE (nama_kategori);


--
-- Name: kategori_penerima kategori_penerima_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kategori_penerima
    ADD CONSTRAINT kategori_penerima_pkey PRIMARY KEY (kategori_id);


--
-- Name: kecamatan kecamatan_nama_kecamatan_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kecamatan
    ADD CONSTRAINT kecamatan_nama_kecamatan_unique UNIQUE (nama_kecamatan);


--
-- Name: kecamatan kecamatan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kecamatan
    ADD CONSTRAINT kecamatan_pkey PRIMARY KEY (kecamatan_id);


--
-- Name: master_parameter_uji master_parameter_uji_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_parameter_uji
    ADD CONSTRAINT master_parameter_uji_pkey PRIMARY KEY (id);


--
-- Name: navigation_menu navigation_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.navigation_menu
    ADD CONSTRAINT navigation_menu_pkey PRIMARY KEY (id);


--
-- Name: pemasok pemasok_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pemasok
    ADD CONSTRAINT pemasok_pkey PRIMARY KEY (pemasok_id);


--
-- Name: pengaduan pengaduan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pengaduan
    ADD CONSTRAINT pengaduan_pkey PRIMARY KEY (id);


--
-- Name: penggilingan_distribusi penggilingan_distribusi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penggilingan_distribusi
    ADD CONSTRAINT penggilingan_distribusi_pkey PRIMARY KEY (id);


--
-- Name: penggilingan penggilingan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penggilingan
    ADD CONSTRAINT penggilingan_pkey PRIMARY KEY (penggilingan_id);


--
-- Name: penggilingan_produksi penggilingan_produksi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penggilingan_produksi
    ADD CONSTRAINT penggilingan_produksi_pkey PRIMARY KEY (id);


--
-- Name: penggilingan_sumber_gabah penggilingan_sumber_gabah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penggilingan_sumber_gabah
    ADD CONSTRAINT penggilingan_sumber_gabah_pkey PRIMARY KEY (id);


--
-- Name: pengumuman pengumuman_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pengumuman
    ADD CONSTRAINT pengumuman_pkey PRIMARY KEY (id);


--
-- Name: posyandu_laporan_aktifitas posyandu_laporan_aktifitas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posyandu_laporan_aktifitas
    ADD CONSTRAINT posyandu_laporan_aktifitas_pkey PRIMARY KEY (id);


--
-- Name: posyandu_penerimaan_mbg posyandu_penerimaan_mbg_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posyandu_penerimaan_mbg
    ADD CONSTRAINT posyandu_penerimaan_mbg_pkey PRIMARY KEY (id);


--
-- Name: posyandu posyandu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posyandu
    ADD CONSTRAINT posyandu_pkey PRIMARY KEY (id);


--
-- Name: sekolah_laporan_aktifitas sekolah_laporan_aktifitas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sekolah_laporan_aktifitas
    ADD CONSTRAINT sekolah_laporan_aktifitas_pkey PRIMARY KEY (id);


--
-- Name: sekolah_penerimaan_mbg sekolah_penerimaan_mbg_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sekolah_penerimaan_mbg
    ADD CONSTRAINT sekolah_penerimaan_mbg_pkey PRIMARY KEY (id);


--
-- Name: sekolah sekolah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sekolah
    ADD CONSTRAINT sekolah_pkey PRIMARY KEY (sekolah_id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: session session_token_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_token_unique UNIQUE (token);


--
-- Name: site_setting site_setting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_setting
    ADD CONSTRAINT site_setting_pkey PRIMARY KEY (key);


--
-- Name: sppg sppg_id_sppg_code_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg
    ADD CONSTRAINT sppg_id_sppg_code_unique UNIQUE (id_sppg_code);


--
-- Name: sppg_laporan_aktifitas sppg_laporan_aktifitas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_laporan_aktifitas
    ADD CONSTRAINT sppg_laporan_aktifitas_pkey PRIMARY KEY (id);


--
-- Name: sppg_pemakaian_bahan sppg_pemakaian_bahan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_pemakaian_bahan
    ADD CONSTRAINT sppg_pemakaian_bahan_pkey PRIMARY KEY (id);


--
-- Name: sppg_pembelian_bahan sppg_pembelian_bahan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_pembelian_bahan
    ADD CONSTRAINT sppg_pembelian_bahan_pkey PRIMARY KEY (id);


--
-- Name: sppg_penerima_manfaat sppg_penerima_manfaat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_penerima_manfaat
    ADD CONSTRAINT sppg_penerima_manfaat_pkey PRIMARY KEY (id);


--
-- Name: sppg sppg_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg
    ADD CONSTRAINT sppg_pkey PRIMARY KEY (sppg_id);


--
-- Name: sppg_posyandu_manfaat sppg_posyandu_manfaat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_posyandu_manfaat
    ADD CONSTRAINT sppg_posyandu_manfaat_pkey PRIMARY KEY (id);


--
-- Name: sppg_sertifikasi sppg_sertifikasi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_sertifikasi
    ADD CONSTRAINT sppg_sertifikasi_pkey PRIMARY KEY (sertifikasi_id);


--
-- Name: sppg_uji_rapid_test sppg_uji_rapid_test_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_uji_rapid_test
    ADD CONSTRAINT sppg_uji_rapid_test_pkey PRIMARY KEY (id);


--
-- Name: standar_kecukupan_gizi standar_kecukupan_gizi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.standar_kecukupan_gizi
    ADD CONSTRAINT standar_kecukupan_gizi_pkey PRIMARY KEY (id);


--
-- Name: standar_menu_gizi standar_menu_gizi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.standar_menu_gizi
    ADD CONSTRAINT standar_menu_gizi_pkey PRIMARY KEY (id);


--
-- Name: supply_chain_kebutuhan supply_chain_kebutuhan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supply_chain_kebutuhan
    ADD CONSTRAINT supply_chain_kebutuhan_pkey PRIMARY KEY (id);


--
-- Name: sys_menu sys_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_menu
    ADD CONSTRAINT sys_menu_pkey PRIMARY KEY (id);


--
-- Name: user user_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_unique UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user user_username_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_unique UNIQUE (username);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: yayasan yayasan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yayasan
    ADD CONSTRAINT yayasan_pkey PRIMARY KEY (yayasan_id);


--
-- Name: idx_audit_tabel; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_tabel ON public.audit_log USING btree (tabel_nama);


--
-- Name: idx_audit_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_user ON public.audit_log USING btree (user_id);


--
-- Name: idx_penerima_sekolah; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_penerima_sekolah ON public.sppg_penerima_manfaat USING btree (sekolah_id);


--
-- Name: idx_penerima_sppg; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_penerima_sppg ON public.sppg_penerima_manfaat USING btree (sppg_id);


--
-- Name: idx_penerima_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_penerima_status ON public.sppg_penerima_manfaat USING btree (status);


--
-- Name: idx_penerimaan_sekolah; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_penerimaan_sekolah ON public.sekolah_penerimaan_mbg USING btree (sekolah_id);


--
-- Name: idx_penerimaan_sppg; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_penerimaan_sppg ON public.sekolah_penerimaan_mbg USING btree (sppg_id);


--
-- Name: idx_penerimaan_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_penerimaan_status ON public.sekolah_penerimaan_mbg USING btree (status);


--
-- Name: idx_penerimaan_tanggal; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_penerimaan_tanggal ON public.sekolah_penerimaan_mbg USING btree (tanggal_mulai_mbg);


--
-- Name: idx_posyandu_desa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_posyandu_desa ON public.posyandu USING btree (desa_id);


--
-- Name: idx_posyandu_nama; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_posyandu_nama ON public.posyandu USING btree (nama_posyandu);


--
-- Name: idx_posyandu_penerima_posyandu; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_posyandu_penerima_posyandu ON public.sppg_posyandu_manfaat USING btree (posyandu_id);


--
-- Name: idx_posyandu_penerima_sppg; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_posyandu_penerima_sppg ON public.sppg_posyandu_manfaat USING btree (sppg_id);


--
-- Name: idx_posyandu_penerimaan_posyandu; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_posyandu_penerimaan_posyandu ON public.posyandu_penerimaan_mbg USING btree (posyandu_id);


--
-- Name: idx_posyandu_penerimaan_sppg; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_posyandu_penerimaan_sppg ON public.posyandu_penerimaan_mbg USING btree (sppg_id);


--
-- Name: idx_sekolah_desa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sekolah_desa ON public.sekolah USING btree (desa_id);


--
-- Name: idx_sekolah_kategori; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sekolah_kategori ON public.sekolah USING btree (kategori_id);


--
-- Name: idx_sekolah_nama; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sekolah_nama ON public.sekolah USING btree (nama_sekolah);


--
-- Name: idx_sekolah_npsn; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sekolah_npsn ON public.sekolah USING btree (npsn);


--
-- Name: sppg_penerima_manfaat_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sppg_penerima_manfaat_unique ON public.sppg_penerima_manfaat USING btree (sppg_id, sekolah_id, tahun_ajaran);


--
-- Name: sppg_posyandu_manfaat_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sppg_posyandu_manfaat_unique ON public.sppg_posyandu_manfaat USING btree (sppg_id, posyandu_id);


--
-- Name: sppg_sertifikasi_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sppg_sertifikasi_unique ON public.sppg_sertifikasi USING btree (sppg_id, jenis_sertifikasi);


--
-- Name: account account_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: audit_log audit_log_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: desa desa_kecamatan_id_kecamatan_kecamatan_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desa
    ADD CONSTRAINT desa_kecamatan_id_kecamatan_kecamatan_id_fk FOREIGN KEY (kecamatan_id) REFERENCES public.kecamatan(kecamatan_id);


--
-- Name: master_parameter_uji master_parameter_uji_sppg_id_sppg_sppg_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_parameter_uji
    ADD CONSTRAINT master_parameter_uji_sppg_id_sppg_sppg_id_fk FOREIGN KEY (sppg_id) REFERENCES public.sppg(sppg_id);


--
-- Name: pengaduan pengaduan_sekolah_id_sekolah_sekolah_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pengaduan
    ADD CONSTRAINT pengaduan_sekolah_id_sekolah_sekolah_id_fk FOREIGN KEY (sekolah_id) REFERENCES public.sekolah(sekolah_id);


--
-- Name: pengaduan pengaduan_sppg_id_sppg_sppg_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pengaduan
    ADD CONSTRAINT pengaduan_sppg_id_sppg_sppg_id_fk FOREIGN KEY (sppg_id) REFERENCES public.sppg(sppg_id);


--
-- Name: penggilingan penggilingan_desa_id_desa_desa_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penggilingan
    ADD CONSTRAINT penggilingan_desa_id_desa_desa_id_fk FOREIGN KEY (desa_id) REFERENCES public.desa(desa_id);


--
-- Name: penggilingan_distribusi penggilingan_distribusi_desa_tujuan_id_desa_desa_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penggilingan_distribusi
    ADD CONSTRAINT penggilingan_distribusi_desa_tujuan_id_desa_desa_id_fk FOREIGN KEY (desa_tujuan_id) REFERENCES public.desa(desa_id);


--
-- Name: penggilingan_distribusi penggilingan_distribusi_kecamatan_tujuan_id_kecamatan_kecamatan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penggilingan_distribusi
    ADD CONSTRAINT penggilingan_distribusi_kecamatan_tujuan_id_kecamatan_kecamatan FOREIGN KEY (kecamatan_tujuan_id) REFERENCES public.kecamatan(kecamatan_id);


--
-- Name: penggilingan_distribusi penggilingan_distribusi_penggilingan_id_penggilingan_penggiling; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penggilingan_distribusi
    ADD CONSTRAINT penggilingan_distribusi_penggilingan_id_penggilingan_penggiling FOREIGN KEY (penggilingan_id) REFERENCES public.penggilingan(penggilingan_id) ON DELETE CASCADE;


--
-- Name: penggilingan_distribusi penggilingan_distribusi_sppg_tujuan_id_sppg_sppg_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penggilingan_distribusi
    ADD CONSTRAINT penggilingan_distribusi_sppg_tujuan_id_sppg_sppg_id_fk FOREIGN KEY (sppg_tujuan_id) REFERENCES public.sppg(sppg_id);


--
-- Name: penggilingan penggilingan_kecamatan_id_kecamatan_kecamatan_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penggilingan
    ADD CONSTRAINT penggilingan_kecamatan_id_kecamatan_kecamatan_id_fk FOREIGN KEY (kecamatan_id) REFERENCES public.kecamatan(kecamatan_id);


--
-- Name: penggilingan_produksi penggilingan_produksi_penggilingan_id_penggilingan_penggilingan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penggilingan_produksi
    ADD CONSTRAINT penggilingan_produksi_penggilingan_id_penggilingan_penggilingan FOREIGN KEY (penggilingan_id) REFERENCES public.penggilingan(penggilingan_id) ON DELETE CASCADE;


--
-- Name: penggilingan_sumber_gabah penggilingan_sumber_gabah_desa_id_desa_desa_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penggilingan_sumber_gabah
    ADD CONSTRAINT penggilingan_sumber_gabah_desa_id_desa_desa_id_fk FOREIGN KEY (desa_id) REFERENCES public.desa(desa_id) ON DELETE SET NULL;


--
-- Name: penggilingan_sumber_gabah penggilingan_sumber_gabah_kecamatan_id_kecamatan_kecamatan_id_f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penggilingan_sumber_gabah
    ADD CONSTRAINT penggilingan_sumber_gabah_kecamatan_id_kecamatan_kecamatan_id_f FOREIGN KEY (kecamatan_id) REFERENCES public.kecamatan(kecamatan_id) ON DELETE SET NULL;


--
-- Name: penggilingan_sumber_gabah penggilingan_sumber_gabah_penggilingan_id_penggilingan_penggili; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penggilingan_sumber_gabah
    ADD CONSTRAINT penggilingan_sumber_gabah_penggilingan_id_penggilingan_penggili FOREIGN KEY (penggilingan_id) REFERENCES public.penggilingan(penggilingan_id) ON DELETE CASCADE;


--
-- Name: pengumuman pengumuman_author_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pengumuman
    ADD CONSTRAINT pengumuman_author_id_user_id_fk FOREIGN KEY (author_id) REFERENCES public."user"(id);


--
-- Name: pengumuman pengumuman_sppg_id_sppg_sppg_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pengumuman
    ADD CONSTRAINT pengumuman_sppg_id_sppg_sppg_id_fk FOREIGN KEY (sppg_id) REFERENCES public.sppg(sppg_id);


--
-- Name: posyandu posyandu_desa_id_desa_desa_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posyandu
    ADD CONSTRAINT posyandu_desa_id_desa_desa_id_fk FOREIGN KEY (desa_id) REFERENCES public.desa(desa_id);


--
-- Name: posyandu posyandu_kecamatan_id_kecamatan_kecamatan_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posyandu
    ADD CONSTRAINT posyandu_kecamatan_id_kecamatan_kecamatan_id_fk FOREIGN KEY (kecamatan_id) REFERENCES public.kecamatan(kecamatan_id);


--
-- Name: posyandu_laporan_aktifitas posyandu_laporan_aktifitas_posyandu_id_posyandu_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posyandu_laporan_aktifitas
    ADD CONSTRAINT posyandu_laporan_aktifitas_posyandu_id_posyandu_id_fk FOREIGN KEY (posyandu_id) REFERENCES public.posyandu(id) ON DELETE CASCADE;


--
-- Name: posyandu_laporan_aktifitas posyandu_laporan_aktifitas_sppg_laporan_id_sppg_laporan_aktifit; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posyandu_laporan_aktifitas
    ADD CONSTRAINT posyandu_laporan_aktifitas_sppg_laporan_id_sppg_laporan_aktifit FOREIGN KEY (sppg_laporan_id) REFERENCES public.sppg_laporan_aktifitas(id) ON DELETE CASCADE;


--
-- Name: posyandu_penerimaan_mbg posyandu_penerimaan_mbg_posyandu_id_posyandu_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posyandu_penerimaan_mbg
    ADD CONSTRAINT posyandu_penerimaan_mbg_posyandu_id_posyandu_id_fk FOREIGN KEY (posyandu_id) REFERENCES public.posyandu(id) ON DELETE CASCADE;


--
-- Name: posyandu_penerimaan_mbg posyandu_penerimaan_mbg_sppg_id_sppg_sppg_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posyandu_penerimaan_mbg
    ADD CONSTRAINT posyandu_penerimaan_mbg_sppg_id_sppg_sppg_id_fk FOREIGN KEY (sppg_id) REFERENCES public.sppg(sppg_id);


--
-- Name: sekolah sekolah_desa_id_desa_desa_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sekolah
    ADD CONSTRAINT sekolah_desa_id_desa_desa_id_fk FOREIGN KEY (desa_id) REFERENCES public.desa(desa_id);


--
-- Name: sekolah sekolah_kategori_id_kategori_penerima_kategori_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sekolah
    ADD CONSTRAINT sekolah_kategori_id_kategori_penerima_kategori_id_fk FOREIGN KEY (kategori_id) REFERENCES public.kategori_penerima(kategori_id);


--
-- Name: sekolah sekolah_kecamatan_id_kecamatan_kecamatan_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sekolah
    ADD CONSTRAINT sekolah_kecamatan_id_kecamatan_kecamatan_id_fk FOREIGN KEY (kecamatan_id) REFERENCES public.kecamatan(kecamatan_id);


--
-- Name: sekolah_laporan_aktifitas sekolah_laporan_aktifitas_sekolah_id_sekolah_sekolah_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sekolah_laporan_aktifitas
    ADD CONSTRAINT sekolah_laporan_aktifitas_sekolah_id_sekolah_sekolah_id_fk FOREIGN KEY (sekolah_id) REFERENCES public.sekolah(sekolah_id) ON DELETE CASCADE;


--
-- Name: sekolah_laporan_aktifitas sekolah_laporan_aktifitas_sppg_laporan_id_sppg_laporan_aktifita; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sekolah_laporan_aktifitas
    ADD CONSTRAINT sekolah_laporan_aktifitas_sppg_laporan_id_sppg_laporan_aktifita FOREIGN KEY (sppg_laporan_id) REFERENCES public.sppg_laporan_aktifitas(id) ON DELETE CASCADE;


--
-- Name: sekolah_penerimaan_mbg sekolah_penerimaan_mbg_sekolah_id_sekolah_sekolah_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sekolah_penerimaan_mbg
    ADD CONSTRAINT sekolah_penerimaan_mbg_sekolah_id_sekolah_sekolah_id_fk FOREIGN KEY (sekolah_id) REFERENCES public.sekolah(sekolah_id) ON DELETE CASCADE;


--
-- Name: sekolah_penerimaan_mbg sekolah_penerimaan_mbg_sppg_id_sppg_sppg_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sekolah_penerimaan_mbg
    ADD CONSTRAINT sekolah_penerimaan_mbg_sppg_id_sppg_sppg_id_fk FOREIGN KEY (sppg_id) REFERENCES public.sppg(sppg_id);


--
-- Name: session session_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: sppg sppg_desa_id_desa_desa_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg
    ADD CONSTRAINT sppg_desa_id_desa_desa_id_fk FOREIGN KEY (desa_id) REFERENCES public.desa(desa_id);


--
-- Name: sppg_laporan_aktifitas sppg_laporan_aktifitas_posyandu_id_posyandu_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_laporan_aktifitas
    ADD CONSTRAINT sppg_laporan_aktifitas_posyandu_id_posyandu_id_fk FOREIGN KEY (posyandu_id) REFERENCES public.posyandu(id) ON DELETE CASCADE;


--
-- Name: sppg_laporan_aktifitas sppg_laporan_aktifitas_sekolah_id_sekolah_sekolah_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_laporan_aktifitas
    ADD CONSTRAINT sppg_laporan_aktifitas_sekolah_id_sekolah_sekolah_id_fk FOREIGN KEY (sekolah_id) REFERENCES public.sekolah(sekolah_id) ON DELETE CASCADE;


--
-- Name: sppg_laporan_aktifitas sppg_laporan_aktifitas_sppg_id_sppg_sppg_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_laporan_aktifitas
    ADD CONSTRAINT sppg_laporan_aktifitas_sppg_id_sppg_sppg_id_fk FOREIGN KEY (sppg_id) REFERENCES public.sppg(sppg_id) ON DELETE CASCADE;


--
-- Name: sppg_laporan_aktifitas sppg_laporan_aktifitas_standar_menu_id_standar_menu_gizi_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_laporan_aktifitas
    ADD CONSTRAINT sppg_laporan_aktifitas_standar_menu_id_standar_menu_gizi_id_fk FOREIGN KEY (standar_menu_id) REFERENCES public.standar_menu_gizi(id);


--
-- Name: sppg_pemakaian_bahan sppg_pemakaian_bahan_jenis_pangan_id_jenis_pangan_jenis_pangan_; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_pemakaian_bahan
    ADD CONSTRAINT sppg_pemakaian_bahan_jenis_pangan_id_jenis_pangan_jenis_pangan_ FOREIGN KEY (jenis_pangan_id) REFERENCES public.jenis_pangan(jenis_pangan_id);


--
-- Name: sppg_pemakaian_bahan sppg_pemakaian_bahan_sppg_id_sppg_sppg_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_pemakaian_bahan
    ADD CONSTRAINT sppg_pemakaian_bahan_sppg_id_sppg_sppg_id_fk FOREIGN KEY (sppg_id) REFERENCES public.sppg(sppg_id) ON DELETE CASCADE;


--
-- Name: sppg_pemakaian_bahan sppg_pemakaian_bahan_standar_menu_id_standar_menu_gizi_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_pemakaian_bahan
    ADD CONSTRAINT sppg_pemakaian_bahan_standar_menu_id_standar_menu_gizi_id_fk FOREIGN KEY (standar_menu_id) REFERENCES public.standar_menu_gizi(id);


--
-- Name: sppg_pembelian_bahan sppg_pembelian_bahan_jenis_pangan_id_jenis_pangan_jenis_pangan_; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_pembelian_bahan
    ADD CONSTRAINT sppg_pembelian_bahan_jenis_pangan_id_jenis_pangan_jenis_pangan_ FOREIGN KEY (jenis_pangan_id) REFERENCES public.jenis_pangan(jenis_pangan_id);


--
-- Name: sppg_pembelian_bahan sppg_pembelian_bahan_pemasok_id_pemasok_pemasok_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_pembelian_bahan
    ADD CONSTRAINT sppg_pembelian_bahan_pemasok_id_pemasok_pemasok_id_fk FOREIGN KEY (pemasok_id) REFERENCES public.pemasok(pemasok_id);


--
-- Name: sppg_pembelian_bahan sppg_pembelian_bahan_penggilingan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_pembelian_bahan
    ADD CONSTRAINT sppg_pembelian_bahan_penggilingan_id_fkey FOREIGN KEY (penggilingan_id) REFERENCES public.penggilingan(penggilingan_id);


--
-- Name: sppg_pembelian_bahan sppg_pembelian_bahan_sppg_id_sppg_sppg_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_pembelian_bahan
    ADD CONSTRAINT sppg_pembelian_bahan_sppg_id_sppg_sppg_id_fk FOREIGN KEY (sppg_id) REFERENCES public.sppg(sppg_id) ON DELETE CASCADE;


--
-- Name: sppg_penerima_manfaat sppg_penerima_manfaat_sekolah_id_sekolah_sekolah_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_penerima_manfaat
    ADD CONSTRAINT sppg_penerima_manfaat_sekolah_id_sekolah_sekolah_id_fk FOREIGN KEY (sekolah_id) REFERENCES public.sekolah(sekolah_id);


--
-- Name: sppg_penerima_manfaat sppg_penerima_manfaat_sppg_id_sppg_sppg_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_penerima_manfaat
    ADD CONSTRAINT sppg_penerima_manfaat_sppg_id_sppg_sppg_id_fk FOREIGN KEY (sppg_id) REFERENCES public.sppg(sppg_id) ON DELETE CASCADE;


--
-- Name: sppg_posyandu_manfaat sppg_posyandu_manfaat_posyandu_id_posyandu_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_posyandu_manfaat
    ADD CONSTRAINT sppg_posyandu_manfaat_posyandu_id_posyandu_id_fk FOREIGN KEY (posyandu_id) REFERENCES public.posyandu(id);


--
-- Name: sppg_posyandu_manfaat sppg_posyandu_manfaat_sppg_id_sppg_sppg_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_posyandu_manfaat
    ADD CONSTRAINT sppg_posyandu_manfaat_sppg_id_sppg_sppg_id_fk FOREIGN KEY (sppg_id) REFERENCES public.sppg(sppg_id) ON DELETE CASCADE;


--
-- Name: sppg_sertifikasi sppg_sertifikasi_sppg_id_sppg_sppg_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_sertifikasi
    ADD CONSTRAINT sppg_sertifikasi_sppg_id_sppg_sppg_id_fk FOREIGN KEY (sppg_id) REFERENCES public.sppg(sppg_id) ON DELETE CASCADE;


--
-- Name: sppg_uji_rapid_test sppg_uji_rapid_test_jenis_pangan_id_jenis_pangan_jenis_pangan_i; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_uji_rapid_test
    ADD CONSTRAINT sppg_uji_rapid_test_jenis_pangan_id_jenis_pangan_jenis_pangan_i FOREIGN KEY (jenis_pangan_id) REFERENCES public.jenis_pangan(jenis_pangan_id);


--
-- Name: sppg_uji_rapid_test sppg_uji_rapid_test_parameter_uji_id_master_parameter_uji_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_uji_rapid_test
    ADD CONSTRAINT sppg_uji_rapid_test_parameter_uji_id_master_parameter_uji_id_fk FOREIGN KEY (parameter_uji_id) REFERENCES public.master_parameter_uji(id);


--
-- Name: sppg_uji_rapid_test sppg_uji_rapid_test_pembelian_id_sppg_pembelian_bahan_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_uji_rapid_test
    ADD CONSTRAINT sppg_uji_rapid_test_pembelian_id_sppg_pembelian_bahan_id_fk FOREIGN KEY (pembelian_id) REFERENCES public.sppg_pembelian_bahan(id);


--
-- Name: sppg_uji_rapid_test sppg_uji_rapid_test_sppg_id_sppg_sppg_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_uji_rapid_test
    ADD CONSTRAINT sppg_uji_rapid_test_sppg_id_sppg_sppg_id_fk FOREIGN KEY (sppg_id) REFERENCES public.sppg(sppg_id) ON DELETE CASCADE;


--
-- Name: sppg sppg_yayasan_id_yayasan_yayasan_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg
    ADD CONSTRAINT sppg_yayasan_id_yayasan_yayasan_id_fk FOREIGN KEY (yayasan_id) REFERENCES public.yayasan(yayasan_id);


--
-- Name: standar_kecukupan_gizi standar_kecukupan_gizi_kategori_id_kategori_penerima_kategori_i; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.standar_kecukupan_gizi
    ADD CONSTRAINT standar_kecukupan_gizi_kategori_id_kategori_penerima_kategori_i FOREIGN KEY (kategori_id) REFERENCES public.kategori_penerima(kategori_id) ON DELETE CASCADE;


--
-- Name: standar_menu_gizi standar_menu_gizi_kategori_target_id_kategori_penerima_kategori; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.standar_menu_gizi
    ADD CONSTRAINT standar_menu_gizi_kategori_target_id_kategori_penerima_kategori FOREIGN KEY (kategori_target_id) REFERENCES public.kategori_penerima(kategori_id);


--
-- Name: standar_menu_gizi standar_menu_gizi_sppg_id_sppg_sppg_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.standar_menu_gizi
    ADD CONSTRAINT standar_menu_gizi_sppg_id_sppg_sppg_id_fk FOREIGN KEY (sppg_id) REFERENCES public.sppg(sppg_id);


--
-- Name: supply_chain_kebutuhan supply_chain_kebutuhan_jenis_pangan_id_jenis_pangan_jenis_panga; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supply_chain_kebutuhan
    ADD CONSTRAINT supply_chain_kebutuhan_jenis_pangan_id_jenis_pangan_jenis_panga FOREIGN KEY (jenis_pangan_id) REFERENCES public.jenis_pangan(jenis_pangan_id);


--
-- Name: supply_chain_kebutuhan supply_chain_kebutuhan_pemasok_id_pemasok_pemasok_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supply_chain_kebutuhan
    ADD CONSTRAINT supply_chain_kebutuhan_pemasok_id_pemasok_pemasok_id_fk FOREIGN KEY (pemasok_id) REFERENCES public.pemasok(pemasok_id);


--
-- Name: supply_chain_kebutuhan supply_chain_kebutuhan_sppg_id_sppg_sppg_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supply_chain_kebutuhan
    ADD CONSTRAINT supply_chain_kebutuhan_sppg_id_sppg_sppg_id_fk FOREIGN KEY (sppg_id) REFERENCES public.sppg(sppg_id) ON DELETE CASCADE;


--
-- Name: yayasan yayasan_desa_id_desa_desa_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yayasan
    ADD CONSTRAINT yayasan_desa_id_desa_desa_id_fk FOREIGN KEY (desa_id) REFERENCES public.desa(desa_id);


--
-- Name: yayasan yayasan_kecamatan_id_kecamatan_kecamatan_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yayasan
    ADD CONSTRAINT yayasan_kecamatan_id_kecamatan_kecamatan_id_fk FOREIGN KEY (kecamatan_id) REFERENCES public.kecamatan(kecamatan_id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict ZIuyjNuooUFmBDhAdeae6zscAOHAE6OqxQCKyVmlMrPwuVF0NRKjWmW2HUW3xOK

