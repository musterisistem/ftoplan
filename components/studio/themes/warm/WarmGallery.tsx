'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WarmGalleryProps {
    photographer: any;
    photos: any[];
    slug: string;
}

export default function WarmGallery({ photographer, photos, slug }: WarmGalleryProps) {
    const primaryColor = photographer.primaryColor || '#fff';
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedPhotoIndex === null) return;
            if (e.key === 'Escape') setSelectedPhotoIndex(null);
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPhotoIndex, photos]); // Added photos to dependency array for safety

    const navigate = (direction: number) => {
        if (selectedPhotoIndex === null || !photos || photos.length === 0) return;
        const newIndex = selectedPhotoIndex + direction;
        if (newIndex >= 0 && newIndex < photos.length) {
            setSelectedPhotoIndex(newIndex);
        } else if (newIndex < 0) {
            setSelectedPhotoIndex(photos.length - 1); // Loop to end
        } else {
            setSelectedPhotoIndex(0); // Loop to start
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-32 px-6 font-sans">
            <style dangerouslySetInnerHTML={{ __html: `.font-syne { font-family: 'Syne', sans-serif; }` }} />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto mb-16 border-b border-white/10 pb-8"
            >
                <h1 className="text-4xl md:text-6xl font-bold font-syne mb-4">Galeri</h1>
                <p className="text-gray-400 max-w-xl">En özel anlarınızdan seçkiler.</p>
            </motion.div>

            {photos && photos.length > 0 ? (
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6">
                        {photos.map((photo: any, index: number) => (
                            <motion.div
                                key={index}
                                layoutId={`photo-${index}`}
                                onClick={() => setSelectedPhotoIndex(index)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative group overflow-hidden rounded-lg bg-[#1a1a1a] aspect-[4/5] cursor-pointer border border-white/5 hover:border-white/20"
                            >
                                <motion.img
                                    src={photo.url}
                                    alt={photo.title || 'Çalışma'}
                                    className="w-full h-full object-cover transition-all duration-700 md:scale-100 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                                    <span className="text-sm font-medium tracking-widest text-white/90 uppercase">{photo.title || 'İncele'}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 border border-white/5 rounded-2xl bg-[#111]">
                    {/* Empty state content */}
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <ImageIcon className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">Henüz fotoğraf yüklenmemiş</p>
                </div>
            )}

            {/* LIGHTBOX */}
            <AnimatePresence>
                {selectedPhotoIndex !== null && photos && photos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
                    >
                        {/* Close Button */}
                        <motion.button
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            onClick={() => setSelectedPhotoIndex(null)}
                            className="absolute top-4 right-4 p-3 bg-white/10 rounded-full text-white hover:bg-white hover:text-black transition-all z-20"
                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full text-white hover:bg-white hover:text-black transition-all z-20 hidden md:block"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(1); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full text-white hover:bg-white hover:text-black transition-all z-20 hidden md:block"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>

                        {/* Image */}
                        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12" onClick={() => setSelectedPhotoIndex(null)}>
                            {/* Stop propagation on image click prevents closing, but maybe users want to close by clicking image? Usually close is background. Let's keep bg close. */}
                            <motion.img
                                layoutId={`photo-${selectedPhotoIndex}`}
                                src={photos[selectedPhotoIndex].url}
                                alt={photos[selectedPhotoIndex].title}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                onClick={(e) => e.stopPropagation()} // Clicking image doesn't close
                            />

                            {/* Mobile Counter/Caption */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-6 left-0 right-0 text-center pointer-events-none"
                            >
                                <span className="inline-block px-4 py-2 bg-black/50 rounded-full text-white text-sm backdrop-blur-md">
                                    {selectedPhotoIndex + 1} / {photos.length}
                                </span>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
