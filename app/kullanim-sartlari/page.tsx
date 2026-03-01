import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

export const metadata = {
    title: 'Kullanım Şartları | Weey.NET',
    description: 'Weey.NET Kullanım Şartları — Platform kullanımına ilişkin usul ve esaslar.',
};

export default function TermsOfUsePage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 bg-gradient-to-b from-[#f7eefa] to-white text-center">
                <p className="text-[#5d2b72] text-xs font-black uppercase tracking-widest mb-4">YASAL BİLGİLENDİRME</p>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Kullanım Şartları</h1>
                <p className="text-gray-500 max-w-xl mx-auto text-lg">
                    Platformumuzu kullanırken uyulması gereken kurallar ve yasal sorumluluklar.
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
                                Taraflar ve Kapsam
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                <strong>1.1.</strong> İşbu Kullanım Şartları (“Sözleşme”), Weey.Net (“Platform”) ile Platform’a üye olan fotoğrafçılar (“Üye”) ve fotoğrafçı tarafından oluşturulan erişim bilgileri ile sisteme giriş yapan müşteriler (“Son Kullanıcı”) arasında akdedilmiştir.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                <strong>1.2.</strong> Platforma üye olan veya Platformu kullanan herkes, işbu sözleşme hükümlerini okuduğunu, anladığını ve kabul ettiğini beyan eder.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                <strong>1.3.</strong> Weey.Net, fotoğrafçılar ile müşterileri arasında dijital fotoğraf seçim sürecini sağlayan bir yazılım altyapısı sunar. Weey.Net, taraflar arasındaki ticari ilişkinin tarafı değildir.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
                                Hizmetin Tanımı
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                <strong>2.1.</strong> Weey.Net, Üyelere: Fotoğraf yükleme paneli, albüm oluşturma sistemi, müşteri için kullanıcı adı/şifre üretme, fotoğraf seçim takibi ve bildirim sistemi sağlayan bir yazılım hizmetidir.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                <strong>2.2.</strong> Platform yalnızca teknik altyapı sağlar. Fotoğrafçılık hizmeti sunmaz. Herhangi bir içeriği önceden kontrol etme veya denetleme yükümlülüğü yoktur.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-8 h-8 rounded-lg flex items-center justify-center text-sm">3</span>
                                Üyelik ve Hesap Sorumluluğu
                            </h2>
                            <ul className="text-gray-600 space-y-3">
                                <li className="bg-gray-50 p-4 rounded-xl">• Üye, kayıt olurken verdiği bilgilerin doğruluğundan sorumludur.</li>
                                <li className="bg-gray-50 p-4 rounded-xl">• Hesap güvenliği ve şifre gizliliği münhasıran Üye’ye aittir.</li>
                                <li className="bg-gray-50 p-4 rounded-xl">• Weey.Net, sahte bilgi durumunda üyeliği askıya alma hakkını saklı tutar.</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-8 h-8 rounded-lg flex items-center justify-center text-sm">4</span>
                                İçerik Yükleme ve Sorumluluk
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4 font-bold">
                                Platforma yüklenen tüm içeriklerden münhasıran Üye sorumludur.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                                Üye; yüklediği içeriklerin telif haklarına sahip olduğunu, içerikteki kişilerin açık rızasını aldığını ve içeriklerin hukuka uygun olduğunu beyan ve taahhüt eder.
                            </p>
                            <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl text-rose-900 text-sm">
                                <strong>Önemli:</strong> Weey.Net içeriklerin hukuka uygunluğunu denetlemez. İçeriklerden doğan ihlallerden veya üçüncü kişilerle yaşanan ihtilaflardan sorumlu tutulamaz.
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-8 h-8 rounded-lg flex items-center justify-center text-sm">5</span>
                                Yasaklı Kullanımlar
                            </h2>
                            <p className="text-gray-600 mb-4 text-sm">Aşağıdaki eylemler kesinlikle yasaktır:</p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-500">
                                <li className="bg-gray-100 p-3 rounded-lg">• Hukuka aykırı amaçlı kullanım</li>
                                <li className="bg-gray-100 p-3 rounded-lg">• Telif hakkı ihlalleri</li>
                                <li className="bg-gray-100 p-3 rounded-lg">• Sistemin güvenliğini bozma</li>
                                <li className="bg-gray-100 p-3 rounded-lg">• Kötü amaçlı yazılımlar</li>
                                <li className="bg-gray-100 p-3 rounded-lg">• Tersine mühendislik</li>
                                <li className="bg-gray-100 p-3 rounded-lg">• Spam ve dolandırıcılık</li>
                            </ul>
                        </section>

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="p-6 border border-gray-100 rounded-2xl">
                                <h3 className="font-black text-lg mb-3">7. Hizmet Sürekliliği</h3>
                                <p className="text-gray-500 text-xs leading-relaxed">
                                    Sunucu kesintileri, siber saldırılar veya mücbir sebeplerden doğabilecek aksamalardan Weey.Net sorumlu tutulamaz.
                                </p>
                            </div>
                            <div className="p-6 border border-gray-100 rounded-2xl">
                                <h3 className="font-black text-lg mb-3">8. Veri Yedekleme</h3>
                                <p className="text-gray-500 text-xs leading-relaxed">
                                    Üye, yüklediği fotoğrafların kendi yedeğini almakla yükümlüdür. Olası veri kayıplarında sorumluluk kısıtlıdır.
                                </p>
                            </div>
                        </div>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-8 h-8 rounded-lg flex items-center justify-center text-sm">10</span>
                                Sorumluluğun Sınırlandırılması
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4 text-sm italic">
                                Weey.Net yalnızca teknik altyapı sağlayıcısıdır. Fotoğrafçı ile müşteri arasındaki hizmet kalitesi, teslimat ve ücret anlaşmazlıklarında taraf veya sorumlu değildir.
                            </p>
                        </section>

                        <section className="bg-[#5d2b72] text-white p-10 rounded-[3rem] text-center">
                            <h2 className="text-2xl font-black mb-4">Uygulanacak Hukuk</h2>
                            <p className="text-purple-200 text-sm mb-6 max-w-md mx-auto">
                                İşbu sözleşmeden doğabilecek uyuşmazlıklarda Türkiye Cumhuriyeti Hukuku uygulanır ve yetkili mahkemeler belirlenmiştir.
                            </p>
                            <p className="text-xs text-purple-400">Weey.NET © {new Date().getFullYear()}</p>
                        </section>

                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
