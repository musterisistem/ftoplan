import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Award, Zap, Shield, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Neden Biz? | Weey.NET',
    description: 'Neden Weey.NET\'i seçmelisiniz? Fotoğrafçılığa özel altyapı, güvenli veri ve gerçek destek.',
};

const WHY = [
    {
        icon: Award,
        title: 'Tek İlgilendiğimiz Sektör: Fotoğrafçılık',
        body: 'Muhasebe yazılımı da değil, genel randevu sistemi de değiliz. Sadece fotoğrafçıların iş akışını anlıyor, sadece fotoğrafçılara yazıyoruz.',
        accent: 'border-[#9e5bb8] bg-[#f7eefa]',
        badge: 'bg-[#7a3a94]',
    },
    {
        icon: Shield,
        title: 'Verileriniz Size Ait, Kimseyle Paylaşılmaz',
        body: 'Her stüdyo için ayrı ve izole altyapı. Müşteri bilgilerinize, fotoğraflarınıza, alacaklarınıza başkası erişemez. Hiç.',
        accent: 'border-[#9e5bb8] bg-[#f7eefa]',
        badge: 'bg-[#7a3a94]',
    },
    {
        icon: Zap,
        title: 'Siz İstedikçe Biz Geliştiriyoruz',
        body: 'Her güncelleme, bir müşterimizin gerçek ihtiyacından doğuyor. Geri bildiriminiz doğrudan yazılıma yansır. Özel yazılımcınız gibiyiz.',
        accent: 'border-blue-400 bg-blue-50',
        badge: 'bg-blue-500',
    },
    {
        icon: MessageSquare,
        title: 'Gerçek Kişi Desteği',
        body: 'Sorun yaşadığınızda boş ticket sistemleriyle değil, gerçek bir kişiyle muhatap olursunuz. Cevapsız bırakmıyoruz.',
        accent: 'border-emerald-400 bg-emerald-50',
        badge: 'bg-emerald-500',
    },
];

export default function NedenBizPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
            <PublicHeader />

            {/* Hero */}
            <section className="pt-40 pb-20 px-6 bg-gradient-to-b from-[#f7eefa] to-white text-center">
                <p className="text-[#5d2b72] text-xs font-black uppercase tracking-widest mb-4">Neden Biz?</p>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                    Sıradan Bir Takvim<br />Uygulaması Değiliz.
                </h1>
                <p className="text-gray-500 max-w-xl mx-auto text-lg">
                    Binlerce stüdyo sahibi ile konuştuk, her birinin aynı sorunları yaşadığını gördük. Çözümü sadece fotoğrafçılar için tasarladık.
                </p>
            </section>

            {/* Why cards */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
                    {WHY.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <div key={i} className={`p-8 rounded-[28px] border-2 ${item.accent} hover:-translate-y-1 transition-transform duration-300`}>
                                <div className={`w-12 h-12 ${item.badge} rounded-2xl flex items-center justify-center text-white mb-5`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-[18px] font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-[14px] text-gray-600 leading-relaxed">{item.body}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Side-by-side comparison */}
            <section className="py-10 px-6 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 rounded-[36px] overflow-hidden shadow-2xl border border-gray-100">
                    <div className="bg-gray-900 text-white p-10 md:p-12">
                        <p className="text-red-400 text-xs font-black uppercase tracking-widest mb-6">Şu An Nerede Duruyorsunuz?</p>
                        <ul className="space-y-4">
                            {[
                                'Randevuları WhatsApp\'tan alıyor, kağıda yazıyorsunuzdur',
                                'Ödeme almak için müşteriyi aramak zorunda kalıyorsunuzdur',
                                'Sözleşme yazdırıp elden imzalatıyorsunuzdur',
                                'Hangi müşteride ne kadar alacak var bilmiyorsunuzdur',
                            ].map((t, i) => (
                                <li key={i} className="flex items-start gap-3 text-[15px] text-gray-400">
                                    <span className="text-red-500 shrink-0 font-black">✗</span>
                                    <span className="line-through decoration-red-500/50">{t}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-gradient-to-br from-[#5d2b72] to-[#4a2260] text-white p-10 md:p-12 flex flex-col justify-between">
                        <div>
                            <p className="text-[#d4aae8] text-xs font-black uppercase tracking-widest mb-6">Platforma Geçtikten Sonra</p>
                            <ul className="space-y-4 mb-10">
                                {[
                                    'Müşteri kendi randevusunu web sitenizden oluşturur',
                                    'Kaparayı randevu anında online tahsil edersiniz',
                                    'Sözleşme SMS\'le gönderilir, ekranda imzalanır',
                                    'Her müşterinin alacak durumu tek ekranda görünür',
                                ].map((t, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[15px] text-[#ead5f5]">
                                        <span className="text-emerald-300 shrink-0 font-black">✓</span>
                                        <span className="font-medium">{t}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link href="/register" className="text-center py-4 bg-white text-[#4a2260] rounded-full font-black text-[15px] hover:bg-gray-50 transition-all shadow-lg">
                            Hemen Ücretsiz Başla →
                        </Link>
                    </div>
                </div>
            </section>

            <div className="py-10 text-center">
                <Link href="/register" className="inline-flex items-center gap-2 px-10 py-4 bg-[#5d2b72] text-white rounded-full font-black text-[15px] hover:bg-[#4a2260] transition-all shadow-xl shadow-[#d4aae8]">
                    Şimdi Başla <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
            <PublicFooter />
        </div>
    );
}
