'use client';

import { motion } from 'framer-motion';
import { User, Image as ImageIcon, Play } from 'lucide-react';

interface BromsPortfolioProps {
    photos: any[];
}

export default function BromsPortfolio({ photos }: BromsPortfolioProps) {
    // Duplicate photos to create infinite scroll effect if few exist
    const marqueePhotos = photos.length > 0
        ? [...photos, ...photos, ...photos, ...photos].slice(0, 12)
        : Array(8).fill({ url: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=500&auto=format&fit=crop' });

    return (
        <section className="bg-[#050505] text-white py-24 relative overflow-hidden">

            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold font-syne">Galeri</h2>
                </div>
            </div>

            {/* INFINITE MARQUEE SLIDER */}
            <div className="relative w-full overflow-hidden mb-12">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10" />

                <motion.div
                    className="flex gap-6 w-max"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30, // Slow scroll
                        repeatType: "loop"
                    }}
                >
                    {marqueePhotos.map((photo, i) => (
                        <div key={i} className="relative w-[300px] aspect-[3/4] rounded-lg overflow-hidden shrink-0 group border border-white/5">
                            <img
                                src={photo.url || `https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=500&auto=format&fit=crop`}
                                className="w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-110"
                                alt="Portfolio"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        </div>
                    ))}
                    {/* Repeat for smoothness if needed, but array duplication above handles it mostly */}
                </motion.div>
            </div>
        </section>
    );
}
