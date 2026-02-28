'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

interface UpgradeSuccessFlowProps {
    packageName: string;
    onComplete?: () => void;
    isModal?: boolean;
}

export default function UpgradeSuccessFlow({
    packageName,
    onComplete,
    isModal = false
}: UpgradeSuccessFlowProps) {
    const [stage, setStage] = useState<'confirmed' | 'preparing'>('confirmed');
    const [progress, setProgress] = useState(0);
    const [checklistIndex, setChecklistIndex] = useState(-1);
    const [dots, setDots] = useState('');

    const checklist = [
        "Üyelik bilgileriniz güvenli sunucuya aktarılıyor...",
        "Lisans anahtarınız doğrulanıyor ve aktif ediliyor...",
        "Firmanıza özel veritabanı izolasyonu yapılandırılıyor...",
        "Mobil uygulama altyapınız hazırlanıyor...",
        "Mobil uygulama kurulumunuz başladı...",
        "Mobil uygulama kurulumunuz başarıyla tamamlandı.",
        "Sistem optimizasyonu ve son güvenlik kontrolleri yapılıyor...",
        "Paneliniz başlatılıyor..."
    ];

    useEffect(() => {
        const dotsInterval = setInterval(() => {
            setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);
        return () => clearInterval(dotsInterval);
    }, []);

    useEffect(() => {
        // Timeline:
        // 0-4s: Success Confirmed Phase
        // 4-x: Preparing Phase

        const stage1Timeout = setTimeout(() => {
            setStage('preparing');
        }, 4000);

        // 8 items in checklist. We want each item to show for ~4.5 seconds.
        // Total preparing time = 8 * 4500 = 36000ms.
        // After 36s, the panel should start immediately.

        const stage2Timeout = setTimeout(() => {
            if (onComplete) {
                onComplete();
            } else {
                window.location.href = '/admin/dashboard';
            }
        }, 40000); // 4000 (stage1) + 36000 (stage2) = 40000ms total

        const checklistInterval = setInterval(() => {
            setChecklistIndex((prev: number) => {
                if (prev < checklist.length - 1) return prev + 1;
                return prev;
            });
        }, 4500);

        // Global progress bar (40s total = 40000ms. Update every 50ms)
        const progressInterval = setInterval(() => {
            setProgress((prev: number) => {
                const step = 100 / (40000 / 50);
                return Math.min(prev + step, 100);
            });
        }, 50);

        return () => {
            clearTimeout(stage1Timeout);
            clearTimeout(stage2Timeout);
            clearInterval(checklistInterval);
            clearInterval(progressInterval);
        };
    }, [onComplete]);

    const content = (
        <div className={`w-full min-h-screen flex flex-col items-center justify-center relative bg-[#0a0510] ${isModal ? '' : 'p-12'}`}>
            <AnimatePresence mode="wait">
                {stage === 'confirmed' ? (
                    <motion.div
                        key="confirmed"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="text-center"
                    >
                        <div className="relative mx-auto w-32 h-32 mb-10">
                            {/* Outer Glow */}
                            <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-2xl animate-pulse" />

                            {/* Spinning Rings */}
                            <motion.div
                                className="absolute inset-0 border-2 border-transparent border-t-purple-500 border-r-purple-500/30 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />

                            <div className="absolute inset-0 flex items-center justify-center bg-[#1a0b2e] rounded-full shadow-[inset_0_0_20px_rgba(123,63,242,0.3)] border border-white/10 m-3">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12 }}
                                >
                                    <CheckCircle className="w-12 h-12 text-purple-400" />
                                </motion.div>
                            </div>
                        </div>

                        <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
                            Ödeme Başarıyla Alındı!
                        </h2>
                        <p className="text-slate-400 font-bold text-lg">
                            <span className="text-purple-400">{packageName}</span> paketiniz tanımlanıyor.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preparing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full flex flex-col items-center pb-20"
                    >
                        {/* Orbit Rings aligned perfectly to match image */}
                        <div className="relative w-[180px] h-[180px] flex items-center justify-center mb-16">
                            <div className="absolute inset-[-30%] bg-[#7b3ff2]/10 rounded-full blur-3xl" />

                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-[0.5px] border-t-purple-500/60 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-6 border-[0.5px] border-b-[#7b3ff2]/40 border-r-transparent border-t-transparent border-l-transparent rounded-full"
                            />

                            <div className="relative z-10 w-28 h-28 bg-[#11081f] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(123,63,242,0.15)] border border-white/5">
                                <span className="text-white text-[32px] font-black tracking-[-0.05em] drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">weey</span>
                            </div>

                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0"
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#a855f7] rounded-full shadow-[0_0_12px_#a855f7]" />
                            </motion.div>
                        </div>

                        <h2 className="text-[32px] font-black text-white mb-16 tracking-tight drop-shadow-md">
                            Paneliniz Hazırlanıyor ..
                        </h2>

                        {/* Left Aligned Checklist matching exactly the image */}
                        <div className="w-full max-w-[500px] flex flex-col gap-[18px]">
                            {checklist.map((item, idx) => {
                                const isPast = idx < checklistIndex;
                                const isCurrent = idx === checklistIndex;
                                const isFuture = idx > checklistIndex;

                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{
                                            opacity: isPast || isCurrent ? 1 : 0.0,
                                            x: isFuture ? -10 : 0,
                                            color: isCurrent ? '#ffffff' : '#6b7280' // Current is white, past is gray
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex items-center gap-5 text-[14px] leading-none ${isCurrent ? 'font-black' : 'font-medium'} tracking-tight px-4`}
                                    >
                                        <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                            {isPast ? (
                                                <div className="w-4 h-4 rounded-full border-[1.5px] border-[#374151]" />
                                            ) : isCurrent ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                    className="w-4 h-4 rounded-full border-[1.5px] border-t-[#a855f7] border-white/20"
                                                />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border-[1.5px] border-transparent" />
                                            )}
                                        </div>
                                        <span className="flex-1 text-left">{item}</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Progress Area - Matches new screenshot exactly (thin line crossing full width) */}
            <div className="absolute bottom-16 left-0 right-0 w-full px-8 opacity-80">
                <div className="w-full h-[2px] bg-white/5 overflow-hidden">
                    <motion.div
                        className="h-full bg-[#a855f7]"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear", duration: 0.1 }}
                    />
                </div>
            </div>
        </div>
    );

    if (isModal) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0510]">
                {content}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0510] relative overflow-hidden">
            {/* Background ambient glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="relative z-10 w-full flex flex-col items-center">
                {content}
            </div>
        </div>
    );
}
