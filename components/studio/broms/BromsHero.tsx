'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BromsHeroProps {
    studioName: string;
    bannerImage: string;
    primaryColor: string;
    sliderImages?: any[];
    logo?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    isLight?: boolean;
    slug: string; // Added slug prop
}

export default function BromsHero({ studioName, bannerImage, primaryColor, sliderImages = [], logo, heroTitle, heroSubtitle, isLight = false, slug }: BromsHeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Format slider images
    const images = sliderImages && sliderImages.length > 0
        ? sliderImages.map(img => img.url).slice(0, 5)
        : [bannerImage || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop'];

    useEffect(() => {
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
        setIsLoaded(true);

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [images]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

    const loaderBg = isLight ? 'bg-[#FFFBF0]' : 'bg-neutral-900';
    const overlayClass = isLight ? 'bg-[#FFFBF0]/60' : 'bg-black/40';
    const textColor = isLight ? 'text-[#831843]' : 'text-white';
    const subTextColor = isLight ? 'text-[#9D174D]' : 'text-white/90';
    const arrowsColor = isLight ? 'text-[#831843]/50 hover:text-[#831843]' : 'text-white/50 hover:text-white';

    const btnPrimary = isLight
        ? 'bg-gradient-to-r from-pink-600 to-rose-700 text-white hover:shadow-lg hover:shadow-rose-600/30 border-none'
        : 'bg-white text-black hover:bg-opacity-90';

    const btnSecondary = isLight
        ? 'border-pink-600/30 text-pink-700 hover:bg-pink-50 hover:border-pink-600'
        : 'border-white/30 text-white hover:bg-white hover:text-black';

    if (!isLoaded) return <div className={`h-screen w-full ${loaderBg}`} />;

    return (
        <header className={`relative h-screen w-full overflow-hidden ${loaderBg}`}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${images[currentSlide]})` }}
                    />
                    <div className={`absolute inset-0 ${overlayClass} transition-colors duration-700`} />
                </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
                <>
                    <button onClick={prevSlide} className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 transition-colors ${arrowsColor}`}>
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button onClick={nextSlide} className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 transition-colors ${arrowsColor}`}>
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </>
            )}

            <div className={`relative z-10 h-full flex flex-col justify-center items-center text-center px-4 ${textColor}`}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="max-w-4xl"
                >
                    <h1 className="text-sm md:text-base font-bold tracking-[0.5em] uppercase mb-4 opacity-80">
                        {studioName}
                    </h1>

                    <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 font-syne drop-shadow-sm">
                        {heroTitle || "Anları Yakala"}
                    </h2>

                    <p className={`text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12 ${subTextColor}`}>
                        {heroSubtitle || "Profesyonel stüdyo çekimleri ve dış mekan fotoğrafçılığı ile en özel anlarınızı ölümsüzleştiriyoruz."}
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        <Link
                            href={`/studio/${slug}/contact`}
                            className={`group relative inline-flex items-center gap-3 px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all overflow-hidden rounded-full ${btnPrimary}`}
                        >
                            <span>Randevu Al</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href={`/studio/${slug}/gallery`}
                            className={`inline-flex items-center gap-3 px-8 py-4 border text-sm font-bold tracking-widest uppercase transition-all rounded-full ${btnSecondary}`}
                        >
                            <span>Mutlu Çiftlerimiz</span>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60"
                >
                    <div className={`w-[1px] h-12 ${isLight ? 'bg-[#831843]/50' : 'bg-white/50'}`} />
                    <span className="text-[10px] tracking-[0.3em] uppercase">Kaydır</span>
                </motion.div>
            </div>
        </header>
    );
}
