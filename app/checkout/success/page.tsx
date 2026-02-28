'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { CheckCircle, Loader2 } from 'lucide-react';

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'verifying' | 'success' | 'redirecting' | 'error'>('verifying');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('success');
            return;
        }

        let pollCount = 0;
        const maxPolls = 15; // Toplamda ~30 saniye bekler (15 * 2000)

        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/payment/paytr/status?token=${token}`);
                const data = await res.json();

                if (data.success && data.status === 'completed') {
                    // Ödeme başarılı, üyeliği açılmış, login olalım
                    setStatus('redirecting');

                    const loginRes = await signIn('credentials', {
                        autoLoginToken: token,
                        redirect: false,
                    });

                    if (loginRes?.ok && !loginRes.error) {
                        router.push('/admin/dashboard');
                    } else {
                        // Eğer otomatik login olamazsa normal başarılı sayfasını göstersin
                        setStatus('success');
                    }
                } else if (!data.success && data.error === 'Sipariş bulunamadı veya bağlantı süresi dolmuş') {
                    // Hatalı token veya süre dolmuş
                    setStatus('success');
                } else {
                    // Hala pending...
                    pollCount++;
                    if (pollCount < maxPolls) {
                        setTimeout(checkStatus, 2000);
                    } else {
                        setStatus('success'); // Beklemekten sıkıldık, manuel giriş yapsın
                    }
                }
            } catch (err) {
                console.error('Status check error:', err);
                setStatus('success'); // Hata durumunda da standart başarılı ekranında kalsın
            }
        };

        checkStatus();
    }, [token, router]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">

                {status === 'verifying' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-[#5d2b72] animate-spin mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Doğrulanıyor...</h2>
                        <p className="text-gray-500">Lütfen sayfadan ayrılmayın, üyeliğiniz aktifleştiriliyor.</p>
                    </div>
                )}

                {status === 'redirecting' && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kurulum Tamamlandı!</h2>
                        <p className="text-gray-500 mb-6">Yönetim paneline yönlendiriliyorsunuz...</p>
                        <Loader2 className="w-8 h-8 text-[#5d2b72] animate-spin" />
                    </div>
                )}

                {(status === 'success' || status === 'error') && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Ödeme Başarılı!</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {errorMsg || 'Ödemeniz başarıyla alındı. Hesabınız arka planda aktifleştiriliyor. Müşteri panelinizi hemen kullanmaya başlayabilirsiniz.'}
                        </p>
                        <button
                            onClick={() => router.push('/login')}
                            className="inline-block w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all text-lg"
                        >
                            Panele Giriş Yap
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin w-12 h-12 text-purple-600" /></div>}>
            <SuccessContent />
        </Suspense>
    );
}
