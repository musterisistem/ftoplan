import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

export const metadata = {
    title: 'KVKK Aydınlatma Metni | Weey.NET',
    description: 'Weey.NET Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni.',
};

export default function KVKKPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 bg-gradient-to-b from-[#f7eefa] to-white text-center">
                <p className="text-[#5d2b72] text-xs font-black uppercase tracking-widest mb-4">YASAL BİLGİLENDİRME</p>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">KVKK Aydınlatma Metni</h1>
                <p className="text-gray-500 max-w-xl mx-auto text-lg">
                    Kişisel verilerinizin korunması ve işlenmesine ilişkin süreçlerimiz hakkında detaylı bilgilendirme.
                </p>
                <p className="text-gray-400 text-sm mt-6">Son Güncelleme: 1 Mart 2026</p>
            </section>

            {/* Content Section */}
            <section className="pb-24 px-6">
                <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-16 shadow-2xl shadow-purple-900/5">
                    <div className="prose prose-purple max-w-none text-gray-600 leading-relaxed">

                        <div className="mb-12 text-center pb-8 border-b border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Weey.Net</h2>
                            <h3 className="text-lg font-bold text-gray-700 uppercase">KİŞİSEL VERİLERİN KORUNMASI KANUNU (KVKK) AYDINLATMA METNİ</h3>
                        </div>

                        <section className="mb-10">
                            <p className="mb-4"><strong>Veri Sorumlusu:</strong> Weey.Net</p>
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-7 h-7 rounded-lg flex items-center justify-center text-xs">1</span>
                                Veri Sorumlusu Hakkında
                            </h2>
                            <p>6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, kişisel verileriniz; veri sorumlusu sıfatıyla Weey.Net (“Platform”) tarafından aşağıda açıklanan kapsamda işlenebilecektir. Weey.Net, fotoğrafçılar ile müşterileri arasında dijital fotoğraf seçim sürecini sağlayan bir yazılım altyapısı hizmeti sunmaktadır.</p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-7 h-7 rounded-lg flex items-center justify-center text-xs">2</span>
                                İşlenen Kişisel Veriler
                            </h2>
                            <div className="space-y-6">
                                <div className="p-6 bg-gray-50 rounded-2xl">
                                    <h3 className="font-bold text-gray-900 mb-3">2.1. Fotoğrafçı (Üye) Verileri</h3>
                                    <p className="text-sm text-gray-500">Ad, soyad, firma bilgisi, telefon numarası, e-posta adresi, fatura ve ödeme bilgileri, IP adresi, kullanım ve işlem kayıtları.</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-2xl">
                                    <h3 className="font-bold text-gray-900 mb-3">2.2. Müşteri (Son Kullanıcı) Verileri</h3>
                                    <p className="text-sm text-gray-500">Kullanıcı adı, şifre (şifrelenmiş olarak), fotoğraf seçim bilgileri, IP adresi, oturum ve cihaz bilgileri.</p>
                                </div>
                                <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
                                    <h3 className="font-bold text-purple-900 mb-3">2.3. Platforma Yüklenen İçerikler</h3>
                                    <p className="text-sm text-purple-800 mb-4">Fotoğrafçılar tarafından sisteme yüklenen fotoğraflar, görseller ve albüm içerikleri.</p>
                                    <div className="p-4 bg-white/50 rounded-xl border border-purple-200">
                                        <p className="text-xs text-purple-900 font-bold leading-relaxed">
                                            ⚠️ Önemli: Platforma yüklenen fotoğraflar bakımından veri sorumluluğu, ilgili fotoğrafçıya aittir. Weey.Net bu içerikler üzerinde editoryal kontrol sağlamaz ve içeriklerin hukuka uygun elde edilip edilmediğini denetlemez.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-7 h-7 rounded-lg flex items-center justify-center text-xs">3</span>
                                Kişisel Verilerin İşlenme Amaçları
                            </h2>
                            <p className="text-sm mb-4">Toplanan kişisel veriler aşağıdaki amaçlarla işlenmektedir:</p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <li className="bg-gray-50 p-4 rounded-xl">• Üyelik süreçlerinin yürütülmesi</li>
                                <li className="bg-gray-50 p-4 rounded-xl">• Hizmetin sunulması ve sürdürülebilmesi</li>
                                <li className="bg-gray-50 p-4 rounded-xl">• Fotoğraf seçim sürecinin yönetilmesi</li>
                                <li className="bg-gray-50 p-4 rounded-xl">• Bildirim ve teknik destek</li>
                                <li className="bg-gray-50 p-4 rounded-xl">• Sistem güvenliğinin sağlanması</li>
                                <li className="bg-gray-50 p-4 rounded-xl">• Yasal yükümlülüklerin yerine getirilmesi</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-7 h-7 rounded-lg flex items-center justify-center text-xs">4</span>
                                Kişisel Verilerin Aktarılması
                            </h2>
                            <p className="text-sm mb-4">Kişisel verileriniz aşağıdaki durumlarda üçüncü kişilere aktarılabilir:</p>
                            <ul className="space-y-2 text-sm text-gray-500 mb-4">
                                <li>• Yasal zorunluluk halinde resmi kurum ve kuruluşlara</li>
                                <li>• Sunucu ve barındırma hizmeti sağlayıcılarına</li>
                                <li>• Ödeme altyapı sağlayıcılarına</li>
                                <li>• Hukuki danışmanlara (uyuşmazlık halinde)</li>
                            </ul>
                            <p className="text-sm font-black text-[#5d2b72] italic">Weey.Net, kişisel verileri ticari amaçla üçüncü kişilere satmaz veya kiralamaz.</p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-7 h-7 rounded-lg flex items-center justify-center text-xs">5</span>
                                Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi
                            </h2>
                            <p className="text-sm mb-3">Verileriniz web formları, uygulama girişleri, panel kullanımı, çerezler ve elektronik kanallar aracılığıyla toplanmaktadır. KVKK’nın 5. ve 6. maddeleri uyarınca;</p>
                            <ul className="list-disc pl-6 text-sm space-y-1">
                                <li>Sözleşmenin kurulması ve ifası</li>
                                <li>Hukuki yükümlülüğün yerine getirilmesi</li>
                                <li>Veri sorumlusunun meşru menfaati</li>
                                <li>Açık rıza</li>
                            </ul>
                            <p className="mt-2 text-xs italic">hukuki sebeplerine dayanılarak işlenmektedir.</p>
                        </section>

                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                            <div className="p-6 border border-gray-100 rounded-2xl">
                                <h3 className="font-black text-gray-900 mb-2">6. Veri Saklama Süresi</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">Kişisel veriler; üyelik süresi boyunca, hizmetin gerektirdiği süre kadar ve yasal zamanaşımı süreleri boyunca saklanır. Süre sonunda silinir veya anonim hale getirilir.</p>
                            </div>
                            <div className="p-6 border border-gray-100 rounded-2xl">
                                <h3 className="font-black text-gray-900 mb-2">7. Veri Güvenliği</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">Weey.Net makul teknik ve idari güvenlik önlemleri almaktadır. Kullanıcılar hesap güvenliğinden ve şifre gizliliğinden bizzat sorumludur.</p>
                            </div>
                        </div>

                        <section className="mb-10 p-6 bg-gray-900 rounded-[2rem] text-white">
                            <h2 className="text-xl font-black mb-4 uppercase tracking-tight">8. Fotoğraf İçeriklerine İlişkin Özel Açıklama</h2>
                            <p className="text-sm text-gray-400 mb-4">Platforma yüklenen fotoğraflar bakımından; ilgili kişilerin açık rızasının alınması, özel nitelikli verilerin işlenmesi ve çocuklara ait görsellerde yasal temsilci onayının alınması münhasıran <strong>ilgili fotoğrafçının</strong> sorumluluğundadır.</p>
                            <p className="text-xs text-gray-500 italic">Weey.Net yalnızca teknik altyapı sağlayıcıdır.</p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="bg-purple-100 text-[#5d2b72] w-7 h-7 rounded-lg flex items-center justify-center text-xs">9</span>
                                KVKK Kapsamındaki Haklarınız
                            </h2>
                            <p className="text-sm mb-4">KVKK’nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, amacını öğrenme, düzeltme, silme ve zarara uğramanız halinde tazminat talep etme haklarına sahipsiniz.</p>
                        </section>

                        <section className="mt-16 pt-10 border-t-2 border-purple-50">
                            <div className="p-10 bg-[#5d2b72] rounded-[3rem] text-center text-white">
                                <h2 className="text-2xl font-black mb-4">10. Başvuru Usulü</h2>
                                <p className="text-purple-200 text-sm mb-6 max-w-md mx-auto">Taleplerinizi kimlik doğrulaması yaparak aşağıdaki e-posta adresi üzerinden bizlere iletebilirsiniz.</p>
                                <div className="text-xl font-black text-white">📩 destek@weey.net</div>
                                <p className="text-xs text-purple-400 mt-4">Talepleriniz en geç 30 gün içinde sonuçlandırılır.</p>
                            </div>
                            <div className="mt-10 text-center">
                                <h3 className="text-sm font-black text-gray-900 mb-2">11. Değişiklik Hakkı</h3>
                                <p className="text-xs text-gray-500">Weey.Net, işbu Aydınlatma Metni üzerinde değişiklik yapma hakkını saklı tutar.</p>
                                <p className="mt-6 text-xs font-black text-[#5d2b72] uppercase tracking-widest leading-none">Weey.NET</p>
                            </div>
                        </section>

                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
