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

    if (slides.length === 0) {
        return null; // Don't show anything if no slides
    }

    const currentSlide = slides[currentIndex];

    return (
        <div
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden relative group shadow-lg hover:shadow-2xl transition-shadow duration-300"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides Stack with Fade */}
            <div className="relative h-64 bg-gradient-to-br from-indigo-50 to-purple-50">
                {slides.map((slide, index) => (
                    <div
                        key={slide._id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        {/* Slide Image */}
                        {slide.imageUrl && (
                            <Image
                                src={slide.imageUrl}
                                alt={slide.title}
                                fill
                                className="object-cover"
                            />
                        )}

                        {/* Overlay with Content */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
                            <div className="p-6 text-white w-full">
                                <h3 className="text-2xl font-semibold mb-2">{slide.title}</h3>
                                {slide.description && (
                                    <p className="text-sm text-white/90 mb-3 line-clamp-2">
                                        {slide.description}
                                    </p>
                                )}
                                {slide.link && (
                                    <a
                                        href={slide.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
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
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 shadow-lg"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 shadow-lg"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
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
