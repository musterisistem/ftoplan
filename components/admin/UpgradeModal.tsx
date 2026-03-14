'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, CheckCircle, Zap, HardDrive, Globe, CreditCard,
    Lock, Building, ArrowRight, ShieldCheck, Sparkles,
    Check, Star, Award, ChevronRight, Loader2, Info,
    Copy, Banknote, AlertCircle
} from 'lucide-react';
import UpgradeSuccessFlow from './UpgradeSuccessFlow';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface PackageData {
    id: string;
    _id: string;
    name: string;
    price: number;
    storage: number;
    maxCustomers?: number;
    maxPhotos?: number;
    maxAppointments?: number;
    hasWatermark?: boolean;
    hasWebsite?: boolean;
    supportType?: string;
    features: string[];
}

interface BankAccount {
    bankName: string;
    accountHolder: string;
    iban: string;
    logoUrl?: string;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const [packages, setPackages] = useState<PackageData[]>([]);
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bank_transfer'>('credit_card');

    // Payment states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [paytrToken, setPaytrToken] = useState<string | null>(null);
    
    // Bank states
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [copiedIban, setCopiedIban] = useState<string | null>(null);
    const [bankTransferLoading, setBankTransferLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchPackages();
            fetchBankAccounts();
        }
    }, [isOpen]);

    const fetchPackages = async () => {
        try {
            const res = await fetch('/api/packages');
            const data = await res.json();
            if (Array.isArray(data)) {
                // Ensure price is treated as a clean number (handling potential string/dot issues)
                const formatted = data.map(pkg => ({
                    ...pkg,
                    price: pkg.price < 1000 ? Math.round(pkg.price * 1000) : Math.round(pkg.price)
                }));
                // Filter out trial package
                setPackages(formatted.filter(p => p.id !== 'trial'));
            }
        } catch (err) {
            console.error('Failed to fetch packages:', err);
        }
    };

    const fetchBankAccounts = async () => {
        try {
            const res = await fetch('/api/checkout/bank-accounts');
            const data = await res.json();
            if (data.bankAccounts) {
                setBankAccounts(data.bankAccounts);
                if (data.bankAccounts.length > 0) setSelectedBank(data.bankAccounts[0].iban);
            }
        } catch (err) {
            console.error('Failed to fetch bank accounts:', err);
        }
    };

    if (!isOpen) return null;

    const handleSelectPackage = (pkg: PackageData) => {
        if (session?.user?.packageType === pkg.id) return;
        setSelectedPackage(pkg);
        setStep(2);
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
            setPaytrToken(null);
            setError('');
        }
    };

    const handlePayment = async () => {
        if (!selectedPackage) return;
        setLoading(true);
        setError('');

        try {
            const orderRes = await fetch('/api/payment/upgrade/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packageId: selectedPackage.id }),
            });
            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error || 'Sipariş oluşturulamadı.');

            const checkoutRes = await fetch('/api/payment/paytr/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderNo: orderData.orderNo }),
            });
            const checkoutData = await checkoutRes.json();
            if (checkoutRes.ok && checkoutData.success && checkoutData.token) {
                setPaytrToken(checkoutData.token);
            } else {
                throw new Error(checkoutData.error || 'Ödeme oturumu başlatılamadı.');
            }
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleBankTransferNotify = async () => {
        if (!selectedPackage) return;
        setBankTransferLoading(true);
        setError('');

        try {
            // Create the upgrade order first
            const orderRes = await fetch('/api/payment/upgrade/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packageId: selectedPackage.id }),
            });
            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error || 'Sipariş oluşturulamadı.');

            const selectedBankObj = bankAccounts.find(b => b.iban === selectedBank);
            
            const res = await fetch('/api/payment/bank-transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    orderNo: orderData.orderNo,
                    bankName: selectedBankObj?.bankName,
                    bankIban: selectedBankObj?.iban,
                    amount: selectedPackage.price * 0.95 // %5 discount for transfer
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setStep(3);
            } else {
                setError(data.error || 'Bildirim sırasında hata oluştu.');
            }
        } catch (err) {
            setError('Havale bildirimi yapılamadı.');
        } finally {
            setBankTransferLoading(false);
        }
    };

    const handleCopyIban = (iban: string) => {
        navigator.clipboard.writeText(iban).catch(() => { });
        setCopiedIban(iban);
        setTimeout(() => setCopiedIban(null), 2000);
    };

    const BANK_TRANSFER_DISCOUNT = 5;
    const finalAmount = paymentMethod === 'bank_transfer' 
        ? Math.round(selectedPackage?.price ? selectedPackage.price * (1 - BANK_TRANSFER_DISCOUNT/100) : 0)
        : selectedPackage?.price || 0;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto overflow-x-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`w-full ${step === 1 ? 'max-w-4xl' : 'max-w-3xl'} bg-white rounded-[2.5rem] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.2)] relative overflow-hidden flex flex-col`}
            >
                {/* Close Button */}
                {step !== 3 && (
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/80 hover:bg-white text-slate-400 hover:text-slate-600 rounded-full shadow-sm transition-all z-50 border border-slate-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                <div className="p-5 sm:p-7 relative z-10">
                    <AnimatePresence mode="wait">
                        {/* --- STEP 1: PACKAGE COMPARISON --- */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="space-y-10"
                            >
                                <div className="text-center max-w-xl mx-auto space-y-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-full text-[#5d2b72] text-[10px] font-black uppercase tracking-widest border border-purple-100">
                                        <Sparkles className="w-3.5 h-3.5" /> Planını Güncelle
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">İşinizi Bir Üst Seviyeye Taşıyın</h2>
                                    <p className="text-xs sm:text-sm text-slate-500 font-medium">Size en uygun planı seçerek hemen avantajlardan faydalanın.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                                    {packages.map((pkg, i) => {
                                        const isCurrent = session?.user?.packageType === pkg.id;
                                        const isKurumsal = pkg.id === 'kurumsal';
                                        
                                        return (
                                            <motion.div
                                                key={pkg.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className={`relative group bg-white rounded-3xl p-8 border-2 transition-all duration-500 flex flex-col
                                                    ${isKurumsal 
                                                        ? 'border-purple-200 shadow-[0_12px_40px_rgba(93,43,114,0.08)] bg-gradient-to-b from-white to-purple-50/20' 
                                                        : 'border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200'}
                                                    ${isCurrent ? 'opacity-90 border-emerald-500/30' : ''}`}
                                            >
                                                {isKurumsal && (
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#5d2b72] to-purple-600 text-white text-[10px] font-black uppercase tracking-[2px] rounded-full shadow-lg">
                                                        TAM PROFESYONEL
                                                    </div>
                                                )}

                                                {isCurrent && (
                                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase border border-emerald-100">
                                                        <CheckCircle className="w-3 h-3" /> Şu Anki Planınız
                                                    </div>
                                                )}

                                                <div className="mb-6">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shrink-0 transition-transform group-hover:rotate-3
                                                        ${isKurumsal ? 'bg-[#5d2b72] text-white shadow-xl shadow-purple-200' : 'bg-slate-900 text-white'}`}>
                                                        {isKurumsal ? <Award className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                                                    </div>
                                                    <h3 className="text-xl font-black text-slate-900 mb-1">{pkg.name}</h3>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-black text-slate-900">₺{pkg.price.toLocaleString('tr-TR')}</span>
                                                        <span className="text-slate-400 font-bold text-xs">/ Yıl</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-3 mb-8 flex-1">
                                                    {pkg.features.map((f, fi) => {
                                                        const cleanF = f.replace('HIGHLIGHT:', '').replace('---', '').trim();
                                                        if (f.startsWith('---')) return <div key={fi} className="h-px bg-slate-50 my-2" />;
                                                        
                                                        return (
                                                            <div key={fi} className="flex items-start gap-2.5">
                                                                <div className="mt-1 w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                                </div>
                                                                <span className="text-[13px] font-semibold text-slate-600 leading-tight">{cleanF}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <button
                                                    onClick={() => !isCurrent && handleSelectPackage(pkg)}
                                                    disabled={isCurrent}
                                                    className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 text-sm
                                                    ${isCurrent
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default'
                                                        : isKurumsal
                                                            ? 'bg-[#5d2b72] text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                                                            : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200 hover:-translate-y-0.5'}`}
                                                >
                                                    {isCurrent ? 'Aktif Plan' : 'Bu Plana Geç'} <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* --- STEP 2: CHECKOUT (Split Layout) --- */}
                        {step === 2 && selectedPackage && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <button
                                    onClick={handleBack}
                                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 rotate-180" /> Planlara Geri Dön
                                </button>

                                <div className="flex flex-col lg:flex-row gap-8 items-start">
                                    {/* Left Side: Payment Methods */}
                                    <div className="flex-1 w-full space-y-6">
                                        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                                            <h3 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2">
                                                <ShieldCheck className="w-5 h-5 text-purple-600" /> Ödeme Yöntemi
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => { setPaymentMethod('credit_card'); setPaytrToken(null); }}
                                                    className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all font-black text-[13px] relative
                                                        ${paymentMethod === 'credit_card'
                                                            ? 'border-[#5d2b72] bg-purple-50/30 text-[#5d2b72]'
                                                            : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                                                >
                                                    <CreditCard className="w-6 h-6" />
                                                    <span>Kart ile Öde</span>
                                                    {paymentMethod === 'credit_card' && <div className="absolute top-2 right-2 w-2 h-2 bg-purple-600 rounded-full" />}
                                                </button>
                                                <button
                                                    onClick={() => { setPaymentMethod('bank_transfer'); setPaytrToken(null); }}
                                                    className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all font-black text-[13px] relative
                                                        ${paymentMethod === 'bank_transfer'
                                                            ? 'border-emerald-500 bg-emerald-50/30 text-emerald-700'
                                                            : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                                                >
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full whitespace-nowrap tracking-wider shadow-sm">
                                                        %5 EK İNDİRİM
                                                    </div>
                                                    <Banknote className="w-6 h-6" />
                                                    <span>Havale / EFT</span>
                                                    {paymentMethod === 'bank_transfer' && <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />}
                                                </button>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold animate-pulse">
                                                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                                            </div>
                                        )}

                                        {paytrToken ? (
                                            <div className="w-full min-h-[500px] bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 relative">
                                                <iframe src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`} id="paytriframe" frameBorder="0" scrolling="no" style={{ width: '100%', minHeight: '500px' }} />
                                                <Script src="https://www.paytr.com/js/iframeResizer.min.js" strategy="lazyOnload" onLoad={() => { (window as any).iFrameResize && (window as any).iFrameResize({}, '#paytriframe'); }} />
                                            </div>
                                        ) : paymentMethod === 'credit_card' ? (
                                            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 text-center space-y-6">
                                                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                                    <Lock className="w-8 h-8" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="text-xl font-black text-slate-900">Güvenli Kart Ödemesi</h4>
                                                    <p className="text-sm text-slate-500 max-w-xs mx-auto">PayTR güvencesi ile kartınızla 3D Secure güvenliğiyle anında ödeme yapın.</p>
                                                </div>
                                                <button
                                                    onClick={handlePayment}
                                                    disabled={loading}
                                                    className="w-full h-16 bg-slate-900 hover:bg-black text-white font-black text-base rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 disabled:opacity-70 group"
                                                >
                                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" /> Ödemeyi Başlat</>}
                                                </button>
                                                <div className="flex items-center justify-center gap-4 opacity-40">
                                                    <img src="https://www.paytr.com/img/general/paytr-logo.png" alt="PayTR" className="h-6 object-contain" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3">
                                                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                                    <div className="space-y-1">
                                                        <p className="text-[12px] font-black text-amber-900">Önemli Hatırlatma</p>
                                                        <p className="text-[11px] font-medium text-amber-800 leading-relaxed">
                                                            Havale sonrası panelinizin aktivasyonu ödeme onayından sonra (genellikle 1 iş günü) gerçekleşir.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-5">
                                                    <h4 className="text-[13px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-50 pb-4">BANKA HESAPLARI</h4>
                                                    
                                                    {bankAccounts.length === 0 ? (
                                                        <div className="text-center py-6 text-slate-400 text-xs font-medium italic">Hesap bilgileri yüklenemedi.</div>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {bankAccounts.map((bank, i) => (
                                                                <div
                                                                    key={i}
                                                                    onClick={() => setSelectedBank(bank.iban)}
                                                                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative group
                                                                        ${selectedBank === bank.iban ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                                                                >
                                                                    <div className="flex items-center gap-4">
                                                                        {bank.logoUrl ? (
                                                                            <img src={bank.logoUrl} alt={bank.bankName} className="w-12 h-12 object-contain rounded-xl bg-white p-1 border border-slate-100" />
                                                                        ) : (
                                                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100"><Building className="w-6 h-6 text-slate-300" /></div>
                                                                        )}
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="font-black text-slate-900 text-sm truncate">{bank.bankName}</p>
                                                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{bank.accountHolder}</p>
                                                                            <p className="text-[12px] font-mono text-slate-600 mt-1 font-bold">{bank.iban}</p>
                                                                        </div>
                                                                        <button
                                                                            onClick={(e) => { e.stopPropagation(); handleCopyIban(bank.iban); }}
                                                                            className={`p-2.5 rounded-xl border transition-all ${copiedIban === bank.iban ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-100 text-slate-400 group-hover:text-slate-600'}`}
                                                                        >
                                                                            {copiedIban === bank.iban ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={handleBankTransferNotify}
                                                        disabled={bankTransferLoading || !selectedBank}
                                                        className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 disabled:opacity-70"
                                                    >
                                                        {bankTransferLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CheckCircle className="w-5 h-5" /> Ödemeyi Yaptım, Bildir</>}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Side: Order Summary (Dark Theme) */}
                                    <div className="w-full lg:w-[340px] shrink-0">
                                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white sticky top-0 shadow-2xl shadow-slate-950/20">
                                            <h3 className="text-xl font-black mb-8 pb-4 border-b border-white/10 flex items-center gap-2">
                                                <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Sipariş Özeti
                                            </h3>

                                            <div className="space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[2px]">PAKET</span>
                                                        <p className="font-black text-lg text-white">{selectedPackage.name}</p>
                                                    </div>
                                                    <div className="px-2 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase">YILLIK</div>
                                                </div>

                                                <div className="space-y-3 pt-4">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-white/40 font-bold">Liste Fiyatı</span>
                                                        <span className={`font-black ${paymentMethod === 'bank_transfer' ? 'text-white/30 line-through' : 'text-white'}`}>
                                                            ₺{selectedPackage.price.toLocaleString('tr-TR')}
                                                        </span>
                                                    </div>
                                                    
                                                    {paymentMethod === 'bank_transfer' && (
                                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                                                            <span className="text-emerald-400 text-xs font-black uppercase tracking-wider">Havale İndirimi</span>
                                                            <span className="text-emerald-400 font-black">-₺{(selectedPackage.price * 0.05).toLocaleString('tr-TR')}</span>
                                                        </motion.div>
                                                    )}

                                                    <div className="pt-6 border-t border-white/10 flex flex-col items-end gap-1">
                                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[2px]">TOPLAM ÖDENECEK</span>
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="text-4xl font-black text-white leading-none">
                                                                ₺{finalAmount.toLocaleString('tr-TR')}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-white/20 font-bold mt-1">KDV DAHİLDİR</p>
                                                    </div>
                                                </div>

                                                <div className="pt-8 space-y-4">
                                                    <div className="flex items-center gap-3 text-white/60">
                                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                                        <span className="text-[11px] font-bold">256-Bit SSL Koruma</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-white/60">
                                                        <Lock className="w-4 h-4 text-purple-400" />
                                                        <span className="text-[11px] font-bold">Güvenli Ödeme Altyapısı</span>
                                                    </div>
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
                                packageName={selectedPackage.name}
                                isModal={true}
                                onComplete={() => {
                                    onClose();
                                    router.refresh();
                                    if (typeof window !== 'undefined') window.location.reload();
                                }}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
