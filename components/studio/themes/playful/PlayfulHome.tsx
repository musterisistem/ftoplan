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
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
                @keyframes fade-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-up { animation: fade-up 0.8s ease-out forwards; }
                .animate-fade-up-1 { animation: fade-up 0.8s ease-out 0.1s forwards; opacity: 0; }
                .animate-fade-up-2 { animation: fade-up 0.8s ease-out 0.2s forwards; opacity: 0; }
                .animate-fade-up-3 { animation: fade-up 0.8s ease-out 0.3s forwards; opacity: 0; }
                .script-font { font-family: 'Dancing Script', cursive; }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            ` }} />

            <main
                className="min-h-screen relative overflow-hidden pb-20"
                style={{ background: 'linear-gradient(180deg, #E8F4FC 0%, #FDF6F0 50%, #FEF7F0 100%)' }}
            >
                {/* Hero Section */}
                <section className="relative pt-28 pb-12 px-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-md mb-8 animate-fade-up">
                        <Star className="w-4 h-4" style={{ color: primaryColor }} />
                        <span className="text-sm font-medium text-gray-600">→</span>
                        <div
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${primaryColor}20` }}
                        >
                            <Sparkles className="w-3 h-3" style={{ color: primaryColor }} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Anı Yakalayın</span>
                    </div>

                    {/* Main Title with Script */}
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight animate-fade-up-1">
                        Hayalinizdeki{' '}
                        <span
                            className="script-font italic"
                            style={{ color: primaryColor }}
                        >
                            Düğün Fotoğrafları
                        </span>
                        <br />
                        Gerçek Olsun!
                    </h1>

                    {/* Description */}
                    <p className="text-gray-600 text-lg max-w-xl mx-auto mb-10 animate-fade-up-2">
                        {photographer.aboutText || 'En özel gününüzü profesyonel ekibimizle ölümsüzleştirin.'}
                    </p>

                    {/* CTA Button */}
                    <div className="animate-fade-up-3">
                        <Link
                            href={`/studio/${slug}/gallery`}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                            style={{ backgroundColor: '#1a1a1a' }}
                        >
                            Galeriyi İncele
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>

                {/* Horizontal Photo Slider */}
                {portfolioPhotos.length > 0 && (
                    <section className="py-8 relative">
                        <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Çalışmalarımız<span className="script-font italic ml-2" style={{ color: primaryColor }}>dan</span>
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => scroll('left')}
                                    disabled={!canScrollLeft}
                                    className="p-2 rounded-full bg-white shadow-md disabled:opacity-30 hover:shadow-lg transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                                </button>
                                <button
                                    onClick={() => scroll('right')}
                                    disabled={!canScrollRight}
                                    className="p-2 rounded-full bg-white shadow-md disabled:opacity-30 hover:shadow-lg transition-all"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-700" />
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
                                    style={{
                                        width: index % 3 === 1 ? '320px' : '260px',
                                        height: index % 3 === 1 ? '400px' : '340px'
                                    }}
                                >
                                    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl">
                                        <img
                                            src={photo.url}
                                            alt={photo.title || ''}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div
                                            className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Services Section */}
                <section className="py-16 px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                Neler{' '}
                                <span className="script-font italic" style={{ color: primaryColor }}>Sunuyoruz?</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: '📸', title: 'Dış Çekim', desc: 'Doğal ortamda profesyonel çekim' },
                                { icon: '💒', title: 'Düğün Hikayesi', desc: 'Tüm gün coverage' },
                                { icon: '🎬', title: 'Video Klip', desc: 'Sinematik düğün klibi' }
                            ].map((service, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
                                >
                                    <div className="text-4xl mb-4">{service.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                                    <p className="text-gray-600">{service.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section
                    className="py-16 px-6 mx-6 rounded-3xl mb-8"
                    style={{ backgroundColor: `${primaryColor}10` }}
                >
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Bir Sonraki Adımı{' '}
                            <span className="script-font italic" style={{ color: primaryColor }}>Atın</span>
                        </h2>
                        <p className="text-gray-600 mb-8">Tarihinizi belirleyin ve size özel teklif alın</p>
                        <Link
                            href={`/studio/${slug}/contact`}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white shadow-xl transition-all duration-300 hover:scale-105"
                            style={{ backgroundColor: primaryColor }}
                        >
                            İletişime Geç
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} {photographer.studioName}
                </footer>
            </main>
        </>
    );
}
