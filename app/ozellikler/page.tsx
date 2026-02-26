'use client';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { ArrowRight, Calendar, CreditCard, FileText, Users, Globe, BellRing, BarChart2, Image as ImageIcon, Smartphone, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FEATURES = [
    { icon: Calendar, color: 'bg-[#5d2b72]', glow: 'shadow-purple-200', light: 'bg-purple-50 border-purple-100', title: 'Online Randevu Sistemi', desc: 'Müşterileriniz web sitenizden hizmet seçeneklerinize göre anında randevu oluştursun. Çakışma yok, telefonla uğraşma yok.' },
    { icon: CreditCard, color: 'bg-emerald-500', glow: 'shadow-emerald-200', light: 'bg-emerald-50 border-emerald-100', title: 'Online Kapora & Ödeme Alma', desc: 'Randevuyu alırken ödemenizi de alın. Müşterinize kredi kartıyla taksit kolaylığı sunun. Borcun peşinden koşmak tarihe karışsın.' },
    { icon: ImageIcon, color: 'bg-pink-500', glow: 'shadow-pink-200', light: 'bg-pink-50 border-pink-100', title: 'Fotoğraf Seçtirme Galerisi', desc: 'Müşterileriniz kendi özel panellerinden fotoğraflarını seçsin. Favorilediklerini anında görün, dijital teslimatı tamamlayın.' },
    { icon: FileText, color: 'bg-blue-500', glow: 'shadow-blue-200', light: 'bg-blue-50 border-blue-100', title: 'Online Dijital Sözleşme', desc: "Sözleşmeyi SMS'le link olarak gönderin, müşteri ekranda imzalasın. Elden imza almak için koşturmak bitti." },
    { icon: Users, color: 'bg-orange-500', glow: 'shadow-orange-200', light: 'bg-orange-50 border-orange-100', title: 'Ekip & Olay Yönetimi', desc: "Düğün çekimindeki kuaför, kız alma, konvoy gibi olayları tanımlayın, personellerinizi etiketleyin, SMS'le bildirimi otomatik gönderilsin." },
    { icon: Globe, color: 'bg-indigo-600', glow: 'shadow-indigo-200', light: 'bg-indigo-50 border-indigo-100', title: 'Kurumsal Web Sitesi', desc: 'Markanıza özel, modern ve SEO uyumlu bir web sitesi. Albüm galeri, referans sayfası ve iletişim formuyla eksiksiz.' },
    { icon: BellRing, color: 'bg-amber-500', glow: 'shadow-amber-200', light: 'bg-amber-50 border-amber-100', title: 'Otomatik SMS Bildirimleri', desc: 'Randevu hatırlatma, ödeme tarihi uyarısı veya teslimat bilgisi — kurumsal SMS şablonlarınızı siz belirleyin, sistem otomatik göndersin.' },
    { icon: BarChart2, color: 'bg-teal-500', glow: 'shadow-teal-200', light: 'bg-teal-50 border-teal-100', title: 'Gelir & Alacak Takibi', desc: 'Aylık gelir, bekleyen ödemeler ve alacaklarınızı tek ekranda görün. Ödeme gününden önce sistem müşteriye hatırlatma göndersin.' },
    { icon: Smartphone, color: 'bg-rose-500', glow: 'shadow-rose-200', light: 'bg-rose-50 border-rose-100', title: 'Mobil Uygulamadan Yönetim', desc: 'Dışarıdayken bile tüm sisteminizi cebinizden yönetin. iOS ve Android uyumlu uygulama ile her şey yanınızda.' },
];

export default function OzelliklerPage() {
    return (
        <div className="min-h-screen bg-[#f8faff] text-gray-900 font-sans antialiased">
            <PublicHeader />

            {/* Floating Background Blobs */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-purple-100/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-50/40 rounded-full blur-[100px]" />
            </div>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 lg:pt-44 lg:pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    {/* Hero */}
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-purple-100 rounded-full text-[#5d2b72] text-[12px] font-black uppercase tracking-[0.15em] mb-8 shadow-sm">
                            <Zap className="w-3.5 h-3.5" /> Tüm Özellikler
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.05] tracking-tight">
                            Fotoğrafçının İhtiyacı Olan<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5d2b72] via-purple-600 to-indigo-600">
                                Her Şey Tek Yerde
                            </span>
                        </h1>
                        <p className="text-slate-500 text-lg leading-relaxed font-medium">
                            Randevudan teslimatına, ödemeden sözleşmeye — tüm süreçler dijital,
                            otomatik ve organize.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.06 * i, duration: 0.5, ease: 'easeOut' }}
                                    className="group bg-white p-8 rounded-[28px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300"
                                >
                                    {/* Icon with hover glow */}
                                    <div className={`w-13 h-13 w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg ${f.glow} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-[17px] font-bold text-slate-900 mb-2 group-hover:text-[#5d2b72] transition-colors">{f.title}</h3>
                                    <p className="text-[14px] text-slate-500 leading-relaxed">{f.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <div className="mt-20 text-center">
                        <Link
                            href="/packages"
                            className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#5d2b72] to-indigo-600 text-white rounded-full font-black text-[15px] hover:shadow-[0_10px_30px_rgba(93,43,114,0.25)] hover:-translate-y-0.5 transition-all shadow-xl shadow-purple-200 group"
                        >
                            Tüm Özellikleri Ücretsiz Dene <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <p className="text-slate-400 text-sm mt-3 font-medium">3 gün ücretsiz · Kart bilgisi gerekmez</p>
                    </div>
                </motion.div>
            </main>

            <PublicFooter />
        </div>
    );
}
