import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Sıkça Sorulan Sorular | Weey.NET',
    description: 'Weey.NET hakkında merak ettiğiniz her şey — fiyatlar, özellikler, teknik destek ve daha fazlası.',
};

const FAQS = [
    {
        q: '14 günlük deneme süresi bittikten sonra ne olur?',
        a: 'Deneme süreniz bittiğinde hesabınız otomatik olarak ücretsiz plana düşer. Herhangi bir ücret kesilmez, kredi kartı da istenmez. İstediğiniz zaman ücretli plana geçebilirsiniz.',
    },
    {
        q: 'Online ödeme ve kapora sistemi nasıl çalışıyor?',
        a: 'Müşteriniz randevu oluştururken belirlediğiniz kapora tutarını kredi kartıyla öder. Ödeme direkt olarak Stripe üzerinden işlenir ve belirlediğiniz banka hesabınıza aktarılır. Taksit seçeneklerini siz belirlersiniz.',
    },
    {
        q: 'Dijital sözleşme yasal olarak geçerli mi?',
        a: 'Evet. Müşterinin ekran üzerinde imzaladığı dijital sözleşmeler, 5070 sayılı Elektronik İmza Kanunu kapsamında hukuki geçerliliğe sahiptir. Her imzalanmış sözleşme sistem üzerinde tarih ve IP bilgisiyle birlikte arşivlenir.',
    },
    {
        q: 'Mevcut müşteri verilerimi sisteme aktarabilir miyim?',
        a: 'Evet. Destek ekibimiz Excel veya CSV formatındaki müşteri listelerinizi sisteme aktarmanıza yardımcı olur. Ücretsiz veri göçü desteği sunuyoruz.',
    },
    {
        q: 'Birden fazla fotoğrafçı veya stüdyo için kullanabilir miyim?',
        a: 'Studio ve Kurumsal planlarımızda birden fazla kullanıcı ekleyebilirsiniz. Her kullanıcıya farklı yetki seviyeleri tanımlayabilirsiniz (yönetici, fotoğrafçı, resepsiyonist).',
    },
    {
        q: 'Fotoğraf galerisi ne kadar depolama alanı sunuyor?',
        a: 'Ücretsiz planda 5 GB, Profesyonel planda 50 GB, Kurumsal planda ise sınırsız depolama alanı sunulmaktadır. Tüm fotoğraflar Bunny CDN üzerinde güvenli şekilde saklanır.',
    },
    {
        q: 'Müşterim fotoğraf seçimini nasıl yapıyor?',
        a: 'Çekimi tamamlanan müşterinize özel bir galeri linki SMS/e-posta ile gönderilir. Müşteri bu link üzerinden fotoğraflarını önizleyip favorilediği görselleri seçer. Seçimler anlık olarak sizin paneline yansır.',
    },
    {
        q: 'Kendi domain adımla kullanabilir miyim?',
        a: 'Evet. Kurumsal planımızda kendi domain adınızı (ör. www.stüdyoadiniz.com) sisteme bağlayabilirsiniz. Profesyonel planda ise size özel bir alt alan adı (stüdyoadiniz.weey.net) tanımlanır.',
    },
    {
        q: 'Mobil uygulama var mı?',
        a: 'Evet. iOS ve Android için native uygulamamız mevcuttur. Randevu takvimi, müşteri yönetimi, ödeme takibi ve galeri paylaşımını telefonunuzdan rahatlıkla yönetebilirsiniz.',
    },
    {
        q: 'Teknik sorun yaşarsam nasıl destek alabilirim?',
        a: 'Canlı sohbet, WhatsApp ve e-posta üzerinden destek sunuyoruz. Mesai saatleri içinde 30 dakika içinde, mesai sonrası 4 saat içinde geri dönüyoruz. Kurumsal müşteriler için öncelikli destek hattı ayrıca tanımlanır.',
    },
];

export default function SSSPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
            <PublicHeader />

            {/* Hero */}
            <section className="pt-40 pb-20 px-6 bg-gradient-to-b from-[#f7eefa] to-white text-center">
                <p className="text-[#5d2b72] text-xs font-black uppercase tracking-widest mb-4">SSS</p>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Sıkça Sorulan Sorular</h1>
                <p className="text-gray-500 max-w-xl mx-auto text-lg">
                    Aklınızdaki soruların cevabı burada. Bulamazsanız bize yazın.
                </p>
            </section>

            {/* FAQ Accordion */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto space-y-3">
                    {FAQS.map((faq, i) => (
                        <details
                            key={i}
                            className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                        >
                            <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                                <span className="font-bold text-gray-900 text-[16px] leading-snug">{faq.q}</span>
                                <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="px-6 pb-6 text-[15px] text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>
            </section>

            {/* Still have questions */}
            <section className="py-16 px-6 text-center">
                <div className="max-w-xl mx-auto p-10 rounded-[2rem] bg-gradient-to-br from-[#5d2b72] to-[#4a2260] text-white shadow-2xl shadow-[#d4aae8]">
                    <h2 className="text-2xl font-black mb-3">Başka sorunuz mu var?</h2>
                    <p className="text-[#d4aae8] mb-6">Destek ekibimiz size yardımcı olmaktan mutluluk duyar.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/iletisim" className="px-8 py-3 bg-white text-[#4a2260] rounded-full font-black hover:bg-gray-50 transition-all">
                            İletişime Geç
                        </Link>
                        <Link href="/register" className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all">
                            Ücretsiz Dene <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
