import { getPhotographer } from '@/lib/studioUtils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const photographer = await getPhotographer(slug);
    if (!photographer) return { title: 'Gizlilik Politikası' };
    return { title: `Gizlilik Politikası | ${photographer.studioName}` };
}

export default async function GizlilikPolitikasiPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const photographer = await getPhotographer(slug);

    if (!photographer) return notFound();

    const studioName = photographer.studioName || 'Stüdyo';
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-white text-gray-800">
            {/* Header */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Gizlilik Politikası</h1>
                    <p className="text-gray-300 text-sm">{studioName}</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 py-10 space-y-8 text-sm leading-relaxed">

                {/* Uygulama Bilgileri */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Uygulama Adı</p>
                            <p className="font-semibold text-gray-900">{studioName}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Geliştirici</p>
                            <p className="font-semibold text-gray-900">Armin Media</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Son Güncelleme</p>
                            <p className="font-semibold text-gray-900">{currentYear}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Platform</p>
                            <p className="font-semibold text-gray-900">iOS & Android & Web</p>
                        </div>
                    </div>
                </div>

                {/* Giriş */}
                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-3">1. Giriş</h2>
                    <p className="text-gray-600">
                        <strong>{studioName}</strong> olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası, mobil uygulamamız ve web platformumuz aracılığıyla toplanan kişisel verilerin nasıl işlendiğini, saklandığını ve korunduğunu açıklamaktadır. Uygulamamızı kullanarak bu politikayı kabul etmiş sayılırsınız.
                    </p>
                </section>

                {/* Toplanan Veriler */}
                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-3">2. Toplanan Kişisel Veriler</h2>
                    <p className="text-gray-600 mb-3">Uygulamamız aşağıdaki kişisel verileri toplayabilir:</p>
                    <ul className="space-y-2">
                        {[
                            'Ad, soyad ve iletişim bilgileri (telefon numarası, e-posta adresi)',
                            'Fotoğraf ve medya dosyaları (yalnızca kullanıcı onayıyla)',
                            'Cihaz bilgileri (model, işletim sistemi, uygulama sürümü)',
                            'Kullanım verileri (uygulama içi etkileşimler, tercihler)',
                            'Konum bilgisi (yalnızca açık izin verilmesi durumunda)',
                            'Çerez ve oturum bilgileri',
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Verilerin Kullanımı */}
                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-3">3. Verilerin Kullanım Amaçları</h2>
                    <p className="text-gray-600 mb-3">Toplanan veriler aşağıdaki amaçlarla kullanılmaktadır:</p>
                    <ul className="space-y-2">
                        {[
                            'Hizmetlerin sunulması ve iyileştirilmesi',
                            'Kullanıcı hesabının oluşturulması ve yönetilmesi',
                            'Fotoğraf galerisi ve seçim hizmetlerinin sağlanması',
                            'Müşteri desteği ve iletişim',
                            'Yasal yükümlülüklerin yerine getirilmesi',
                            'Güvenlik ve dolandırıcılık önleme',
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Veri Güvenliği */}
                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-3">4. Veri Güvenliği</h2>
                    <p className="text-gray-600">
                        Kişisel verilerinizin güvenliği için endüstri standardı güvenlik önlemleri uygulanmaktadır. Verileriniz SSL/TLS şifreleme ile iletilmekte, güvenli sunucularda saklanmakta ve yetkisiz erişime karşı korunmaktadır. Bununla birlikte, internet üzerinden hiçbir veri iletiminin %100 güvenli olmadığını belirtmek isteriz.
                    </p>
                </section>

                {/* Üçüncü Taraflar */}
                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-3">5. Üçüncü Taraflarla Veri Paylaşımı</h2>
                    <p className="text-gray-600 mb-3">
                        Kişisel verileriniz, aşağıdaki durumlar dışında üçüncü taraflarla paylaşılmaz:
                    </p>
                    <ul className="space-y-2">
                        {[
                            'Yasal zorunluluk veya mahkeme kararı bulunması',
                            'Hizmet sağlayıcılarımızla (bulut depolama, SMS servisi vb.) yalnızca gerekli ölçüde',
                            'Açık kullanıcı onayının alınması',
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Çerezler */}
                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-3">6. Çerezler ve İzleme Teknolojileri</h2>
                    <p className="text-gray-600">
                        Uygulamamız, kullanıcı deneyimini iyileştirmek amacıyla çerezler ve benzeri teknolojiler kullanmaktadır. Oturum çerezleri, giriş durumunuzu korumak için kullanılır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz; ancak bu durumda bazı özellikler çalışmayabilir.
                    </p>
                </section>

                {/* Kullanıcı Hakları */}
                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-3">7. Kullanıcı Hakları (KVKK)</h2>
                    <p className="text-gray-600 mb-3">
                        6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki haklara sahipsiniz:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
                            'İşlenen veriler hakkında bilgi talep etme',
                            'Verilerin işlenme amacını öğrenme',
                            'Yurt içi/dışı aktarım bilgisi alma',
                            'Eksik/yanlış verilerin düzeltilmesini isteme',
                            'Verilerin silinmesini talep etme',
                            'İşleme itiraz etme hakkı',
                            'Zararın tazminini talep etme',
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-2 text-gray-600 bg-gray-50 rounded-xl p-3">
                                <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                                <span className="text-xs">{item}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Veri Saklama */}
                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-3">8. Veri Saklama Süresi</h2>
                    <p className="text-gray-600">
                        Kişisel verileriniz, hizmet ilişkisi devam ettiği sürece ve yasal yükümlülükler kapsamında gerekli olan süre boyunca saklanmaktadır. Hesabınızı silmeniz durumunda verileriniz, yasal saklama süreleri saklı kalmak kaydıyla sistemden kaldırılır.
                    </p>
                </section>

                {/* Çocukların Gizliliği */}
                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-3">9. Çocukların Gizliliği</h2>
                    <p className="text-gray-600">
                        Uygulamamız 13 yaşın altındaki çocuklara yönelik değildir. 13 yaşın altındaki bireylerden bilerek kişisel veri toplamıyoruz. Ebeveyn veya vasi olarak çocuğunuzun veri paylaştığını fark ederseniz lütfen bizimle iletişime geçin.
                    </p>
                </section>

                {/* Politika Değişiklikleri */}
                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-3">10. Politika Değişiklikleri</h2>
                    <p className="text-gray-600">
                        Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler olması durumunda kullanıcılar uygulama içi bildirim veya e-posta yoluyla bilgilendirilecektir. Güncel politikayı bu sayfadan takip edebilirsiniz.
                    </p>
                </section>

                {/* İletişim */}
                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-3">11. İletişim</h2>
                    <p className="text-gray-600 mb-4">
                        Gizlilik politikamız hakkında sorularınız veya talepleriniz için aşağıdaki kanallardan bize ulaşabilirsiniz:
                    </p>
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-gray-500 w-24">Stüdyo</span>
                            <span className="text-sm font-medium text-gray-900">{studioName}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-gray-500 w-24">Geliştirici</span>
                            <span className="text-sm font-medium text-gray-900">Armin Media</span>
                        </div>
                        {photographer.phone && (
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-gray-500 w-24">Telefon</span>
                                <span className="text-sm font-medium text-gray-900">{photographer.phone}</span>
                            </div>
                        )}
                        {photographer.email && (
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-gray-500 w-24">E-posta</span>
                                <span className="text-sm font-medium text-gray-900">{photographer.email}</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <div className="text-center pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                        © {currentYear} {studioName} · Armin Media tarafından geliştirilmiştir
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Bu politika {currentYear} yılında güncellenmiştir.
                    </p>
                </div>
            </div>
        </div>
    );
}
