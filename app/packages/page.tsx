'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, ArrowRight, HardDrive, Globe, Shield, Zap, Check, Lock, ChevronLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

export default function PackagesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [packagesData, setPackagesData] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/packages')
            .then(r => r.ok ? r.json() : [])
            .then(setPackagesData)
            .catch(() => { });
    }, []);

    const standartPkg = packagesData.find(p => p.id === 'standart');
    const kurumsalPkg = packagesData.find(p => p.id === 'kurumsal');

    const selectPackage = (packageId: string) => {
        if (status === 'unauthenticated') {
            router.push(`/register?package=${packageId}`);
            return;
        }
        setLoading(packageId);
        router.push(`/checkout?package=${packageId}`);
    };

    return (
        <div className="min-h-screen bg-[#f8faff] text-slate-900 font-sans antialiased">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#ead5f5]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-100/30 to-transparent" />
            </div>

            <PublicHeader />

            {/* Content */}
            <main className="max-w-7xl mx-auto px-6 pt-32 pb-16 lg:pt-40 lg:pb-24">
                <div className="text-center mb-20 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f7eefa] rounded-full text-[#5d2b72] text-[12px] font-black uppercase tracking-widest mb-6">
                        <Zap className="w-4 h-4" /> Enerjik Fiyatlandırma
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                        İşinizi Büyütmek İçin <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5d2b72] to-[#7a3a94]">Doğru Planı Seçin</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">
                        Esnek ve şeffaf paketlerimizle maliyetlerinizi kontrol altında tutun, stüdyonuzu dijital dünyaya taşıyın.
                    </p>
                </div>

                {/* Cards Container */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">

                    {/* Trial Card */}
                    <div className="bg-white p-12 rounded-[40px] shadow-xl border border-slate-50 hover:scale-105 transition-all group">
                        <div className="w-14 h-14 rounded-3xl bg-slate-50 flex items-center justify-center mb-8"><Zap className="w-7 h-7 text-orange-500" /></div>
                        <div className="text-slate-400 font-black uppercase tracking-widest text-[11px] mb-4">Ücretsiz Deneme</div>
                        <div className="text-6xl font-black text-slate-900 mb-4 font-mono">₺0</div>
                        <p className="text-slate-500 font-bold mb-8 text-sm">14 gün boyunca tüm temel özellikleri sınırsızca deneyin. Kredi kartı gerekmez.</p>
                        <ul className="space-y-4 mb-10">
                            {['3 GB Depolama', 'Müşteri Yönetimi', 'Randevu Takibi', 'Online Fotoğraf Seçimi'].map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                    <Check className="w-5 h-5 text-green-500" /> {f}
                                </li>
                            ))}
                        </ul>
                        <Link href="/register" className="w-full py-4 rounded-full border-2 border-slate-100 text-slate-900 font-black hover:border-[#5d2b72] hover:text-[#5d2b72] transition-all flex items-center justify-center gap-2">
                            Denemeyi Başlat <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Standard Card */}
                    {standartPkg && (
                        <div className="bg-white p-12 rounded-[40px] shadow-xl border border-slate-50 hover:scale-105 transition-all">
                            <div className="w-14 h-14 rounded-3xl bg-blue-50 flex items-center justify-center mb-8"><HardDrive className="w-7 h-7 text-blue-500" /></div>
                            <div className="text-slate-400 font-black uppercase tracking-widest text-[11px] mb-4">{standartPkg.name}</div>
                            <div className="text-6xl font-black text-slate-900 mb-4 font-mono">₺{standartPkg.price?.toLocaleString()}</div>
                            <p className="text-slate-500 font-bold mb-8 text-sm">Büyümeye başlayan stüdyolar için geliştirilmiş güçlü yönetim araçları.</p>
                            <ul className="space-y-4 mb-10">
                                <li className="flex items-center gap-3 text-slate-500 font-bold text-sm"><Check className="w-5 h-5 text-green-500" /> {standartPkg.storage} GB Güvenli Depolama</li>
                                {standartPkg.features?.slice(0, 4).map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                        <Check className="w-5 h-5 text-green-500" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => selectPackage('standart')} disabled={loading === 'standart'} className="w-full py-4 rounded-full bg-slate-900 text-white font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                {loading === 'standart' ? <span className="animate-spin border-2 border-white/20 border-t-white rounded-full w-5 h-5" /> : 'Bu Paketi Seç'}
                            </button>
                        </div>
                    )}

                    {/* Pro/Kurumsal Card */}
                    {kurumsalPkg && (
                        <div className="bg-gradient-to-br from-[#5d2b72] via-[#6a3ae2] to-[#7a3a94] p-12 rounded-[40px] shadow-2xl shadow-[#d4aae8] hover:scale-110 transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10"><Globe className="w-32 h-32 text-white" /></div>
                            <div className="w-14 h-14 rounded-3xl bg-white/10 flex items-center justify-center mb-8 backdrop-blur-md border border-white/20"><Globe className="w-7 h-7 text-white" /></div>
                            <div className="text-white/60 font-black uppercase tracking-widest text-[11px] mb-4">{kurumsalPkg.name}</div>
                            <div className="text-6xl font-black text-white mb-4 font-mono">₺{kurumsalPkg.price?.toLocaleString()}</div>
                            <p className="text-white/80 font-bold mb-8 text-sm">Sınırsız güç ve kurumsal kimlik arayan profesyonel ajanslar için.</p>
                            <ul className="space-y-4 mb-10">
                                <li className="flex items-center gap-3 text-white font-bold text-sm"><Check className="w-5 h-5 text-white/40" /> {kurumsalPkg.storage} GB Depolama</li>
                                {kurumsalPkg.features?.slice(0, 4).map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3 text-white font-bold text-sm">
                                        <Check className="w-5 h-5 text-white/40" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => selectPackage('kurumsal')} disabled={loading === 'kurumsal'} className="w-full py-5 rounded-full bg-white text-[#5d2b72] font-black shadow-2xl shadow-black/20 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                {loading === 'kurumsal' ? <span className="animate-spin border-2 border-[#5d2b72]/20 border-t-[#5d2b72] rounded-full w-6 h-6" /> : 'Hemen Başlat'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Trust Badges */}
                <div className="mt-32 grid md:grid-cols-3 gap-12 border-t border-slate-100 pt-16">
                    {[
                        { icon: <Shield className="w-8 h-8" />, title: 'Güvenli Altyapı', desc: 'Sınırları aşan güvenlik mimarisiyle verileriniz SSL koruması altında saklanır.' },
                        { icon: <Lock className="w-8 h-8" />, title: 'Gizlilik Odaklı', desc: 'Kart bilgileriniz asla sunucularımızda saklanmaz, PCI-DSS uyumlu ödeme altyapısı kullanılır.' },
                        { icon: <Zap className="w-8 h-8" />, title: 'Anında Kurulum', desc: 'Ödeme onaylandığı anda paneliniz kurulur ve saniyeler içinde kullanmaya başlarsınız.' },
                    ].map((t, i) => (
                        <div key={i} className="flex gap-6">
                            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">{t.icon}</div>
                            <div>
                                <h4 className="text-lg font-black text-slate-900 mb-2">{t.title}</h4>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed">{t.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main >

            <PublicFooter />
        </div >
    );
}
