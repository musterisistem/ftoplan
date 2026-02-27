'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface Photo {
    url: string;
    title?: string;
    category?: string;
}

interface MasonryPortfolioProps {
    photos: Photo[];
    primaryColor: string;
}

export default function MasonryPortfolio({ photos, primaryColor }: MasonryPortfolioProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    // If no photos, show dummies using the 15 custom demo images
    const defaultDemoImages = Array.from({ length: 15 }, (_, i) => ({
        url: `https://fotoplan.b-cdn.net/demo/demof_${i + 1}.png`,
        title: `Örnek ${i + 1}`
    }));

    const displayPhotos = photos.length > 0 ? photos : defaultDemoImages;

    return (
        <section className="py-20 px-4 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-sm font-medium tracking-[0.2em] uppercase text-gray-500">Portfolio</span>
                    <h2 className="text-4xl md:text-5xl font-serif mt-3 text-gray-900">Captured Moments</h2>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {displayPhotos.map((photo, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-sm"
                            onClick={() => setSelectedPhoto(photo)}
                        >
                            <img
                                src={photo.url}
                                alt={photo.title || 'Portfolio Image'}
                                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <ZoomIn className="text-white w-8 h-8 scale-0 group-hover:scale-100 transition-transform duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                        <X className="w-10 h-10" />
                    </button>
                    <motion.img
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={selectedPhoto.url}
                        alt="Full screen"
                        className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
                    />
                </div>
            )}
        </section>
    );
}
