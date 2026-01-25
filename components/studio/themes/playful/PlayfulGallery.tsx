'use client';

import { Star, Image as ImageIcon } from 'lucide-react';

interface PlayfulGalleryProps {
    photographer: any;
    photos: any[];
    slug: string;
}

export default function PlayfulGallery({ photographer, photos, slug }: PlayfulGalleryProps) {
    const primaryColor = photographer.primaryColor || '#f97316';

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
                .script-font { font-family: 'Dancing Script', cursive; }
            ` }} />

            <main
                className="min-h-screen pt-24 pb-32 px-4"
                style={{ background: 'linear-gradient(180deg, #E8F4FC 0%, #FDF6F0 50%, #FEF7F0 100%)' }}
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-6">
                        <Star className="w-4 h-4" style={{ color: primaryColor }} />
                        <span className="text-sm font-medium text-gray-700">Portfolyo</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                        <span className="script-font italic" style={{ color: primaryColor }}>Galeri</span>
                    </h1>
                </div>

                {photos && photos.length > 0 ? (
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {photos.map((photo: any, index: number) => (
                                <div
                                    key={index}
                                    className={`relative group overflow-hidden rounded-3xl shadow-lg bg-white cursor-pointer ${index % 5 === 0 ? 'col-span-2 row-span-2' : ''
                                        }`}
                                    style={{ aspectRatio: index % 5 === 0 ? '1' : '1' }}
                                >
                                    <img
                                        src={photo.url}
                                        alt={photo.title || 'Çalışma'}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
        </>
    );
}
