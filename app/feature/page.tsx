'use client';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Camera, Calendar, Mail, FileText, Layout, Users, Zap, Search, Shield, ArrowRight, Sparkles, Globe } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
    { title: 'Online Galeri', desc: 'Müşterileriniz şifreli galeriler üzerinden fotoğraflarını seçer.', icon: <Camera className="w-8 h-8 text-amber-500" /> },
    { title: 'Finansal Takip', desc: 'Gelir, gider ve borç takibini tek ekrandan yönetin.', icon: <Shield className="w-8 h-8 text-purple-500" /> },
    { title: 'Otomatik Mail', desc: 'Randevu ve ödeme hatırlatmaları otomatik iletilir.', icon: <Sparkles className="w-8 h-8 text-pink-500" /> },
    { title: 'Çoklu Dil Desteği', desc: 'Dünyanın her yerinden müşterilerinize ulaşın.', icon: <Globe className="w-8 h-8 text-emerald-500" /> },
];

export default function FeaturePage() {
    return (
        <div className="min-h-screen bg-[#FDFCFE] text-slate-900 font-sans antialiased">
            <PublicHeader />
            <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20 max-w-2xl mx-auto">
                    <span className="inline-block px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">Explore Features</span>
                    <h1 className="text-5xl font-bold mb-6">Designed to simplify your workday.</h1>
                    <p className="text-slate-500 text-lg leading-relaxed">Discover the powerful features that make Weey.NET the best choice for pro photographers.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {FEATURES.map((f, i) => (
                        <div key={i} className="bg-white p-12 rounded-[50px] shadow-lg border border-white hover:shadow-2xl transition-all">
                            <div className="w-20 h-20 rounded-[30px] bg-slate-50 flex items-center justify-center mb-8">{f.icon}</div>
                            <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-base">{f.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-40 text-center">
                    <div className="max-w-xl mx-auto bg-gradient-to-br from-slate-50 to-white p-12 rounded-[60px] shadow-xl border border-white">
                        <h3 className="text-2xl font-bold mb-6">Still curious about more?</h3>
                        <p className="text-slate-500 mb-10">Our community is growing every day. Join us and see the difference.</p>
                        <Link href="/register" className="bg-black text-white px-10 py-5 rounded-2xl font-bold hover:scale-105 transition-all inline-flex items-center gap-2">
                            Start Trial Now <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
