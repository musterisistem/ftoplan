import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

export const metadata = {
    title: 'Mesafeli Satış Sözleşmesi | Weey.NET',
    description: 'Weey.NET Mesafeli Satış Sözleşmesi — Hizmet alımına ilişkin hak ve yükümlülükler.',
};

export default function DistanceSalesAgreementPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 bg-gradient-to-b from-[#f7eefa] to-white text-center">
                <p className="text-[#5d2b72] text-xs font-black uppercase tracking-widest mb-4">YASAL BİLGİLENDİRME</p>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Mesafeli Satış Sözleşmesi</h1>
                <p className="text-gray-500 max-w-xl mx-auto text-lg">
                    Weey.NET platformu üzerinden sunulan dijital hizmetlere ilişkin satış koşulları.
                </p>
                <p className="text-gray-400 text-sm mt-6">Son Güncelleme: 1 Mart 2026</p>
            </section>

            {/* Content Section */}
            <section className="pb-24 px-6">
                <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-16 shadow-2xl shadow-purple-900/5">
                    <div className="prose prose-purple max-w-none text-gray-600 leading-relaxed">

                        <div className="mb-12 text-center pb-8 border-b border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Weey.Net</h2>
                            <h3 className="text-lg font-bold text-gray-700 uppercase">Mesafeli Satış Sözleşmesi</h3>
                        </div>

                        <section className="mb-10">
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-7 h-7 rounded-lg flex items-center justify-center text-xs">1</span>
                                TARAFLAR
                            </h2>
                            <p className="mb-4">İşbu Mesafeli Satış Sözleşmesi (“Sözleşme”);</p>
                            <ul className="list-none space-y-2 pl-4 border-l-2 border-purple-200">
                                <li><strong>Bir tarafta:</strong> Weey.Net (“Hizmet Sağlayıcı”)</li>
                                <li><strong>Diğer tarafta:</strong> Weey.Net platformuna üye olan fotoğrafçı (“Üye”)</li>
                            </ul>
                            <p className="mt-4">arasında elektronik ortamda kurulmuştur. Üye, platforma kayıt olarak ve “Kabul Ediyorum” seçeneğini işaretleyerek işbu sözleşmenin tüm hükümlerini okuduğunu, anladığını ve kabul ettiğini beyan eder.</p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-7 h-7 rounded-lg flex items-center justify-center text-xs">2</span>
                                SÖZLEŞMENİN KONUSU
                            </h2>
                            <p>İşbu sözleşmenin konusu, Weey.Net tarafından sunulan dijital fotoğraf seçim ve müşteri yönetim yazılım hizmetinin, Üye’ye elektronik ortamda sunulmasına ilişkin tarafların hak ve yükümlülüklerinin belirlenmesidir. Weey.Net, fotoğrafçılar ile müşterileri arasında dijital fotoğraf seçim sürecini sağlayan bir yazılım altyapısı sunar. Fotoğrafçılık hizmeti sunmaz.</p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-7 h-7 rounded-lg flex items-center justify-center text-xs">3</span>
                                HİZMETİN TANIMI
                            </h2>
                            <p className="mb-4">Weey.Net tarafından sunulan hizmetler şunlardır:</p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <li className="bg-gray-50 p-3 rounded-lg">• Fotoğraf yükleme paneli</li>
                                <li className="bg-gray-50 p-3 rounded-lg">• Albüm oluşturma</li>
                                <li className="bg-gray-50 p-3 rounded-lg">• Müşteri için kullanıcı adı/şifre</li>
                                <li className="bg-gray-50 p-3 rounded-lg">• Fotoğraf seçim takibi</li>
                                <li className="bg-gray-50 p-3 rounded-lg">• Bildirim sistemi</li>
                                <li className="bg-gray-50 p-3 rounded-lg">• Dijital altyapı ve veri barındırma</li>
                            </ul>
                            <p className="mt-4 text-sm font-medium italic">Platform yalnızca teknik altyapı sağlar. Fotoğrafçı ile müşteri arasındaki hizmet ilişkisine taraf değildir.</p>
                        </section>

                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                            <section>
                                <h2 className="text-lg font-black text-gray-900 mb-3 border-b-2 border-purple-100 pb-2">4. SÖZLEŞMENİN KURULMASI</h2>
                                <p className="text-sm">4.1. Üyelik işleminin tamamlanması ve ödeme yapılması ile sözleşme elektronik ortamda kurulmuş sayılır. 4.2. Üye, sözleşmenin bir örneğine elektronik ortamda erişebileceğini kabul eder.</p>
                            </section>
                            <section>
                                <h2 className="text-lg font-black text-gray-900 mb-3 border-b-2 border-purple-100 pb-2">5. ÜCRET VE ÖDEME</h2>
                                <p className="text-sm">5.1. Hizmet bedeli, sitede belirtilen üyelik paketine göre belirlenir. 5.2. Ödeme kredi kartı veya sunulan dijital yöntemlerle tahsil edilir. 5.3. Ödeme altyapısından kaynaklanan aksaklıklardan Weey.Net sorumlu değildir.</p>
                            </section>
                        </div>

                        <section className="mb-10 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                            <h2 className="text-xl font-black text-amber-900 mb-4">6. CAYMA HAKKI</h2>
                            <p className="text-sm text-amber-800 mb-2">6.1. Üye, hizmetin elektronik ortamda anında ifa edilmeye başlanacağını kabul eder.</p>
                            <p className="text-sm text-amber-800 font-bold">6.2. Üyelik aktivasyonu ile birlikte hizmet sunulmaya başlandığından, Üye cayma hakkından feragat ettiğini kabul eder (TKHK m.15/ğ).</p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-7 h-7 rounded-lg flex items-center justify-center text-xs">7</span>
                                ÜYENİN BEYAN VE TAAHHÜTLERİ
                            </h2>
                            <p className="mb-4 text-sm">Üye;</p>
                            <ul className="space-y-2 text-sm">
                                <li><strong>7.1.</strong> Yüklediği içerikler üzerinde gerekli telif haklarına sahip olduğunu,</li>
                                <li><strong>7.2.</strong> Fotoğraflarda yer alan kişilerden açık rıza aldığını,</li>
                                <li><strong>7.3.</strong> KVKK ve ilgili mevzuata uygun hareket ettiğini,</li>
                                <li><strong>7.4.</strong> Platformu hukuka aykırı amaçlarla kullanmayacağını,</li>
                                <li><strong>7.5.</strong> Başkalarına ait kişisel verileri izinsiz yüklemeyeceğini,</li>
                            </ul>
                            <p className="mt-4 text-sm font-bold text-red-600">beyan ve taahhüt eder. Yüklenen içeriklerden doğabilecek her türlü hukuki ve cezai sorumluluk münhasıran Üye’ye aittir.</p>
                        </section>

                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                            <section>
                                <h2 className="text-lg font-black text-gray-900 mb-3">8. İÇERİK SORUMLULUĞU</h2>
                                <p className="text-xs">8.1. Weey.Net içerikleri kontrol etmekle yükümlü değildir. 8.2. Telif veya veri ihlali iddialarından doğan uyuşmazlıklarda taraf değildir. 8.3. Üye, Weey.Net&apos;in uğrayacağı zararları tazmin etmeyi kabul eder.</p>
                            </section>
                            <section>
                                <h2 className="text-lg font-black text-gray-900 mb-3">9. HİZMET KESİNTİLERİ</h2>
                                <p className="text-xs">Sunucu arızaları, siber saldırılar, mücbir sebepler veya altyapı kesintileri nedeniyle oluşabilecek aksaklıklardan sorumlu tutulamaz. Hizmetin kesintisiz olacağı garanti edilmez.</p>
                            </section>
                        </div>

                        <section className="mb-10">
                            <h2 className="text-lg font-black text-gray-900 mb-4">10. VERİ SAKLAMA VE YEDEKLEME</h2>
                            <p className="text-sm mb-2">10.1. Weey.Net makul teknik önlemleri alır. 10.2. Üye, yüklediği fotoğrafların yedeğini almakla yükümlüdür.</p>
                            <p className="text-sm font-bold italic">10.3. Veri kaybı durumunda sorumluluk, üyelik dönemine ait hizmet bedeli ile sınırlıdır.</p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-lg font-black text-gray-900 mb-4">11. FİKRİ MÜLKİYET</h2>
                            <p className="text-sm">Platform yazılımı, tasarımı, kodları ve altyapısı Weey.Net’e aittir. Üye; yazılımı kopyalayamaz, çoğaltamaz, tersine mühendislik yapamaz, lisanslayamaz veya satamaz.</p>
                        </section>

                        <section className="mb-10 p-6 bg-gray-900 rounded-[2rem] text-white">
                            <h2 className="text-xl font-black mb-4">12. SORUMLULUĞUN SINIRLANDIRILMASI</h2>
                            <p className="text-xs text-gray-400 mb-4">12.1. Weey.Net yalnızca yazılım altyapı sağlayıcısıdır. 12.2. Fotoğrafçı ile müşteri arasındaki ticari ilişkiden doğan uyuşmazlıklardan sorumlu değildir. 12.3. Toplam sorumluluk, ödenen hizmet bedeli ile sınırlıdır. 12.4. Dolaylı zararlar kabul edilmez.</p>
                        </section>

                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                            <section>
                                <h2 className="text-lg font-black text-gray-900 mb-3">13. FESİH</h2>
                                <p className="text-xs">Üye dilediği zaman üyeliği sonlandırabilir. Sözleşme ihlali, hukuka aykırı içerik veya güvenlik tehdidi durumunda Weey.Net tek taraflı fesih hakkını saklı tutar.</p>
                            </section>
                            <section>
                                <h2 className="text-lg font-black text-gray-900 mb-3">14. MÜCBİR SEBEPLER</h2>
                                <p className="text-xs">Doğal afet, savaş, terör, resmi makam kararları gibi kontrol dışı gelişmeler mücbir sebep sayılır ve taraflar sorumlu tutulamaz.</p>
                            </section>
                        </div>

                        <section className="mt-16 pt-8 border-t-2 border-purple-50 text-center">
                            <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">15. UYUŞMAZLIKLARIN ÇÖZÜMÜ</h2>
                            <p className="text-gray-600 mb-6 italic">İşbu sözleşmeden doğabilecek uyuşmazlıklarda Türkiye Cumhuriyeti Hukuku uygulanır. Yetkili mahkemeler belirlenmiştir.</p>
                            <div className="inline-block px-12 py-4 bg-[#5d2b72] text-white rounded-full font-black text-sm uppercase tracking-widest">
                                YÜRÜRLÜK: {new Date().toLocaleDateString('tr-TR')}
                            </div>
                            <p className="mt-8 text-xs font-black text-[#5d2b72]">Weey.NET</p>
                        </section>

                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
