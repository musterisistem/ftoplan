'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { CheckCircle, Loader2, Sparkles } from 'lucide-react';
import UpgradeSuccessFlow from '@/components/admin/UpgradeSuccessFlow';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

function WelcomeScreen({ onMount, onClose }: { onMount: () => void, onClose: () => void }) {
    useEffect(() => {
        onMount();
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0510] flex items-center justify-center relative overflow-hidden px-4">
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="bg-[#11081f] border border-white/10 p-8 sm:p-12 rounded-3xl shadow-[0_0_50px_rgba(123,63,242,0.15)] max-w-lg w-full text-center relative z-10"
            >
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 mb-8 transform hover:rotate-12 transition-transform">
                    <Sparkles className="w-12 h-12 text-white" />
                </div>

                <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-md">
                    Aramıza Hoş Geldiniz!
                </h1>
                <p className="text-slate-300 text-lg mb-10 leading-relaxed font-medium">
                    Yönetim paneliniz başarıyla kuruldu ve tüm modülleriniz aktif edildi. Sisteminizi kullanmaya hemen başlayabilirsiniz.
                </p>

                <button
                    onClick={onClose}
                    className="w-full py-4 bg-white text-black font-black text-lg rounded-xl hover:scale-[1.02] hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                    Panele Geçiş Yap
                </button>
            </motion.div>
        </div>
    );
}

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    type ViewState = 'verifying' | 'successFlow' | 'welcome' | 'error';
    const [view, setView] = useState<ViewState>('verifying');
    const [packageName] = useState('Premium Paket');

    useEffect(() => {
        if (!token) {
            setView('error');
            return;
        }

        let pollCount = 0;
        const maxPolls = 15;

        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/payment/paytr/status?token=${token}`);
                const data = await res.json();

                if (data.success && data.status === 'completed') {
                    // Try to auto login in the background!
                    await signIn('credentials', {
                        autoLoginToken: token,
                        redirect: false,
                    });

                    // Start the 40-second long animation flow!
                    setView('successFlow');
                } else if (!data.success && data.error === 'Sipariş bulunamadı veya bağlantı süresi dolmuş') {
                    setView('error');
                } else {
                    pollCount++;
                    if (pollCount < maxPolls) {
                        setTimeout(checkStatus, 2000);
                    } else {
                        setView('error');
                    }
                }
            } catch (err) {
                console.error('Status check error:', err);
                setView('error');
            }
        };

        checkStatus();
    }, [token]);

    const handleFlowComplete = () => {
        // Upgrade flow bitince karşılama ekranına geç
        setView('welcome');
    };

    const handleWelcomeScreenLoad = () => {
        // Havai fişekleri patlatıyoruz!
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    if (view === 'successFlow') {
        return <UpgradeSuccessFlow packageName={packageName} onComplete={handleFlowComplete} isModal={false} />;
    }

    if (view === 'welcome') {
        return <WelcomeScreen onMount={handleWelcomeScreenLoad} onClose={() => router.push('/admin/dashboard')} />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <PublicHeader />
            <main className="flex-1 flex flex-col justify-center items-center pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">

                    {view === 'verifying' && (
                        <div className="flex flex-col items-center">
                            <Loader2 className="w-16 h-16 text-[#5d2b72] animate-spin mb-6" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Doğrulanıyor...</h2>
                            <p className="text-gray-500">Lütfen bekleyin, sunucu ile iletişim halindeyiz.</p>
                        </div>
                    )}

                    {view === 'error' && (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Ödeme Onaylandı!</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Ödemeniz başarıyla alındı ve hesabınız aktifleştirildi. Yönetim paneline giriş yapabilirsiniz.
                            </p>
                            <button
                                onClick={() => router.push('/login')}
                                className="inline-block w-full py-4 bg-gradient-to-r from-[#5d2b72] to-purple-600 text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all text-lg"
                            >
                                Panele Giriş Yap
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin w-12 h-12 text-[#5d2b72]" /></div>}>
            <SuccessContent />
        </Suspense>
    );
}
