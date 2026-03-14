'use client';

import { useState, useEffect, Suspense } from 'react';
import Script from 'next/script';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    CreditCard, Lock, Building, CheckCircle, Banknote, AlertCircle, Copy, Check, ChevronRight, Info
} from 'lucide-react';
import UpgradeSuccessFlow from '@/components/admin/UpgradeSuccessFlow';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import CreativeLoader from '@/components/ui/CreativeLoader';
import { signIn } from 'next-auth/react';

const BANK_TRANSFER_DISCOUNT = 5;

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderNo = searchParams.get('order');

    const [selectedPackage, setSelectedPackage] = useState<{
        name: string;
        price: string;
        amount: number;
        code: string;
        orderNo: string;
    } | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [paytrToken, setPaytrToken] = useState<string | null>(null);

    // Payment method: 'credit_card' | 'bank_transfer'
    const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bank_transfer'>('credit_card');

    // Bank transfer state
    const [bankAccounts, setBankAccounts] = useState<any[]>([]);
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [copiedIban, setCopiedIban] = useState<string | null>(null);
    const [bankTransferSent, setBankTransferSent] = useState(false);
    const [bankTransferLoading, setBankTransferLoading] = useState(false);
    const [isSettingUp, setIsSettingUp] = useState(false);

    // Coupon states
    const [couponCode, setCouponCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    useEffect(() => {
        if (!orderNo) {
            router.push('/packages');
            return;
        }
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${encodeURIComponent(orderNo)}`);
                const data = await res.json();
                if (data.success && data.order) {
                    // Use amount directly - preserve decimal precision (e.g. 109.99, not 110)
                    const rawAmount = data.order.amount ?? 0;
                    const cleanAmount = rawAmount; // No rounding!
                    setSelectedPackage({
                        name: data.order.packageName || 'Paket',
                        price: `₺${cleanAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                        amount: cleanAmount,
                        code: data.order.packageId || '',
                        orderNo: data.order.orderNo,
                    });
                } else {
                    setError('Sipariş bulunamadı veya süresi dolmuş. Lütfen tekrar kayıt olun.');
                }
            } catch {
                setError('Sipariş yüklenirken bir sorun oluştu.');
            }
        };
        fetchOrder();

        // Fetch bank accounts
        fetch('/api/checkout/bank-accounts')
            .then(r => r.json())
            .then(d => setBankAccounts(d.bankAccounts || []))
            .catch(() => { });
    }, [orderNo, router]);

    // When switching to bank transfer: mark the order immediately
    const handleMethodSwitch = async (method: 'credit_card' | 'bank_transfer') => {
        setPaymentMethod(method);
        if (method === 'bank_transfer' && selectedPackage) {
            // Mark the order as bank_transfer in the DB
            try {
                await fetch('/api/orders/set-payment-method', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderNo: selectedPackage.orderNo, paymentMethod: 'bank_transfer' }),
                });
            } catch { }
        }
    };

    // Calculate amounts - preserve decimal precision
    const originalAmount = selectedPackage?.amount || 0;
    const couponDiscountAmount = appliedDiscount > 0 ? Math.round((originalAmount * appliedDiscount / 100) * 100) / 100 : 0;
    const bankTransferDiscountAmount = paymentMethod === 'bank_transfer'
        ? Math.round(((originalAmount - couponDiscountAmount) * BANK_TRANSFER_DISCOUNT / 100) * 100) / 100
        : 0;
    const finalAmount = Math.round((originalAmount - couponDiscountAmount - bankTransferDiscountAmount) * 100) / 100;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setApplyingCoupon(true);
        setCouponError('');
        setCouponSuccess('');
        try {
            const res = await fetch('/api/checkout/validate-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setAppliedDiscount(data.discountPercentage);
                setCouponSuccess(`%${data.discountPercentage} indirim uygulandı!`);
            } else {
                setCouponError(data.error || 'Geçersiz kupon kodu.');
                setAppliedDiscount(0);
            }
        } catch {
            setCouponError('Kupon doğrulanırken hata oluştu.');
        } finally {
            setApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode('');
        setAppliedDiscount(0);
        setCouponError('');
        setCouponSuccess('');
    };

    const handleCreditCardPayment = async () => {
        if (!selectedPackage) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/payment/paytr/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderNo: selectedPackage.orderNo,
                    appliedCoupon: appliedDiscount > 0 ? couponCode : undefined
                }),
            });
            const data = await res.json();
            if (res.ok && data.success && data.token) {
                setPaytrToken(data.token);
            } else {
                setError(data.error || 'Ödeme altyapısına bağlanılamadı.');
                setLoading(false);
            }
        } catch {
            setError('Ödeme sistemiyle bağlantı kurulamadı.');
            setLoading(false);
        }
    };

    const handleBankTransferSent = async () => {
        if (!selectedPackage) return;
        setBankTransferLoading(true);
        setError('');
        
        const selectedBankObj = bankAccounts.find(b => b.iban === selectedBank);

        try {
            const res = await fetch('/api/payment/bank-transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    orderNo: selectedPackage.orderNo,
                    bankName: selectedBankObj?.bankName,
                    bankIban: selectedBankObj?.iban,
                    amount: finalAmount
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                // Show setup loader
                setIsSettingUp(true);
                
                // Wait for a few seconds to simulate setup (matching card flow)
                setTimeout(async () => {
                    // Auto login
                    const loginRes = await signIn('credentials', {
                        autoLoginToken: data.autoLoginToken,
                        redirect: false
                    });

                    if (loginRes?.ok) {
                        router.push('/admin/dashboard');
                    } else {
                        // If auto login fails, at least show the confirmation screen
                        setBankTransferSent(true);
                        setIsSettingUp(false);
                    }
                }, 3500);
            } else {
                setError(data.error || 'İşlem sırasında hata oluştu.');
            }
        } catch {
            setError('Sunucuya ulaşılamadı, lütfen tekrar deneyin.');
        } finally {
            setBankTransferLoading(false);
        }
    };

    const handleCopyIban = (iban: string) => {
        navigator.clipboard.writeText(iban).catch(() => { });
        setCopiedIban(iban);
        setTimeout(() => setCopiedIban(null), 2000);
    };

    if (success && selectedPackage) {
        return <UpgradeSuccessFlow packageName={selectedPackage.name} onComplete={() => { window.location.href = '/admin/dashboard'; }} />;
    }

    if (bankTransferSent) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <PublicHeader />
                <main className="flex-1 flex items-center justify-center px-4 py-32">
                    <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-12 max-w-lg w-full text-center">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Başvurunuz Alındı!</h2>
                        <p className="text-gray-500 mb-6 leading-relaxed">
                            Havale ödemeniz onaylandıktan sonra paneliniz otomatik olarak aktive edilecekttir. Bu işlem genellikle 1 iş günü içinde tamamlanır.
                        </p>
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 text-left">
                            <p className="text-amber-800 text-sm font-medium flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                                Havale açıklamasına sipariş numaranızı (<strong>{selectedPackage?.orderNo}</strong>) yazmayı unutmayın.
                            </p>
                        </div>
                        <a href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#5d2b72] to-purple-600 text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg">
                            Giriş Sayfasına Git <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                </main>
                <PublicFooter />
            </div>
        );
    }

    if (!orderNo || (!selectedPackage && !error)) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" /></div>;
    }

    if (error && !selectedPackage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 max-w-md text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Sipariş Bulunamadı</h2>
                    <p className="text-gray-500 text-sm mb-6">{error}</p>
                    <a href="/packages" className="inline-block px-6 py-3 bg-[#5d2b72] text-white rounded-xl font-semibold text-sm hover:bg-[#4a2260] transition-colors">Paketlere Dön</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative">
            {isSettingUp && (
                <CreativeLoader message="Paneliniz Hazırlanıyor..." />
            )}
            <PublicHeader />
            <main className="flex-1 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Güvenli Ödeme</h1>
                        <p className="text-gray-500 mt-2">Aboneliğinizi başlatmak için ödeme adımını tamamlayın.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left: Payment Section */}
                        <div className="flex-1 w-full space-y-5">
                            {/* Payment Method Selector */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                <h2 className="font-bold text-gray-800 mb-4">Ödeme Yöntemi</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Credit Card */}
                                    <button
                                        onClick={() => handleMethodSwitch('credit_card')}
                                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all text-sm font-semibold
                                            ${paymentMethod === 'credit_card'
                                                ? 'border-[#5d2b72] bg-purple-50 text-[#5d2b72]'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        <CreditCard className="w-6 h-6" />
                                        <span>Kredi / Banka Kartı</span>
                                        {paymentMethod === 'credit_card' && (
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">SEÇİLDİ</span>
                                        )}
                                    </button>

                                    {/* Bank Transfer */}
                                    <button
                                        onClick={() => handleMethodSwitch('bank_transfer')}
                                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all text-sm font-semibold relative
                                            ${paymentMethod === 'bank_transfer'
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        {/* Discount Badge */}
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest whitespace-nowrap">
                                            %{BANK_TRANSFER_DISCOUNT} İNDİRİM
                                        </div>
                                        <Banknote className="w-6 h-6" />
                                        <span>Havale / EFT</span>
                                        {paymentMethod === 'bank_transfer' && (
                                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">SEÇİLDİ</span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Credit Card Frame */}
                            {paymentMethod === 'credit_card' && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    {paytrToken ? (
                                        <div className="w-full relative min-h-[800px]">
                                            <iframe src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`} id="paytriframe" frameBorder="0" scrolling="no" style={{ width: '100%', minHeight: '800px' }} />
                                            <Script src="https://www.paytr.com/js/iframeResizer.min.js" strategy="lazyOnload" onLoad={() => { (window as any).iFrameResize && (window as any).iFrameResize({}, '#paytriframe'); }} />
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center">
                                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-5"><CreditCard className="w-8 h-8" /></div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Güvenli Kredi Kartı Ödemesi</h3>
                                            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">256-bit SSL korumalı PayTR altyapısı üzerinden güvenle ödeyin. Onay sonrası paneliniz anında aktif edilir.</p>
                                            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}
                                            <button onClick={handleCreditCardPayment} disabled={loading || !selectedPackage}
                                                className="w-full max-w-sm mx-auto py-4 bg-gradient-to-r from-[#5d2b72] to-purple-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 text-base disabled:opacity-60"
                                            >
                                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Lock className="w-4 h-4" /> PayTR ile Güvenli Öde: ₺{finalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>}
                                            </button>
                                            <div className="mt-6 flex items-center justify-center gap-6 opacity-50 text-xs text-gray-500">
                                                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> 256-bit SSL</span>
                                                <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> 3D Secure</span>
                                                <span className="flex items-center gap-1"><Building className="w-3 h-3" /> PayTR Güvencesi</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Bank Transfer Section */}
                            {paymentMethod === 'bank_transfer' && (
                                <div className="space-y-4">
                                    {/* Info Box */}
                                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                                        <div className="flex items-start gap-3">
                                            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm text-amber-800 space-y-1">
                                                <p className="font-bold">Havale/EFT ile Ödemede Dikkat Edilmesi Gerekenler</p>
                                                <ul className="list-disc list-inside space-y-1 text-amber-700">
                                                    <li>Havale ile ödemede <strong>%{BANK_TRANSFER_DISCOUNT} indirim</strong> otomatik uygulanmaktadır.</li>
                                                    <li>Havale açıklamasına <strong>sipariş numaranızı ({selectedPackage?.orderNo})</strong> yazmayı unutmayın.</li>
                                                    <li>Panel erişiminiz <strong>aktivasyon onayından sonra</strong> açılır. Anında kurulum yapılmaz.</li>
                                                    <li>Ödeme onayı genellikle <strong>1 iş günü</strong> içinde tamamlanır.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bank Account Cards */}
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                        <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                                            <Building className="w-5 h-5 text-emerald-600" />
                                            Banka Hesap Bilgileri
                                        </h3>

                                        {bankAccounts.length === 0 ? (
                                            <p className="text-gray-400 text-sm text-center py-6">Banka hesabı bilgileri henüz tanımlanmamış. Lütfen bizimle iletişime geçin.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {bankAccounts.map((bank: any, i: number) => (
                                                    <div
                                                        key={i}
                                                        onClick={() => setSelectedBank(bank.iban)}
                                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedBank === bank.iban
                                                                ? 'border-emerald-400 bg-emerald-50'
                                                                : 'border-gray-100 hover:border-emerald-200 bg-gray-50'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            {bank.logoUrl ? (
                                                                <img src={bank.logoUrl} alt={bank.bankName} className="w-14 h-10 object-contain rounded-lg bg-white border border-gray-100 p-1" />
                                                            ) : (
                                                                <div className="w-14 h-10 bg-gray-200 rounded-lg flex items-center justify-center"><Building className="w-5 h-5 text-gray-400" /></div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-gray-800 text-sm">{bank.bankName}</p>
                                                                <p className="text-xs text-gray-500">{bank.accountHolder}</p>
                                                                <p className="text-sm font-mono text-gray-700 mt-1 truncate">{bank.iban}</p>
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleCopyIban(bank.iban); }}
                                                                className={`flex-shrink-0 p-2 rounded-lg border transition-all ${copiedIban === bank.iban
                                                                        ? 'bg-emerald-100 border-emerald-300 text-emerald-600'
                                                                        : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600'
                                                                    }`}
                                                                title="IBAN'ı kopyala"
                                                            >
                                                                {copiedIban === bank.iban ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-6 pt-5 border-t border-gray-100">
                                            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}
                                            <button
                                                onClick={handleBankTransferSent}
                                                disabled={bankTransferLoading || !selectedPackage}
                                                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                                            >
                                                {bankTransferLoading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <><CheckCircle className="w-5 h-5" /> Ödemeyi Gönderdim — Hesabımı Kur</>
                                                )}
                                            </button>
                                            <p className="text-center text-xs text-gray-400 mt-3">
                                                Bu butona tıklayarak paneliniz oluşturulur, ancak ödeme onayınız alınana kadar erişim kısıtlı kalır.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Order Summary */}
                        <div className="w-full lg:w-80">
                            <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 text-white sticky top-8">
                                <h3 className="text-xl font-bold mb-6">Sipariş Özeti</h3>

                                <div className="flex justify-between items-center py-4 border-b border-gray-800">
                                    <span className="text-gray-400">Paket</span>
                                    <span className="font-medium text-white">{selectedPackage?.name}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-gray-800">
                                    <span className="text-gray-400">Süre</span>
                                    <span className="font-medium text-white">Yıllık</span>
                                </div>

                                <div className="py-6 space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-gray-400">Ara Toplam</span>
                                        <span className={`text-xl font-bold ${(appliedDiscount > 0 || paymentMethod === 'bank_transfer') ? 'text-gray-500 line-through' : 'text-white'}`}>
                                            {selectedPackage?.price}
                                        </span>
                                    </div>

                                    {appliedDiscount > 0 && (
                                        <div className="flex justify-between items-end">
                                            <span className="text-emerald-400">Kupon (%{appliedDiscount})</span>
                                            <span className="font-bold text-emerald-400">-₺{couponDiscountAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                    )}

                                    {paymentMethod === 'bank_transfer' && (
                                        <div className="flex justify-between items-end">
                                            <span className="text-emerald-400">Havale İndirimi (%{BANK_TRANSFER_DISCOUNT})</span>
                                            <span className="font-bold text-emerald-400">-₺{bankTransferDiscountAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-end pt-3 border-t border-gray-800">
                                        <span className="text-gray-400">Ödenecek</span>
                                        <span className={`text-4xl font-extrabold ${paymentMethod === 'bank_transfer' ? 'text-emerald-400' : 'text-[#9b51e0]'}`}>
                                            ₺{finalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <p className="text-right text-xs text-gray-500">KDV Dahildir</p>
                                </div>

                                {/* Coupon Code — only for credit card */}
                                {paymentMethod === 'credit_card' && (
                                <div className="mt-2 space-y-3 pb-4">
                                    <span className="text-sm font-medium text-gray-300 block mb-2">İndirim Kuponu</span>
                                    {appliedDiscount > 0 ? (
                                        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                                            <span className="text-emerald-400 font-medium flex items-center gap-2 text-sm uppercase"><CheckCircle className="w-4 h-4" />{couponCode}</span>
                                            <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-400 text-xs font-bold transition-colors">İPTAL</button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 relative">
                                            <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Kupon Kodu"
                                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white uppercase placeholder:normal-case placeholder:text-gray-500 text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                                            />
                                            <button onClick={handleApplyCoupon} disabled={applyingCoupon || !couponCode.trim()}
                                                className="absolute right-1 top-1 bottom-1 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium text-xs rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {applyingCoupon ? '...' : 'Uygula'}
                                            </button>
                                        </div>
                                    )}
                                    {couponError && <p className="text-red-400 text-xs font-medium pl-1">{couponError}</p>}
                                    {couponSuccess && <p className="text-emerald-400 text-xs font-medium pl-1">{couponSuccess}</p>}
                                </div>
                                )}

                                {/* Transfer notice */}
                                {paymentMethod === 'bank_transfer' && (
                                    <div className="mt-2 bg-amber-900/20 border border-amber-700/20 rounded-xl p-4 text-xs text-amber-300 flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        Panel erişiminiz aktivasyon onayı yapıldıktan sonra kullanmaya başlayabilirsiniz.
                                    </div>
                                )}

                                {paymentMethod === 'credit_card' && (
                                    <div className="mt-4 bg-gray-800/50 rounded-xl p-4 text-sm text-gray-400">
                                        Ödemeniz onaylandığında sisteminiz otomatik olarak kurulur.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Installment Table (credit card only) */}
                    {paymentMethod === 'credit_card' && selectedPackage && (
                        <div className="mt-8 bg-white rounded-2xl p-6 lg:p-10 shadow-sm border border-gray-200 max-w-4xl mx-auto">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center border-b border-gray-100 pb-4">Taksit Seçenekleri</h3>
                            <style dangerouslySetInnerHTML={{ __html: `#paytr_taksit_tablosu { clear:both;font-size:12px;max-width:1200px;text-align:center;font-family:Arial,sans-serif;margin:0 auto} #paytr_taksit_tablosu::before{display:table;content:" "} #paytr_taksit_tablosu::after{content:"";clear:both;display:table} .taksit-tablosu-wrapper{margin:10px;width:280px;padding:18px;cursor:default;text-align:center;display:inline-block;border:1px solid #e1e1e1;border-radius:12px} .taksit-logo img{max-height:28px;padding-bottom:20px} .taksit-tutari-text{float:left;width:126px;color:#a2a2a2;margin-bottom:5px} .taksit-tutar-wrapper{display:inline-block;background-color:#f7f7f7;width:100%;border-radius:8px;margin-bottom:4px;overflow:hidden} .taksit-tutar-wrapper:hover{background-color:#e8e8e8} .taksit-tutari{float:left;width:126px;padding:6px 0;color:#474747} .taksit-tutari:last-child{border-left:2px solid #fff} .taksit-tutari-bold{font-weight:bold} @media all and (max-width:600px){.taksit-tablosu-wrapper{margin:5px 0;width:100%}}` }} />
                            <div id="paytr_taksit_tablosu"></div>
                            <Script src={`https://www.paytr.com/odeme/taksit-tablosu/v2?token=4dda7b2cd16fea5352bf5b9c30c3fb9de51faef89644ab7c8924e93e5ce4c20c&merchant_id=675630&amount=${selectedPackage.amount}&taksit=0&tumu=0`} strategy="lazyOnload" />
                        </div>
                    )}
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" /></div>}>
            <CheckoutContent />
        </Suspense>
    );
}
