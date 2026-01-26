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
        <main className="min-h-screen relative pb-24" style={{ backgroundColor: '#FDF8F5' }}>
            {/* 1. Logo Section */}
            <div className="pt-8 pb-6 bg-white/50 backdrop-blur-sm text-center">
                {photographer.logo ? (
                    <img src={photographer.logo} alt={photographer.studioName} className="h-16 md:h-20 w-auto mx-auto object-contain" />
                ) : (
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
                        {photographer.studioName}
                    </h1>
                )}
            </div>

            {/* 2. Banner/Slider Section */}
            <div className="relative w-full aspect-[4/3] md:aspect-[21/9] bg-gray-100 mb-8">
                <img
                    src={bgImage}
                    alt="Cover"
                    className="w-full h-full object-cover shadow-sm"
                />
            </div>

            <div className="max-w-4xl mx-auto px-6 space-y-12">
                {/* 3. About Section */}
                <section className="text-center">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="h-px w-8 bg-gray-300"></div>
                        <span className="text-sm uppercase tracking-widest text-gray-500">Hakkımızda</span>
                        <div className="h-px w-8 bg-gray-300"></div>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed font-light">
                        {photographer.aboutText || 'Hoşgeldiniz. En özel anlarınızı ölümsüzleştirmek için buradayız.'}
                    </p>
                </section>

                {/* 4. Contact & Social Section */}
                <section className="text-center space-y-6">
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-sm font-medium text-gray-400">İLETİŞİM</span>
                        {photographer.phone && (
                            <a href={`tel:${photographer.phone}`} className="text-2xl font-serif text-gray-900 hover:opacity-70 transition-opacity">
                                {photographer.phone}
                            </a>
                        )}
                    </div>

                    <div className="flex justify-center gap-6 pt-4">
                        {photographer.instagram && (
                            <a href={photographer.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-pink-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </a>
                        )}
                        {photographer.facebook && (
                            <a href={photographer.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            </a>
                        )}
                        {photographer.whatsapp && (
                            <a href={`https://wa.me/${photographer.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-green-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.24 14.76c-.22-.1-.95-.45-1.1-.5-.14-.06-.25-.08-.35.08-.11.16-.43.53-.52.64-.1.11-.2.13-.42.02a11.1 11.1 0 0 1-3.23-2 11.35 11.35 0 0 1-1.95-2.42c-.11-.2-.01-.3.09-.4.08-.09.19-.23.28-.35.1-.1.12-.18.18-.3.06-.12.03-.23-.01-.32-.05-.1-.45-1.09-.62-1.5-.16-.38-.33-.33-.45-.33-.12 0-.25 0-.38 0a.73.73 0 0 0-.54.26c-.19.2-.72.7-.72 1.71 0 1.01.74 2 .84 2.13.1.14 2.92 4.47 7.08 6.27.99.43 1.77.7 2.37.9.99.33 1.9.28 2.61.18.8-.12 2.48-1.02 2.83-2 .35-.99.35-1.83.25-2-.1-.18-.36-.28-.58-.39z" /></svg>
                            </a>
                        )}
                    </div>
                </section>

                {/* 5. Menu Links Grid */}
                <section className="grid grid-cols-2 gap-4 pt-8">
                    <Link href={`/studio/${slug}/gallery`} className="block p-6 bg-white rounded-xl shadow-sm text-center border-b-4 border-pink-100 hover:-translate-y-1 transition-transform">
                        <ImageIcon className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                        <span className="font-semibold text-gray-700">Galeri</span>
                    </Link>
                    <Link href={`/studio/${slug}/packages`} className="block p-6 bg-white rounded-xl shadow-sm text-center border-b-4 border-purple-100 hover:-translate-y-1 transition-transform">
                        <Package className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <span className="font-semibold text-gray-700">Paketler</span>
                    </Link>
                    <Link href={`/studio/${slug}/contact`} className="block p-6 bg-white rounded-xl shadow-sm text-center border-b-4 border-blue-100 hover:-translate-y-1 transition-transform">
                        <ArrowRight className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <span className="font-semibold text-gray-700">İletişim</span>
                    </Link>
                    <Link href={`/studio/${slug}/about`} className="block p-6 bg-white rounded-xl shadow-sm text-center border-b-4 border-orange-100 hover:-translate-y-1 transition-transform">
                        <Sparkles className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                        <span className="font-semibold text-gray-700">Hakkımızda</span>
                    </Link>
                </section>
            </div>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-400 text-sm mt-12 mb-4">
                © {new Date().getFullYear()} {photographer.studioName}
            </footer>
        </main>
    );
}
