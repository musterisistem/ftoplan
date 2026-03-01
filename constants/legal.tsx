import React from 'react';

export const LEGAL_CONTENT = {
    privacy: (
        <div className="space-y-6 text-[15px] leading-relaxed text-slate-600">
            <div className="text-center border-b pb-8 mb-8">
                <h3 className="text-2xl font-black text-slate-900 block mb-2 leading-tight">WEEY.NET GİZLİLİK POLİTİKASI</h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Son Güncelleme Tarihi: 01.03.2026</p>
            </div>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">1. GİRİŞ</h4>
                <p>İşbu Gizlilik Politikası, Weey.Net (“Platform”) tarafından sunulan web sitesi, mobil uygulama ve panel hizmetleri kapsamında toplanan kişisel verilerin işlenmesine ilişkin usul ve esasları açıklamaktadır.</p>
                <p className="mt-3">Weey.Net, fotoğrafçılar ile müşterileri arasında fotoğraf seçimi sürecinin dijital ortamda yürütülmesini sağlayan bir yazılım altyapısı sunmaktadır. Weey.Net, yüklenen içeriklerin sahibi değildir ve içerik üzerinde editoryal kontrol sağlamaz.</p>
                <p className="mt-3">Platformu kullanan tüm kullanıcılar (fotoğrafçılar ve müşteriler), işbu Gizlilik Politikası’nı kabul etmiş sayılır.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">2. TOPLANAN VERİLER</h4>
                <p>Weey.Net aşağıdaki verileri toplayabilir:</p>
                <div className="mt-4 space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-tight">2.1 Fotoğrafçı (Üye) Bilgileri</p>
                        <ul className="text-sm space-y-1">
                            <li>• Ad / Soyad, Firma adı</li>
                            <li>• Telefon numarası, E-posta adresi</li>
                            <li>• Fatura bilgileri, IP adresi</li>
                            <li>• Panel kullanım verileri</li>
                        </ul>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-tight">2.2 Müşteri Bilgileri</p>
                        <ul className="text-sm space-y-1">
                            <li>• Kullanıcı adı, Şifre</li>
                            <li>• Fotoğraf seçim bilgileri, IP adresi</li>
                            <li>• Cihaz ve oturum bilgileri</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">3. KİŞİSEL VERİLERİN İŞLENME AMAÇLARI</h4>
                <p>Toplanan veriler aşağıdaki amaçlarla işlenir:</p>
                <ul className="mt-2 space-y-1 list-disc pl-5 text-sm">
                    <li>Hizmetin sunulması ve sürdürülebilmesi</li>
                    <li>Kullanıcı hesaplarının oluşturulması ve yönetilmesi</li>
                    <li>Fotoğraf seçim süreçlerinin yürütülmesi</li>
                    <li>Bildirim gönderimi (SMS, E-posta vb.)</li>
                    <li>Teknik destek sağlanması</li>
                    <li>Hizmet güvenliğinin sağlanması ve suistimallerin önlenmesi</li>
                    <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                </ul>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">4. VERİ GÜVENLİĞİ</h4>
                <p>Weey.Net, kişisel verilerin korunması için makul teknik ve idari tedbirleri almaktadır. Ancak internet üzerinden veri aktarımının %100 güvenli olduğu garanti edilemez. Kullanıcılar hesap şifrelerinin güvenliğinden kendileri sorumludur.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">5. VERİ PAYLAŞIMI</h4>
                <p>Weey.Net, kişisel verileri yasal zorunluluk hallerinde resmi makamlarla, hizmet sağlayıcı altyapı firmalarıyla (sunucu, SMS vb.) ve ödeme altyapı sağlayıcılarıyla sınırlı ölçüde paylaşabilir. Kullanıcı verileri üçüncü taraflara ticari amaçla satılmaz.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">6. İÇERİK SORUMLULUĞU</h4>
                <p>Platforma yüklenen tüm fotoğraf, görsel ve içeriklerden münhasıran ilgili fotoğrafçı sorumludur. Weey.Net, bu içeriklerin üçüncü kişilerin haklarını ihlal edip etmediğini denetlemez.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">7. VERİ SAKLAMA SÜRESİ</h4>
                <p>Kişisel veriler; üyelik süresi boyunca, yasal saklama yükümlülükleri çerçevesinde ve hizmetin gerektirdiği süre boyunca saklanır. Üyeliğin sona ermesi durumunda veriler silinir veya anonim hale getirilir.</p>
            </section>

            <section className="p-6 bg-slate-900 rounded-[2rem] text-white">
                <h4 className="font-bold mb-3 uppercase tracking-tighter text-purple-300">8. KVKK KAPSAMINDAKİ HAKLAR</h4>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">6698 sayılı Kanun kapsamında; verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltme veya silme haklarına sahipsiniz. Başvurularınızı şu adresten yapabilirsiniz:</p>
                <div className="h-12 w-fit px-6 bg-white/10 rounded-xl flex items-center gap-3 font-bold border border-white/10">
                    📩 destek@weey.net
                </div>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">9. ÇEREZ (COOKIE) KULLANIMI</h4>
                <p>Weey.Net, kullanıcı deneyimini geliştirmek için çerezler kullanabilir. Tarayıcı ayarlarından çerezleri engelleyebilirsiniz ancak bu durumda bazı fonksiyonlar çalışmayabilir.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">10. POLİTİKA DEĞİŞİKLİKLERİ</h4>
                <p>Weey.Net, işbu politikayı dilediği zaman güncelleyebilir. Güncel sürüm platformda yayınlandığı tarihte yürürlüğe girer.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">11. İLETİŞİM</h4>
                <p>Gizlilik Politikası ile ilgili sorularınız için destek@weey.net üzerinden bize ulaşabilirsiniz.</p>
            </section>
        </div>
    ),
    terms: (
        <div className="space-y-6 text-[15px] leading-relaxed text-slate-600">
            <div className="text-center border-b border-slate-100 pb-8 mb-8">
                <h3 className="text-2xl font-black text-slate-900 block mb-2 uppercase tracking-tighter">WEEY.NET KULLANIM ŞARTLARI</h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Son Güncelleme Tarihi: 01.03.2026</p>
            </div>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">1. TARAFLAR VE KAPSAM</h4>
                <p>1.1. İşbu Kullanım Şartları (“Sözleşme”), Weey.Net (“Platform”) ile Platform’a üye olan fotoğrafçılar (“Üye”) ve fotoğrafçı tarafından oluşturulan erişim bilgileri ile sisteme giriş yapan müşteriler (“Son Kullanıcı”) arasında akdedilmiştir.</p>
                <p className="mt-2 text-sm italic">1.2. Platformu kullanan herkes, işbu sözleşme hükümlerini okuduğunu, anladığını ve kabul ettiğini beyan eder.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">2. HİZMETİN TANIMI</h4>
                <p>Weey.Net; fotoğraf yükleme paneli, albüm oluşturma sistemi, müşteri için kullanıcı adı/şifre üretme, seçim takibi ve bildirim sistemi sağlayan bir yazılım hizmetidir. Platform yalnızca teknik altyapı sağlar; fotoğrafçılık hizmeti sunmaz.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">3. ÜYELİK VE HESAP SORUMLULUĞU</h4>
                <p>Üye, sisteme kayıt olurken verdiği bilgilerin doğru ve güncel olduğunu beyan eder. Hesap güvenliğinden ve şifre gizliliğinden münhasıran Üye sorumludur. Herhangi bir güvenlik ihlali durumunda Üye, Platform’a bildirimde bulunmakla yükümlüdür.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">4. İÇERİK YÜKLEME VE SORUMLULUK</h4>
                <p>Platforma yüklenen tüm fotoğraf, görsel, metin ve diğer içeriklerden münhasıran Üye sorumludur. Üye; yüklediği içeriklerin telif haklarına sahip olduğunu, içeriklerde yer alan kişilerin rızasını aldığını ve içeriklerin hukuka uygun olduğunu beyan eder. Weey.Net içeriklerin hukuka uygunluğunu denetlemez.</p>
            </section>

            <section className="p-5 bg-rose-50 border border-rose-100 rounded-2xl">
                <h4 className="font-bold text-rose-900 mb-2 uppercase text-xs tracking-widest">5. YASAKLI KULLANIMLAR</h4>
                <p className="text-xs text-rose-800 leading-relaxed">Sistemi hukuka aykırı amaçlarla kullanmak, telif ihlali yapmak, siber güvenlik tehditleri oluşturmak (virüs, hack vb.) ve sisteme zarar verecek tersine mühendislik eylemleri kesinlikle yasaktır. İhlal durumunda üyelik tek taraflı feshedilebilir.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">6. ÖDEME VE ABONELİK</h4>
                <p>Hizmet bedelleri, seçilen paket üzerinden tahsil edilir. Ödemeler kredi kartı veya havale/EFT yoluyla yapılabilir. Geciken ödemelerde hizmet askıya alınabilir.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">7. HİZMET SÜREKLİLİĞİ</h4>
                <p>Weey.Net, hizmetin kesintisiz ve hatasız olacağını garanti etmez. Planlı bakımlar veya mücbir sebeplerden kaynaklanan kesintilerden Platform sorumlu tutulamaz.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">8. KVKK VE GİZLİLİK</h4>
                <p>Taraflar, 6698 sayılı KVKK mevzuatına uygun hareket etmeyi kabul eder. Üye, müşterilerine ait verileri sisteme yüklerken yasal sorumluluğun kendisinde olduğunu kabul eder.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">9. FİKRİ MÜLKİYET</h4>
                <p>Platform’un yazılımı, tasarımı, logoları ve altyapısı Weey.Net’e aittir. İzinsiz kopyalanamaz, çoğaltılamaz veya ticari amaçla paylaşılamaz.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">10. SORUMLULUĞUN SINIRLANDIRILMASI</h4>
                <p>Weey.Net yalnızca teknik altyapı sağlayıcısıdır. Fotoğrafçı ile müşteri arasındaki ticari ilişkiden, hizmet kalitesinden veya ücret anlaşmazlıklarından hiçbir şekilde sorumlu değildir.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">11. SÖZLEŞMENİN FESHİ</h4>
                <p>Taraflar, dilediği zaman üyeliği sonlandırabilir. Ancak ödenmiş bedellerin iadesi ilgili paketin iade şartlarına tabidir.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">12. MÜCBİR SEBEPLER</h4>
                <p>Doğal afet, savaş, siber saldırı, internet altyapı arızaları gibi Platform’un kontrolü dışında gelişen olaylarda sorumluluk kabul edilmez.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">13. UYUŞMAZLIKLARIN ÇÖZÜMÜ</h4>
                <p>İşbu sözleşmeden doğan uyuşmazlıklarda İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir.</p>
            </section>

            <section>
                <h4 className="font-bold text-slate-900 mb-2">14. YÜRÜRLÜK</h4>
                <p>İşbu sözleşme, Üye’nin kayıt aşamasında onay vermesiyle birlikte süresiz olarak yürürlüğe girer.</p>
            </section>
        </div>
    ),
    kvkk: (
        <div className="space-y-6 text-[15px] leading-relaxed text-slate-600">
            <div className="text-center border-b pb-6">
                <h3 className="text-2xl font-black text-slate-900 uppercase">KVKK AYDINLATMA METNİ</h3>
                <p className="text-sm text-slate-400 mt-2 font-medium tracking-wide">VERİ SORUMLUSU: WEEY.NET — GÜNCELLEME: 01.03.2026</p>
            </div>

            <section>
                <h4 className="font-black text-slate-900 mb-3 text-lg">1. Veri Sorumlusu Hakkında</h4>
                <p>6698 sayılı KVKK uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla Weey.Net tarafından işlenebilecektir. Weey.Net bir yazılım altyapısı hizmeti sunmaktadır.</p>
            </section>

            <section>
                <h4 className="font-black text-slate-900 mb-4 text-lg underline decoration-purple-200">2. İşlenen Kişisel Veriler</h4>
                <div className="grid gap-3">
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="font-bold text-slate-800 text-sm">2.1. Fotoğrafçı (Üye) Verileri</p>
                        <p className="text-sm mt-1">Ad, soyad, firma bilgisi, telefon, e-posta, fatura bilgileri, IP adresi ve kullanım kayıtları.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="font-bold text-slate-800 text-sm">2.2. Müşteri (Son Kullanıcı) Verileri</p>
                        <p className="text-sm mt-1">Kullanıcı adı, şifre, seçim bilgileri, IP adresi ve cihaz bilgileri.</p>
                    </div>
                    <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                        <p className="font-bold text-purple-900 text-sm">2.3. Platforma Yüklenen İçerikler</p>
                        <p className="text-sm mt-1 italic text-purple-800">Fotoğraflar, görseller ve albüm içerikleri. Veri sorumluluğu fotoğrafçıya aittir.</p>
                    </div>
                </div>
            </section>

            <section>
                <h4 className="font-black text-slate-900 mb-3 text-lg">3. İşlenme Amaçları</h4>
                <p>Üyelik süreçleri, hizmet sunumu, fotoğraf seçim yönetimi, teknik destek ve yasal yükümlülükler doğrultusunda verileriniz işlenmektedir.</p>
            </section>

            <section className="p-6 bg-slate-900 text-white rounded-[2rem]">
                <h4 className="font-bold mb-3 uppercase tracking-tighter">9. KVKK Kapsamındaki Haklarınız</h4>
                <p className="text-sm text-slate-400 mb-4">Verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltme veya silme haklarınız için başvurabilirsiniz:</p>
                <div className="text-lg font-black text-purple-300 tracking-tight">📩 destek@weey.net</div>
            </section>
        </div>
    ),
    mss: (
        <div className="space-y-6 text-[15px] leading-relaxed text-slate-600">
            <div className="text-center border-b pb-6">
                <h3 className="text-2xl font-black text-slate-900 uppercase">MESAFELİ SATIŞ SÖZLEŞMESİ</h3>
                <p className="text-sm text-slate-400 mt-2 font-medium">Son Güncelleme Tarihi: 1 Mart 2026</p>
            </div>

            <section>
                <h4 className="font-black text-slate-900 mb-3 text-lg">1. Taraflar</h4>
                <p>İşbu Sözleşme; <strong>Weey.Net</strong> (“Hizmet Sağlayıcı”) ile <strong>Üye</strong> (Fotoğrafçı) arasında elektronik ortamda kurulmuştur.</p>
            </section>

            <section>
                <h4 className="font-black text-slate-900 mb-3 text-lg">2. Sözleşmenin Konusu</h4>
                <p>Dijital fotoğraf seçim ve müşteri yönetim yazılım hizmetinin Üye’ye elektronik ortamda sunulmasına ilişkin hak ve yükümlülüklerin belirlenmesidir.</p>
            </section>

            <section>
                <h4 className="font-black text-slate-900 mb-3 text-lg underline decoration-amber-200">6. Cayma Hakkı</h4>
                <p>Üye, hizmetin anında ifa edilmeye başlanacağını kabul eder. Üyelik aktivasyonu ile birlikte cayma hakkından feragat ettiğinizi kabul etmiş sayılırsınız (TKHK m.15/ğ).</p>
            </section>

            <section>
                <h4 className="font-black text-slate-900 mb-3 text-lg">7. Üyenin Beyan ve Taahhütleri</h4>
                <p>Üye, yüklediği içeriklerin telif haklarına sahip olduğunu, kişilerden rıza aldığını ve KVKK mevzuatına uygun hareket ettiğini beyan eder.</p>
            </section>

            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-slate-900 mb-2 text-sm uppercase">11. Fikri Mülkiyet</h4>
                <p className="text-xs">Platform yazılımı, tasarımı ve altyapısı Weey.Net’e aittir. Kopyalanamaz veya çoğaltılamaz.</p>
            </section>

            <div className="pt-8 border-t text-center text-[10px] text-slate-400 uppercase font-black tracking-widest">
                <p>Elektronik Ortamda Onaylandığı Anda Yürürlüğe Girer</p>
            </div>
        </div>
    )
};
