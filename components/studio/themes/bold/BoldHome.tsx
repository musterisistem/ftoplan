'use client';

import { Heart, Phone, Instagram, Facebook, Mail } from 'lucide-react';
import ModernHero from '@/components/studio/ModernHero';
import MasonryPortfolio from '@/components/studio/MasonryPortfolio';
import { useEffect, useState } from 'react';

export default function BoldHome({ photographer, slug }: { photographer: any; slug: string }) {
    const primaryColor = photographer.primaryColor || '#7c2d3e';
    const [photos, setPhotos] = useState<any[]>([]);

    useEffect(() => {
        if (photographer.portfolioPhotos && photographer.portfolioPhotos.length > 0) {
            setPhotos(photographer.portfolioPhotos);
        }
    }, [photographer]);

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap');
                .font-serif { font-family: 'Playfair Display', serif; }
                .font-sans { font-family: 'Inter', sans-serif; }
            ` }} />

            <main className="min-h-screen bg-[#F9F9F9] font-sans selection:bg-black selection:text-white">

                {/* 1. Hero Section */}
                <ModernHero
                    studioName={photographer.studioName}
                    bannerImage={photographer.bannerImage}
                    logo={photographer.logo}
                    primaryColor={primaryColor}
                />

                {/* 2. Abstract Intro / About */}
                <section className="py-24 px-6 md:px-12 bg-white text-center">
                    <div className="max-w-3xl mx-auto">
                        <Heart className="w-8 h-8 mx-auto mb-6 opacity-30" style={{ color: primaryColor }} />
                        <p className="text-2xl md:text-3xl font-serif leading-relaxed text-gray-800 italic">
                            "{photographer.aboutText || 'Fotoğrafçılık bizim için sadece bir iş değil, ışıkla şiir yazma sanatıdır. En değerli anlarınızı sonsuzluğa taşıyoruz.'}"
                        </p>
                        <div className="mt-8 h-1 w-20 bg-gray-200 mx-auto" />
                    </div>
                </section>

                {/* 3. Portfolio Grid (Masonry) */}
                <MasonryPortfolio photos={photos} primaryColor={primaryColor} />

                {/* 4. Stats / Trust Signals (Minimalist) */}
                <section className="py-20 bg-[#F5F5F7]">
                    <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { label: 'Yıllık Tecrübe', value: '10+' },
                            { label: 'Mutlu Çift', value: '500+' },
                            { label: 'Ödüller', value: '15' },
                            { label: 'Proje', value: '1k+' }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2">{stat.value}</div>
                                <div className="text-xs tracking-[0.2em] text-gray-500 uppercase">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Contact / Footer */}
                <footer className="bg-[#1a1a1a] text-white py-24 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-serif mb-8">Birlikte Harika Bir Hikaye Yazalım</h2>

                        <div className="flex justify-center gap-8 mb-12">
                            {photographer.instagram && (
                                <a href={`https://instagram.com/${photographer.instagram}`} target="_blank" className="hover:text-gray-300 transition-colors">
                                    <Instagram className="w-6 h-6" />
                                </a>
                            )}
                            {photographer.phone && (
                                <a href={`tel:${photographer.phone}`} className="hover:text-gray-300 transition-colors">
                                    <Phone className="w-6 h-6" />
                                </a>
                            )}
                            {photographer.email && (
                                <a href={`mailto:${photographer.email}`} className="hover:text-gray-300 transition-colors">
                                    <Mail className="w-6 h-6" />
                                </a>
                            )}
                        </div>

                        <div className="text-white/40 text-sm font-light">
                            &copy; {new Date().getFullYear()} {photographer.studioName}. All rights reserved.
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}
