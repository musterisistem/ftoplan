'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BromsHeroProps {
    studioName: string;
    bannerImage: string;
    primaryColor: string;
    sliderImages?: any[];
    logo?: string;
    heroTitle?: string;
    heroSubtitle?: string;
}

export default function BromsHero({ studioName, bannerImage, primaryColor, sliderImages = [], logo, heroTitle, heroSubtitle }: BromsHeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Prepare images: Use portfolio images if available, otherwise just the banner
    const images = sliderImages && sliderImages.length > 0
        ? sliderImages.map(img => img.url).slice(0, 5) // Limit to 5
        : [bannerImage || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop'];

    // Auto-play slider
    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    const nextSlide = () => setCurrentSlide(prev => (prev + 1) % images.length);
    const prevSlide = () => setCurrentSlide(prev => (prev - 1 + images.length) % images.length);

    return (
        <section className="relative w-full min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between overflow-hidden">
            {/* Background Slider */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.6, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${images[currentSlide]})` }}
                    />
                </AnimatePresence>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </div>

            {/* Navbar Placeholder - Handled by Global StudioTopNav */}
            {/* Keeping spacing for the fixed header */}
            <div className="relative z-20 px-6 md:px-12 py-6 pointer-events-none h-24"></div>

            {/* Main Content - Centered but Text Left aligned */}
            <div className="relative z-10 flex-grow flex items-center px-6 md:px-12 lg:px-24">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-[1px] w-12 bg-white/50" />
                            <span className="text-sm tracking-[0.3em] uppercase text-gray-300">
                                {heroSubtitle || 'Creative Studio'}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 font-syne whitespace-pre-line">
                            {heroTitle || 'Catch Your\nLife Moment'}
                        </h1>
                        {/* Play Video Button REMOVED as requested */}
                    </motion.div>
                </div>
            </div>

            {/* Bottom Slider Nav Only (Services Removed) */}
            <div className="relative z-20 px-6 md:px-16 lg:px-24 pb-12 flex justify-end">
                {images.length > 1 && (
                    <div className="flex gap-4">
                        <button onClick={prevSlide} className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextSlide} className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
