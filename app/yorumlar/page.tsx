import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Kullanıcı Yorumları | Weey.NET',
    description: 'Weey.NET kullanan fotoğrafçıların gerçek deneyimleri ve yorumları.',
};

const TESTIMONIALS = [
    { name: 'Selin K.', role: 'Düğün Fotoğrafçısı', text: 'WhatsApp\'tan randevu almak yerine artık her şey sistemde. Haftalarca süren karmaşa bitti. Müşterilerim de bu sistemi çok seviyor.', stars: 5 },
    { name: 'Murat A.', role: 'Stüdyo Sahibi', text: 'Online kapora özelliği tek başına aylık 10.000 TL tasarruf sağlıyor. İptal edilen çekimler sona erdi, kapora alan almadan randevu vermiyorum.', stars: 5 },
    { name: 'Duygu T.', role: 'Portre Fotoğrafçısı', text: 'Müşteri fotoğraf seçimi artık çok kolay. Bir daha müşteriyle ekrana oturup seçim yapmadım. Sistem gerçekten her şeyi düşünmüş.', stars: 5 },
    { name: 'Emre B.', role: 'Dış Çekim Uzmanı', text: 'Dijital sözleşme özelliği hukuki güvencemi artırdı. İmza almak için saatlerce zaman harcamıyorum ve her sözleşme arşivde saklanıyor.', stars: 5 },
    { name: 'Zeynep Y.', role: 'Bebek Fotoğrafçısı', text: 'SMS hatırlatıcıları sayesinde gelmeme oranım sıfıra indi. Eskiden ayda 2-3 randevu boşa giderdi, artık hiç gitmiyor.', stars: 5 },
    { name: 'Caner D.', role: 'Ticari Fotoğrafçı', text: 'Ekip yönetimi muhteşem. Kuaförü, kız almasını tek ekranda organize ediyorum. Personel de SMS bildirimini aldığı için beni aramıyor.', stars: 5 },
    { name: 'Ayşe M.', role: 'Yenidoğan Fotoğrafçısı', text: 'Galeri ve fotoğraf seçtirme özelliği sayesinde müşterilerimle çok daha az vakit geçiriyorum. Seçimler çevrimiçi yapılıyor, ben sadece basmaya odaklanıyorum.', stars: 5 },
    { name: 'Bora K.', role: 'Nişan Fotoğrafçısı', text: 'Gelir takibi bölümü muhasebemi kolaylaştırdı. Kimin ne kadar ödediğini, bakiyesinin ne kadar olduğunu saniyeler içinde görüyorum.', stars: 5 },
    { name: 'Elif Ş.', role: 'Okul Fotoğrafçısı', text: 'Çok sayıda öğrenci için paket yönetimi ve toplu SMS mükemmel çalışıyor. Organizasyonum tamamen değişti.', stars: 5 },
];

export default function YorumlarPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
            <PublicHeader />

            {/* Hero */}
            <section className="pt-40 pb-20 px-6 bg-gradient-to-b from-[#f7eefa] to-white text-center">
                <p className="text-[#5d2b72] text-xs font-black uppercase tracking-widest mb-4">Kullanıcı Yorumları</p>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Gerçek Kişiler, Gerçek Sonuçlar</h1>
                <p className="text-gray-500 max-w-xl mx-auto text-lg">
                    Binlerce fotoğrafçının neyi değiştirdiğini bizzat anlattığı deneyimler.
                </p>
            </section>

            {/* Reviews Grid */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#ead5f5] transition-all duration-300 flex flex-col">
                            <div className="flex gap-1 mb-5">
                                {[...Array(t.stars)].map((_, s) => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-6 italic flex-1">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#ead5f5] flex items-center justify-center text-[#4a2260] font-black text-sm">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{t.name}</p>
                                    <p className="text-xs text-gray-400">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="py-10 text-center">
                <Link href="/register" className="inline-flex items-center gap-2 px-10 py-4 bg-[#5d2b72] text-white rounded-full font-black text-[15px] hover:bg-[#4a2260] transition-all shadow-xl shadow-[#d4aae8]">
                    Sen de Katıl <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
            <PublicFooter />
        </div>
    );
}
