'use client';

import { Image as ImageIcon } from 'lucide-react';

interface BoldGalleryProps {
    photographer: any;
    photos: any[];
    slug: string;
}

export default function BoldGallery({ photographer, photos, slug }: BoldGalleryProps) {
    const primaryColor = photographer.primaryColor || '#7c2d3e';

    return (
        <main className="min-h-screen bg-[#FDF8F5] pt-24 pb-32 px-4">
            {/* Header */}
            <div className="text-center mb-12">
                <span className="text-xs uppercase tracking-widest" style={{ color: primaryColor }}>Portfolyo</span>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">Galeri</h1>
            </div>

            {photos && photos.length > 0 ? (
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {photos.map((photo: any, index: number) => (
                            <div
                                key={index}
                                className="relative group overflow-hidden rounded-3xl shadow-xl bg-white aspect-[4/5] cursor-pointer"
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.title || 'Çalışma'}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <div className="text-5xl font-bold text-white/20">
                                        {String(index + 1).padStart(2, '0')}
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
