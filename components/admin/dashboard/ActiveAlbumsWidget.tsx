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
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight w-full text-left mb-6">Aktif Albümler</h3>
                <div className="py-8 text-gray-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40 text-gray-500" />
                    <p className="text-sm font-semibold">Henüz fotoğraf yüklenmemiş</p>
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
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Aktif Albümler</h3>
                <span className="text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full font-semibold shadow-sm border border-gray-200">
                    {albums.length} albüm
                </span>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto custom-scrollbar pr-1 pb-1">
                {albums.map((album) => (
                    <Link
                        key={album.customerId}
                        href={`/admin/customers/${album.customerId}/manage`}
                        className="block group"
                    >
                        <div className="flex items-center gap-4 p-3 pr-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-300">
                            {/* Thumbnail */}
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-200">
                                {album.thumbnailUrl ? (
                                    <Image
                                        src={album.thumbnailUrl}
                                        alt={`${album.brideName} & ${album.groomName}`}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="w-5 h-5 text-gray-300" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-gray-950">
                                            {album.brideName} & {album.groomName}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs font-semibold text-gray-500">
                                                {album.photoCount} fotoğraf
                                            </span>
                                            <span className="text-[10px] text-gray-300">•</span>
                                            <span className="text-xs font-medium text-gray-400">
                                                {formatDate(album.latestPhotoDate)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Selection Status Icon */}
                                    <div className="flex-shrink-0">
                                        {album.hasSelection ? (
                                            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl shadow-sm">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-bold uppercase tracking-wide">Seçildi</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-gray-600 bg-white border border-gray-200 px-3 py-1 rounded-xl shadow-sm">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-bold uppercase tracking-wide">Bekliyor</span>
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
