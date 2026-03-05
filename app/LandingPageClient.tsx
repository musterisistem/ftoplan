'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, CalendarCheck, Users, HardDriveDownload, ShieldCheck, Zap, Star, Camera, Smartphone } from 'lucide-react';
import PublicHeader from '@/components/layout/PublicHeader';
import { motion, useScroll, useTransform } from 'framer-motion';
import PublicFooter from '@/components/layout/PublicFooter';
import Image from 'next/image';
import { useRef } from 'react';

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

export default function LandingPageClient() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    // Hero image parallax effect
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <div className="flex flex-col min-h-screen bg-[#fafafc] text-gray-900 font-sans antialiased overflow-hidden selection:bg-[#7a3a94]/20 selection:text-[#7a3a94]">
            <PublicHeader variant="transparent" />

            <main className="flex-1 relative" ref={targetRef}>

                {/* ── HERO SECTION ── */}
                <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 overflow-hidden max-w-7xl mx-auto flex flex-col items-center text-center">
                    {/* Background Soft Glows */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#d4aae8]/20 blur-[120px] rounded-full pointer-events-none -z-10" />
                    <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none -z-10" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border border-[#e5d5ef] shadow-sm text-[12px] font-bold uppercase tracking-[0.15em] mb-8 text-[#5d2b72]"
                    >
                        <Sparkles className="w-4 h-4 text-[#7a3a94]" />
                        <span>Fotoğrafçılar İçin Yeni Nesil Yönetim</span>
                    </motion.div>

                    <motion.h1
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="text-5xl md:text-7xl lg:text-[80px] font-black tracking-tight leading-[1.05] mb-8 max-w-5xl text-slate-900"
                    >
                        Tüm Stüdyonuzu{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5d2b72] to-[#9c4dcc]">
                            Tek Bir Ekrandan
                        </span>{' '}
                        Yönetin
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-medium"
                    >
                        Randevular, müşteri takibi, fotoğraf seçimi, online kapora alımı ve dijital sözleşmeler... Müşterilerinize mükemmel bir deneyim sunarken, siz sadece fotoğraflara odaklanın.
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
                    >
                        <Link href="/packages" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#5d2b72] to-[#7a3a94] rounded-2xl font-bold text-white text-[16px] hover:shadow-[0_0_30px_rgba(93,43,114,0.4)] transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
                            Hemen Ücretsiz Dene <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="#ozellikler" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 text-[16px] hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                            Özellikleri Keşfet
                        </Link>
                    </motion.div>
                </section>

                {/* ── HERO MOCKUP (Ekran 1) ── */}
                <section className="relative px-6 max-w-[1400px] mx-auto pb-24 -mt-10 lg:-mt-16 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 50 }}
                        style={{ y: heroY }}
                        className="relative rounded-2xl lg:rounded-[32px] overflow-hidden border border-slate-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1),0_0_40px_-10px_rgba(93,43,114,0.1)] bg-white mx-auto "
                    >
                        {/* Browser Toolbar Mock */}
                        <div className="bg-[#f1f5f9] border-b border-slate-200 h-10 w-full flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                            </div>
                        </div>
                        <img
                            src="/anaekran.png"
                            alt="Weey.Net Panel Genel Görünümü"
                            className="w-full h-auto object-cover max-h-[85vh] object-top"
                        />
                    </motion.div>
                </section>




                {/* ── ZIG-ZAG FEATURE SECTIONS ── */}
                <section id="ozellikler" className="max-w-7xl mx-auto px-6 space-y-32 py-12">

                    {/* Feature 1: Müşteriler & Randevu (Ekran 2) */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
                    >
                        <div className="order-2 lg:order-1 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-[#d4aae8]/30 rounded-[32px] transform -rotate-3 blur-[2px] z-0"></div>
                            <img src="/ekran (2).png" alt="Müşteri Yönetimi Ekranı" className="relative z-10 w-full rounded-2xl shadow-xl border border-white" />
                        </div>
                        <motion.div variants={fadeInUp} className="order-1 lg:order-2 flex flex-col items-start text-left">
                            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 mb-6 border border-blue-100"><Users className="w-6 h-6" /></div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Müşterilerinizi Asla Gözden Kaçırmayın.</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                Tüm randevularınız, çekim tarihleriniz ve müşteri süreçleriniz tek bir CRM tablosunda. Hangi müşteri albüm bekliyor, hangisi fotoğraf seçmedi saniyeler içinde görün.
                            </p>
                            <ul className="space-y-4 mb-8 w-full">
                                {[
                                    'Detaylı randevu takvimi ve aşama bazlı takip',
                                    'Online sözleşme onayı ile yasal güvence',
                                    'Çiftlerin isimleri, iletişim bilgileri tüm detaylar elinizin altında.'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600"><Zap className="w-3.5 h-3.5" /></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>

                    {/* Feature 2: Çekim Paketleri & Ödeme (Ekran 3) */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
                    >
                        <motion.div variants={fadeInUp} className="flex flex-col items-start text-left">
                            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 mb-6 border border-purple-100"><HardDriveDownload className="w-6 h-6" /></div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Sınırsız Paket,<br />Kesintisiz Ödeme.</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                Kendi düğün, nişan veya dış çekim paketlerinizi oluşturun. PayTR veya Shopier entegrasyonu sayesinde müşterilerinizden anında, kredi kartıyla güvenli kapora tahsil edin.
                            </p>
                            <ul className="space-y-4 mb-8 w-full">
                                {[
                                    'Sınırsız sayıda paket oluşturma ve fiyatlandırma',
                                    'Müşteriye özel paket atama özelliği',
                                    'Kredi kartı/Havale ile anında bakiye kapatma'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600"><Zap className="w-3.5 h-3.5" /></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-purple-100 rounded-[32px] transform rotate-3 blur-[2px] z-0"></div>
                            <img src="/ekran (3).png" alt="Çekim Paketleri Ekranı" className="relative z-10 w-full rounded-2xl shadow-xl border border-white" />
                        </div>
                    </motion.div>

                    {/* Feature 3: Kişisel Siteler (Ekran 4) */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
                    >
                        <div className="order-2 lg:order-1 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-100 to-blue-100 rounded-[32px] transform -rotate-3 blur-[2px] z-0"></div>
                            <img src="/ekran (4).png" alt="Müşteri Web Sitesi Ekranı" className="relative z-10 w-full rounded-2xl shadow-xl border border-white object-cover" style={{ objectPosition: 'top' }} />
                        </div>
                        <motion.div variants={fadeInUp} className="order-1 lg:order-2 flex flex-col items-start text-left">
                            <div className="p-3 bg-cyan-50 rounded-2xl text-cyan-600 mb-6 border border-cyan-100"><Sparkles className="w-6 h-6" /></div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Kusursuz Dijital Teslimat (Müşteri Sitesi)</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                Her müşterinize özel bir dijital asistan (mini web sitesi) sunun. Çiftler fotoğraf seçimlerini WhatsApp yerine kendi şifreli panellerinden yapsın; sözleşmelerini oradan indirsin.
                            </p>
                            <Link href="/ozellikler" className="inline-flex items-center gap-2 text-cyan-600 font-bold hover:text-cyan-700 transition-colors">
                                Demoyu İncele <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Feature 4: İstatistik ve Raporlama (Ekran 5) */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
                    >
                        <motion.div variants={fadeInUp} className="flex flex-col items-start text-left">
                            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 mb-6 border border-amber-100"><ShieldCheck className="w-6 h-6" /></div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Performansınızı Analiz Edin.</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                Panelinizin ana sayfasındaki detaylı grafikler sayesinde aylık/yıllık cironuzu, tamamlanmamış işlerinizi ve ödeme bekleyen işlemlerinizi tek ekranda ve anında analiz edin.
                            </p>
                        </motion.div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-100 to-orange-100 rounded-[32px] transform rotate-3 blur-[2px] z-0"></div>
                            <img src="/ekran (5).png" alt="İstatistik ve Dashboard" className="relative z-10 w-full rounded-2xl shadow-xl border border-white" />
                        </div>
                    </motion.div>

                </section>

                {/* ── MOBİL UYGULAMA BÖLÜMÜ ── */}
                <section className="relative overflow-hidden py-24 px-6 mb-8 bg-white border-y border-slate-200/60">
                    <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#d4aae8] blur-[160px] opacity-20 rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-300 blur-[140px] opacity-15 rounded-full pointer-events-none" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                            {/* Sol: Metin */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-80px" }}
                                variants={staggerContainer}
                            >
                                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-[12px] font-bold uppercase tracking-widest mb-8">
                                    <Smartphone className="w-4 h-4" />
                                    <span>Özel Mobil Uygulama</span>
                                </motion.div>

                                <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-[56px] font-black text-slate-900 leading-tight tracking-tight mb-6">
                                    Kendi Logonuzla, <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] to-[#818cf8]">AppStore</span>{' '}ve{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34d399] to-[#06b6d4]">Google Play</span>'de!
                                </motion.h2>

                                <motion.p variants={fadeInUp} className="text-lg text-slate-600 leading-relaxed mb-10 max-w-lg">
                                    Weey.Net paketlerimizden birini satın alan stüdyolar için, <strong className="text-slate-900">markanıza özel mobil uygulama</strong> yapıyoruz. Müşterileriniz fotoğraflarını ve albümlerini doğrudan uygulamadan seçiyor. WhatsApp karmaşasına son.
                                </motion.p>

                                <motion.ul variants={staggerContainer} className="space-y-4 mb-10">
                                    {[
                                        { icon: '🎨', text: 'Kendi logonuz, renginiz, marka kimliğiniz' },
                                        { icon: '📱', text: 'Apple App Store ve Google Play\'de yayınlama' },
                                        { icon: '🖼️', text: 'Müşteri doğrudan uygulamadan fotoğraf seçiyor' },
                                        { icon: '🔔', text: 'Push bildirim: albüm hazır, seçim zamanı!' },
                                    ].map((item, i) => (
                                        <motion.li key={i} variants={fadeInUp} className="flex items-center gap-4 text-slate-700 font-medium bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                            <span className="text-2xl">{item.icon}</span>
                                            <span>{item.text}</span>
                                        </motion.li>
                                    ))}
                                </motion.ul>

                                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                                    {/* App Store Butonu */}
                                    <a href="#" className="flex items-center gap-3 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all group shadow-lg shadow-slate-900/20">
                                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-3.33 1.94-3.29 5.79.04 4.51 3.95 6.01 4 6.03-.02.07-.62 2.14-2.46 2.3M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                                        <div>
                                            <p className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">Download on the</p>
                                            <p className="text-white font-black text-base leading-none">App Store</p>
                                        </div>
                                    </a>
                                    {/* Google Play Butonu */}
                                    <a href="#" className="flex items-center gap-3 px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-900 rounded-2xl transition-all group shadow-sm">
                                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none"><path d="M3.18 23.76a2 2 0 0 1-1.18-1.8V2.04A2 2 0 0 1 3.18.28l12.14 11.74L3.18 23.76zm2.66-2.57 8.42-8.15-1.62-1.57-6.8 9.72zm0-19.38 6.8 9.72 1.62-1.57-8.42-8.15zm11.47 8.48-2.1-1.04-1.81 1.75 1.81 1.75 2.13-1.06a1 1 0 0 0-.03-1.4z" fill="#4ade80" /></svg>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Get it on</p>
                                            <p className="text-slate-900 font-black text-base leading-none">Google Play</p>
                                        </div>
                                    </a>
                                </motion.div>
                            </motion.div>

                            {/* Sağ: Telefon Mockup */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, type: 'spring', stiffness: 50 }}
                                className="relative flex justify-center"
                            >
                                {/* Arka plan glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#7a3a94]/20 to-blue-500/10 blur-[60px] rounded-full" />
                                {/* Telefon çerçevesi */}
                                <div className="relative z-10 w-[280px] md:w-[320px]">
                                    <div className="relative bg-[#0f172a] rounded-[44px] p-3 shadow-2xl shadow-indigo-500/20 border border-slate-800">
                                        {/* Kamera çentiği */}
                                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#020617] rounded-full z-20 flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#0f172a] border border-white/10" />
                                        </div>
                                        {/* Ekran */}
                                        <div className="rounded-[36px] overflow-hidden bg-white aspect-[9/19.5]">
                                            <img
                                                src="/mobilekran1.png"
                                                alt="Mobil Uygulama Ekranı"
                                                className="w-full h-full object-cover object-top"
                                            />
                                        </div>
                                    </div>
                                    {/* Yansıma etkisi */}
                                    <div className="mt-4 mx-6 h-6 bg-gradient-to-b from-[#7a3a94]/10 to-transparent blur-xl rounded-full" />
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </section>

                {/* ── BENTO GRID FEATURES ── */}
                <section className="bg-white py-24 mb-24 border-y border-slate-200/60">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Neden Weey.Net?</h2>
                            <p className="text-lg text-slate-500">Stüdyonuzu hızlandırmak için ihtiyacınız olan her güçlü altyapı burada.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#fafafc] border border-slate-200/60 p-8 rounded-[32px] group hover:bg-[#f6f2f9] transition-colors">
                                <HardDriveDownload className="w-10 h-10 text-[#5d2b72] mb-6" />
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Sınırsız CDN Depolama</h3>
                                <p className="text-slate-600 leading-relaxed">Binlerce fotoğrafı güvenle bulutta saklayın. Müşterileriniz görsellere ışık hızında erişsin, diskiniz asla dolmasın.</p>
                            </div>
                            <div className="bg-[#fafafc] border border-slate-200/60 p-8 rounded-[32px] md:col-span-2 group hover:bg-[#f6f2f9] transition-colors relative overflow-hidden">
                                <div className="absolute right-0 top-0 opacity-10 blur-sm transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500"><CalendarCheck className="w-64 h-64" /></div>
                                <div className="relative z-10">
                                    <ShieldCheck className="w-10 h-10 text-[#5d2b72] mb-6" />
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Tamamen Yasal ve Elektronik Sözleşmeler</h3>
                                    <p className="text-slate-600 leading-relaxed max-w-lg">WhatsApp üzerinden kopuk sözleşmeler bitiyor. KVKK, Gizlilik Şartları ve Hizmet Sözleşmenizi online olarak IP adresli zaman damgasıyla imzalatın, anlaşmazlıkları başlamadan çözün.</p>
                                </div>
                            </div>
                            <div className="bg-[#5d2b72] p-8 rounded-[32px] md:col-span-3 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden text-white shadow-xl shadow-[#5d2b72]/20">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                <div className="relative z-10 max-w-2xl">
                                    <h3 className="text-3xl font-black mb-3">7/24 Kesintisiz Destek</h3>
                                    <p className="text-[#d8bbec] text-lg leading-relaxed">Teknik veya yazılım ile ilgili tüm sorularınızda hızlıca yanıt veren destek sistemimizle her zaman yanınızdayız.</p>
                                </div>
                                <Link href="/iletisim" className="relative z-10 whitespace-nowrap px-8 py-4 bg-white text-[#5d2b72] rounded-2xl font-bold text-[16px] hover:bg-[#f2e6f7] transition-all">
                                    İletişime Geç
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CALL TO ACTION ── */}
                <section className="pb-32 px-6">
                    <div className="max-w-5xl mx-auto bg-gradient-to-r from-slate-900 to-[#1a0b2e] rounded-[40px] p-12 lg:p-20 text-center relative overflow-hidden border border-slate-800 shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7a3a94] blur-[150px] opacity-40 rounded-full" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 blur-[150px] opacity-20 rounded-full" />

                        <div className="relative z-10 flex flex-col items-center">
                            <Sparkles className="w-12 h-12 text-[#d4aae8] mb-8" />
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">Sistemi Denemeye Hazır mısınız?</h2>
                            <p className="text-xl text-[#a890bd] mb-12 max-w-2xl">Stüdyonuzun dijital dönüşümünü bugün başlatın. Kredi kartı gerektirmeden, tüm özellikleri 3 gün boyunca sınırları zorlayarak test edin.</p>
                            <Link href="/packages" className="px-10 py-5 bg-white text-[#1a0b2e] rounded-full font-black text-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                                Ücretsiz Hesabını Oluştur
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            <PublicFooter />
        </div>
    );
}
