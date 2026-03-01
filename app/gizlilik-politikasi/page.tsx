import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

export const metadata = {
    title: 'Gizlilik Politikası | Weey.NET',
    description: 'Weey.NET Gizlilik Politikası — Kişisel verilerinizin korunması ve işlenmesine ilişkin esaslar.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 bg-gradient-to-b from-[#f7eefa] to-white text-center">
                <p className="text-[#5d2b72] text-xs font-black uppercase tracking-widest mb-4">YASAL BİLGİLENDİRME</p>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Gizlilik Politikası</h1>
                <p className="text-gray-500 max-w-xl mx-auto text-lg">
                    Verilerinizin güvenliği bizim için önceliktir. Politika detaylarımızı aşağıda bulabilirsiniz.
                </p>
                <p className="text-gray-400 text-sm mt-6">Son Güncelleme: 1 Mart 2026</p>
            </section>

            {/* Content Section */}
            <section className="pb-24 px-6">
                <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-16 shadow-2xl shadow-purple-900/5">
                    <div className="prose prose-purple max-w-none">
                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
                                Giriş
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                İşbu Gizlilik Politikası, Weey.Net (“Platform”) tarafından sunulan web sitesi, mobil uygulama ve panel hizmetleri kapsamında toplanan kişisel verilerin işlenmesine ilişkin usul ve esasları açıklamaktadır.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Weey.Net, fotoğrafçılar ile müşterileri arasında fotoğraf seçimi sürecinin dijital ortamda yürütülmesini sağlayan bir yazılım altyapısı sunmaktadır. Weey.Net, yüklenen içeriklerin sahibi değildir ve içerik üzerinde editoryal kontrol sağlamaz.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Platformu kullanan tüm kullanıcılar (fotoğrafçılar ve müşteriler), işbu Gizlilik Politikası’nı kabul etmiş sayılır.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
                                Toplanan Veriler
                            </h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="p-6 bg-gray-50 rounded-2xl">
                                    <h3 className="font-bold text-gray-900 mb-4">2.1 Fotoğrafçı (Üye) Bilgileri</h3>
                                    <ul className="text-sm text-gray-500 space-y-2">
                                        <li>• Ad / Soyad, Firma adı</li>
                                        <li>• Telefon numarası, E-posta adresi</li>
                                        <li>• Fatura bilgileri</li>
                                        <li>• IP adresi, Panel kullanım verileri</li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-2xl">
                                    <h3 className="font-bold text-gray-900 mb-4">2.2 Müşteri Bilgileri</h3>
                                    <ul className="text-sm text-gray-500 space-y-2">
                                        <li>• Kullanıcı adı ve Şifre</li>
                                        <li>• Fotoğraf seçim bilgileri</li>
                                        <li>• IP adresi</li>
                                        <li>• Cihaz ve oturum bilgileri</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-purple-50 rounded-2xl border border-purple-100">
                                <h3 className="font-bold text-gray-900 mb-2">2.3 Yüklenen İçerikler</h3>
                                <p className="text-sm text-gray-600">
                                    Fotoğrafçılar tarafından sisteme yüklenen fotoğraflar, albüm içerikleri ve açıklamalar dahildir.
                                    <strong> Weey.Net, yüklenen içeriklerin içeriğini denetlemez ve içeriklerin hukuka uygunluğundan sorumlu değildir.</strong>
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-8 h-8 rounded-lg flex items-center justify-center text-sm">3</span>
                                Kişisel Verilerin İşlenme Amaçları
                            </h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
                                <li className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl">✓ Hizmetin sunulması</li>
                                <li className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl">✓ Hesap yönetimi</li>
                                <li className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl">✓ Fotoğraf seçim süreci</li>
                                <li className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl">✓ Teknik destek</li>
                                <li className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl">✓ Hizmet güvenliği</li>
                                <li className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl">✓ Yasal yükümlülükler</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-8 h-8 rounded-lg flex items-center justify-center text-sm">4</span>
                                Veri Güvenliği
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Weey.Net, kişisel verilerin korunması için makul teknik ve idari tedbirleri almaktadır. Ancak internet üzerinden veri aktarımının tamamen güvenli olduğu garanti edilemez.
                            </p>
                            <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl text-amber-800 text-sm">
                                <strong>Kullanıcı Sorumlulukları:</strong> Şifre güvenliğinden kullanıcılar bizzat sorumludur. Hesap bilgilerinin üçüncü kişilerle paylaşılmasından doğacak sonuçlar kullanıcıya aittir.
                            </div>
                        </section>

                        <div className="grid md:grid-cols-2 gap-12 mb-12">
                            <section>
                                <h2 className="text-xl font-black text-gray-900 mb-4">5. Veri Paylaşımı</h2>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Yasal zorunluluk hallerinde resmi makamlarla, hizmet sağlayıcı altyapı firmalarıyla ve ödeme altyapı sağlayıcılarıyla sınırlı ölçüde paylaşılabilir.
                                    <strong> Veriler ticari amaçla satılmaz.</strong>
                                </p>
                            </section>
                            <section>
                                <h2 className="text-xl font-black text-gray-900 mb-4">6. İçerik Sorumluluğu</h2>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Platforma yüklenen tüm içerikten münhasıran ilgili fotoğrafçı sorumludur. Weey.Net telif haklarına uygunluğu denetlemez.
                                </p>
                            </section>
                        </div>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-8 h-8 rounded-lg flex items-center justify-center text-sm">7</span>
                                Veri Saklama ve Haklar
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Veriler üyelik süresince ve yasal yükümlülükler çerçevesinde saklanır. 6698 sayılı KVKK kapsamında haklarınız için bize ulaşabilirsiniz.
                            </p>
                            <div className="bg-gray-900 text-white p-8 rounded-[2rem] text-center">
                                <h3 className="font-bold mb-2">KVKK Talepleri İçin</h3>
                                <p className="text-purple-300">📧 destek@weey.net</p>
                            </div>
                        </section>

                        <section className="border-t border-gray-100 pt-12">
                            <h2 className="text-2xl font-black text-gray-900 mb-4 text-center">Politika Değişiklikleri</h2>
                            <p className="text-gray-500 text-sm text-center">
                                Weey.Net, işbu Gizlilik Politikası’nı önceden bildirim yapmaksızın güncelleme hakkını saklı tutar.
                            </p>
                        </section>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
