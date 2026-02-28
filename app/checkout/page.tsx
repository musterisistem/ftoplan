'use client';

import { useState, useEffect, Suspense } from 'react';
import Script from 'next/script';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, Lock, Building, CheckCircle } from 'lucide-react';
import UpgradeSuccessFlow from '@/components/admin/UpgradeSuccessFlow';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

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
                    setSelectedPackage({
                        name: data.order.packageName || 'Paket',
                        price: `₺${(data.order.amount ?? 0).toLocaleString('tr-TR')}`,
                        amount: data.order.amount ?? 0,
                        code: data.order.packageId || '',
                        orderNo: data.order.orderNo,
                    });
                } else {
                    setError('Sipariş bulunamadı veya süresi dolmuş. Lütfen tekrar kayıt olun.');
                }
            } catch (err) {
                console.error('Failed to load order', err);
                setError('Sipariş yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.');
            }
        };
        fetchOrder();
    }, [orderNo, router]);

    const handlePayment = async () => {
        if (!selectedPackage) return;
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/payment/paytr/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderNo: selectedPackage.orderNo }),
            });

            const data = await res.json();

            if (res.ok && data.success && data.token) {
                // Set token to render iframe
                setPaytrToken(data.token);
            } else {
                setError(data.error || 'Ödeme altyapısına bağlanılamadı. Lütfen tekrar deneyin.');
                setLoading(false);
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError('Ödeme sistemiyle bağlantı kurulamadı.');
            setLoading(false);
        }
    };

    if (success && selectedPackage) {
        return (
            <UpgradeSuccessFlow
                packageName={selectedPackage.name}
                onComplete={() => { window.location.href = '/admin/dashboard'; }}
            />
        );
    }

    // Loading state
    if (!orderNo || (!selectedPackage && !error)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
            </div>
        );
    }

    // Error state
    if (error && !selectedPackage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Sipariş Bulunamadı</h2>
                    <p className="text-gray-500 text-sm mb-6">{error}</p>
                    <a href="/packages" className="inline-block px-6 py-3 bg-[#5d2b72] text-white rounded-xl font-semibold text-sm hover:bg-[#4a2260] transition-colors">
                        Paketlere Dön
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <PublicHeader />
            <main className="flex-1 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 text-center sm:text-left max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900">Güvenli Ödeme</h1>
                        <p className="text-gray-500 mt-2">Aboneliğinizi başlatmak için ödeme adımını tamamlayın.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 max-w-4xl mx-auto">
                        {/* Left: Payment Form / iFrame */}
                        <div className="flex-1 w-full">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden w-full">
                                {paytrToken ? (
                                    <div className="w-full relative min-h-[800px]">
                                        <iframe
                                            src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`}
                                            id="paytriframe"
                                            frameBorder="0"
                                            scrolling="no"
                                            style={{ width: '100%', minHeight: '800px' }}
                                        ></iframe>
                                        <Script
                                            src="https://www.paytr.com/js/iframeResizer.min.js"
                                            strategy="lazyOnload"
                                            onLoad={() => {
                                                // @ts-ignore
                                                if (window.iFrameResize) window.iFrameResize({}, '#paytriframe');
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="p-8 sm:p-10 text-center">
                                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CreditCard className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Güvenli Kredi Kartı Ödemesi</h2>
                                        <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
                                            Ödemenizi 256-bit SSL korumalı PayTR altyapısı üzerinden güvenle gerçekleştirebilirsiniz. İşleminiz tamamlandığında paneliniz otomatik olarak aktif edilecektir.
                                        </p>

                                        {error && (
                                            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium text-left">
                                                {error}
                                            </div>
                                        )}

                                        <button
                                            onClick={handlePayment}
                                            disabled={loading || !selectedPackage}
                                            className="w-full max-w-md mx-auto py-4 bg-gradient-to-r from-[#5d2b72] to-purple-600 text-white font-bold rounded-xl shadow-[0_8px_25px_rgba(93,43,114,0.3)] hover:shadow-[0_12px_35px_rgba(93,43,114,0.4)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-60"
                                        >
                                            {loading ? (
                                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <><Lock className="w-5 h-5" /> PayTR ile Güvenli Öde: {selectedPackage?.price}</>
                                            )}
                                        </button>

                                        <div className="mt-8 flex items-center justify-center gap-6 opacity-60">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                <Lock className="w-3.5 h-3.5" /> 256-bit SSL
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                <CheckCircle className="w-3.5 h-3.5" /> 3D Secure
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                <Building className="w-3.5 h-3.5" /> PayTR Güvencesi
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
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

                                <div className="py-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-gray-400">Toplam Tutar</span>
                                        <span className="text-3xl font-extrabold text-white">{selectedPackage?.price}</span>
                                    </div>
                                    <p className="text-right text-xs text-gray-500 mt-1">KDV Dahildir</p>
                                </div>

                                <div className="mt-4 bg-gray-800/50 rounded-xl p-4 text-sm text-gray-400">
                                    Ödemenizi tamamladığınız an sisteminiz otomatik olarak kurulur ve fotoğraflarınızı yüklemeye başlayabilirsiniz.
                                </div>
                            </div>

                            {/* Taksit Seçenekleri Tablosu */}
                            {selectedPackage && (
                                <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Taksit Seçenekleri</h3>
                                    <style dangerouslySetInnerHTML={{
                                        __html: `
                                        #paytr_taksit_tablosu{clear: both;font-size: 12px;max-width: 1200px;text-align: center;font-family: inherit;}
                                        #paytr_taksit_tablosu::before {display: table;content: " ";}
                                        #paytr_taksit_tablosu::after {content: "";clear: both;display: table;}
                                        .taksit-tablosu-wrapper{margin: 5px;width: 100%; max-width: 280px; padding: 12px;cursor: default;text-align: center;display: inline-block;border: 1px solid #e1e1e1; border-radius: 12px;}
                                        .taksit-logo img{max-height: 28px;padding-bottom: 10px; margin: 0 auto;}
                                        .taksit-tutari-text{float: left;width: 50%;color: #a2a2a2;margin-bottom: 5px;}
                                        .taksit-tutar-wrapper{display: inline-block;background-color: #f7f7f7; width: 100%; border-radius: 8px; margin-bottom: 4px; overflow: hidden;}
                                        .taksit-tutar-wrapper:hover{background-color: #e8e8e8;}
                                        .taksit-tutari{float: left;width: 50%;padding: 6px 0;color: #474747;}
                                        .taksit-tutari:last-child {border-left: 2px solid #ffffff;}
                                        .taksit-tutari-bold{font-weight: bold;}
                                    `}} />
                                    <div id="paytr_taksit_tablosu"></div>
                                    <Script
                                        src={`https://www.paytr.com/odeme/taksit-tablosu/v2?token=4dda7b2cd16fea5352bf5b9c30c3fb9de51faef89644ab7c8924e93e5ce4c20c&merchant_id=675630&amount=${selectedPackage.amount}&taksit=0&tumu=0`}
                                        strategy="lazyOnload"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
