'use client';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Camera, Calendar, Mail, FileText, Layout, Users, Zap, Search, Shield, ArrowRight, Sparkles, Globe } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FEATURES = [
    {
        title: 'Online Galeri',
        desc: 'Müşterileriniz şifreli galeriler üzerinden fotoğraflarını seçer ve favoriler.',
        icon: <Camera className="w-8 h-8 text-[#5d2b72]" />,
        bg: 'bg-[#f7eefa]/40'
    },
    {
        title: 'Finansal Takip',
        desc: 'Gelir, gider, kapora ve borç takibini tek ekrandan profesyonelce yönetin.',
        icon: <Shield className="w-8 h-8 text-[#5d2b72]" />,
        bg: 'bg-[#f7eefa]/40'
    },
    {
        title: 'Otomatik Mail & SMS',
        desc: 'Randevu onayları ve ödeme hatırlatmaları müşterilerinize otomatik iletilir.',
        icon: <Sparkles className="w-8 h-8 text-[#5d2b72]" />,
        bg: 'bg-[#f7eefa]/40'
    },
    {
        title: 'Dijital Sözleşme',
        desc: 'Kağıt israfına son. Sözleşmelerinizi dijitalde imzalatın ve güvenle saklayın.',
        icon: <FileText className="w-8 h-8 text-[#5d2b72]" />,
        bg: 'bg-[#f7eefa]/40'
    },
    {
        title: 'Ekip Yönetimi',
        desc: 'Fotoğrafçılarınıza ve asistanlarınıza özel yetkilerle panel erişimi tanımlayın.',
        icon: <Users className="w-8 h-8 text-[#5d2b72]" />,
        bg: 'bg-[#f7eefa]/40'
    },
    {
        title: 'Yedekleme ve Güvenlik',
        desc: 'Tüm verileriniz ve müşteri bilgileriniz en üst düzey güvenlik ile korunur.',
        icon: <Globe className="w-8 h-8 text-[#5d2b72]" />,
        bg: 'bg-[#f7eefa]/40'
    },
];

export default function FeaturePage() {
    return (
        <div className="min-h-screen bg-[#f8faff] text-slate-900 font-sans antialiased">
            <PublicHeader />

            {/* Design Elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-purple-100/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-50/40 rounded-full blur-[100px]" />
            </div>

            <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20 max-w-3xl mx-auto"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-purple-100 rounded-full text-[#5d2b72] text-[12px] font-black uppercase tracking-[0.15em] mb-8 shadow-sm">
                        <Zap className="w-3.5 h-3.5" /> Tüm Özellikler
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.05] tracking-tight">
                        İş Akışınızı <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5d2b72] via-purple-600 to-indigo-600">
                            Basitleştirin.
                        </span>
                    </h1>
                    <p className="text-slate-500 text-lg leading-relaxed font-medium mb-10">
                        Fotoğrafçılar için özel olarak tasarlanmış güçlü araçlarla stüdyonuzu profesyonelce yönetin.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/packages" className="px-8 py-4 bg-[#5d2b72] text-white rounded-full font-black text-base shadow-[0_8px_30px_rgba(93,43,114,0.3)] hover:scale-105 transition-all inline-flex items-center gap-2">
                            Ücretsiz Başla <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/neden-biz" className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-full font-bold text-base hover:bg-slate-50 transition-all">
                            Daha Fazla Bilgi
                        </Link>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${f.bg} flex items-center justify-center mb-8 border border-white group-hover:scale-110 transition-transform`}>{f.icon}</div>
                            <h3 className="text-xl font-bold mb-4 text-slate-900">{f.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-[15px] font-medium">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mt-32 text-center"
                >
                    <div className="max-w-4xl mx-auto bg-white p-12 md:p-16 rounded-[60px] shadow-2xl shadow-slate-200/60 border border-slate-50 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black mb-6 text-slate-900">Hâlâ merak ettiğiniz detaylar mı var?</h3>
                            <p className="text-slate-500 mb-10 text-lg max-w-xl mx-auto font-medium">Sürekli büyüyen topluluğumuza katılın ve aradaki farkı kendiniz görün.</p>
                            <Link href="/packages" className="bg-gradient-to-r from-[#5d2b72] to-purple-700 text-white px-10 py-5 rounded-full font-black text-base shadow-[0_8px_25px_rgba(93,43,114,0.25)] hover:scale-105 transition-all inline-flex items-center gap-2">
                                Hemen Ücretsiz Dene <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            <PublicFooter />
        </div>
    );
}
