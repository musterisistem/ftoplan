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
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fade-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fade-right { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
                .animate-fade-up { animation: fade-up 0.8s ease-out forwards; }
                .animate-fade-up-1 { animation: fade-up 0.8s ease-out 0.1s forwards; opacity: 0; }
                .animate-fade-up-2 { animation: fade-up 0.8s ease-out 0.2s forwards; opacity: 0; }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            ` }} />

            <main className="min-h-screen bg-[#FDF8F5] pb-20">
                {/* Hero Section - Split Design */}
                <section className="min-h-screen flex flex-col lg:flex-row">
                    {/* Left - Dark Section */}
                    <div
                        className="flex-1 flex flex-col justify-center px-8 md:px-16 py-24 lg:py-0 relative overflow-hidden"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full" />
                        <div className="absolute bottom-20 right-10 w-32 h-32 border border-white/10 rounded-full" />

                        <div className="relative z-10 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 animate-fade-up">
                                <span className="text-white/70 text-xs uppercase tracking-wider">Premium Fotoğrafçılık</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6 animate-fade-up-1">
                                Anılarınızı
                                <br />
                                <span className="font-bold italic">Sanat Eserine</span>
                                <br />
                                Dönüştürüyoruz
                            </h1>

                            <p className="text-white/70 text-lg mb-10 max-w-md animate-fade-up-2">
                                {photographer.aboutText || 'Profesyonel ekibimizle, en değerli anlarınızı ölümsüzleştiriyoruz.'}
                            </p>

                            <div className="flex flex-wrap gap-4 animate-fade-up-2">
                                <Link
                                    href={`/studio/${slug}/gallery`}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl"
                                >
                                    Galeri
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href={`/studio/${slug}/packages`}
                                    className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-all"
                                >
                                    Paketler
                                </Link>
                            </div>

                            <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
                                {[
                                    { value: '500+', label: 'Mutlu Çift' },
                                    { value: '10+', label: 'Yıl Deneyim' },
                                    { value: '50+', label: 'Ödül' }
                                ].map((stat, i) => (
                                    <div key={i}>
                                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                                        <div className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right - Image Section */}
                    <div className="flex-1 relative min-h-[400px] lg:min-h-screen">
                        <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute bottom-8 left-8 right-8 flex gap-4">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${primaryColor}20` }}
                                >
                                    <Camera className="w-6 h-6" style={{ color: primaryColor }} />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">1000+</div>
                                    <div className="text-xs text-gray-500">Projeler</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Horizontal Photo Slider */}
                {portfolioPhotos.length > 0 && (
                    <section className="py-16 bg-[#FDF8F5]">
                        <div className="max-w-7xl mx-auto px-6 mb-6 flex items-center justify-between">
                            <div>
                                <span className="text-xs uppercase tracking-widest" style={{ color: primaryColor }}>Portfolyo</span>
                                <h2 className="text-3xl font-bold text-gray-900 mt-2">Son Çalışmalar</h2>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => scroll('left')}
                                    disabled={!canScrollLeft}
                                    className="p-3 rounded-full bg-white shadow-md border border-gray-100 disabled:opacity-30 hover:shadow-lg transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                                </button>
                                <button
                                    onClick={() => scroll('right')}
                                    disabled={!canScrollRight}
                                    className="p-3 rounded-full text-white shadow-md disabled:opacity-30 hover:shadow-lg transition-all"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div
                            ref={sliderRef}
                            className="flex gap-6 overflow-x-auto px-6 hide-scrollbar snap-x snap-mandatory"
                        >
                            {portfolioPhotos.map((photo: any, index: number) => (
                                <Link
                                    key={index}
                                    href={`/studio/${slug}/gallery`}
                                    className="flex-shrink-0 snap-start group"
                                    style={{ width: '340px', height: '450px' }}
                                >
                                    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl">
                                        <img
                                            src={photo.url}
                                            alt={photo.title || ''}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div
                                            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                                        />
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <div
                                                className="text-6xl font-bold opacity-20"
                                                style={{ color: 'white' }}
                                            >
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Features Section */}
                <section className="py-20 px-6 bg-[#FDF8F5]">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-xs uppercase tracking-widest" style={{ color: primaryColor }}>Neden Biz</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-4">Profesyonel Hizmet</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="relative">
                                    <div className="text-7xl font-bold opacity-10 mb-2" style={{ color: primaryColor }}>
                                        {feature.num}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 -mt-10">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-6" style={{ backgroundColor: primaryColor }}>
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Hikayenizi Anlatmaya Hazır mısınız?</h2>
                        <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">Size özel teklif almak için hemen iletişime geçin</p>
                        <Link
                            href={`/studio/${slug}/contact`}
                            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl text-lg"
                        >
                            İletişime Geç
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 bg-[#FDF8F5] text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} {photographer.studioName}
                </footer>
            </main>
        </>
    );
}
