import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { CheckCircle2, ArrowRight, Calendar, CreditCard, FileText, Users, Globe, BellRing, BarChart2, Image as ImageIcon, Smartphone } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Özellikler | Weey.NET',
    description: 'Fotoğrafçılar için online randevu, kapora, dijital sözleşme, fotoğraf seçtirme ve daha fazlası.',
};

const FEATURES = [
    { icon: Calendar, color: 'bg-[#7a3a94]', title: 'Online Randevu Sistemi', desc: 'Müşterileriniz web sitenizden hizmet seçeneklerinize göre anında randevu oluştursun. Çakışma yok, telefonla uğraşma yok.' },
    { icon: CreditCard, color: 'bg-emerald-500', title: 'Online Kapora & Ödeme Alma', desc: 'Randevuyu alırken ödemenizi de alın. Müşterinize kredi kartıyla taksit kolaylığı sunun. Borcun peşinden koşmak tarihe karışsın.' },
    { icon: ImageIcon, color: 'bg-pink-500', title: 'Fotoğraf Seçtirme Galerisi', desc: 'Müşterileriniz kendi özel panellerinden fotoğraflarını seçsin. Favorilediklerini anında görün, dijital teslimatı tamamlayın.' },
    { icon: FileText, color: 'bg-blue-500', title: 'Online Dijital Sözleşme', desc: 'Sözleşmeyi SMS\'le link olarak gönderin, müşteri ekranda imzalasın. Elden imza almak için koşturmak bitti.' },
    { icon: Users, color: 'bg-orange-500', title: 'Ekip & Olay Yönetimi', desc: 'Düğün çekimindeki kuaför, kız alma, konvoy gibi olayları tanımlayın, personellerinizi etiketleyin, SMS\'le bildirimi otomatik gönderilsin.' },
    { icon: Globe, color: 'bg-[#7a3a94]', title: 'Kurumsal Web Sitesi', desc: 'Markanıza özel, modern ve SEO uyumlu bir web sitesi. Albüm galeri, referans sayfası ve iletişim formuyla eksiksiz.' },
    { icon: BellRing, color: 'bg-amber-500', title: 'Otomatik SMS Bildirimleri', desc: 'Randevu hatırlatma, ödeme tarihi uyarısı veya teslimat bilgisi — kurumsal SMS şablonlarınızı siz belirleyin, sistem otomatik göndersin.' },
    { icon: BarChart2, color: 'bg-teal-500', title: 'Gelir & Alacak Takibi', desc: 'Aylık gelir, bekleyen ödemeler ve alacaklarınızı tek ekranda görün. Ödeme gününden önce sistem müşteriye hatırlatma SMS\'i göndersin.' },
    { icon: Smartphone, color: 'bg-rose-500', title: 'Mobil Uygulamadan Yönetim', desc: 'Dışarıdayken bile tüm sisteminizi cebinizden yönetin. iOS ve Android uyumlu uygulama ile her şey yanınızda.' },
];

export default function OzelliklerPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
            <PublicHeader />
            {/* Hero */}
            <section className="pt-36 pb-20 px-6 bg-gradient-to-b from-[#f7eefa] to-white text-center">
                <p className="text-[#5d2b72] text-xs font-black uppercase tracking-widest mb-4">Özellikler</p>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Fotoğrafçının İhtiyacı Olan<br />Her Şey Tek Yerde</h1>
                <p className="text-gray-500 max-w-xl mx-auto text-lg">Randevudan teslimatına, ödemeden sözleşmeye — tüm süreçler dijital, otomatik ve organize.</p>
            </section>

            {/* Feature Grid */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <div key={i} className="group p-8 rounded-3xl border border-gray-100 bg-white hover:border-[#ead5f5] hover:shadow-xl hover:shadow-[#f7eefa] hover:-translate-y-1 transition-all duration-300">
                                <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-[18px] font-bold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-[14px] text-gray-500 leading-relaxed">{f.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <div className="py-10 text-center">
                <Link href="/register" className="inline-flex items-center gap-2 px-10 py-4 bg-[#5d2b72] text-white rounded-full font-black text-[15px] hover:bg-[#4a2260] transition-all shadow-xl shadow-[#d4aae8]">
                    Tüm Özellikleri Ücretsiz Dene <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-gray-400 text-sm mt-3">14 gün ücretsiz · Kredi kartı gerekmez</p>
            </div>
            <PublicFooter />
        </div>
    );
}
