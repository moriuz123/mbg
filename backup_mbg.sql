--
-- PostgreSQL database dump
--

\restrict nlnao1FqkGGxln54bFk5RVIFiS985oRpTpOrsvGDBlVFRGLqGS3xKggJR8Frjer

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
    satuan_default text DEFAULT 'Kilogram'::text
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
-- Name: master_distributor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.master_distributor (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.master_distributor OWNER TO postgres;

--
-- Name: master_jenis_pangan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.master_jenis_pangan (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.master_jenis_pangan OWNER TO postgres;

--
-- Name: master_pemasok; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.master_pemasok (
    id text NOT NULL,
    nama_pemasok text NOT NULL,
    kategori text NOT NULL,
    alamat text,
    kontak text,
    status text DEFAULT 'Aktif'::text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.master_pemasok OWNER TO postgres;

--
-- Name: master_sekolah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.master_sekolah (
    id text NOT NULL,
    nama_sekolah text NOT NULL,
    jenjang text NOT NULL,
    alamat text NOT NULL,
    jumlah_siswa text NOT NULL,
    sppg_id text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.master_sekolah OWNER TO postgres;

--
-- Name: pemasok; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pemasok (
    pemasok_id integer NOT NULL,
    nama_pemasok text NOT NULL,
    alamat_pemasok text,
    kontak text
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
    created_at timestamp without time zone DEFAULT now()
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
    created_at timestamp without time zone DEFAULT now()
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
    kapasitas_realisasi_kg numeric(12,2) NOT NULL,
    rendemen_persen numeric(5,2),
    catatan text,
    created_at timestamp without time zone DEFAULT now()
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
    harga_beli_per_kg numeric(12,2),
    catatan text,
    created_at timestamp without time zone DEFAULT now()
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
    sekolah_id integer NOT NULL,
    tanggal date NOT NULL,
    menu text NOT NULL,
    jumlah_porsi integer,
    status text DEFAULT 'Terkirim'::text,
    catatan text,
    foto_dokumentasi text,
    created_at timestamp without time zone DEFAULT now()
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
    updated_at timestamp without time zone DEFAULT now()
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
    sekolah_id integer
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
    kontak text
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
TDyhucayurNPITiNJbAqBMqju4Pma4MT	Lj5QdG09i91KwONl0mLinVpvRzwb6PaY	credential	Lj5QdG09i91KwONl0mLinVpvRzwb6PaY	\N	\N	\N	\N	\N	\N	a2100179cbb3275999921d43d958cfb3:665a57790d10f7eddf971bbaf2c7ee2408b203691812f906309d6d26e6f0e41535c4f7fe1b150e34e01958dc10addc58d154cd145631f0ca23cc72444cd6b88f	2026-07-18 08:21:26.949	2026-07-18 08:21:26.949
Jj4YuCtat51hmJoVUeHPmFYKKwrYvEQm	hPn61R1KgMeRSkwdJsb1y174Xyxijax9	credential	hPn61R1KgMeRSkwdJsb1y174Xyxijax9	\N	\N	\N	\N	\N	\N	0b18286c77c0c2a0dbe25eb578aa62ae:9518ef6b11346f51aef89c6e630815d368c9f4d5564020af800498d3e49c604c8a542654faf77cfb893f4c4a823c2a38347841a64c2a2be05b2e182f139ae4bf	2026-08-03 22:28:46.329	2026-08-03 22:28:46.329
ru6rG8fKdC8D4TPIZHCgMe5OmZjQw1Cf	ApSsMV7YaLF5fY1BaxdGvnjWvP5b34zq	credential	ApSsMV7YaLF5fY1BaxdGvnjWvP5b34zq	\N	\N	\N	\N	\N	\N	c328b9a334b1098089b0bcb2b040772f:3be166a429cd8c9ee377278e4094e8c531cb7eeb42643c3aa47e6116ab945a6d0286c82b198b3cfc16535281b098d04b68137cfdd55a0ad4ee21d3036f4e4244	2026-08-03 22:28:47.189	2026-08-03 22:28:47.189
bKwwQX7Z0E3gEV9fRzr7ENvE1Of3ogps	CLxzgFuGqgCgIyMIr8yU637XTgLDNryd	credential	CLxzgFuGqgCgIyMIr8yU637XTgLDNryd	\N	\N	\N	\N	\N	\N	9afef5fccc95da4e99571e63a00752d0:8944793cb5761436a45c95fc86ec7052edd6ef0af5c7c0664ae29550024f326f5a587d819b8f82259e840734d9b12603d04ac6d780250df3c603ecff5c27c58d	2026-08-03 22:28:47.722	2026-08-03 22:28:47.722
YxL3WL6Ll7rcR5bLwJZfzYT4vPcUsjpe	OWmbOspTYHtE4MPRdCQqTuwFAbgeeDun	credential	OWmbOspTYHtE4MPRdCQqTuwFAbgeeDun	\N	\N	\N	\N	\N	\N	8c7ceb3a00c28ea14485bc97e1788c75:21aff09f7e22edb386b9b79625cbb99cede1127fe9ba3dbef0bd839df90db14cd201572f30cc3584af2ebfb02a80e649e91d2b8411a5ca6a26495c62ebb5b00f	2026-08-04 22:53:21.165	2026-08-04 22:53:21.165
49MjwjIscFrMbXPHFChepk2qED7nSl5l	CFwmSYvUDAm2MVa2mmm1ttpbMXiAZdyD	credential	CFwmSYvUDAm2MVa2mmm1ttpbMXiAZdyD	\N	\N	\N	\N	\N	\N	dd713fdbd0d149c4e7353e401b48b589:7156baa84d5e98f23a41db3ce749f5a3e71a2c9716be20468cb3b999b658809c437d8684504f19d1dde1b72c02852d0520afe2816cf83455907ac5cad2c7365c	2026-08-04 22:53:21.738	2026-08-04 22:53:21.738
pIYbk37a57bdAzCWTyt7DpZdZ1BMuhQr	4l5z3mLHhNhLDsQjiNrY6LhZ5uMP0zWu	credential	4l5z3mLHhNhLDsQjiNrY6LhZ5uMP0zWu	\N	\N	\N	\N	\N	\N	17b2036ead642deef624161445121d09:aeeee03c0968d65a85fad1828e9cb55448b7cfc3cb4f53d467bd5a74fd29b14af16cb6853b518de7b0caaed073249d10cd997b110c41835c890bc3a98dfa3a78	2026-08-04 22:53:22.288	2026-08-04 22:53:22.288
b2kBAYvFTgLnhwwcVVDNZkBENF1sVxRq	aPlFk5utesEdarcyI6EPb1OPxGQOXfAY	credential	aPlFk5utesEdarcyI6EPb1OPxGQOXfAY	\N	\N	\N	\N	\N	\N	7f0455307a4fa485659473cdfe1935df:2028e3676f01653e6e1adc67b5c203b315693c575e02e87021d0fbd391aa8c53b7c9cfd843aca4ebc51b2519a32d1d0e0a495f31c7bfebdf7122d77c0f2b4cdd	2026-08-04 22:53:22.857	2026-08-04 22:53:22.857
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
4	5	Muara Ciujung Timur 2
5	5	Cijoro Pasir 2
6	6	Pasar Keong 2
\.


--
-- Data for Name: jenis_pangan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jenis_pangan (jenis_pangan_id, nama_bahan, kategori, satuan_default) FROM stdin;
1	beras	Karbohidrat	Kilogram
2	Beras Medium	Karbohidrat	Kilogram
3	Telur Ayam	Protein Hewani	Kilogram
4	Kacang Hijau	Kacang-kacangan	Kilogram
8	Beras Medium 2	Karbohidrat	Kilogram
9	Telur Ayam 2	Protein Hewani	Kilogram
10	Kacang Hijau 2	Kacang-kacangan	Kilogram
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
14	SMP/MTs	0
16	SD/MI 2	0
17	SMP/MTs 2	0
18	SMA/SMK/MA 2	0
\.


--
-- Data for Name: kecamatan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kecamatan (kecamatan_id, nama_kecamatan) FROM stdin;
1	Rangkasbiutng
2	Rangkasbitung
3	Cibadak
4	Warunggunung
5	Rangkasbitung 2
6	Cibadak 2
7	Warunggunung 2
\.


--
-- Data for Name: master_distributor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.master_distributor (id, name, "createdAt") FROM stdin;
\.


--
-- Data for Name: master_jenis_pangan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.master_jenis_pangan (id, name, "createdAt") FROM stdin;
\.


--
-- Data for Name: master_pemasok; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.master_pemasok (id, nama_pemasok, kategori, alamat, kontak, status, "createdAt") FROM stdin;
\.


--
-- Data for Name: master_sekolah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.master_sekolah (id, nama_sekolah, jenjang, alamat, jumlah_siswa, sppg_id, "createdAt") FROM stdin;
\.


--
-- Data for Name: pemasok; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pemasok (pemasok_id, nama_pemasok, alamat_pemasok, kontak) FROM stdin;
1	PT. Pangan Nusantara	Tangerang	021-998877
2	CV. Tani Jaya	Lebak	0855667788
3	Toko Beras Sejahtera	Rangkasbitung	081199998888
4	PT. Pangan Nusantara	Tangerang	021-998877
5	CV. Tani Jaya	Lebak	0855667788
6	Toko Beras Sejahtera	Rangkasbitung	081199998888
7	PT. Pangan Nusantara 2	Tangerang	021-998877
8	CV. Tani Jaya 2	Lebak	0855667788
9	Toko Beras Sejahtera 2	Rangkasbitung	081199998888
\.


--
-- Data for Name: pengaduan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pengaduan (id, nama_pelapor, kontak, sppg_id, sekolah_id, isi_pengaduan, status, tanggal, tanggapan) FROM stdin;
\.


--
-- Data for Name: penggilingan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.penggilingan (penggilingan_id, nama_penggilingan, alamat, kecamatan_id, penanggung_jawab, no_hp, kapasitas_terpasang_kg_minggu, status, created_at) FROM stdin;
1	test 1	loii	1	po	08787878	150.00	Aktif	2026-08-04 15:43:40.37193
5	Penggilingan Padi Makmur	Jl. Sawah Makmur	1	Supardi	\N	5000.00	Aktif	2026-08-04 17:05:42.054036
6	Penggilingan Subur	Jl. Pertanian	2	Joko	\N	3000.00	Aktif	2026-08-04 17:05:42.054036
7	Penggilingan Harapan Tani	Jl. Sawah Indah	3	Gatot	\N	4500.00	Aktif	2026-08-04 17:05:42.054036
8	Penggilingan Padi Makmur 2	Jl. Sawah Makmur	5	Supardi	\N	5000.00	Aktif	2026-08-04 17:07:11.808387
9	Penggilingan Subur 2	Jl. Pertanian	6	Joko	\N	3000.00	Aktif	2026-08-04 17:07:11.808387
10	Penggilingan Harapan Tani 2	Jl. Sawah Indah	7	Gatot	\N	4500.00	Aktif	2026-08-04 17:07:11.808387
\.


--
-- Data for Name: penggilingan_distribusi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.penggilingan_distribusi (id, penggilingan_id, minggu_mulai, minggu_selesai, volume_kg, tujuan_tipe, sppg_tujuan_id, lokasi_lain, catatan, created_at) FROM stdin;
7	8	2026-08-01	2026-08-07	1000.00	SPPG	8	\N	\N	2026-08-04 17:07:12.000479
8	9	2026-08-01	2026-08-07	500.00	SPPG	9	\N	\N	2026-08-04 17:07:12.000479
9	10	2026-08-01	2026-08-07	1000.00	Pasar	\N	\N	\N	2026-08-04 17:07:12.000479
\.


--
-- Data for Name: penggilingan_produksi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.penggilingan_produksi (id, penggilingan_id, minggu_mulai, minggu_selesai, kapasitas_realisasi_kg, rendemen_persen, catatan, created_at) FROM stdin;
7	8	2026-08-01	2026-08-07	1200.00	60.00	\N	2026-08-04 17:07:11.914147
8	9	2026-08-01	2026-08-07	900.00	60.00	\N	2026-08-04 17:07:11.914147
9	10	2026-08-01	2026-08-07	1500.00	60.00	\N	2026-08-04 17:07:11.914147
\.


--
-- Data for Name: penggilingan_sumber_gabah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.penggilingan_sumber_gabah (id, penggilingan_id, minggu_mulai, minggu_selesai, sumber_gabah, volume_kg, harga_beli_per_kg, catatan, created_at) FROM stdin;
7	8	2026-08-01	2026-08-07	Petani Lokal Desa A	2000.00	\N	\N	2026-08-04 17:07:11.84884
8	9	2026-08-01	2026-08-07	KUD Harapan	1500.00	\N	\N	2026-08-04 17:07:11.84884
9	10	2026-08-01	2026-08-07	Kelompok Tani Sejahtera	2500.00	\N	\N	2026-08-04 17:07:11.84884
\.


--
-- Data for Name: sekolah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sekolah (sekolah_id, nama_sekolah, npsn, kategori_id, desa_id, kecamatan_id, alamat_sekolah, nama_kepala_sekolah, no_hp_kepala_sekolah, email_sekolah, jumlah_siswa_laki, jumlah_siswa_perempuan, jumlah_siswa_total, tahun_ajaran_last, keterangan, created_at, updated_at) FROM stdin;
1	SDN 1 Rangkasbitung	20601234	1	1	1	Jl. Multatuli No. 1	\N	\N	\N	150	200	\N	\N	\N	2026-08-04 17:05:41.618496	2026-08-04 17:05:41.618496
2	SMPN 1 Cibadak	20601235	2	3	2	Jl. Raya Cibadak	\N	\N	\N	200	220	\N	\N	\N	2026-08-04 17:05:41.618496	2026-08-04 17:05:41.618496
3	SMAN 1 Warunggunung	20601236	3	3	3	Jl. Raya Warunggunung	\N	\N	\N	300	300	\N	\N	\N	2026-08-04 17:05:41.618496	2026-08-04 17:05:41.618496
4	SDN 2 Rangkasbitung	20601237	16	4	5	Jl. 2	\N	\N	\N	100	120	\N	\N	\N	2026-08-04 17:07:11.350993	2026-08-04 17:07:11.350993
5	SMPN 2 Cibadak	20601238	17	6	6	Jl. 3	\N	\N	\N	150	160	\N	\N	\N	2026-08-04 17:07:11.350993	2026-08-04 17:07:11.350993
6	SMAN 2 Warunggunung	20601239	18	6	7	Jl. 4	\N	\N	\N	200	210	\N	\N	\N	2026-08-04 17:07:11.350993	2026-08-04 17:07:11.350993
\.


--
-- Data for Name: sekolah_penerimaan_mbg; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sekolah_penerimaan_mbg (id, sekolah_id, sppg_id, status, tanggal_mulai_mbg, tanggal_selesai_mbg, tahun_ajaran, jumlah_hari_operasional, catatan_status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId") FROM stdin;
aZEaFMjCN0oSTtsbmb0ZrTxfpAWa9RSQ	2026-07-25 08:21:27.009	wom39fZnss7EptnbaE5KjdREzd2o2ik7	2026-07-18 08:21:27.009	2026-07-18 08:21:27.009	172.21.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	Lj5QdG09i91KwONl0mLinVpvRzwb6PaY
2upPjnrJy5pPHR2isfdbwnOVRwX8tQwd	2026-07-25 08:21:54.161	zCMIZBEQYbr0C1RDqaigcai4qcnNHUUt	2026-07-18 08:21:54.162	2026-07-18 08:21:54.162	172.21.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	Lj5QdG09i91KwONl0mLinVpvRzwb6PaY
CZLPRqRxvwXzKPvIGwlQGx6satAA2BJN	2026-07-25 08:29:17.181	zo6ljI1bxj3QapQcsRTlBFdYFANh8dSz	2026-07-18 08:29:17.182	2026-07-18 08:29:17.182	172.21.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	Lj5QdG09i91KwONl0mLinVpvRzwb6PaY
rWcrxgKhjxXQEZs8wNlmj1hSGpvhTIvv	2026-07-25 08:43:02.359	WCQjsYpE7d967dG9BnzLUcAZKMp59Yn7	2026-07-18 08:43:02.36	2026-07-18 08:43:02.36	172.21.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	Lj5QdG09i91KwONl0mLinVpvRzwb6PaY
7qN18WwxjhsxgMJD94dhhvHEoSFtymip	2026-07-25 08:45:33.438	O753C4Q4PtCK2mgrWHkr8u7HvakyJmv8	2026-07-18 08:45:33.438	2026-07-18 08:45:33.438	172.21.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	Lj5QdG09i91KwONl0mLinVpvRzwb6PaY
6LslZQsQOshTvM4y1TUJmtO3Lbn6dZl2	2026-07-25 09:00:57.358	8Vf8Kq8PCrmA3OoJUBXm2iEMfxAgdLxu	2026-07-18 09:00:57.358	2026-07-18 09:00:57.358	172.21.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	Lj5QdG09i91KwONl0mLinVpvRzwb6PaY
Qm5BqJzD2Qc05xGuLA0JhKfdC43NMema	2026-08-10 02:45:43.78	ixGE8RRiTuxyY2GM9W7cZBxqoaIht6G6	2026-08-03 02:45:43.78	2026-08-03 02:45:43.78	172.21.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	Lj5QdG09i91KwONl0mLinVpvRzwb6PaY
3Nct05dkpbj4t9TpCDWAuGIjAVbQmloU	2026-08-10 02:46:27.545	svPKyKsecrSN8PyqNIpJ5G5ZNJM2jMQR	2026-08-03 02:46:27.556	2026-08-03 02:46:27.556	172.21.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	Lj5QdG09i91KwONl0mLinVpvRzwb6PaY
PbZaiYJRTGql8Pj3Ps4Ah7fbTV6ubJbh	2026-08-10 04:35:25.292	KUccFtzHD826CUz78rDTh8W5e1mgHyI9	2026-08-03 04:35:25.336	2026-08-03 04:35:25.336	172.21.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	Lj5QdG09i91KwONl0mLinVpvRzwb6PaY
IvBcI8BuZoLblfHBYP3kedfYMJYgJrrY	2026-08-10 04:43:37.554	Z5Y1eLH9a8qD2Ib3NZPCJtJiQmpB4rkN	2026-08-03 04:43:37.555	2026-08-03 04:43:37.555	172.21.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	Lj5QdG09i91KwONl0mLinVpvRzwb6PaY
ILq8PZ7f6w4biHPe8682M6eNpLs6RVZb	2026-08-10 05:18:35.765	swbzwZ0mSM0KXFarG5e7dtweRIK7UeHW	2026-08-03 05:18:35.766	2026-08-03 05:18:35.766	172.21.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	Lj5QdG09i91KwONl0mLinVpvRzwb6PaY
Dd6kXcukzPqSP2b07dwb2Q8mzuUw6ivA	2026-08-10 22:28:46.531	RCPthxp0pqsK5btiR5cfOdN81NJUxDaX	2026-08-03 22:28:46.531	2026-08-03 22:28:46.531			hPn61R1KgMeRSkwdJsb1y174Xyxijax9
suRxsgS4MFRf88eXQy9Dy3dIYBSP23mG	2026-08-10 22:28:47.253	fguvqnjggllkT6NPMnAUzmwBWre4FYZ5	2026-08-03 22:28:47.253	2026-08-03 22:28:47.253			ApSsMV7YaLF5fY1BaxdGvnjWvP5b34zq
BQtS5qE1R1kbyKO5WelzwUJq5b97XzsT	2026-08-10 22:28:47.83	yEsnalRlHxWLweN9tjDdUkrrtjurlJoG	2026-08-03 22:28:47.83	2026-08-03 22:28:47.83			CLxzgFuGqgCgIyMIr8yU637XTgLDNryd
RHRkNHsuYyiZ0bW3ITUruhr3z47xRQFj	2026-08-11 22:53:21.255	u9Pv4DbOAVwXjuQIQmHXwRQsJpYGTvHR	2026-08-04 22:53:21.255	2026-08-04 22:53:21.255			OWmbOspTYHtE4MPRdCQqTuwFAbgeeDun
W5L0tTqeyW46X5WqsgFX3iTscNUYK3EN	2026-08-11 22:53:21.796	yBUaBlDbs40fHEXOKN32awDvTeIGjEe0	2026-08-04 22:53:21.796	2026-08-04 22:53:21.796			CFwmSYvUDAm2MVa2mmm1ttpbMXiAZdyD
v51cL9t6t7l08st5Cyq01RmqNcRmiOQ3	2026-08-11 22:53:22.329	qCs64jwi0BOSDAV4bXJNbEYgqSTR6xRG	2026-08-04 22:53:22.329	2026-08-04 22:53:22.329			4l5z3mLHhNhLDsQjiNrY6LhZ5uMP0zWu
wZAMvzA9eJcavjaGPycZHm5VHOQgWlau	2026-08-11 22:53:22.934	mzkZ77XsAuo5lPJ14Gu4FQDfgKCXaw6E	2026-08-04 22:53:22.934	2026-08-04 22:53:22.934			aPlFk5utesEdarcyI6EPb1OPxGQOXfAY
ZAih12GfRuAqvj4SXMrrzlgP9L63PaxB	2026-08-12 00:56:03.14	1jYE2CgdjMO58SGHSZdHLPXWFdyUj9Ki	2026-08-05 00:56:03.142	2026-08-05 00:56:03.142	172.21.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	ApSsMV7YaLF5fY1BaxdGvnjWvP5b34zq
\.


--
-- Data for Name: sppg; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sppg (sppg_id, id_sppg_code, nama_sppg, desa_id, yayasan_id, alamat, status_operasional, tanggal_operasional, bpjs_kesehatan, nama_ka_sppg, no_hp_ka_sppg, jumlah_penjamah_makanan, jumlah_bpjs_tk, chef_bersertifikat_bnsp, keterangan, created_at, updated_at) FROM stdin;
1	123	tes	\N	\N	jkkkkk	Operasional	2026-08-04	t	gg	08787878	6	6	0	\N	2026-08-04 16:58:14.713757	2026-08-04 16:58:14.713757
5	SPPG-001	Dapur Umum Rangkas	1	1	Jl. Sentral	Aktif	\N	f	Hasan	081122223333	5	20	0	\N	2026-08-04 17:05:41.841815	2026-08-04 17:05:41.841815
6	SPPG-002	Dapur Sehat Cibadak	3	2	Jl. Pasar Keong	Aktif	\N	f	Wati	081133334444	4	16	0	\N	2026-08-04 17:05:41.841815	2026-08-04 17:05:41.841815
7	SPPG-003	Dapur Mutiara Warunggunung	3	3	Jl. Mutiara	Belum Operasional	\N	f	Dewi	081144445555	3	13	0	\N	2026-08-04 17:05:41.841815	2026-08-04 17:05:41.841815
8	SPPG-004	Dapur Umum Rangkas 2	4	4	Jl. Sentral	Aktif	\N	f	Hasan	081122223333	5	20	0	\N	2026-08-04 17:07:11.433647	2026-08-04 17:07:11.433647
9	SPPG-005	Dapur Sehat Cibadak 2	6	5	Jl. Pasar Keong	Aktif	\N	f	Wati	081133334444	4	16	0	\N	2026-08-04 17:07:11.433647	2026-08-04 17:07:11.433647
10	SPPG-006	Dapur Mutiara Warunggunung 2	6	6	Jl. Mutiara	Belum Operasional	\N	f	Dewi	081144445555	3	13	0	\N	2026-08-04 17:07:11.433647	2026-08-04 17:07:11.433647
\.


--
-- Data for Name: sppg_laporan_aktifitas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sppg_laporan_aktifitas (id, sppg_id, sekolah_id, tanggal, menu, jumlah_porsi, status, catatan, foto_dokumentasi, created_at) FROM stdin;
\.


--
-- Data for Name: sppg_penerima_manfaat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sppg_penerima_manfaat (id, sppg_id, sekolah_id, tahun_ajaran, jumlah_laki, jumlah_perempuan, jumlah_total, status, tanggal_mulai, tanggal_selesai, catatan, created_at, updated_at) FROM stdin;
2	8	4	2025/2026	150	200	\N	Aktif	2025-07-01	\N	\N	2026-08-04 17:07:11.499916	2026-08-04 17:07:11.499916
3	9	5	2025/2026	200	220	\N	Aktif	2025-07-01	\N	\N	2026-08-04 17:07:11.499916	2026-08-04 17:07:11.499916
4	10	6	2025/2026	300	300	\N	Aktif	2025-07-01	\N	\N	2026-08-04 17:07:11.499916	2026-08-04 17:07:11.499916
\.


--
-- Data for Name: sppg_sertifikasi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sppg_sertifikasi (sertifikasi_id, sppg_id, jenis_sertifikasi, status, tanggal_berlaku, keterangan) FROM stdin;
4	8	HALAL	t	2028-01-01	Halal MUI
5	9	IKL	t	2029-01-01	Dinkes
6	10	SLHS	f	2025-01-01	Kadaluarsa
\.


--
-- Data for Name: supply_chain_kebutuhan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supply_chain_kebutuhan (id, sppg_id, jenis_pangan_id, pemasok_id, kebutuhan_per_bulan, satuan, periode, created_at) FROM stdin;
7	8	8	7	500.00	Kilogram	2026-08-01	2026-08-04 17:07:11.771377
8	9	9	8	300.00	Kilogram	2026-08-01	2026-08-04 17:07:11.771377
9	10	10	9	150.00	Kilogram	2026-08-01	2026-08-04 17:07:11.771377
\.


--
-- Data for Name: sys_menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_menu (id, nama_modul, url, icon, hak_akses, status, "createdAt") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt", role, kecamatan_id, penggilingan_id, sekolah_id) FROM stdin;
Lj5QdG09i91KwONl0mLinVpvRzwb6PaY	Petugas Inspeksi	admin@lebakkab.go.id	f	\N	2026-07-18 08:21:26.894	2026-07-18 08:21:26.894	super_admin	\N	\N	\N
hPn61R1KgMeRSkwdJsb1y174Xyxijax9	Super Admin	superadmin@mbg.go.id	f	\N	2026-08-03 22:28:46.132	2026-08-03 22:28:46.132	super_admin	\N	\N	\N
ApSsMV7YaLF5fY1BaxdGvnjWvP5b34zq	Admin SPPG Cibadak	sppg.cibadak@mbg.go.id	f	\N	2026-08-03 22:28:47.14	2026-08-03 22:28:47.14	sppg	\N	\N	\N
CLxzgFuGqgCgIyMIr8yU637XTgLDNryd	Mitra Penggilingan Berkah	penggilingan.berkah@mbg.go.id	f	\N	2026-08-03 22:28:47.687	2026-08-03 22:28:47.687	penggilingan_gabah	\N	\N	\N
OWmbOspTYHtE4MPRdCQqTuwFAbgeeDun	Admin Dinas	admin@lebak.go.id	f	\N	2026-08-04 22:53:21.099	2026-08-04 22:53:21.099	admin_dinas	\N	\N	\N
CFwmSYvUDAm2MVa2mmm1ttpbMXiAZdyD	Operator SPPG	sppg@lebak.go.id	f	\N	2026-08-04 22:53:21.67	2026-08-04 22:53:21.67	sppg	\N	\N	\N
4l5z3mLHhNhLDsQjiNrY6LhZ5uMP0zWu	Operator Penggilingan	penggilingan@lebak.go.id	f	\N	2026-08-04 22:53:22.23	2026-08-04 22:53:22.23	operator_penggilingan	\N	\N	\N
aPlFk5utesEdarcyI6EPb1OPxGQOXfAY	Operator Sekolah	sekolah@lebak.go.id	f	\N	2026-08-04 22:53:22.801	2026-08-04 22:53:22.801	operator_sekolah	\N	\N	\N
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: yayasan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.yayasan (yayasan_id, nama_yayasan, alamat, kontak) FROM stdin;
1	Yayasan Bhakti Lebak	Rangkasbitung	081234567890
2	Yayasan Pendidikan Harapan	Cibadak	081987654321
3	Yayasan Generasi Maju	Warunggunung	08122334455
4	Yayasan Bhakti Lebak 2	Rangkasbitung	081234567890
5	Yayasan Pendidikan Harapan 2	Cibadak	081987654321
6	Yayasan Generasi Maju 2	Warunggunung	08122334455
\.


--
-- Name: audit_log_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_log_audit_id_seq', 1, false);


--
-- Name: desa_desa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.desa_desa_id_seq', 6, true);


--
-- Name: jenis_pangan_jenis_pangan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jenis_pangan_jenis_pangan_id_seq', 10, true);


--
-- Name: kategori_penerima_kategori_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kategori_penerima_kategori_id_seq', 18, true);


--
-- Name: kecamatan_kecamatan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kecamatan_kecamatan_id_seq', 7, true);


--
-- Name: pemasok_pemasok_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pemasok_pemasok_id_seq', 9, true);


--
-- Name: pengaduan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pengaduan_id_seq', 1, false);


--
-- Name: penggilingan_distribusi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.penggilingan_distribusi_id_seq', 9, true);


--
-- Name: penggilingan_penggilingan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.penggilingan_penggilingan_id_seq', 10, true);


--
-- Name: penggilingan_produksi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.penggilingan_produksi_id_seq', 9, true);


--
-- Name: penggilingan_sumber_gabah_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.penggilingan_sumber_gabah_id_seq', 9, true);


--
-- Name: sekolah_penerimaan_mbg_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sekolah_penerimaan_mbg_id_seq', 1, false);


--
-- Name: sekolah_sekolah_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sekolah_sekolah_id_seq', 6, true);


--
-- Name: sppg_laporan_aktifitas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sppg_laporan_aktifitas_id_seq', 3, true);


--
-- Name: sppg_penerima_manfaat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sppg_penerima_manfaat_id_seq', 4, true);


--
-- Name: sppg_sertifikasi_sertifikasi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sppg_sertifikasi_sertifikasi_id_seq', 6, true);


--
-- Name: sppg_sppg_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sppg_sppg_id_seq', 10, true);


--
-- Name: supply_chain_kebutuhan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supply_chain_kebutuhan_id_seq', 9, true);


--
-- Name: yayasan_yayasan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.yayasan_yayasan_id_seq', 6, true);


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
-- Name: master_distributor master_distributor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_distributor
    ADD CONSTRAINT master_distributor_pkey PRIMARY KEY (id);


--
-- Name: master_jenis_pangan master_jenis_pangan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_jenis_pangan
    ADD CONSTRAINT master_jenis_pangan_pkey PRIMARY KEY (id);


--
-- Name: master_pemasok master_pemasok_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_pemasok
    ADD CONSTRAINT master_pemasok_pkey PRIMARY KEY (id);


--
-- Name: master_sekolah master_sekolah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_sekolah
    ADD CONSTRAINT master_sekolah_pkey PRIMARY KEY (id);


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
-- Name: sppg_sertifikasi sppg_sertifikasi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_sertifikasi
    ADD CONSTRAINT sppg_sertifikasi_pkey PRIMARY KEY (sertifikasi_id);


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
-- Name: penggilingan_sumber_gabah penggilingan_sumber_gabah_penggilingan_id_penggilingan_penggili; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penggilingan_sumber_gabah
    ADD CONSTRAINT penggilingan_sumber_gabah_penggilingan_id_penggilingan_penggili FOREIGN KEY (penggilingan_id) REFERENCES public.penggilingan(penggilingan_id) ON DELETE CASCADE;


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
-- Name: sppg_laporan_aktifitas sppg_laporan_aktifitas_sekolah_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_laporan_aktifitas
    ADD CONSTRAINT sppg_laporan_aktifitas_sekolah_id_fkey FOREIGN KEY (sekolah_id) REFERENCES public.sekolah(sekolah_id) ON DELETE CASCADE;


--
-- Name: sppg_laporan_aktifitas sppg_laporan_aktifitas_sppg_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_laporan_aktifitas
    ADD CONSTRAINT sppg_laporan_aktifitas_sppg_id_fkey FOREIGN KEY (sppg_id) REFERENCES public.sppg(sppg_id) ON DELETE CASCADE;


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
-- Name: sppg_sertifikasi sppg_sertifikasi_sppg_id_sppg_sppg_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg_sertifikasi
    ADD CONSTRAINT sppg_sertifikasi_sppg_id_sppg_sppg_id_fk FOREIGN KEY (sppg_id) REFERENCES public.sppg(sppg_id) ON DELETE CASCADE;


--
-- Name: sppg sppg_yayasan_id_yayasan_yayasan_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sppg
    ADD CONSTRAINT sppg_yayasan_id_yayasan_yayasan_id_fk FOREIGN KEY (yayasan_id) REFERENCES public.yayasan(yayasan_id);


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
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict nlnao1FqkGGxln54bFk5RVIFiS985oRpTpOrsvGDBlVFRGLqGS3xKggJR8Frjer

