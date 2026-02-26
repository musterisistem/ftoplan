'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import PublicHeader from '@/components/layout/PublicHeader';
import { motion, AnimatePresence } from 'framer-motion';
import PublicFooter from '@/components/layout/PublicFooter';
import { useState, useEffect } from 'react';

const SLOGANS = [
    {
        line1: "İşinizi Büyütün.",
        line2: "WhatsApp'ı Bırakın.",
        description: "Randevu, kapora, fotoğraf seçimi, dijital sözleşme, ekip yönetimi ve çok daha fazlası. Tüm iş süreçleriniz tek platformda, tamamen otomatik."
    },
    {
        line1: "Sıradan Bir Takvim",
        line2: "Uygulaması Değiliz.",
        description: "Yüzlerce stüdyo sahibi ile konuştuk, her birinin aynı sorunları yaşadığını gördük. Çözümü sadece fotoğrafçılar için tasarladık."
    },
    {
        line1: "Tüm Stüdyonuzu",
        line2: "Dijitale Taşıyın.",
        description: "Randevodan sözleşmeye, fotoğraf seçiminden ödeme takibine kadar tüm iş süreçleriniz artık tek ekranda ve tamamen otomatik."
    }
];

export default function LandingPageClient() {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [videoReady, setVideoReady] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % SLOGANS.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [isPaused]);

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans antialiased">
            <PublicHeader variant="transparent" />

            {/* ── HERO ── */}
            <main className="flex-1 relative flex flex-col items-center justify-center overflow-hidden px-6 pt-40 pb-40 lg:pt-56 lg:pb-56 text-center">
                {/* BG Video and Overlay */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#f8faff]">
                    <iframe
                        className={`absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 grayscale-[20%] brightness-[90%] transition-opacity duration-1000 ${videoReady ? 'opacity-40' : 'opacity-0'}`}
                        src="https://www.youtube.com/embed/XKbh5CpkLDQ?autoplay=1&mute=1&loop=1&playlist=XKbh5CpkLDQ&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
                        allow="autoplay; encrypted-media"
                        frameBorder="0"
                        onLoad={() => setVideoReady(true)}
                    />
                    {/* Gradient Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f7eefa]/40 via-white/20 to-[#f7eefa]/40" />
                </div>

                <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#1a0b2e]/90 backdrop-blur-2xl border border-white/10 text-white text-[13px] font-black uppercase tracking-[0.2em] mb-12 group cursor-default relative overflow-hidden shadow-[0_0_40px_rgba(93,43,114,0.5)]"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />

                        <div className="relative z-10 flex items-center gap-2.5">
                            <Sparkles className="w-4 h-4 text-[#d4aae8]" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#f7eefa] to-white">
                                Türkiye&apos;nin Fotoğrafçı Yazılımı
                            </span>
                        </div>
                    </motion.div>

                    <div
                        className="relative w-full h-[400px] md:h-[320px] lg:h-[300px] flex items-center justify-center cursor-pointer"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="absolute inset-0 flex flex-col items-center justify-center p-4"
                            >
                                <h1 className="text-5xl md:text-6xl lg:text-[76px] font-black tracking-tight leading-[1.1] mb-8 drop-shadow-sm max-w-5xl">
                                    <span className="block text-slate-900 mb-2">
                                        {SLOGANS[index].line1}
                                    </span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5d2b72] to-[#7a3a94]">
                                        {SLOGANS[index].line2}
                                    </span>
                                </h1>

                                <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed font-medium px-6">
                                    {SLOGANS[index].description}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
                        <Link href="/packages" className="w-full sm:w-auto px-10 py-5 bg-[#5d2b72] rounded-full font-bold text-white text-[16px] hover:bg-[#4a2260] transition-all shadow-2xl shadow-[#c490d8]/60 flex items-center justify-center gap-2 hover:-translate-y-0.5">
                            3 Gün Ücretsiz Dene <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/ozellikler" className="w-full sm:w-auto px-10 py-5 bg-white/80 backdrop-blur-md border-2 border-gray-100 rounded-full font-bold text-gray-700 text-[16px] hover:bg-white hover:border-gray-200 transition-all shadow-sm flex items-center justify-center gap-2">
                            Özellikleri Keşfet
                        </Link>
                    </div>

                    {/* Deleted social proof section */}
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
