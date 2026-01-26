'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface PlayfulHomeProps {
    photographer: any;
    slug: string;
}

export default function PlayfulHome({ photographer, slug }: PlayfulHomeProps) {
    const primaryColor = photographer.primaryColor || '#f97316';
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
        <main className="min-h-screen relative pb-24 bg-[#E8F4FC]">
            {/* 1. Logo Section */}
            <div className="pt-8 pb-6 bg-[#E8F4FC] text-center">
                {photographer.logo ? (
                    <img src={photographer.logo} alt={photographer.studioName} className="h-16 md:h-20 w-auto mx-auto object-contain" />
                ) : (
                    <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                        {photographer.studioName}
                    </h1>
                )}
            </div>

            {/* 2. Banner/Slider Section */}
            <div className="relative w-full aspect-[4/3] md:aspect-[21/9] bg-white rounded-[2rem] mx-auto overflow-hidden max-w-[95%] shadow-lg border-4 border-white mb-8">
                <img
                    src={bgImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="max-w-4xl mx-auto px-6 space-y-12">
                {/* 3. About Section */}
                <section className="text-center bg-white p-6 rounded-3xl shadow-sm border-2 border-indigo-100">
                    <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-bold mb-4">HİKAYEMİZ</span>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        {photographer.aboutText || 'Hayatınızın en renkli anlarını yakalıyoruz!'}
                    </p>
                </section>

                {/* 4. Contact & Social Section */}
                <section className="text-center space-y-6">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-bold text-gray-400">BİZE ULAŞIN</span>
                        {photographer.phone && (
                            <a href={`tel:${photographer.phone}`} className="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-white px-6 py-2 rounded-full shadow-sm">
                                {photographer.phone}
                            </a>
                        )}
                    </div>

                    <div className="flex justify-center gap-4">
                        {photographer.instagram && (
                            <a href={photographer.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-pink-500 text-white rounded-2xl shadow-md hover:scale-110 transition-all rotate-3 hover:rotate-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </a>
                        )}
                        {photographer.facebook && (
                            <a href={photographer.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-600 text-white rounded-2xl shadow-md hover:scale-110 transition-all -rotate-3 hover:rotate-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            </a>
                        )}
                        {photographer.whatsapp && (
                            <a href={`https://wa.me/${photographer.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-green-500 text-white rounded-2xl shadow-md hover:scale-110 transition-all rotate-3 hover:rotate-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.24 14.76c-.22-.1-.95-.45-1.1-.5-.14-.06-.25-.08-.35.08-.11.16-.43.53-.52.64-.1.11-.2.13-.42.02a11.1 11.1 0 0 1-3.23-2 11.35 11.35 0 0 1-1.95-2.42c-.11-.2-.01-.3.09-.4.08-.09.19-.23.28-.35.1-.1.12-.18.18-.3.06-.12.03-.23-.01-.32-.05-.1-.45-1.09-.62-1.5-.16-.38-.33-.33-.45-.33-.12 0-.25 0-.38 0a.73.73 0 0 0-.54.26c-.19.2-.72.7-.72 1.71 0 1.01.74 2 .84 2.13.1.14 2.92 4.47 7.08 6.27.99.43 1.77.7 2.37.9.99.33 1.9.28 2.61.18.8-.12 2.48-1.02 2.83-2 .35-.99.35-1.83.25-2-.1-.18-.36-.28-.58-.39z" /></svg>
                            </a>
                        )}
                    </div>
                </section>

                {/* 5. Menu Links Grid */}
                <section className="grid grid-cols-2 gap-4 pt-4">
                    <Link href={`/studio/${slug}/gallery`} className="flex flex-col items-center p-6 bg-yellow-100 rounded-3xl hover:bg-yellow-200 transition-colors">
                        <span className="text-3xl mb-2">📸</span>
                        <span className="font-bold text-yellow-800">Galeri</span>
                    </Link>
                    <Link href={`/studio/${slug}/packages`} className="flex flex-col items-center p-6 bg-green-100 rounded-3xl hover:bg-green-200 transition-colors">
                        <span className="text-3xl mb-2">📦</span>
                        <span className="font-bold text-green-800">Paketler</span>
                    </Link>
                    <Link href={`/studio/${slug}/contact`} className="flex flex-col items-center p-6 bg-blue-100 rounded-3xl hover:bg-blue-200 transition-colors">
                        <span className="text-3xl mb-2">📞</span>
                        <span className="font-bold text-blue-800">İletişim</span>
                    </Link>
                    <Link href={`/studio/${slug}/about`} className="flex flex-col items-center p-6 bg-purple-100 rounded-3xl hover:bg-purple-200 transition-colors">
                        <span className="text-3xl mb-2">✨</span>
                        <span className="font-bold text-purple-800">Hakkımızda</span>
                    </Link>
                </section>
            </div>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-500 text-sm mt-12 mb-4">
                © {new Date().getFullYear()} {photographer.studioName}
            </footer>
        </main>
    );
}
