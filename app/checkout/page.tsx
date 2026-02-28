'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CreditCard, Lock, Building, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UpgradeSuccessFlow from '@/components/admin/UpgradeSuccessFlow';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderNo = searchParams.get('order');

    const [selectedPackage, setSelectedPackage] = useState<any | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Fetch the specific order details directly
    useEffect(() => {
        if (!orderNo) {
            router.push('/packages');
            return;
        }

        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${orderNo}`);
                const data = await res.json();

                if (data.success && data.order) {
                    setSelectedPackage({
                        name: data.order.packageName,
                        price: `₺${data.order.amount.toLocaleString('tr-TR')}`,
                        code: data.order.packageId,
                        orderNo: data.order.orderNo,
                    });
                } else {
                    setError('Sipariş bulunamadı veya süresi doldu.');
                }
            } catch (err) {
                console.error('Failed to load order', err);
                setError('Sipariş yüklenirken bir sorun oluştu.');
            }
        };
        fetchOrder();
    }, [orderNo, router]);

    if (!orderNo || (!selectedPackage && !error)) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;
    }

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            // Real Shopier Checkout for Credit Card
            const res = await fetch('/api/payment/shopier/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderNo: selectedPackage.orderNo }),
            });

            const data = await res.json();

            if (res.ok && data.success && data.html) {
                // Inject the form into the document and submit it automatically
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data.html;
                document.body.appendChild(tempDiv);

                const formElement = document.getElementById('shopier_form') as HTMLFormElement;
                if (formElement) {
                    formElement.submit();
                } else {
                    setError('Ödeme sayfasına yönlendirilemedi.');
                    setLoading(false);
                }
            } else {
                setError(data.error || 'Ödeme altyapısına bağlanılamadı.');
                setLoading(false);
            }
        } catch (err) {
            setError('Shopier servisine bağlanılırken hata oluştu. Lütfen tekrar deneyin.');
            setLoading(false);
        }
    };

    if (success) {
        return <SuccessFlow selectedPackage={selectedPackage} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-gray-900">Güvenli Ödeme</h1>
                    <p className="text-gray-500 mt-2">Aboneliğinizi başlatmak için ödeme adımını tamamlayın.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Payment Form */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-8 sm:p-10 text-center">
                                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CreditCard className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">Güvenli Kredi Kartı Ödemesi</h2>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
                                    Ödemenizi 256-bit SSL korumalı Shopier altyapısı üzerinden güvenle gerçekleştirebilirsiniz. İşleminiz tamamlandığında paneliniz otomatik olarak aktif edilecektir.
                                </p>

                                {error && (
                                    <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium flex items-start text-left">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handlePayment}
                                    disabled={loading}
                                    className="w-full max-w-md mx-auto py-4 bg-gradient-to-r from-[#5d2b72] to-purple-600 text-white font-bold rounded-xl shadow-[0_8px_25px_rgba(93,43,114,0.3)] hover:shadow-[0_12px_35px_rgba(93,43,114,0.4)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-lg"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <><Lock className="w-5 h-5" /> Shopier ile Güvenli Öde: {selectedPackage.price}</>
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
                                        <Building className="w-3.5 h-3.5" /> Shopier Güvencesi
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="w-full lg:w-96">
                        <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 text-white sticky top-8">
                            <h3 className="text-xl font-bold mb-6">Sipariş Özeti</h3>

                            <div className="flex justify-between items-center py-4 border-b border-gray-800">
                                <span className="text-gray-400">Paket</span>
                                <span className="font-medium text-white">{selectedPackage.name}</span>
                            </div>

                            <div className="flex justify-between items-center py-4 border-b border-gray-800">
                                <span className="text-gray-400">Süre</span>
                                <span className="font-medium text-white">Yıllık</span>
                            </div>

                            <div className="py-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-400">Toplam Tutar</span>
                                    <span className="text-3xl font-extrabold text-white">{selectedPackage.price}</span>
                                </div>
                                <p className="text-right text-xs text-gray-500 mt-1">KDV Dahildir</p>
                            </div>

                            <div className="mt-4 bg-gray-800/50 rounded-xl p-4 text-sm text-gray-400">
                                Ödemenizi tamamladığınız an sisteminiz otomatik olarak kurulur ve fotoğraflarınızı yüklemeye başlayabilirsiniz.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Success Flow Component ────────────────────────── */
function SuccessFlow({ selectedPackage }: { selectedPackage: any }) {
    return (
        <UpgradeSuccessFlow
            packageName={selectedPackage.name}
            onComplete={() => {
                window.location.href = '/admin/dashboard';
            }}
        />
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" /></div>}>
            <CheckoutContent />
        </Suspense>
    );
}
