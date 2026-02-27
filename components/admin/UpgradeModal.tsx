'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, CheckCircle, Zap, HardDrive, Globe, CreditCard,
    Lock, Building, ArrowRight, ShieldCheck, Sparkles,
    Check, Star, Award, ChevronRight, Loader2
} from 'lucide-react';
import UpgradeSuccessFlow from './UpgradeSuccessFlow';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PACKAGES_DATA: Record<string, {
    name: string;
    price: string;
    code: string;
    accent: string;
    isPopular?: boolean;
    features: string[];
}> = {
    standart: {
        name: 'Standart Paket',
        price: '9.499 ₺',
        code: 'standart',
        accent: '#5d2b72',
        isPopular: false,
        features: [
            '10 GB Güvenli Bulut Arşivi',
            'Sınırsız Müşteri Kaydı & Yönetimi',
            'Sınırsız Fotoğraf Yükleme & Paylaşım',
            'Filigransız ve Şifreli Galeriler',
            'Görsel Fotoğraf Seçim Arayüzü',
            'Otomatik Boyut Optimizasyonu',
            'Randevu SMS & Mail Hatırlatıcılar',
            'Gelişmiş Gelir-Gider Takibi',
            'Dijital Sözleşme Altyapısı',
            'Mobil Uygulama Paneli'
        ]
    },
    kurumsal: {
        name: 'Kurumsal Paket',
        price: '19.999 ₺',
        code: 'kurumsal',
        accent: '#7b3ff2',
        isPopular: true,
        features: [
            '30 GB Genişletilebilir Depolama',
            'Profesyonel Web Sitesi',
            'Özel Alan Adı (domain.com)',
            'Kurumsal İş E-posta Adresi',
            'Markaya Özel Arayüz Tasarımı',
            '7/24 VIP Teknik Destek Hattı',
            'Ekip & Asistan Yetkilendirme',
            'İş Analizi & Performans Raporları',
            'Yapay Zeka Fotoğraf Tasnifleme',
            'Tüm Standart Özellikler'
        ]
    }
};

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    const { data: session, update } = useSession();
    const router = useRouter();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedPackage, setSelectedPackage] = useState<'standart' | 'kurumsal' | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cc' | 'transfer'>('cc');

    // Payment states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [ccName, setCcName] = useState('');
    const [ccNumber, setCcNumber] = useState('');
    const [ccExpiry, setCcExpiry] = useState('');
    const [ccCvv, setCcCvv] = useState('');

    if (!isOpen) return null;

    const handleSelectPackage = (pkg: 'standart' | 'kurumsal') => {
        setSelectedPackage(pkg);
        setStep(2);
    };

    const handleBack = () => {
        if (step === 2) setStep(1);
    };

    const handlePayment = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!selectedPackage) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/payment/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    packageCode: selectedPackage,
                    paymentMethod,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setStep(3);
                await update({
                    packageType: selectedPackage,
                    storageLimit: data.storageLimit || (selectedPackage === 'kurumsal' ? 32212254720 : 10737418240),
                    subscriptionExpiry: data.expiryDate
                });
            } else {
                setError(data.error || 'Ödeme işlemi başarısız oldu.');
            }
        } catch (err) {
            setError('Bir sunucu hatası oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md overflow-y-auto overflow-x-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.15)] relative overflow-hidden"
            >
                {/* Header Accents */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5d2b72] via-[#7b3ff2] to-indigo-600"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>

                {/* Close Button */}
                {step !== 3 && (
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-all z-20 hover:rotate-90"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                <div className="p-8 sm:p-12 relative z-10">
                    <AnimatePresence mode="wait">
                        {/* --- STEP 1: PACKAGE SELECTION --- */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="text-center max-w-lg mx-auto">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-[#5d2b72] text-[10px] font-black uppercase tracking-widest mb-4">
                                        <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Paketini Yükselt
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">İşinizi Büyütmenin En Kolay Yolu</h2>
                                    <p className="text-slate-500 font-medium mt-3">Saniyeler içinde paketinizi yükseltin ve tüm profesyonel özelliklerin kilidini açın.</p>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                                    {Object.values(PACKAGES_DATA).map((pkg) => (
                                        <div
                                            key={pkg.code}
                                            onClick={() => handleSelectPackage(pkg.code as any)}
                                            className={`group relative flex flex-col bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-500 cursor-pointer overflow-hidden
                                                ${pkg.isPopular
                                                    ? 'border-[#7b3ff2] shadow-[0_20px_60px_-15px_rgba(123,63,242,0.15)] ring-1 ring-[#7b3ff2]/20'
                                                    : 'border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1'}`}
                                        >
                                            {pkg.isPopular && (
                                                <div className="absolute top-0 right-0 pt-4 pr-4">
                                                    <span className="bg-[#7b3ff2] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-purple-500/20">
                                                        Elite
                                                    </span>
                                                </div>
                                            )}

                                            <div className="mb-8">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-6 transition-transform duration-500 bg-gradient-to-br ${pkg.code === 'kurumsal' ? 'from-[#7b3ff2] to-indigo-600' : 'from-[#5d2b72] to-purple-600'} text-white`}>
                                                    {pkg.code === 'kurumsal' ? <Award className="w-7 h-7" /> : <Zap className="w-7 h-7" />}
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 group-hover:text-[#5d2b72] transition-colors">{pkg.name}</h3>
                                                <div className="flex items-baseline gap-1 mt-2">
                                                    <span className="text-4xl font-black text-slate-900 tracking-tight">{pkg.price}</span>
                                                    <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">/ Yıl</span>
                                                </div>
                                            </div>

                                            <ul className="space-y-3.5 mb-10 flex-1">
                                                {pkg.features.map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className={`mt-1 h-5 w-5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:border-purple-200 transition-colors`}>
                                                            <Check className={`w-3 h-3 ${pkg.code === 'kurumsal' ? 'text-[#7b3ff2]' : 'text-[#5d2b72]'} stroke-[4]`} />
                                                        </div>
                                                        <span className="text-sm font-semibold text-slate-600 leading-tight">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <button className={`w-full py-4 rounded-2xl font-black text-[15px] flex items-center justify-center gap-2 transition-all group-active:scale-95
                                                ${pkg.code === 'kurumsal'
                                                    ? 'bg-[#7b3ff2] text-white shadow-[0_12px_24px_-8px_rgba(123,63,242,0.4)] hover:shadow-[0_16px_32px_-8px_rgba(123,63,242,0.5)]'
                                                    : 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800'}`}>
                                                Seç ve İlerle <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* --- STEP 2: CHECKOUT --- */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <button
                                    onClick={handleBack}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors mb-10 group"
                                >
                                    <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Geri Dön
                                </button>

                                <div className="grid lg:grid-cols-5 gap-12">
                                    {/* Checkout Form */}
                                    <div className="lg:col-span-3">
                                        <div className="flex gap-4 mb-8">
                                            <button
                                                onClick={() => setPaymentMethod('cc')}
                                                className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 border-2 transition-all
                                                    ${paymentMethod === 'cc'
                                                        ? 'border-[#7b3ff2] bg-purple-50/50 text-[#7b3ff2]'
                                                        : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                            >
                                                <CreditCard className="w-5 h-5" /> Kredi Kartı
                                            </button>
                                            <button
                                                onClick={() => setPaymentMethod('transfer')}
                                                className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 border-2 transition-all
                                                    ${paymentMethod === 'transfer'
                                                        ? 'border-[#7b3ff2] bg-purple-50/50 text-[#7b3ff2]'
                                                        : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                            >
                                                <Building className="w-5 h-5" /> Havale / EFT
                                            </button>
                                        </div>

                                        {error && (
                                            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-[13px] font-bold">
                                                <X className="w-4 h-4 shrink-0" /> {error}
                                            </div>
                                        )}

                                        {paymentMethod === 'cc' ? (
                                            <form onSubmit={handlePayment} className="space-y-5">
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-black text-slate-400 tracking-wider uppercase ml-1">KART ÜZERİNDEKİ İSİM</label>
                                                    <input type="text" required value={ccName} onChange={(e) => setCcName(e.target.value.toUpperCase())} className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-50 focus:border-[#7b3ff2]/20 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900" placeholder="AD SOYAD" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-black text-slate-400 tracking-wider uppercase ml-1">KART NUMARASI</label>
                                                    <div className="relative">
                                                        <input type="text" required maxLength={19} value={ccNumber} onChange={(e) => setCcNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} className="w-full h-14 pl-14 pr-5 bg-slate-50 border-2 border-slate-50 focus:border-[#7b3ff2]/20 focus:bg-white rounded-2xl outline-none transition-all font-mono font-bold text-slate-900" placeholder="0000 0000 0000 0000" />
                                                        <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-5">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[11px] font-black text-slate-400 tracking-wider uppercase ml-1">SON KULLANMA</label>
                                                        <input type="text" required maxLength={5} value={ccExpiry} onChange={(e) => {
                                                            let val = e.target.value.replace(/\D/g, '');
                                                            if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                                            setCcExpiry(val);
                                                        }} className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-50 focus:border-[#7b3ff2]/20 focus:bg-white rounded-2xl outline-none transition-all font-mono font-bold text-slate-900 text-center" placeholder="AA/YY" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[11px] font-black text-slate-400 tracking-wider uppercase ml-1">CVV / CVC</label>
                                                        <input type="text" required maxLength={3} value={ccCvv} onChange={(e) => setCcCvv(e.target.value.replace(/\D/g, ''))} className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-50 focus:border-[#7b3ff2]/20 focus:bg-white rounded-2xl outline-none transition-all font-mono font-bold text-slate-900 text-center" placeholder="•••" />
                                                    </div>
                                                </div>
                                                <button type="submit" disabled={loading} className="w-full h-16 mt-6 bg-slate-900 hover:bg-black text-white font-black text-[16px] rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70">
                                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Ödemeyi Tamamla</>}
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-[1.5rem] flex items-start gap-4">
                                                    <Building className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
                                                    <p className="text-sm font-semibold text-indigo-900 leading-relaxed">
                                                        Banka havalesi ile ödeme yaparken açıklama kısmına <strong>işyeri adınızı</strong> yazmayı unutmayın. Yönetim ekibi onayladığında paketiniz aktif edilecektir.
                                                    </p>
                                                </div>
                                                <div className="p-6 bg-slate-50 rounded-[1.5rem] space-y-4">
                                                    <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                                                        <span className="text-xs font-black text-slate-400 tracking-widest uppercase">BANKA</span>
                                                        <span className="text-sm font-black text-slate-900">Garanti BBVA</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                                                        <span className="text-xs font-black text-slate-400 tracking-widest uppercase">ALICI</span>
                                                        <span className="text-sm font-black text-slate-900">Weey Yazılım A.Ş.</span>
                                                    </div>
                                                    <div className="flex flex-col gap-2 py-2">
                                                        <span className="text-xs font-black text-slate-400 tracking-widest uppercase text-center w-full">IBAN ADRESİ</span>
                                                        <span className="text-[17px] font-black text-slate-900 font-mono tracking-tight bg-white p-4 rounded-xl shadow-sm text-center border border-slate-100">
                                                            TR12 0006 2000 0001 2345 6789 01
                                                        </span>
                                                    </div>
                                                </div>
                                                <button onClick={() => handlePayment()} disabled={loading} className="w-full h-16 bg-[#7b3ff2] hover:bg-[#6A32DE] text-white font-black text-[16px] rounded-2xl shadow-xl shadow-purple-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Havale Bildirimi Yap <ArrowRight className="w-5 h-5" /></>}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Summary */}
                                    <div className="lg:col-span-2">
                                        <div className="bg-slate-50 rounded-[2.5rem] p-8 h-full sticky top-0 border border-slate-100">
                                            <h4 className="text-[11px] font-black text-slate-400 tracking-widest uppercase mb-6 flex items-center gap-2">
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> SİPARİŞ ÖZETİ
                                            </h4>

                                            <div className="mb-8">
                                                <p className="text-2xl font-black text-slate-900 mb-1">{PACKAGES_DATA[selectedPackage!].name}</p>
                                                <p className="text-sm font-bold text-[#7b3ff2] uppercase tracking-wide">Yıllık Lisans</p>
                                            </div>

                                            <div className="space-y-4 mb-10">
                                                {PACKAGES_DATA[selectedPackage!].features.slice(0, 5).map((f, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-[13px] font-bold text-slate-500">
                                                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> {f}
                                                    </div>
                                                ))}
                                                <div className="pt-2 text-[12px] font-black text-[#7b3ff2] flex items-center gap-1.5 cursor-help group">
                                                    + {PACKAGES_DATA[selectedPackage!].features.length - 5} Diğer Özellik <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-slate-200 space-y-4">
                                                <div className="flex justify-between items-center text-slate-500 font-bold">
                                                    <span>Ara Toplam</span>
                                                    <span>{PACKAGES_DATA[selectedPackage!].price}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-slate-900 font-black text-xl pt-2">
                                                    <span>Ödenecek</span>
                                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-900 tracking-tight">
                                                        {PACKAGES_DATA[selectedPackage!].price}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- STEP 3: SUCCESS --- */}
                        {step === 3 && selectedPackage && (
                            <UpgradeSuccessFlow
                                packageName={PACKAGES_DATA[selectedPackage].name}
                                isModal={true}
                                onComplete={() => {
                                    onClose();
                                    router.refresh();
                                }}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
