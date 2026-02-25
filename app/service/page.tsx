'use client';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Camera, Image as ImageIcon, CreditCard, Users, BarChart as BarChart2, Globe, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

const SERVICES = [
    {
        title: 'Appointment Management',
        desc: 'Automated scheduling and calendar sync for your studio sessions.',
        icon: <Users className="w-8 h-8 text-purple-600" />
    },
    {
        title: 'Online Photo Selection',
        desc: 'Let your clients choose their favorite shots comfortably from home.',
        icon: <ImageIcon className="w-8 h-8 text-blue-600" />
    },
    {
        title: 'Secure Payments',
        desc: 'Handle deposits and final payments through integrated gateways.',
        icon: <CreditCard className="w-8 h-8 text-indigo-600" />
    },
    {
        title: 'Analytics & Reporting',
        desc: 'Keep track of your revenue and business growth with clear data.',
        icon: <BarChart2 className="w-8 h-8 text-emerald-600" />
    }
];

export default function ServicePage() {
    return (
        <div className="min-h-screen bg-[#FDFCFE] text-slate-900 font-sans antialiased">
            <PublicHeader />
            <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20 max-w-2xl mx-auto">
                    <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">Our Services</span>
                    <h1 className="text-5xl font-bold mb-6">Comprehensive tools for photography business.</h1>
                    <p className="text-slate-500 text-lg leading-relaxed">Everything you need to run your studio successfully, all in one place.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {SERVICES.map((s, i) => (
                        <div key={i} className="bg-white p-10 rounded-[40px] shadow-xl border border-white hover:-translate-y-2 transition-all group">
                            <div className="w-16 h-16 rounded-3xl bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center mb-8 transition-colors">
                                {s.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{s.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Second Section */}
                <div className="mt-40 flex flex-col lg:flex-row items-center gap-20">
                    <div className="lg:w-1/2">
                        <h2 className="text-4xl font-bold mb-8">Markanıza Özel<br />Kurumsal Web Sitesi</h2>
                        <p className="text-slate-500 text-lg mb-8">Sadece panel değil, müşterileriniz için profesyonel bir portfolyo ve seçim alanı sunuyoruz.</p>
                        <div className="space-y-4">
                            {['Kendi Alan Adınız', 'SEO Uyumlu Altyapı', 'Mobil Uyumlu Tasarım'].map((f) => (
                                <div key={f} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><Check className="w-4 h-4" /></div>
                                    <span className="font-bold text-slate-700">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full aspect-video bg-slate-100 rounded-[50px] shadow-inner flex items-center justify-center">
                        <Globe className="w-20 h-20 text-slate-300" />
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
