'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Slide {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    link?: string;
}

export default function DashboardSlider() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        fetchSlides();
    }, []);

    // Auto-rotate every 4 seconds (pause on hover)
    useEffect(() => {
        if (slides.length === 0 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [slides.length, isPaused]);

    const fetchSlides = async () => {
        try {
            const res = await fetch('/api/dashboard/slides');
            const data = await res.json();
            setSlides(data);
        } catch (error) {
            console.error('Failed to fetch slides:', error);
        } finally {
            setLoading(false);
        }
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // If no slides are available, show a fallback creative slide
    const displaySlides = slides.length > 0 ? slides : [{
        _id: 'default-fallback',
        title: 'Weey.NET ile Stüdyonuzu Büyütün',
        description: 'Tüm müşteri kayıtlarınızı, seçilecek fotoğrafları ve randevularınızı tek bir noktadan yöneterek zaman kazanın.',
        imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2670&auto=format&fit=crop', // A beautiful photography background
        link: ''
    }];

    const currentSlide = displaySlides[currentIndex] || displaySlides[0];

    return (
        <div
            className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 overflow-hidden relative group shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides Stack with Fade */}
            <div className="relative h-64 bg-gradient-to-br from-[#1E293B] to-[#0F172A]">
                {displaySlides.map((slide, index) => (
                    <div
                        key={slide._id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        {/* Slide Image - Using standard img to avoid Next.js domain restrictions */}
                        {slide.imageUrl && (
                            <img
                                src={slide.imageUrl}
                                alt={slide.title}
                                className="object-cover w-full h-full opacity-60 mix-blend-overlay"
                            />
                        )}

                        {/* Overlay with Content */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent flex items-end">
                            <div className="p-8 text-white w-full">
                                <h3 className="text-3xl font-bold mb-3 tracking-tight text-white/95">{slide.title}</h3>
                                {slide.description && (
                                    <p className="text-[15px] font-medium text-white/80 mb-4 line-clamp-2 max-w-2xl leading-relaxed">
                                        {slide.description}
                                    </p>
                                )}
                                {slide.link && (
                                    <a
                                        href={slide.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10 transition-all"
                                    >
                                        Detayları Gör <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows - Always Visible on Hover */}
            {displaySlides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-gray-900 text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:scale-110 z-50"
                    >
                        <ChevronLeft className="w-6 h-6 ml-[-2px]" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-gray-900 text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:scale-110 z-50"
                    >
                        <ChevronRight className="w-6 h-6 mr-[-2px]" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all ${index === currentIndex
                                ? 'bg-white w-8'
                                : 'bg-white/50 hover:bg-white/75 w-2'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
