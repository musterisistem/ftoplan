'use client';

import React from 'react';
import { CheckCircle2, Clock, Image as ImageIcon, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Album {
    customerId: string;
    brideName: string;
    groomName: string;
    photoCount: number;
    latestPhotoDate: Date;
    hasSelection: boolean;
    thumbnailUrl: string;
}

interface ActiveAlbumsWidgetProps {
    albums: Album[];
}

export function ActiveAlbumsWidget({ albums }: ActiveAlbumsWidgetProps) {
    if (!albums || albums.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Aktif Albümler</h3>
                <div className="text-center py-8 text-gray-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Henüz fotoğraf yüklenmemiş</p>
                </div>
            </div>
        );
    }

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - d.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Bugün';
        if (diffDays === 1) return 'Dün';
        if (diffDays < 7) return `${diffDays} gün önce`;

        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Aktif Albümler</h3>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                    {albums.length} albüm
                </span>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto custom-scrollbar">
                {albums.map((album) => (
                    <Link
                        key={album.customerId}
                        href={`/admin/customers/${album.customerId}/manage`}
                        className="block group"
                    >
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                            {/* Thumbnail */}
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                {album.thumbnailUrl ? (
                                    <Image
                                        src={album.thumbnailUrl}
                                        alt={`${album.brideName} & ${album.groomName}`}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="w-6 h-6 text-gray-300" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {album.brideName} & {album.groomName}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500">
                                                {album.photoCount} fotoğraf
                                            </span>
                                            <span className="text-xs text-gray-300">•</span>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(album.latestPhotoDate)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Selection Status Icon */}
                                    <div className="flex-shrink-0">
                                        {album.hasSelection ? (
                                            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span className="text-xs font-medium">Seçildi</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-xs font-medium">Bekliyor</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}</style>
        </div>
    );
}
