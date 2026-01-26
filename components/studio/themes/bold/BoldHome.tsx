'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Camera, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface BoldHomeProps {
    photographer: any;
    slug: string;
}

export default function BoldHome({ photographer, slug }: BoldHomeProps) {
    const primaryColor = photographer.primaryColor || '#7c2d3e';
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
            const scrollAmount = direction === 'left' ? -350 : 350;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const features = [
        { num: '01', title: 'Profesyonel Çekim', desc: 'En son teknoloji ekipmanlarla çalışıyoruz.' },
        { num: '02', title: 'Kreatif Düzenleme', desc: 'Her fotoğraf özenle işlenir.' },
        { num: '03', title: 'Hızlı Teslimat', desc: 'Albümünüz kısa sürede elinizde.' }
    ];

    return (
        <main className="min-h-screen relative pb-24 bg-white text-gray-900">
            {/* 1. Logo Section */}
            <div className="pt-8 pb-6 bg-white text-center">
                {photographer.logo ? (
                    <img src={photographer.logo} alt={photographer.studioName} className="h-16 md:h-24 w-auto mx-auto object-contain" />
                ) : (
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-gray-900">
                        {photographer.studioName}
                    </h1>
                )}
            </div>

            {/* 2. Banner/Slider Section */}
            <div className="relative w-full h-[50vh] bg-black mb-12">
                <img
                    src={bgImage}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-90"
                />
            </div>

            <div className="max-w-4xl mx-auto px-6 space-y-16">
                {/* 3. About Section */}
                <section className="text-center">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-gray-400">Hakkımızda</h2>
                    <p className="text-xl md:text-2xl font-bold leading-tight text-gray-900">
                        {photographer.aboutText || 'Profesyonel bakış açısıyla en iyi kareleri yakalıyoruz.'}
                    </p>
                </section>

                {/* 4. Contact & Social Section */}
                <section className="text-center space-y-8 border-t border-b border-gray-100 py-12">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-900">İLETİŞİM</span>
                        {photographer.phone && (
                            <a href={`tel:${photographer.phone}`} className="text-3xl font-black tracking-tight hover:text-gray-600 transition-colors">
                                {photographer.phone}
                            </a>
                        )}
                    </div>

                    <div className="flex justify-center gap-4">
                        {photographer.instagram && (
                            <a href={photographer.instagram} target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-100 hover:bg-black hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </a>
                        )}
                        {photographer.facebook && (
                            <a href={photographer.facebook} target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-100 hover:bg-black hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            </a>
                        )}
                        {photographer.whatsapp && (
                            <a href={`https://wa.me/${photographer.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-100 hover:bg-black hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.24 14.76c-.22-.1-.95-.45-1.1-.5-.14-.06-.25-.08-.35.08-.11.16-.43.53-.52.64-.1.11-.2.13-.42.02a11.1 11.1 0 0 1-3.23-2 11.35 11.35 0 0 1-1.95-2.42c-.11-.2-.01-.3.09-.4.08-.09.19-.23.28-.35.1-.1.12-.18.18-.3.06-.12.03-.23-.01-.32-.05-.1-.45-1.09-.62-1.5-.16-.38-.33-.33-.45-.33-.12 0-.25 0-.38 0a.73.73 0 0 0-.54.26c-.19.2-.72.7-.72 1.71 0 1.01.74 2 .84 2.13.1.14 2.92 4.47 7.08 6.27.99.43 1.77.7 2.37.9.99.33 1.9.28 2.61.18.8-.12 2.48-1.02 2.83-2 .35-.99.35-1.83.25-2-.1-.18-.36-.28-.58-.39z" /></svg>
                            </a>
                        )}
                    </div>
                </section>

                {/* 5. Menu Links Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href={`/studio/${slug}/gallery`} className="group block p-8 bg-black text-white text-center hover:bg-gray-900 transition-colors">
                        <span className="font-bold uppercase tracking-widest group-hover:underline decoration-2 underline-offset-4">Galeri</span>
                    </Link>
                    <Link href={`/studio/${slug}/packages`} className="group block p-8 bg-gray-100 text-gray-900 text-center hover:bg-gray-200 transition-colors">
                        <span className="font-bold uppercase tracking-widest">Paketler</span>
                    </Link>
                    <Link href={`/studio/${slug}/contact`} className="group block p-8 bg-gray-100 text-gray-900 text-center hover:bg-gray-200 transition-colors">
                        <span className="font-bold uppercase tracking-widest">İletişim</span>
                    </Link>
                    <Link href={`/studio/${slug}/about`} className="group block p-8 bg-black text-white text-center hover:bg-gray-900 transition-colors">
                        <span className="font-bold uppercase tracking-widest group-hover:underline decoration-2 underline-offset-4">Hakkımızda</span>
                    </Link>
                </section>
            </div>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-400 text-xs uppercase tracking-widest mt-12 mb-4">
                © {new Date().getFullYear()} {photographer.studioName}
            </footer>
        </main>
    );
}
