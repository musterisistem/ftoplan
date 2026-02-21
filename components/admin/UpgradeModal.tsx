'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { X, CheckCircle, Zap, HardDrive, Globe, CreditCard, Lock, Building, ArrowRight } from 'lucide-react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PACKAGES = {
    standart: { name: 'Standart Paket', price: '4.999 ₺', code: 'standart' },
    kurumsal: { name: 'Kurumsal Paket', price: '9.999 ₺', code: 'kurumsal' }
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

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
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
                // Update session to reflect new package and limits
                await update({
                    packageType: selectedPackage,
                    storageLimit: data.storageLimit || (selectedPackage === 'kurumsal' ? 32212254720 : 10737418240),
                    subscriptionExpiry: data.expiryDate
                });

                setTimeout(() => {
                    onClose();
                    router.refresh();
                }, 3000);
            } else {
                setError(data.error || 'Ödeme işlemi başarısız oldu.');
            }
        } catch (err) {
            setError('Bir sunucu hatası oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 1: PACKAGE SELECTION ---
    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                    <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Paketinizi Yükseltin</h2>
                <p className="text-gray-500 font-medium mt-2">İşletmenizi büyütmek için sana en uygun planı seç.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Standart Package */}
                <div className="bg-white rounded-[2rem] p-6 border-2 border-gray-100 hover:border-indigo-300 transition-all flex flex-col group cursor-pointer" onClick={() => handleSelectPackage('standart')}>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Standart Paket</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-extrabold text-gray-900">₺4.999</span>
                        <span className="text-sm text-gray-500 font-medium">/ Yıl</span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                            <span className="text-sm font-medium text-gray-700">10 GB Depolama Alanı</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                            <span className="text-sm font-medium text-gray-700">Müşteri Galerileri</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                            <span className="text-sm font-medium text-gray-700">Online Tahsilat</span>
                        </li>
                    </ul>
                    <button className="w-full py-3.5 bg-[#F4F6FB] group-hover:bg-[#EDF0F7] text-gray-900 font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
                        Seç ve İlerle <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Kurumsal Package */}
                <div className="bg-white rounded-[2rem] p-6 border-2 border-[#7B3FF2] relative flex flex-col group cursor-pointer shadow-lg shadow-purple-500/10" onClick={() => handleSelectPackage('kurumsal')}>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7B3FF2] to-indigo-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        En Popüler
                    </div>
                    <h3 className="text-xl font-bold text-[#7B3FF2] mb-1 mt-2">Kurumsal Paket</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-extrabold text-gray-900">₺9.999</span>
                        <span className="text-sm text-gray-500 font-medium">/ Yıl</span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-[#7B3FF2] shrink-0" />
                            <span className="text-sm font-medium text-gray-700">30 GB Depolama Alanı</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-[#7B3FF2] shrink-0" />
                            <span className="text-sm font-medium text-gray-700">Premium Web Sayfası</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-[#7B3FF2] shrink-0" />
                            <span className="text-sm font-medium text-gray-700">Tüm Standart Özellikler</span>
                        </li>
                    </ul>
                    <button className="w-full py-3.5 bg-[#7B3FF2] hover:bg-[#6A32DE] text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2">
                        Seç ve İlerle <Zap className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    // --- STEP 2: CHECKOUT ---
    const renderStep2 = () => {
        const pkg = selectedPackage ? PACKAGES[selectedPackage] : null;

        return (
            <div>
                <button
                    onClick={() => setStep(1)}
                    className="mb-6 text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" /> Geri Dön
                </button>

                <div className="bg-gray-50 p-4 rounded-2xl mb-6 flex justify-between items-center border border-gray-100">
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Seçilen Paket</p>
                        <p className="font-extrabold text-lg text-gray-900">{pkg?.name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tutar</p>
                        <p className="font-extrabold text-2xl text-[#7B3FF2]">{pkg?.price}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setPaymentMethod('cc')}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${paymentMethod === 'cc' ? 'bg-[#7B3FF2] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        <CreditCard className="w-4 h-4" /> Kredi Kartı
                    </button>
                    <button
                        onClick={() => setPaymentMethod('transfer')}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${paymentMethod === 'transfer' ? 'bg-[#7B3FF2] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        <Building className="w-4 h-4" /> Havale / EFT
                    </button>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
                            {error}
                        </div>
                    )}

                    {paymentMethod === 'cc' ? (
                        <form onSubmit={handlePayment} className="space-y-4">
                            <div>
                                <label className="block text-[12px] font-bold text-gray-700 mb-1.5 ml-1">KART ÜZERİNDEKİ İSİM</label>
                                <input type="text" required value={ccName} onChange={(e) => setCcName(e.target.value)} className="w-full px-4 py-3 bg-[#F4F6FB] border-none rounded-xl focus:ring-2 focus:ring-[#7B3FF2]/20 focus:bg-white outline-none transition-all font-medium text-sm" placeholder="AD SOYAD" />
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-gray-700 mb-1.5 ml-1">KART NUMARASI</label>
                                <div className="relative">
                                    <input type="text" required maxLength={19} value={ccNumber} onChange={(e) => setCcNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} className="w-full pl-12 pr-4 py-3 bg-[#F4F6FB] border-none rounded-xl focus:ring-2 focus:ring-[#7B3FF2]/20 focus:bg-white outline-none transition-all font-mono text-sm" placeholder="0000 0000 0000 0000" />
                                    <CreditCard className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[12px] font-bold text-gray-700 mb-1.5 ml-1">SON KULLANMA</label>
                                    <input type="text" required maxLength={5} value={ccExpiry} onChange={(e) => {
                                        let val = e.target.value.replace(/\D/g, '');
                                        if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                        setCcExpiry(val);
                                    }} className="w-full px-4 py-3 bg-[#F4F6FB] border-none rounded-xl focus:ring-2 focus:ring-[#7B3FF2]/20 focus:bg-white outline-none transition-all font-mono text-sm" placeholder="AA/YY" />
                                </div>
                                <div>
                                    <label className="block text-[12px] font-bold text-gray-700 mb-1.5 ml-1">CVC</label>
                                    <input type="text" required maxLength={3} value={ccCvv} onChange={(e) => setCcCvv(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-3 bg-[#F4F6FB] border-none rounded-xl focus:ring-2 focus:ring-[#7B3FF2]/20 focus:bg-white outline-none transition-all font-mono text-sm" placeholder="123" />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" disabled={loading} className="w-full py-4 bg-[#7B3FF2] hover:bg-[#6A32DE] text-white font-bold text-[15px] rounded-2xl shadow-[0_8px_20px_-6px_rgba(123,63,242,0.4)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none">
                                    {loading ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <><Lock className="w-4 h-4" /> Güvenle Öde</>}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 leading-relaxed font-medium">
                                Lütfen aşağıda yer alan banka hesabımıza sipariş tutarını havale edin. Açıklama kısmına işletme adınızı yazmayı unutmayın. Yönetim ekibi ödemeyi doğruladığında paketiniz aktif edilecektir.
                            </div>
                            <div className="space-y-3">
                                <div className="p-3.5 bg-[#F4F6FB] rounded-xl flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-bold uppercase">Banka Adı</span>
                                    <span className="font-semibold text-gray-900">Garanti BBVA</span>
                                </div>
                                <div className="p-3.5 bg-[#F4F6FB] rounded-xl flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-bold uppercase">Alıcı Adı</span>
                                    <span className="font-semibold text-gray-900">Weey Yazılım A.Ş.</span>
                                </div>
                                <div className="p-3.5 bg-[#F4F6FB] rounded-xl flex flex-col gap-1">
                                    <span className="text-xs text-gray-500 font-bold uppercase">IBAN</span>
                                    <span className="font-mono font-medium text-gray-900">TR12 0006 2000 0001 2345 6789 01</span>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button onClick={handlePayment} disabled={loading} className="w-full py-4 bg-[#7B3FF2] hover:bg-[#6A32DE] text-white font-bold text-[15px] rounded-2xl shadow-[0_8px_20px_-6px_rgba(123,63,242,0.4)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none">
                                    {loading ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <>Havale Bildirimi Yap</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // --- STEP 3: SUCCESS ---
    const renderStep3 = () => (
        <div className="text-center py-10 px-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500 animate-in zoom-in slide-in-from-bottom-2 duration-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Tebrikler! 🎉</h2>
            <p className="text-gray-500 font-medium mb-8">
                Ödemeniz başarıyla alındı ve <strong>{PACKAGES[selectedPackage!].name}</strong> aktif edildi. Sayfa yenileniyor...
            </p>
            <div className="w-8 h-8 mx-auto border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
                {step !== 3 && (
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                <div className="p-8 sm:p-10">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                </div>
            </div>
        </div>
    );
}
