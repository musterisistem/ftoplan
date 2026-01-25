'use client';

import { Sparkles, Image as ImageIcon } from 'lucide-react';

interface WarmGalleryProps {
    photographer: any;
    photos: any[];
    slug: string;
}

export default function WarmGallery({ photographer, photos, slug }: WarmGalleryProps) {
    const primaryColor = photographer.primaryColor || '#8b4d62';

    return (
        <main
            className="min-h-screen pt-24 pb-32 px-4"
            style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #F5D5C8 25%, #FBEAE3 50%, #FDF8F5 100%)' }}
        >
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6">
                    <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
                    <span className="text-sm font-medium text-gray-700">Portfolyo</span>
                </div>
                <h1
                    className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: 'Georgia, serif' }}
                >
                    Galeri
                </h1>
                <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: primaryColor }} />
            </div>

            {photos && photos.length > 0 ? (
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        {photos.map((photo: any, index: number) => (
                            <div
                                key={index}
                                className="relative group overflow-hidden rounded-2xl shadow-lg bg-white aspect-square cursor-pointer"
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.title || 'Çalışma'}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                                    style={{ background: `linear-gradient(135deg, ${primaryColor}80, ${primaryColor}40)` }}
                                >
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                                        <ImageIcon className="w-5 h-5 text-gray-800" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20">
                    <div
                        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
                        style={{ backgroundColor: `${primaryColor}15` }}
                    >
                        <ImageIcon className="w-12 h-12" style={{ color: primaryColor }} />
                    </div>
                    <p className="text-gray-600 text-lg font-medium">Henüz fotoğraf yüklenmemiş</p>
                </div>
            )}
        </main>
    );
}
