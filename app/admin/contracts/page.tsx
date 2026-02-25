'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useAlert } from '@/context/AlertContext';
import {
    FileText,
    Save,
    Download,
    History,
    AlertCircle,
    CheckCircle2,
    Camera,
    Video as VideoIcon,
    Printer,
    RefreshCw,
    Sparkles,
    Trash2
} from 'lucide-react';

const OUTDOOR_CONTRACT_DEFAULT = `1. TARAFLAR VE KONU
İşbu sözleşme, {{STUDIO_NAME}} (Hizmet Sağlayıcı) ile Müşteri arasında, aşağıda detayları belirtilen dış mekan fotoğraf çekimi hizmeti hususunda akdedilmiştir.

2. ÖDEME KOŞULLARI
• Paket dahilinde kalan ödeme miktarı, fotoğraf çekiminin gerçekleştirileceği gün, çekim başlamadan önce nakit olarak elden teslim edilecektir.
• Mücbir sebepler dışında ödeme yapılmadan çekim hizmeti başlatılmayacaktır.

3. HAVA KOŞULLARI VE ERTELEME
• Çekim günü hava şartlarının hizmet vermeye elverişsiz olması (yoğun yağış, fırtına vb.) durumunda, tarafların karşılıklı mutabakatı ile çekim kapalı bir mekana alınabilir veya ileri bir tarihe ertelenebilir.
• Erteleme yapılması durumunda, Hizmet Sağlayıcı ve Müşteri'nin ortaklaşa belirleyeceği, takvimin uygun olduğu yeni bir tarihte çekim gerçekleştirilecektir.

4. MEKAN VE EKSTRA GİDERLER
• Tercih edilen çekim mekanının (müze, milli park, özel işletme vb.) talep edebileceği her türlü giriş, kullanım, otopark veya izin ücreti Müşteri'ye aittir.
• Çekim esnasında talep edilen ekstra hizmetler (özel aksesuar kullanımı, binek hayvan kiralama, kayık, platform vb.) Müşteri tarafından karşılanacaktır.

5. İPTAL VE İADE KOŞULLARI
• Müşterinin çekimden vazgeçmesi veya tek taraflı iptal etmesi durumunda, ön ödeme (kaparo) iadesi talep edilemez ve yapılmaz. Hizmet Sağlayıcı, ayrılan gün ve saat için uğradığı gelir kaybını kaparo ile tazmin eder.

6. ÇEKİM SÜRESİ VE GECİKME
• Standart fotoğraf çekim süresi 2 (iki) saattir.
• Çekim günü kararlaştırılan randevu saatine Müşteri'nin geç kalması durumunda, geç kalınan süre toplam çekim süresinden düşülecektir. Hizmet Sağlayıcı'nın sonraki randevularını aksatmamak adına çekim bitiş saati esnetilemez.

7. TESLİMAT VE SEÇİM SÜRECİ
• Fotoğraf çekiminden 3 (üç) hafta sonra Müşteri'ye iletilecek dijital panel erişim bilgileri (kullanıcı adı ve şifre) ile fotoğraf seçimi yapılabilecektir.
• Müşteri tarafından fotoğraf seçiminin tamamlandığı tarihten itibaren 4 (dört) hafta içerisinde albüm ve ürün teslimatı yapılacaktır.

8. YETKİLİ MAHKEME
İşbu sözleşmeden doğabilecek uyuşmazlıklarda yerel mahkemeler ve icra daireleri yetkilidir.`;

const VIDEO_CONTRACT_DEFAULT = `1. TARAFLAR VE KONU
İşbu sözleşme, {{STUDIO_NAME}} (Hizmet Sağlayıcı) ile Müşteri arasında, aşağıda detayları belirtilen video prodüksiyon ve klip çekimi hizmeti hususunda akdedilmiştir.

2. HİZMET KAPSAMI
• Hizmet Sağlayıcı, anlaşılan paket içeriğine uygun olarak (Drone çekimi, 4K/1080p çözünürlük, aktüel kamera vb.) video çekim hizmetini gerçekleştirecektir.
• Kurgu ve montaj stili (Sinematik, Belgesel, Teaser vb.), çekim öncesinde Müşteri talepleri doğrultusunda belirlenir.

3. TESLİMAT VE REVİZYON
• Video kurgu işlemleri, çekim tarihinden itibaren en geç 5 (beş) hafta içerisinde tamamlanarak dijital ortamda ön izlemeye sunulur.
• Müşteri'nin kurgu üzerinde 2 (iki) kez revizyon talep etme hakkı saklıdır. Bu sayıyı aşan veya kurgunun baştan yapılmasını gerektirecek köklü değişiklik talepleri ek ücrete tabidir.
• Ham görüntüler (Raw footage), aksi yazılı olarak kararlaştırılmadıkça teslim edilmez. Sadece işlenmiş son ürün teslim edilir.

4. MÜZİK VE TELİF
• Videoda kullanılacak müzikler, telif hakları sorunları yaşamamak adına lisanslı kütüphanelerden veya telifsiz kaynaklardan seçilir.
• Müşteri'nin özel bir müzik talep etmesi durumunda, ilgili eserin telif hakkı sorumluluğu ve olası platform engellemeleri (YouTube, Instagram vb.) Müşteri'ye aittir.

5. TEKNİK AKSAKLIKLAR VE MÜCBİR SEBEPLER
• Hizmet Sağlayıcı'nın kontrolü dışındaki teknik arızalar (veri kaybı, ekipman çalınması vb.) veya mücbir sebepler (afet, kaza vb.) nedeniyle hizmetin tamamlanamaması durumunda, alınan ödemenin tamamı Müşteri'ye iade edilir. Hizmet Sağlayıcı'nın sorumluluğu iade bedeli ile sınırlıdır.

6. ÖDEME VE İPTAL
• Video hizmet bedelinin kalan kısmı, çekim günü işe başlamadan önce nakit olarak tahsil edilir.
• Müşteri tarafından yapılan iptallerde kaparo iadesi yapılmaz.

7. YETKİLİ MAHKEME
İşbu sözleşmeden doğabilecek uyuşmazlıklarda yerel mahkemeler ve icra daireleri yetkilidir.`;

export default function ContractsPage() {
    const { data: session } = useSession();
    const { showAlert } = useAlert();
    const [contracts, setContracts] = useState<any[]>([]);
    const [selectedContractId, setSelectedContractId] = useState<string | 'new' | null>(null);
    const [editData, setEditData] = useState({ name: '', type: 'outdoor', content: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const cleanContractContent = (content: string) => {
        const studioName = session?.user?.studioName || 'Fotoğraf Stüdyosu';
        return content
            .replace(/{{STUDIO_NAME}}/gi, studioName)
            .replace(/Kadraj\s*Panel/gi, studioName)
            .replace(/Weey.NET/gi, studioName)
            .replace(/weey-net/gi, studioName)
            .replace(/Weey\.NET/gi, studioName)
            .replace(/Foto\s*Plan/gi, studioName)
            .replace(/Hizmet\s*Sağlayıcı/gi, studioName);
    };

    const getOutdoorDefault = () => {
        const studioName = session?.user?.studioName || 'Fotoğraf Stüdyosu';
        return OUTDOOR_CONTRACT_DEFAULT.replace('{{STUDIO_NAME}}', studioName);
    };

    const getVideoDefault = () => {
        const studioName = session?.user?.studioName || 'Fotoğraf Stüdyosu';
        return VIDEO_CONTRACT_DEFAULT.replace('{{STUDIO_NAME}}', studioName);
    };

    // Inject global print CSS to hide sidebar/header during printing
    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'contract-print-style';
        style.innerHTML = `
            @page {
                size: A4 portrait;
                margin: 1.5cm 1.8cm;
            }
            @media print {
                /* Nuclear option: hide EVERYTHING, then only show our template */
                body * {
                    visibility: hidden !important;
                    background: transparent !important;
                }
                body {
                    background: white !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                /* Show ONLY the print template and all its children */
                .contract-print-template,
                .contract-print-template * {
                    visibility: visible !important;
                }
                /* Position the template so content flows across multiple pages */
                .contract-print-template {
                    display: block !important;
                    position: static !important;
                    width: 100% !important;
                    background: white !important;
                    color: #1e293b !important;
                    padding: 0 !important;
                    margin: 0 !important;
                }
            }
        `;
        document.head.appendChild(style);
        return () => {
            const el = document.getElementById('contract-print-style');
            if (el) el.remove();
        };
    }, []);

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            const res = await fetch('/api/contracts');
            if (res.ok) {
                let data = await res.json();

                // If DB is empty, seed defaults as requested by user
                if (data.length === 0) {
                    const defaults = [
                        { name: 'Dış Çekim Sözleşmesi', type: 'outdoor', content: getOutdoorDefault(), isActive: true },
                        { name: 'Video Çekim Sözleşmesi', type: 'video', content: getVideoDefault(), isActive: true }
                    ];

                    for (const def of defaults) {
                        await fetch('/api/contracts', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(def)
                        });
                    }

                    // Re-fetch after seeding to get IDs and timestamps
                    const reRes = await fetch('/api/contracts');
                    if (reRes.ok) {
                        data = await reRes.json();
                    }
                }

                setContracts(data);
                if (data.length > 0 && !selectedContractId) {
                    setSelectedContractId(data[0]._id);
                    setEditData({
                        name: data[0].name,
                        type: data[0].type,
                        content: cleanContractContent(data[0].content)
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch contracts:', error);
        }
    };

    useEffect(() => {
        if (selectedContractId === 'new') {
            setEditData({ name: 'Yeni Sözleşme', type: 'outdoor', content: '' });
        } else if (selectedContractId) {
            const contract = contracts.find(c => c._id === selectedContractId);
            if (contract) {
                setEditData({
                    name: contract.name,
                    type: contract.type,
                    content: cleanContractContent(contract.content)
                });
                setLastSaved(new Date(contract.updatedAt));
            }
        }
    }, [selectedContractId, contracts, session]);

    const handleSave = async () => {
        if (!editData.name || !editData.content) {
            showAlert('Lütfen isim ve içerik alanlarını doldurun', 'warning');
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                ...editData,
                _id: selectedContractId === 'new' ? undefined : selectedContractId
            };

            const res = await fetch('/api/contracts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const saved = await res.json();
                showAlert('Sözleşme başarıyla kaydedildi', 'success');
                setLastSaved(new Date());
                await fetchContracts();
                setSelectedContractId(saved._id);
            } else {
                showAlert('Kaydedilemedi!', 'error');
            }
        } catch (error) {
            showAlert('Hata oluştu', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (selectedContractId === 'new' || !selectedContractId) return;

        if (!confirm('Bu sözleşmeyi silmek istediğinize emin misiniz?')) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/contracts/${selectedContractId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                showAlert('Sözleşme başarıyla silindi', 'success');
                setSelectedContractId(null);
                await fetchContracts();
            } else {
                showAlert('Silinemedi!', 'error');
            }
        } catch (error) {
            showAlert('Hata oluştu', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleReset = () => {
        if (confirm('Sözleşme metnini varsayılan fabrika ayarlarına döndürmek istediğinize emin misiniz?')) {
            if (editData.type === 'outdoor') setEditData(prev => ({ ...prev, content: getOutdoorDefault() }));
            else setEditData(prev => ({ ...prev, content: getVideoDefault() }));
        }
    };

    const handlePrint = () => {
        if (!editData.content) {
            showAlert('Yazdırılacak içerik bulunamadı', 'warning');
            return;
        }
        window.print();
    };

    return (
        <div className="p-6 md:p-8 max-w-[1920px] mx-auto space-y-6 print:p-0 print:m-0">
            {/* Print Only Content - shown only during printing */}
            <div className="contract-print-template" style={{ display: 'none' }}>
                {/* Header / Letterhead */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-10">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">{session?.user?.studioName || 'Fotoğraf Stüdyosu'}</h1>
                        <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Hizmet Sözleşmesi</p>
                    </div>
                    <div className="text-right text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
                        <p>Belge No: {selectedContractId?.substring(0, 8).toUpperCase()}</p>
                        <p>Tarih: {new Date().toLocaleDateString('tr-TR')}</p>
                    </div>
                </div>

                {/* Contract Title */}
                <div className="text-center mb-12">
                    <h2 className="text-xl font-bold uppercase tracking-[0.2em] border-y border-slate-200 py-3">{editData.name}</h2>
                </div>

                {/* Main Content */}
                <div className="whitespace-pre-wrap text-sm leading-loose text-justify mb-20 px-4">
                    {editData.content}
                </div>

                {/* Signature Section */}
                <div className="grid grid-cols-2 gap-20 px-4 mt-auto pt-10">
                    {/* Photographer Side */}
                    <div className="flex flex-col items-center border-t border-slate-200 pt-6">
                        <p className="text-[10px] uppercase tracking-widest mb-1 text-slate-400 font-bold">Hizmet Sağlayıcı</p>
                        <p className="text-sm font-black mb-8">{session?.user?.studioName || 'Fotoğrafçı Adı / Firma'}</p>
                        <div className="w-40 h-24 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center">
                            <span className="text-[8px] uppercase tracking-widest text-slate-300 font-bold">Kaşe / İmza</span>
                        </div>
                    </div>

                    {/* Customer Side */}
                    <div className="flex flex-col items-center border-t border-slate-200 pt-6">
                        <p className="text-[10px] uppercase tracking-widest mb-1 text-slate-400 font-bold">Alıcı / Müşteri</p>
                        <p className="text-sm font-black mb-8">Müşteri Adı Soyadı</p>
                        <div className="w-40 h-24 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center">
                            <span className="text-[8px] uppercase tracking-widest text-slate-300 font-bold">İmza</span>
                        </div>
                    </div>
                </div>

                {/* Footer note - below signatures */}
                <div className="mt-10 pt-6 border-t border-slate-100 text-center">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        Bu belge {session?.user?.studioName || 'stüdyo'} tarafından elektronik ortamda oluşturulmuştur.
                    </p>
                </div>
            </div>

            {/* UI Content - Hidden during print */}
            <div className="print:hidden space-y-6">
                <div className="py-2 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900">Çekim Sözleşmeleri</h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">Müşterilerinize onaylatacağınız hizmet sözleşmelerini buradan yönetin.</p>
                    </div>
                    <button
                        onClick={() => setSelectedContractId('new')}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:-translate-y-0.5"
                    >
                        <Save className="w-4 h-4 rotate-45" />
                        Yeni Sözleşme Ekle
                    </button>
                </div>

                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Left Sidebar: List */}
                    <div className="w-full xl:w-72 flex-shrink-0 space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5" />
                            Kayıtlı Sözleşmeler
                        </h3>
                        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {contracts.map((contract) => (
                                <button
                                    key={contract._id}
                                    onClick={() => setSelectedContractId(contract._id)}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all group ${selectedContractId === contract._id
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                                        : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${selectedContractId === contract._id ? 'bg-white/20' : 'bg-slate-100'}`}>
                                            {contract.type === 'outdoor' ? <Camera className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold truncate">{contract.name}</p>
                                            <p className={`text-[10px] ${selectedContractId === contract._id ? 'text-indigo-100' : 'text-slate-400'}`}>
                                                {contract.type === 'outdoor' ? 'Dış Çekim' : contract.type === 'video' ? 'Video Çekim' : 'Özel'}
                                            </p>
                                        </div>
                                        {selectedContractId === contract._id && <CheckCircle2 className="w-3.5 h-3.5 text-white/60" />}
                                    </div>
                                </button>
                            ))}
                            {contracts.length === 0 && (
                                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-xs font-medium text-slate-400">Henüz sözleşme yok</p>
                                </div>
                            )}
                        </div>

                        {/* Information Box - Variables */}
                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 space-y-3">
                            <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-2 uppercase tracking-wide">
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                Değişken Kullanımı
                            </h4>
                            <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                                Metin içerisinde <code className="bg-white/60 px-1 rounded text-indigo-900 font-bold">{"{{STUDIO_NAME}}"}</code> ifadesini kullanırsanız, bu alan otomatik olarak stüdyo adınızla değiştirilecektir.
                            </p>
                        </div>
                    </div>

                    {/* Center: Editor */}
                    <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col min-h-[700px]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-white/40 bg-white/40 gap-4">
                            <div className="flex flex-col md:flex-row gap-4 flex-1">
                                <div className="relative flex-1">
                                    <label className="absolute -top-1.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Sözleşme Adı</label>
                                    <input
                                        type="text"
                                        value={editData.name}
                                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full bg-slate-100/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="Örn: Wedding 2024"
                                    />
                                </div>
                                <div className="relative w-full md:w-48">
                                    <label className="absolute -top-1.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Tür</label>
                                    <select
                                        value={editData.type}
                                        onChange={(e) => setEditData(prev => ({ ...prev, type: e.target.value as any }))}
                                        className="w-full bg-slate-100/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    >
                                        <option value="outdoor">Dış Çekim</option>
                                        <option value="video">Video Çekim</option>
                                        <option value="custom">Özel Sözleşme</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrint}
                                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
                                    title="PDF Çıktısı Al / Yazdır"
                                >
                                    <Printer className="w-5 h-5" />
                                </button>
                                <div className="h-8 w-px bg-slate-200 mx-1"></div>
                                {(editData.type === 'outdoor' || editData.type === 'video') && (
                                    <button
                                        onClick={handleReset}
                                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                                        title="Fabrika Ayarlarına Dön"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                )}
                                {selectedContractId !== 'new' && selectedContractId && (
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                                        title="Sözleşmeyi Sil"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Kaydediliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            {selectedContractId === 'new' ? 'Oluştur' : 'Kaydet'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 p-0 relative group">
                            <textarea
                                value={editData.content}
                                onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                                className="w-full h-full p-8 text-sm leading-relaxed text-slate-700 focus:outline-none resize-none font-mono bg-white/50 focus:bg-white transition-colors custom-scrollbar"
                                placeholder="Sözleşme metnini buraya giriniz..."
                            />
                            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-2xl text-xs font-bold text-slate-600 shadow-lg flex items-center gap-2.5">
                                <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${isSaving ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}></div>
                                {lastSaved ? `Son kayıt: ${lastSaved.toLocaleTimeString()}` : 'Kaydedilmedi'}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar: Tips & Help */}
                    <div className="w-full xl:w-80 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                Önemli Bilgiler
                            </h4>
                            <div className="space-y-4">
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                    <p className="text-xs font-bold text-slate-700">📜 Hukuki Geçerlilik</p>
                                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Sözleşme metinleri müşteri ve stüdyo arasındaki hukuki bağı kurar. Lütfen maddelerin eksiksiz olduğundan emin olun.</p>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                    <p className="text-xs font-bold text-slate-700">💾 Otomatik Atama</p>
                                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Burada düzenlediğiniz sözleşmeler, yeni randevu oluşturulurken listede en güncel haliyle karşınıza çıkacaktır.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
                            <h4 className="text-xs font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                                <RefreshCw className="w-3 h-3" />
                                Hızlı İpuçları
                            </h4>
                            <ul className="space-y-3">
                                <li className="flex gap-3">
                                    <span className="text-indigo-400 font-bold">•</span>
                                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">Yeni bir sözleşme oluşturmak için sağ üstteki butonu kullanın.</p>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-indigo-400 font-bold">•</span>
                                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">Reset ikonu ile sözleşmeyi ilk (fabrika) ayarlarına döndürebilirsiniz.</p>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-indigo-400 font-bold">•</span>
                                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">Değişikliklerin geçerli olması için mutlaka "Kaydet" butonuna basmalısınız.</p>
                                </li>
                            </ul>
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Printer className="w-4 h-4 text-amber-700" />
                                </div>
                                <p className="text-xs font-bold text-amber-900">PDF Çıktısı</p>
                            </div>
                            <p className="text-[10px] text-amber-700 leading-relaxed font-medium">Sözleşmeler müşterileriniz tarafından dijital olarak onaylanabilir veya PDF olarak çıktı alınabilir.</p>
                            <button
                                onClick={handlePrint}
                                className="w-full mt-3 py-2 bg-white hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                Hemen Yazdır
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
