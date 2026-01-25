'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ImageIcon, Package, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface WarmHomeProps {
    photographer: any;
    slug: string;
}

export default function WarmHome({ photographer, slug }: WarmHomeProps) {
    const primaryColor = photographer.primaryColor || '#8b4d62';
    const bgImage = photographer.bannerImage ||
        (photographer.portfolioPhotos?.[0]?.url) ||
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80';

    const portfolioPhotos = photographer.portfolioPhotos || [];
    const sliderRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        sliderRef.current?.addEventListener('scroll', checkScroll);
        return () => sliderRef.current?.removeEventListener('scroll', checkScroll);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fade-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-up { animation: fade-up 0.8s ease-out forwards; }
                .animate-fade-up-delay { animation: fade-up 0.8s ease-out 0.2s forwards; opacity: 0; }
                .animate-fade-up-delay-2 { animation: fade-up 0.8s ease-out 0.4s forwards; opacity: 0; }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            ` }} />

            <main className="min-h-screen relative overflow-hidden pb-20">
                {/* Warm Gradient Background */}
                <div
                    className="fixed inset-0 z-0"
                    style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #F5D5C8 30%, #FBEAE3 60%, #FDF8F5 100%)' }}
                />

                {/* Hero Section */}
                <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 pt-24 pb-16 z-10">
                    {/* Hero Image Container */}
                    <div className="relative w-full max-w-md md:max-w-lg mx-auto mb-8 animate-fade-up">
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-black/20 aspect-[3/4]">
                            <img src={bgImage} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#FBEAE3]/80 via-transparent to-transparent" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 text-center max-w-lg mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6 animate-fade-up">
                            <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
                            <span className="text-sm font-medium text-gray-700">Profesyonel Fotoğrafçılık</span>
                        </div>

                        <h1
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-up-delay"
                            style={{ fontFamily: 'Georgia, serif' }}
                        >
                            {photographer.studioName}
                        </h1>

                        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto animate-fade-up-delay">
                            {photographer.aboutText || 'Anlarınızı en güzel şekilde ölümsüzleştiriyoruz.'}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up-delay-2">
                            <Link
                                href={`/studio/${slug}/gallery`}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <ImageIcon className="w-5 h-5" />
                                Portfolyo
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href={`/studio/${slug}/packages`}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                <Package className="w-5 h-5" />
                                Paketler
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Horizontal Photo Slider */}
                {portfolioPhotos.length > 0 && (
                    <section className="relative z-10 py-12 bg-white/50 backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto px-6 mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                                    Çalışmalarımız
                                </h2>
                                <div className="w-12 h-1 mt-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => scroll('left')}
                                    disabled={!canScrollLeft}
                                    className="p-3 rounded-full bg-white shadow-md disabled:opacity-30 hover:shadow-lg transition-all"
                                    style={{ borderColor: primaryColor }}
                                >
                                    <ChevronLeft className="w-5 h-5" style={{ color: primaryColor }} />
                                </button>
                                <button
                                    onClick={() => scroll('right')}
                                    disabled={!canScrollRight}
                                    className="p-3 rounded-full bg-white shadow-md disabled:opacity-30 hover:shadow-lg transition-all"
                                >
                                    <ChevronRight className="w-5 h-5" style={{ color: primaryColor }} />
                                </button>
                            </div>
                        </div>

                        <div
                            ref={sliderRef}
                            className="flex gap-4 overflow-x-auto px-6 hide-scrollbar snap-x snap-mandatory"
                        >
                            {portfolioPhotos.map((photo: any, index: number) => (
                                <Link
                                    key={index}
                                    href={`/studio/${slug}/gallery`}
                                    className="flex-shrink-0 snap-start group"
                                    style={{ width: '280px', height: '360px' }}
                                >
                                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
                                        <img
                                            src={photo.url}
                                            alt={photo.title || ''}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                                            style={{ background: `linear-gradient(135deg, ${primaryColor}80, ${primaryColor}40)` }}
                                        >
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                                                <ArrowRight className="w-5 h-5 text-gray-800" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="relative z-10 py-8 px-6 bg-white/30 backdrop-blur-sm text-center border-t border-white/50">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} {photographer.studioName}
                    </p>
                </footer>
            </main>
        </>
    );
}
