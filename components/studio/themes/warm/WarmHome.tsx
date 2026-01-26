'use client';

import { useEffect, useState } from 'react';
import BromsHero from '@/components/studio/broms/BromsHero';
import BromsPortfolio from '@/components/studio/broms/BromsPortfolio';
import BromsContact from '@/components/studio/broms/BromsContact';

export default function WarmHome({ photographer, slug }: { photographer: any; slug: string }) {
    const primaryColor = photographer.primaryColor || '#ec4899';
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
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Syne:wght@400;700;800&display=swap');
                body, html { background-color: #0a0a0a; color: white; }
                .font-syne { font-family: 'Syne', sans-serif; }
                .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
            ` }} />

            <main className="min-h-screen bg-[#0a0a0a] font-sans selection:bg-white selection:text-black">
                <BromsHero
                    studioName={photographer.studioName}
                    bannerImage={photographer.bannerImage}
                    primaryColor={primaryColor}
                    sliderImages={photos}
                    logo={photographer.logo}
                    heroTitle={photographer.heroTitle}
                    heroSubtitle={photographer.heroSubtitle}
                />

                <BromsPortfolio photos={photos} />

                {/* Simple About Section */}
                <section className="bg-[#050505] text-white py-16 px-6 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-6">Hakkımızda</h3>
                        <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-300 font-syne">
                            {photographer.aboutText || "Anları durdurup sonsuzluğa hapsetme sanatıyla, en özel günlerinizde yanınızdayız. Işık ve gölgeyle hikayenizi yazıyoruz."}
                        </p>
                    </div>
                </section>

                <BromsContact photographer={photographer} />
            </main>
        </>
    );
}
