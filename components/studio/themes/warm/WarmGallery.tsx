'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WarmGalleryProps {
    photographer: any;
    photos: any[];
    slug: string;
}

export default function WarmGallery({ photographer, photos, slug }: WarmGalleryProps) {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState(0);

    // Light Mode Logic
    const isLight = photographer.siteTheme === 'light';

    // Palette
    const bgColor = isLight ? 'bg-[#FFFBF0]' : 'bg-[#0a0a0a]';
    const textColor = isLight ? 'text-[#831843]' : 'text-white';
    const borderColor = isLight ? 'border-[#831843]/10' : 'border-white/10';
    const subText = isLight ? 'text-[#9D174D]/70' : 'text-gray-400';
    const cardBg = isLight ? 'bg-[#FFF0F5]' : 'bg-[#1a1a1a]';
    const cardBorder = isLight ? 'border-[#831843]/5 hover:border-[#831843]/20' : 'border-white/5 hover:border-white/20';
    const lightboxBg = isLight ? 'bg-[#FFFBF0]/98' : 'bg-black/95';

    // Controls
    const controlClass = isLight
        ? 'bg-[#831843]/5 hover:bg-[#831843] hover:text-white text-[#831843]'
        : 'bg-white/10 hover:bg-white hover:text-black text-white';

    const cardShadow = isLight
        ? 'shadow-[0_15px_30px_-5px_rgba(131,24,67,0.2)] hover:shadow-[0_25px_50px_-10px_rgba(131,24,67,0.4)]'
        : 'shadow-[0_15px_30px_-5px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_50px_-10px_rgba(0,0,0,0.8)]';

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedPhotoIndex === null) return;
            if (e.key === 'Escape') setSelectedPhotoIndex(null);
            if (e.key === 'ArrowLeft') paginate(-1);
            if (e.key === 'ArrowRight') paginate(1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPhotoIndex, photos]);

    // Slider Variants
    const slideVariants = {
        enter: (direction: number) => {
            return {
                x: direction > 0 ? 1000 : -1000,
                opacity: 0,
                scale: 0.8
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => {
            return {
                zIndex: 0,
                x: direction < 0 ? 1000 : -1000,
                opacity: 0,
                scale: 0.8
            };
        }
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        if (selectedPhotoIndex === null || !photos || photos.length === 0) return;
        setDirection(newDirection);
        let newIndex = selectedPhotoIndex + newDirection;
        if (newIndex < 0) newIndex = photos.length - 1;
        if (newIndex >= photos.length) newIndex = 0;
        setSelectedPhotoIndex(newIndex);
    };

    return (
        <main className={`min-h-screen ${bgColor} ${textColor} pt-24 pb-32 px-6 font-sans`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .font-syne { font-family: 'Syne', sans-serif; }
                @keyframes shimmer {
                    0% { transform: translateX(-150%) skewX(-12deg); }
                    100% { transform: translateX(150%) skewX(-12deg); }
                }
                .group:hover .animate-shimmer {
                    animation: shimmer 1s ease-in-out;
                }
            ` }} />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`max-w-7xl mx-auto mb-16 border-b ${borderColor} pb-8`}
            >
                <h1 className="text-4xl md:text-6xl font-bold font-syne mb-4">Mutlu Çiftlerimiz</h1>
                <p className={`${subText} max-w-xl`}>En özel anlarınızdan seçkiler.</p>
            </motion.div>

            {photos && photos.length > 0 ? (
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
                        {photos.map((photo: any, index: number) => (
                            <motion.div
                                key={index}
                                layoutId={`photo-${index}`}
                                onClick={() => {
                                    setDirection(0);
                                    setSelectedPhotoIndex(index);
                                }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative group overflow-hidden rounded-xl aspect-[4/5] cursor-pointer border transition-all duration-300 z-0 hover:z-10 ${cardBg} ${cardBorder} ${cardShadow}`}
                            >
                                <motion.img
                                    src={photo.url}
                                    alt={photo.title || 'Çalışma'}
                                    className="w-full h-full object-cover transition-transform duration-700 md:scale-100 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 z-20 pointer-events-none">
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#831843]/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6 z-10">
                                    <span className="text-sm font-medium tracking-widest text-white/90 uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {photo.title || 'İncele'}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={`flex flex-col items-center justify-center py-32 border ${borderColor} rounded-2xl ${cardBg} ${cardShadow}`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isLight ? 'bg-[#831843]/10' : 'bg-white/5'}`}>
                        <ImageIcon className={`w-8 h-8 ${isLight ? 'text-[#831843]' : 'text-gray-500'}`} />
                    </div>
                    <p className={`${subText} text-lg font-medium`}>Henüz fotoğraf yüklenmemiş</p>
                </div>
            )}

            {/* LIGHTBOX with SLIDER ANIMATION */}
            <AnimatePresence initial={false} custom={direction}>
                {selectedPhotoIndex !== null && photos && photos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`fixed inset-0 z-[100] backdrop-blur-xl flex items-center justify-center overflow-hidden ${lightboxBg}`}
                    >
                        {/* Close Button */}
                        <motion.button
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            onClick={() => setSelectedPhotoIndex(null)}
                            className={`absolute top-4 right-4 p-3 rounded-full transition-all z-20 ${controlClass}`}
                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all z-20 hidden md:block ${controlClass}`}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); paginate(1); }}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all z-20 hidden md:block ${controlClass}`}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>

                        {/* Image Slider */}
                        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12 cursor-grab active:cursor-grabbing" onClick={() => setSelectedPhotoIndex(null)}>
                            <motion.img
                                key={selectedPhotoIndex}
                                src={photos[selectedPhotoIndex].url}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = swipePower(offset.x, velocity.x);
                                    if (swipe < -swipeConfidenceThreshold) {
                                        paginate(1);
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        paginate(-1);
                                    }
                                }}
                                alt={photos[selectedPhotoIndex].title}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl absolute"
                                onClick={(e) => e.stopPropagation()}
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-6 left-0 right-0 text-center pointer-events-none z-10"
                            >
                                <span className={`inline-block px-4 py-2 rounded-full text-sm backdrop-blur-md
                                    ${isLight ? 'bg-[#831843]/10 text-[#831843]' : 'bg-black/50 text-white'}
                                `}>
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
