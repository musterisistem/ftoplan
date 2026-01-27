'use client';

import { motion } from 'framer-motion';

interface BromsPortfolioProps {
    photos: any[];
    isLight?: boolean;
}

export default function BromsPortfolio({ photos, isLight = false }: BromsPortfolioProps) {
    // Determine photos to show (limit to 12 for home)
    const displayPhotos = photos.slice(0, 12);

    if (displayPhotos.length === 0) return null;

    // Palette: Cream (#FFFBF0), Pink (#FCE7F3), Dark Pink (#831843)
    const bgColor = isLight ? 'bg-[#FFFBF0]' : 'bg-[#0a0a0a]';
    const overlayBg = isLight ? 'bg-[#FFFBF0]/80' : 'bg-black/60';
    const overlayText = isLight ? 'text-[#831843]' : 'text-white';

    // Button
    const btnClass = isLight
        ? 'border-[#831843] text-[#831843] hover:bg-[#831843] hover:text-white'
        : 'border-white/20 text-white/60 hover:border-white hover:text-white hover:bg-white/5';

    return (
        <section className={`py-2 px-2 md:px-4 ${bgColor}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {displayPhotos.map((photo, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative aspect-[4/5] overflow-hidden rounded-sm cursor-pointer"
                    >
                        <img
                            src={photo.url}
                            alt={photo.title || 'Portfolio'}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${overlayBg}`}>
                            <h3 className={`text-xl font-light tracking-widest uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ${overlayText}`}>
                                {photo.category || 'Gözat'}
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="text-center mt-12 mb-12">
                <a href="gallery" className={`inline-block border px-8 py-3 text-sm tracking-[0.2em] transition-colors ${btnClass}`}>
                    TÜM GALERİYİ GÖR
                </a>
            </div>
        </section>
    );
}
