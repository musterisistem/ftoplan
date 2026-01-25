'use client';

import { useState } from 'react';
import { Image as ImageIcon, Upload, ExternalLink, Trash2 } from 'lucide-react';
import Button from '@/components/common/Button';

// Mock data
const mockGalleries = [
    { id: '1', title: 'Düğün Fotoğrafları', photoCount: 450, coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80', date: '2026-06-18' },
    { id: '2', title: 'Save The Date', photoCount: 85, coverUrl: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?auto=format&fit=crop&q=80', date: '2026-03-15' },
];

export default function GalleryPanel() {
    const [galleries, setGalleries] = useState(mockGalleries);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                    Fotoğraf Galerileri
                </h3>
                <Button size="sm">
                    <Upload className="w-4 h-4 mr-1" />
                    Yeni Galeri Oluştur
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleries.map((gallery) => (
                    <div key={gallery.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                        <div className="relative h-48 bg-gray-200">
                            {/* In real app, use Next.js Image component */}
                            <img
                                src={gallery.coverUrl}
                                alt={gallery.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                                <button className="text-white hover:text-purple-300 transition-colors">
                                    <ExternalLink className="w-5 h-5" />
                                </button>
                                <button className="text-white hover:text-red-400 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold text-gray-900 mb-1">{gallery.title}</h4>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>{gallery.photoCount} Fotoğraf</span>
                                <span>{new Date(gallery.date).toLocaleDateString('tr-TR')}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Upload Placeholder */}
                <button className="border-2 border-dashed border-gray-300 rounded-2xl h-full min-h-[250px] flex flex-col items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50/50 transition-all gap-3">
                    <div className="p-4 bg-gray-50 rounded-full group-hover:bg-white transition-colors">
                        <Upload className="w-8 h-8" />
                    </div>
                    <span className="font-medium">Yeni Galeri Yükle</span>
                </button>
            </div>
        </div>
    );
}
