'use client';

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Image as ImageIcon, Download, X, ChevronLeft, ChevronRight, Heart, Check, Grid3X3, LayoutGrid } from 'lucide-react';

interface Photo {
    url: string;
    filename: string;
}

export default function StudioGalleriesPage() {
    const { data: session } = useSession();
    const params = useParams();
    const slug = params.slug as string;
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');

    useEffect(() => {
        if (session?.user?.customerId) {
            fetchData();
        }
    }, [session]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/customers/${session?.user?.customerId}`);
            if (res.ok) {
                const data = await res.json();
                setPhotos(data.photos || []);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevious = () => {
        if (selectedPhoto !== null) {
            setSelectedPhoto(selectedPhoto > 0 ? selectedPhoto - 1 : photos.length - 1);
        }
    };

    const handleNext = () => {
        if (selectedPhoto !== null) {
            setSelectedPhoto(selectedPhoto < photos.length - 1 ? selectedPhoto + 1 : 0);
        }
    };

    // Touch/Swipe handling
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;
        if (Math.abs(diff) > 50) {
            if (diff > 0) handleNext();
            else handlePrevious();
        }
        setTouchStart(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Heart className="w-10 h-10 text-pink-500 animate-pulse" />
            </div>
        );
    }

    if (photos.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Henüz Fotoğraf Yok</h2>
                <p className="text-gray-500">Fotoğraflarınız yüklendikten sonra burada görünecektir.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Fotoğraflarınız</h1>
                    <p className="text-sm text-gray-500">{photos.length} fotoğraf</p>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                    >
                        <Grid3X3 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        onClick={() => setViewMode('large')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'large' ? 'bg-white shadow-sm' : ''}`}
                    >
                        <LayoutGrid className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Photo Grid */}
            <div className={`grid gap-2 ${viewMode === 'grid' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {photos.map((photo, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedPhoto(index)}
                        className={`relative overflow-hidden rounded-xl bg-gray-100 cursor-pointer group ${viewMode === 'large' ? 'aspect-square' : 'aspect-square'
                            }`}
                    >
                        <img
                            src={photo.url}
                            alt=""
                            className="w-full h-full object-cover group-active:scale-95 transition-transform"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {/* Lightbox - Full Screen Mobile Style */}
            {selectedPhoto !== null && (
                <div
                    className="fixed inset-0 bg-black z-50 flex flex-col"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Lightbox Header */}
                    <div className="flex items-center justify-between p-4 text-white">
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="p-2 hover:bg-white/10 rounded-full"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <span className="text-sm">{selectedPhoto + 1} / {photos.length}</span>
                        <a
                            href={photos[selectedPhoto].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-white/10 rounded-full"
                        >
                            <Download className="w-6 h-6" />
                        </a>
                    </div>

                    {/* Image */}
                    <div className="flex-1 flex items-center justify-center relative px-4">
                        <img
                            src={photos[selectedPhoto].url}
                            alt=""
                            className="max-w-full max-h-full object-contain"
                        />

                        {/* Desktop Navigation Arrows */}
                        <button
                            onClick={handlePrevious}
                            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Thumbnail Strip */}
                    <div className="p-4 overflow-x-auto">
                        <div className="flex gap-2 justify-center">
                            {photos.slice(
                                Math.max(0, selectedPhoto - 3),
                                Math.min(photos.length, selectedPhoto + 4)
                            ).map((photo, i) => {
                                const actualIndex = Math.max(0, selectedPhoto - 3) + i;
                                return (
                                    <button
                                        key={actualIndex}
                                        onClick={() => setSelectedPhoto(actualIndex)}
                                        className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${actualIndex === selectedPhoto ? 'ring-2 ring-white' : 'opacity-50'
                                            }`}
                                    >
                                        <img
                                            src={photo.url}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Swipe Hint */}
                    <p className="text-center text-white/50 text-xs pb-4 md:hidden">
                        ← Sola/sağa kaydırarak gezinin →
                    </p>
                </div>
            )}
        </div>
    );
}
