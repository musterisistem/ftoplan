'use client';

import { useEffect, useState } from 'react';
import BromsHero from '@/components/studio/broms/BromsHero';
// import BromsPortfolio from '@/components/studio/broms/BromsPortfolio';
import BromsContact from '@/components/studio/broms/BromsContact';
import MarqueePortfolio from './MarqueePortfolio';
import WarmContact from './WarmContact';
// import WarmPackages from './WarmPackages';
// import WarmAbout from './WarmAbout';

export default function WarmHome({ photographer, slug }: { photographer: any; slug: string }) {
    const primaryColor = photographer.primaryColor || '#ec4899';
    const [photos, setPhotos] = useState<any[]>([]);

    // Determine Theme Mode
    const isLight = photographer.siteTheme === 'light';
    const modeBg = isLight ? '#FFFBF0' : '#0a0a0a';
    const modeText = isLight ? '#831843' : 'white';

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
                body, html { background-color: ${modeBg}; color: ${modeText}; }
                .font-syne { font-family: 'Syne', sans-serif; }
                .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
            ` }} />

            <main className={`min-h-screen font-sans ${isLight ? 'selection:bg-pink-200 selection:text-pink-900' : 'selection:bg-white selection:text-black'}`} style={{ backgroundColor: modeBg }}>

                {/* 1. SLIDER (Hero) */}
                <BromsHero
                    studioName={photographer.studioName}
                    bannerImage={photographer.bannerImage}
                    primaryColor={primaryColor}
                    sliderImages={photos}
                    logo={photographer.logo}
                    heroTitle={photographer.heroTitle}
                    heroSubtitle={photographer.heroSubtitle}
                    // @ts-ignore
                    isLight={isLight}
                    slug={slug} // Added slug prop
                />

                {/* 2. MARQUEE GALLERY (Kayan Galeri) */}
                <MarqueePortfolio photos={photos} isLight={isLight} />

                {/* 3. CONTACT INFO */}
                <WarmContact photographer={photographer} slug={slug} />


            </main>
        </>
    );
}
