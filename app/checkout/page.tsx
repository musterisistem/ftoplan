'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CreditCard, Lock, Building, CheckCircle, ArrowRight } from 'lucide-react';

const PACKAGES = {
    standart: { name: 'Standart Paket', price: '4.999 ₺', code: 'standart' },
    kurumsal: { name: 'Kurumsal Paket', price: '9.999 ₺', code: 'kurumsal' }
};

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const packageCode = searchParams.get('package') as keyof typeof PACKAGES;
    const selectedPackage = PACKAGES[packageCode];

    const [paymentMethod, setPaymentMethod] = useState<'cc' | 'transfer'>('cc');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form states for Fake CC
    const [ccName, setCcName] = useState('');
    const [ccNumber, setCcNumber] = useState('');
    const [ccExpiry, setCcExpiry] = useState('');
    const [ccCvv, setCcCvv] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?redirect=/checkout?package=' + packageCode);
        }
        if (status === 'authenticated' && !selectedPackage) {
            router.push('/packages');
        }
    }, [status, selectedPackage, router, packageCode]);

    if (!selectedPackage || status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;
    }

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Mock API request to activate package
            const res = await fetch('/api/payment/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    packageCode: selectedPackage.code,
                    paymentMethod,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                // Redirect to dashboard after 3 seconds
                setTimeout(() => {
                    router.push('/admin/dashboard');
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

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600 animate-bounce" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Ödeme Başarılı!</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Tebrikler, <strong>{selectedPackage.name}</strong> aboneliğiniz aktif edildi. Yönetim paneline yönlendiriliyorsunuz...
                    </p>
                    <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
                </div>
            </div>
        );
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
                            {/* Tabs */}
                            <div className="flex border-b border-gray-200">
                                <button
                                    onClick={() => setPaymentMethod('cc')}
                                    className={`flex-1 py-4 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 ${paymentMethod === 'cc' ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <CreditCard className="w-5 h-5" /> Kredi / Banka Kartı
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('transfer')}
                                    className={`flex-1 py-4 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 ${paymentMethod === 'transfer' ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <Building className="w-5 h-5" /> Havale / EFT
                                </button>
                            </div>

                            <div className="p-6 sm:p-8">
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 font-medium">
                                        {error}
                                    </div>
                                )}

                                {paymentMethod === 'cc' ? (
                                    <form onSubmit={handlePayment} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Kart Üzerindeki İsim</label>
                                            <input type="text" required value={ccName} onChange={(e) => setCcName(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all" placeholder="AD SOYAD" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
                                            <div className="relative">
                                                <input type="text" required maxLength={19} value={ccNumber} onChange={(e) => setCcNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-mono" placeholder="0000 0000 0000 0000" />
                                                <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma (AA/YY)</label>
                                                <input type="text" required maxLength={5} value={ccExpiry} onChange={(e) => {
                                                    let val = e.target.value.replace(/\D/g, '');
                                                    if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                                    setCcExpiry(val);
                                                }} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-mono" placeholder="MM/YY" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                                <input type="text" required maxLength={3} value={ccCvv} onChange={(e) => setCcCvv(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-mono" placeholder="123" />
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button type="submit" disabled={loading} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Lock className="w-4 h-4" /> {selectedPackage.price} Öde ve Başla</>}
                                            </button>
                                        </div>
                                        <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                                            <Lock className="w-3 h-3" /> 256-bit SSL sertifikası ile ödemeniz güvence altındadır. (Demo Mode)
                                        </p>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 leading-relaxed">
                                            Lütfen aşağıda yer alan banka hesabımıza sipariş tutarını havale edin. Açıklama kısmına kayıt olduğunuz <strong>e-posta adresini</strong> veya <strong>firma adınızı</strong> yazmayı unutmayın. Yönetim ekibi ödemeyi doğruladığında hesabınız aktif edilecektir (Demo).
                                        </div>
                                        <div className="space-y-4">
                                            <div className="p-4 border border-gray-200 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Banka Adı</p>
                                                <p className="font-medium text-gray-900">Garanti BBVA</p>
                                            </div>
                                            <div className="p-4 border border-gray-200 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Alıcı Adı</p>
                                                <p className="font-medium text-gray-900">Weey Yazılım A.Ş.</p>
                                            </div>
                                            <div className="p-4 border border-gray-200 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">IBAN</p>
                                                <p className="font-mono text-gray-900">TR12 0006 2000 0001 2345 6789 01</p>
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <button onClick={handlePayment} disabled={loading} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Havale Bildirimi Yap ve Bekle</>}
                                            </button>
                                        </div>
                                    </div>
                                )}
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
