'use client';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import {
    Camera, Users, Award, Zap, Globe, Shield, CheckCircle2, Star, Mail, Phone
} from 'lucide-react';

const VALUES = [
    { icon: <Zap className="w-6 h-6" />, color: 'bg-[#ead5f5] text-[#5d2b72]', title: 'Hız & Verimlilik', desc: 'Manuel işlemleri sıfıra indirip stüdyonuzu hızlandıracak akıllı otomasyonlar.' },
    { icon: <Shield className="w-6 h-6" />, color: 'bg-emerald-100 text-emerald-600', title: 'Güvenlik', desc: '256-bit SSL şifreleme ve yedeklenmiş bulut altyapısıyla verileriniz her zaman güvende.' },
    { icon: <Globe className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600', title: 'Erişilebilirlik', desc: 'Telefon, tablet veya bilgisayardan, istediğiniz yerden stüdyonuzu yönetin.' },
    { icon: <Award className="w-6 h-6" />, color: 'bg-amber-100 text-amber-600', title: 'Kalite', desc: 'Fotoğra stüdyolarının gerçek ihtiyaçlarından doğan, sürekli güncellenen bir platform.' },
];

const TEAM = [
    { name: 'Ortak Yazılım Mühendisliği', role: 'Ürün & Teknoloji', initial: 'T', color: 'from-[#7a3a94] to-[#7a3a94]' },
    { name: 'Stüdyo Operasyon Ekibi', role: 'Müşteri Başarısı', initial: 'M', color: 'from-pink-500 to-rose-500' },
    { name: 'Tasarım Departmanı', role: 'Kullanıcı Deneyimi', initial: 'D', color: 'from-emerald-500 to-teal-500' },
];

export default function KurumsalPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
            <PublicHeader />
            {/* Hero */}
            <section className="relative pt-44 pb-24 px-6 overflow-hidden bg-gradient-to-br from-[#f7eefa] via-white to-[#f7eefa]">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ead5f5]/60 rounded-full blur-[130px] pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ead5f5] border border-[#d4aae8] text-[#4a2260] text-[13px] font-bold mb-8">
                        <Camera className="w-4 h-4" /> Hakkımızda
                    </span>
                    <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-6">
                        Fotoğrafçılara Özel<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5d2b72] to-[#5d2b72]">Dijital Çözüm</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Weey.NET, Türkiye'deki fotoğraf stüdyolarının dijital dönüşümünü hızlandırmak amacıyla kurulmuş bir SaaS platformudur.
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="py-24 px-6 overflow-hidden">
                <div className="max-w-4xl mx-auto">
                    <p className="text-[13px] font-black uppercase tracking-widest text-[#5d2b72] text-center mb-4">Hikayemiz</p>
                    <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Neden Weey.NET?</h2>
                    <div className="space-y-6 text-gray-600 leading-relaxed text-lg text-center">
                        <p>
                            Fotoğrafi ailesinden gelen kurucularımız, stüdyo sahiplerinin her gün randevu yönetimi, fotoğraf teslimi ve ödeme takibi gibi operasyonel işlere harcadıklarını fark etti.
                        </p>
                        <p>
                            Bu zorluğu çözmek için yola çıktık. Weey.NET olarak stüdyo işletmeciliğini basitleştiriyor, dijitalleştiriyor ve otomasyona taşıyoruz.
                        </p>
                        <p>
                            Bugün Türkiye'nin dört bir yanında binlerce fotoğrafçı Weey.NET üzerinden müşterilerini yönetiyor, galerilerini paylaşıyor ve ödemelerini alıyor.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-[13px] font-black uppercase tracking-widest text-[#5d2b72] mb-3">Değerlerimiz</p>
                        <h2 className="text-3xl font-black text-gray-900">Ne İçin Çalışıyoruz?</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {VALUES.map((v, i) => (
                            <div key={i} className="p-7 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className={`w-12 h-12 rounded-2xl ${v.color} flex items-center justify-center mb-5`}>{v.icon}</div>
                                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                                <p className="text-[14px] text-gray-500 leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-[13px] font-black uppercase tracking-widest text-[#5d2b72] mb-3">Ekibimiz</p>
                        <h2 className="text-3xl font-black text-gray-900">Arkamızda Kim Var?</h2>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {TEAM.map((t, i) => (
                            <div key={i} className="p-8 rounded-3xl border border-gray-100 bg-white shadow-sm text-center hover:shadow-md transition-shadow">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                                    <span className="text-2xl font-black text-white">{t.initial}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">{t.name}</h3>
                                <p className="text-[13px] text-[#5d2b72] font-semibold">{t.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-2xl mx-auto text-center p-12 rounded-[2.5rem] bg-gradient-to-br from-[#5d2b72] to-[#4a2260] shadow-2xl shadow-[#7a3a94]/30">
                    <h2 className="text-3xl font-black text-white mb-4">Bize Katılın</h2>
                    <p className="text-white/70 mb-8">14 gün ücretsiz deneyin. Kredi kartı gerekmez.</p>
                    <a href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#4a2260] font-black rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all">
                        Ücretsiz Başla <CheckCircle2 className="w-5 h-5" />
                    </a>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
